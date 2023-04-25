import firebase from './firebase'
import {searchBusinesses}from './yelp'

/**
 * gets a count from all reviews grouped by category
 * uses quite a few database calls
 *      1 = query of all reviews
 *      n = number of unique restaurants
 * use this to generate reviewHistoryData to be used for the next array
 * this is so we only make the ton of api calls once
 * @param {*} uuid 
 * @return tuple of two items: array of past restaurants, object counting categories
 */
export async function reviewHistory(uid){

    // acquire all reviews so we can see what restaurants user is reviewing
    return firebase.dbGetReviews(uid, field="authorid").then(async (resultMap) => {
        var restaurants = [];
        var categoryCounts = {};

        for(const review of resultMap.values()){
            if(!restaurants.includes(review.restaurant_alias)){
                restaurants.push(review.restaurant_alias);
            }
        }

        // from all restaurants count up the categories
        for(const restaurantAlias in restaurants){
            await firebase.dbGet("restaurants", restaurants[restaurantAlias]).then(restaurant => {
                if(!restaurant)
                    return;
                restaurant.categories.forEach((category) => {
                    if(!Object.hasOwn(categoryCounts, category.alias)){
                        categoryCounts[category.alias] = 0;
                    }
                    categoryCounts[category.alias] += 1;
                })
            }).catch((errormsg) => console.log(errormsg))
        }

        return [restaurants, categoryCounts];
    });
}

/**
 * just get a random restaurant based on category counts unweighted
 * basically top 5 categories are searched
 * will not use restaurants the user has already been to
 * 1 single yelp api call
 * @param {*} uid user id
 * @returns restaurant details that is random weighted by category count
 */
export async function randomRecommendation(reviewHistoryData, locationData, apiKey){

    const [restaurants, categoryCounts] = reviewHistoryData;
    console.log(restaurants);
    console.log(categoryCounts);

    // gets top five by sorting category counts
    var categoryCountsSorted = [];
    for(var category in categoryCounts){
        categoryCountsSorted.push([category, categoryCounts[category]])
    }
    categoryCountsSorted.sort((a, b) => a[1] - b[1]);
    var topFiveCategories = []
    categoryCountsSorted.slice(0, 5).forEach(category => topFiveCategories.push(category[0]))
    console.log(topFiveCategories)


    return await searchBusinesses(" ", locationData, 20, apiKey, [], categories=topFiveCategories);

}

