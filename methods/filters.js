/**
 * List of all attributes
 */
const attributes = [
	'hot_and_new',
	'request_a_quote',
	'reservation',
	'waitlist_reservation',
	'deals',
	'gender_neutral_restrooms',
	'open_to_all',
	'wheelchair_accessible',
]

/**
 * List of all prices
 */
const prices = [
	{number: 1, price: '$'},
	{number: 2, price: '$$'},
	{number: 3, price: '$$$'},
	{number: 4, price: '$$$$'},
]

/**
 * List of all sort by attributes
 */
const sort_by = [
	"best_match",
	'rating', 
	'review_count',
	'distance'
]

module.exports = { attributes, prices, sort_by}