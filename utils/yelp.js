import axios from 'axios';

function auth(apiKey){
    return {
        headers: {
            Authorization: 'Bearer ' + apiKey,
        }
    };
}

async function searchBusinesses(searchTerm, locationData, apiKey) {
    var apiString = 'https://api.yelp.com/v3/businesses/search?'+
        `term=${searchTerm}`+
        `&latitude=${locationData.lat}` +
        `&longitude=${locationData.long}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data);
}

async function autocomplete(searchTerm, locationData, apiKey) {
    var apiString = 'https://api.yelp.com/v3/autocomplete?'+
        `text=${searchTerm}`+
        `&latitude=${locationData.lat}` +
        `&longitude=${locationData.long}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data);
}

async function businessDetail(businessAlias, apiKey){
    var apiString = `https://api.yelp.com/v3/businesses/${businessAlias}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data);
}

module.exports = {searchBusinesses, autocomplete, businessDetail};
/**
 * a utility class to use functions that simplify the usage of the yelp fusion api using a third party package
 * examples are included below
 */



