import nlp from 'compromise'
import firebase from './firebase'
import {afinn165} from 'afinn-165'



module.exports = {incrementAdjectives, getMostUsedAdjectives, adjectivesSentimentIncrement}


/**
 * Parses a review and counts the adjectives
 * @param {*} review 
 * @returns list of adjectives
 */
function getAdjectives(review){
    let doc = nlp(review);
    let adjectivesData = doc.adjectives().json()
    let adjectives = []
    console.log(adjectivesData)
    adjectivesData.forEach(adjective => {
        if(!adjectives.includes(adjective.text.replace(/\W/g, ''))){
            adjectives.push(adjective.text.replace(/\W/g, ''));
        }
    });
    return adjectives;
}

/**
 * Naive form of sentiment analysis without negation
 * @param {*} sentence 
 * @returns 
 */
function getSentiment(sentence){
    let sentiment = 0;
    let words = sentence.split(" ");
    words.forEach(word => {
        let adjustedWord = word.replace(/\W/g, ''); // strip non-alphanumeric characters
        if(afinn165[adjustedWord.toLowerCase()]){
            sentiment += afinn165[adjustedWord.toLowerCase()]; // get sentiment score from afinn-165
        }
    });
    return sentiment;
}

/**
 * Increments the usage of adjectives in a review along if its used positively or negatively overall
 * @param {*} review 
 * @param {*} restaurantAlias 
 */
function adjectivesSentimentIncrement(review, restaurantAlias){
    let adjectives = getAdjectives(review);
    let adjectivesSentiment = {}
    adjectives.forEach((adjective) => {
        adjectivesSentiment[adjective] = 0;
    });
    let sentences = review.match( /[^\.!\?]+[\.!\?]+/g ); // split review into sentences

    let toUpdate = {};
    sentences.forEach((sentence) => {
        let sentiment = getSentiment(sentence); // get sentiment score per sentence
        adjectives.forEach(adjective => {
            if(sentence.includes(adjective)){
                adjectivesSentiment[adjective] += sentiment; // sum up per-sentence sentiment score per adjective
            }
            
        });
        adjectives.forEach(adjective => { //add up total and sentiment score
            toUpdate[`adjectives.${adjective}.total`] = 1;
            if(adjectivesSentiment[adjective] > 0){
                toUpdate[`adjectives.${adjective}.positive`] = 1;
            }
            else if(adjectivesSentiment[adjective] < 0) {
                toUpdate[`adjectives.${adjective}.negative`] = 1;
            }
        });
    });
    return firebase.dbCreateBlank("restaurants", restaurantAlias).then(() => { // send to database
        firebase.dbIncrement("restaurants", restaurantAlias, toUpdate);
    });
}

/**
 * Parses a review and counts the adjectives to increment in the database
 * @param {*} review the text review
 * @param {*} restaurantAlias identifier of a restaurant
 * @returns 
 */
function incrementAdjectives(review, restaurantAlias){
    let adjectives = getAdjectives(review);
    let toUpdate = {};
    adjectives.forEach(adjective => {
        toUpdate["adjectives."+adjective+".total"] = 1;
    });
    return firebase.dbCreateBlank("restaurants", restaurantAlias).then(() => {
        firebase.dbIncrement("restaurants", restaurantAlias, toUpdate);
    })
}

/**
 * Gives a list of most used adjectives of a restaurant sorted by frequency
 * @param {*} restaurantAlias identifier of restaurant
 * @param {*} limit the length of the list
 * @returns 
 */
function getMostUsedAdjectives(restaurantAlias, limit=10){
    return firebase.dbGet("restaurants", restaurantAlias).then(restaurantData => {
        let adjectives = restaurantData.adjectives;
        let sortedAdjectives = []
        Object.keys(adjectives).forEach(key => {
            sortedAdjectives.push([key, adjectives[key]]);
        })
        sortedAdjectives.sort((a,b) => a[1] - b[1]);
        return sortedAdjectives.slice(0,limit);
    })
    .catch(error => []);
}
