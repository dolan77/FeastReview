import axios from 'axios';

function auth(apiKey){
    return {
        headers: {
            Authorization: 'Bearer ' + apiKey,
        }
    };
}

async function searchBusinesses(searchTerm, locationData, apiKey) {
    var apiString = 'https://api.yelp.com/v3/businesses/' +
        `search?term=${searchTerm}`+
        `&latitude=${locationData.lat}` +
        `&longitude=${locationData.long}`
    return axios.get(apiString, auth(apiKey)).then(result => JSON.parse(result));
}

async function autocomplete(searchTerm, locationData, apiKey) {
    return '';
}

async function businessDetail(businessId, apiKey){
    return '';
}

module.exports = {searchBusinesses, autocomplete, businessDetail};
/**
 * a utility class to use functions that simplify the usage of the yelp fusion api using a third party package
 * examples are included below
 */



