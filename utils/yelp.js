const yelpApi = require('yelp-fusion');
const apiKey = require('../../yelp_key.json').key;

module.exports = {searchBusinesses, autocomplete, businessDetail};

/**
 * gives all the information of the businesses related to search term
 * @param {*} searchTerm text for search
 * @param {*} locationData accepts location in format "city, state code"
 * @returns 
 */
async function searchBusinesses(searchTerm, locationData){
    const client = yelpApi.client(apiKey);

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
    const client = yelpApi.client(apiKey);
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
    const client = yelpApi.client(apiKey);
    return client.business(business.alias).then(response => response.jsonBody);
}

// example of getting you more details from a business
searchBusinesses('mcdon', 'westminster, CA').then(searchResults => {
    businessDetail(searchResults[0]).then(details => console.log(details));
})