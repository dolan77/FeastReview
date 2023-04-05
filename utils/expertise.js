import colors from './colors'
import firebase from './firebase'


module.exports = {titleStyle, getPossibleTitles}

/**
 * Given a title, it will get you the text style for it
 * @param {*} title like Dessert Legend, a title of user
 * @param {*} fontSize desired font size to fit anywhere
 * @returns 
 */
function titleStyle(title){
    switch(title.split(" ").pop()){
        case "Expert":
            return {
                color: colors.expertRed,
                fontWeight: 'bold'
            }
        case "Legend":
            return {
                color: colors.legendGold,
                fontStyle: 'italic',
                fontWeight: 'bold'
            }
        case 'selected!':
            return {
                color: colors.gray,
                fontStyle: 'italic',
                fontSize: 14
            }
        default:
            return {
                color: colors.white
            }
        
    }
}

/**
 * gets a list of all possible titles a user can have
 * @param {*} uuid 
 */
async function getPossibleTitles(uid){
    var validTitles = {
        Casual: 1,
        Expert: 5,
        Legend: 10
    }


    // acquire all reviews so we can see what restaurants user is reviewing
    return firebase.dbGetReviews(uid, field="authorid").then(async (resultMap) => {
        var restaurants = [];
        var categoryCounts = {};
        var titles = [];

        for(const review of resultMap.values()){
            if(!restaurants.includes(review.restaurant_alias)){
                restaurants.push(review.restaurant_alias);
            }
        }

        console.log(restaurants)
        // from all restaurants count up the categories
        for(const restaurantAlias in restaurants){
            await firebase.dbGet("restaurants", restaurants[restaurantAlias]).then(restaurant => {
                if(!restaurant)
                    return;
                restaurant.categories.forEach((category) => {
                    if(!Object.hasOwn(categoryCounts, category.title)){
                        categoryCounts[category.title] = 0;
                    }
                    categoryCounts[category.title] += 1;
                })
            }).catch((errormsg) => console.log(errormsg))
        }

        console.log(categoryCounts)
        // make the permutations of titles
        for(let category in categoryCounts){
            for(let title in validTitles){
                if(categoryCounts[category] >= validTitles[title]){
                    titles.push(`${category} ${title}`);
                }
            }
        }

        return titles;
    });
}