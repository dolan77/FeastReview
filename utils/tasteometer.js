import nlp from 'compromise'
import firebase from './firebase'

module.exports = {incrementAdjectives}

function getAdjectives(review){
    let doc = nlp(review);
    let adjectivesData = doc.adjectives().json()
    let adjectives = []
    adjectivesData.forEach(adjective => {
        adjectives.push(adjective.text);
    });
    return adjectives;
}

function incrementAdjectives(review, restaurantAlias){
    let adjectives = getAdjectives(review);
    let toUpdate = {};
    adjectives.forEach(adjective => {
        toUpdate["adjectives."+adjective] = firebase.inc;
    });
    console.log(toUpdate)
    return firebase.dbCreateBlank("restaurants", restaurantAlias).then(() => {
        firebase.dbIncrement("restaurants", restaurantAlias, toUpdate);
    })
}
