const yelpApi = require('yelp-fusion');
const apiKey = require('../../api_keys.json').yelp;
const fb = require('./firebase.js');

module.exports = {searchBusinesses, autocomplete, businessDetail};

/**
 * a utility class to use functions that simplify the usage of the yelp fusion api using a third party package
 * examples are included below, you can
 */

// example of searching for a business returning all results
//searchBusinesses('mcdonalds', 'westminster, CA').then(searchResults => {
//    console.log(searchResults);
//})

// example of getting you all details from mcdonalds
//searchBusinesses('mcdonalds', 'westminster, CA').then(searchResults => {
//    businessDetail(searchResults[0]).then(details => console.log(details));
//})

// example of getting you hours from the nearest chipotle
//searchBusinesses('chipotle', 'westminster, CA').then(searchResults => {
//    businessDetail(searchResults[0]).then(details => console.log(details.hours[0].open));
//})

const client = yelpApi.client(apiKey);

/**
 * gives all the information of the businesses related to search term
 * @param {*} searchTerm text for search
 * @param {*} locationData accepts location in format "city, state code"
 * @returns 
 */
async function searchBusinesses(searchTerm, locationData){
    const searchContent = {
        term: searchTerm,
        location: locationData
    };
    
    return client.search(searchContent).then((response) => response.jsonBody.businesses);
}

/**
 * intended to autocomplete text in search bar
 * @param {*} searchTerm the text currently in search
 * @returns list of autocomplete terms
 */
async function autocomplete(searchTerm){
    return client.autocomplete({text: searchTerm})
            .then(response => {
                let results = [];
                response.jsonBody.terms.forEach(element => {
                    results.push(element.text);
                });
                return results})
            .catch(e => console.error(e));
}

/**
 * takes result from business search and gets you more details
 * @param {*} business object from business search
 * @returns more details from a specific business
 */
async function businessDetail(business){
    return client.business(business.alias).then(response => response.jsonBody);
}

