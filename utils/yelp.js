import axios from 'axios';


/**
 * Simple helper function to help format API key in BEARER header format
 * @param {*} apiKey 
 * @returns formated for axios GET call
 */
function auth(apiKey){
    return {
        headers: {
            Authorization: 'Bearer ' + apiKey,
        }
    };
}

/**
 * use YELP api to search for businesses using user text
 * @param {*} searchTerm text user is using to search
 * @param {*} locationData location object with lat (latitude) and long (longitude) key-values
 * @param {*} apiKey the api key of yelp
 * @param {*} filters filter for user to use
 * @returns an array of businesses (default 20 i think)
 */
async function searchBusinesses(searchTerm, locationData, limit, apiKey, filters) {
    var apiString = 'https://api.yelp.com/v3/businesses/search?'+
        `term=${searchTerm}`+
        `&latitude=${locationData.lat}` +
        `&longitude=${locationData.long}`
	
	if (filters) {
		apiString += filters 
	}

	apiString += `&limit=${limit}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data.businesses);
}


/**
 * use YELP api to autcomplete user text
 * @param {*} searchTerm text user is using to search
 * @param {*} locationData location object with lat (latitude) and long (longitude) key-values
 * @param {*} apiKey the api key of yelp
 * @returns a list of terms to autocomplete what user is typing
 */
async function autocomplete(searchTerm, locationData, apiKey) {
    var apiString = 'https://api.yelp.com/v3/autocomplete?'+
        `text=${searchTerm}`+
        `&latitude=${locationData.lat}` +
        `&longitude=${locationData.long}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data);
}

/**
 * use YELP api to get full details of a specific business by alias
 * @param {*} businessAlias the unique readable alias that identifies the restaurant
 * @param {*} apiKey the api key of yelp
 * @returns an object with full information on a restaurant business
 */
async function businessDetail(businessAlias, apiKey){
    var apiString = `https://api.yelp.com/v3/businesses/${businessAlias}`
    return axios.get(apiString, auth(apiKey)).then(response => response.data);
}

module.exports = {searchBusinesses, autocomplete, businessDetail};


