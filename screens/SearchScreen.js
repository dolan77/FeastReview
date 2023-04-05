import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Image, ScrollView, Modal, Pressable } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { starRating } from '../methods/star.js';
import { map } from '../methods/map.js';
import { attributes, prices, sort_by } from '../methods/filters.js';

import { searchBusinesses, businessDetail} from '../utils/yelp.js';
import { dbGet, dbSet } from '../utils/firebase.js';
import { requestLocationPermission } from '../utils/locationPermission.js'
import { SearchBar} from '../components/SearchBar.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'

export default function SearchScreen() {
	const defaultLocation = {"coords": {"accuracy": 5, "altitude": 5, "altitudeAccuracy": 0.5, "heading": 0, "latitude": 33.78383050167186, "longitude": -118.11367992726652, "speed": 0}, "mocked": false, "provider": "fused", "timestamp": 1676767775647}

	const [searchText, setSearchText] = useState('')
	const [location, setLocation] = useState(defaultLocation)
	const [restaurants, setRestaurants] = useState([])
	const [pressed, setPressed] = useState(1)
	const [displayMap, setDisplayMap] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);

	const [priceSel, setpriceSel] = useState([]);
	const [sortBySel, setsortBySel] = useState('');
	const [attrSel, setattrSel] = useState([]);
	const [filterString, setFilterString] = useState('')

    const navigation = useNavigation();

	/**
	 * After refresh, the app will get the user's location
	 * written by Matthew Hirai
	 */
	useEffect(() => {
		getLocation()
	}, [])

	/**
	 * If pressed state is changed, it will call the handleSearch 
	 * function with a new limit
	 * written by Matthew Hirai
	 */
	useEffect(() => {
		if (pressed !== 1) {
			const limit = 10 * pressed
			if (filterString) {
				handleSearch({limit}, filterString, false)
			}
			else {
				handleSearch({limit})
			}
		}
	}, [pressed])

	/**
	 * Uses the geolocation package to get the user's current latitude and longitude
	 * written by Matthew Hirai
	 */
	let getLocation = () => {
		Geolocation.getCurrentPosition(
			position => {
				setLocation(position)
			},
			error => {
				// See error code charts below.
				console.log(error.code, error.message);
			},
			{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
		);
	};
	
	/**
	 * Calls the yelp api function then sets the results to restaurant state
	 * @param {*} limit amount of results that will be displayed (default value of 10)
	 * written by Nathan Lai
	 */
	handleSearch = ({limit = 10}, filter = "", newSearch = true) => {
		if (newSearch) {
			setFilterString('')
			setattrSel([])
			setpriceSel([])
			setsortBySel('')
			setPressed(1)
			limit = 10
		}

		dbGet('api_keys','key')
			.then(keys => {
				searchBusinesses(
					searchText, 
					{lat: location.coords.latitude, long: location.coords.longitude},
					limit, 
					keys.yelp,
					filter
				)
				.then(result => {
					setRestaurants([...result])
				})
				.catch(() => console.log("Error, searching YELP businesses"));
		})
		.catch(() => console.log("Error, getting YELP api key"));
	}

	/**
	 * Allows live complete by putting searchtext together with handleSearch
	 * @param {*} text the string that the user types
	 * written by Nathan Lai
	 */
	autoComplete = (text) => {
		setSearchText(text);
		handleSearch(10);
	}

	/**
	 * calls the handleSearch function with filters
	 * written by Matthew Hirai
	 */
	saveFilters = () => {
		let priceFilter = ''
		let attributesFilter = ''
		let filter = ''

		if (priceSel.length !== 0) {
			priceFilter = priceSel.toString().replaceAll(',', '&')
		}

		if (attrSel.length !== 0) {
			attributesFilter = attrSel.toString().replaceAll(',', '&')
		}

		filter = `${priceFilter ? `&${priceFilter}` : ''}${attributesFilter ? `&${attributesFilter}` : ''}${sortBySel ? `&${sortBySel}` : ''}` 
		
		setFilterString(filter)
		handleSearch(10 * pressed, filter, false)
		setModalVisible(false)
	}

	/**
	 * Adds price filter if selected; if it's already in the array, it'll remove it
	 * Multiple price points can be selected.
	 * written by Kenny Du
	 */
	handlePriceSel = (p_num) => {
		priceSel.some((element) => element === `price=${p_num}`) ? 
			[console.log(p_num,'in priceSel, removing....'), setpriceSel(prevSel => prevSel.filter(e => e != `price=${p_num}`))] : 
			[console.log(p_num, 'not in priceSel, adding....'), setpriceSel(prevSel => [...prevSel, `price=${p_num}`])]
	}
	/**
	 * Checks if price number is inside of the priceSel array. If so, return true.
	 * written by Kenny Du
	 */
	function checkPriceSelect(p_num) {
		return priceSel.some((element) => element === `price=${p_num}`)
	}

	/**
	 * Stores the string of the attribute that is selected for the 'Sort By' filter option.
	 * Only 1 option can be selected
	 * written by Kenny Du
	 */
	
	const handleSortBySel = (sort_sel) => {
		setsortBySel(`sort_by=${sort_sel}`)
	}
	/**
	 * Checks if sort by filter is inside of the sortBySel state. If so, return true.
	 * written by Kenny Du
	 */
	function checkSortBySel(sort_sel) {
		return `sort_by=${sort_sel}` == sortBySel;
	}

	/**
	 * Adds attribute filter if selected; if it's already in the array, it'll remove it
	 * Multiple attributes can be selected
	 * written by Kenny Du
	 */
	const handleAttrSel = (attr) => {
		attrSel.some((element) => element === `attributes=${attr}`) ?
		[console.log(attr,'in attributesSel, removing....'), setattrSel(prevSel => prevSel.filter(e => e != `attributes=${attr}`))] : 
		[console.log(attr, 'not in attributesSel, adding....'), setattrSel(prevSel => [...prevSel, `attributes=${attr}`])];
	}
	/**
	 * function returns true if the attribute parameter exists inside attrSel
	 * written by Kenny Du
	 */
	function checkAttrSel(attr) {
		return attrSel.some((element) => element === `attributes=${attr}`);
	}


	/**
	 * displays a map with markers of the restaurants that the user searched
	 * written by Matthew Hirai
	*/
    return (
        <View style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput 
					style={styles.searchBar}
					placeholder='Search for foods...'
					placeholderTextColor='white'
					value = {searchText}
					onChangeText={text => setSearchText(text)}
					onSubmitEditing={handleSearch}
				/>
				{restaurants.length !== 0 && 
					<Ionicons 
						style={styles.filter} 
						name="filter" 
						onPress={() => setModalVisible(true)}
					/>
				}
			</View>

			{modalVisible && 
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}
				>
					{/* Container for all filter components */}
					<View style = {styles.modalView}>
						<Text style={[styles.buttonText, {fontSize: 30}]} onPress={console.log('\npriceSel: ', priceSel, '\nsortBySel: ', sortBySel, '\nattrSel: ', attrSel)}>Filter Results</Text>

						{/* Container for 'Sort By' and 'Price */}
						<View style = {styles.sortPriceView}>

							{/* View for the 'Sort By' filter by Kenny Du */}
							<View style={styles.filterComponent1}>
								<Text style={styles.buttonText}>Sort By</Text>
								{sort_by.map((sorting) => {
									return (
										<View 
											key={sorting} 
											style={[
												{borderWidth: checkSortBySel(sorting)? 1:0}, 
												{width: 95}, 
												{alignItems: 'center'}, 
												{borderRadius: 8}, 
												{backgroundColor: checkSortBySel(sorting)? 'black':"#00000000"}
											]}
										> 
											<TouchableOpacity onPress={() => handleSortBySel(sorting)}>
												<Text style={[{color:checkSortBySel(sorting)? 'white':'black'}]}>
													{sorting.replaceAll('_', ' ')}
												</Text>
											</TouchableOpacity>
										</View>
									)
								})}
							</View>
							
							{/* View for the 'Price' filter by Kenny Du */}
							<View style={styles.filterComponent1}>
								<Text style={styles.buttonText}>Price</Text>
								{prices.map((p) => {
									return (
										<View 
											key={p.number} 
											style={[
												{borderWidth: checkPriceSelect(p.number)? 1:0}, 
												{width: 50}, 
												{alignItems: 'center'}, 
												{borderRadius: 8}, 
												{backgroundColor: checkPriceSelect(p.number)? 'black':"#00000000"}
											]} 
										>
											<TouchableOpacity style = {[{width:50}, {alignItems:'center'}]} onPress={() => [handlePriceSel(p.number)]}>
												<Text style={[{color:checkPriceSelect(p.number)? 'white':'black'}]} >
													{p.price}
												</Text>
											</TouchableOpacity>
										</View>
									)
								})}
							</View>
						</View>
							
						<Text style={[styles.buttonText, {paddingTop:10}]} >Attributes</Text>
						{/* View for the 'Attributes' filter by Kenny Du */}
						<View style={styles.attributesFilter}>
							{attributes.map((attribute) => {
								return (
									<View 
										key={attribute} 
										style={[
											{padding: 5}, 
											{borderRadius: 8}, 
											{borderWidth: checkAttrSel(attribute)? 1:0}, 
											{backgroundColor: checkAttrSel(attribute)? 'black':"#00000000"}
										]} 
									>
										<TouchableOpacity style={{justifyContent:'center'}} onPress={() => handleAttrSel(attribute)}>
											<Text style={[{color:checkAttrSel(attribute)? 'white':'black'}]} >
												{attribute.replaceAll('_', ' ')} 
											</Text>
										</TouchableOpacity>
									</View>
								)
							})}
						</View>

						{/* View for the 'Back' and 'Save buttons */}
						<View style = {styles.filterExitButtonsContainer}>
							<TouchableOpacity
								onPress={() => setModalVisible(!modalVisible)}
								style={styles.filterExitButtons}
							>
								<Text style={styles.buttonText}>{"Back"}</Text>
							</TouchableOpacity>
							
							<TouchableOpacity
								onPress={saveFilters}
								style={styles.filterExitButtons}
							>
								<Text style={styles.buttonText}>{"Save"}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			}

			{(restaurants.length !== 0 && displayMap) ? map(restaurants, location) : <></>}
			{restaurants.length !== 0 &&
				<View style={{marginBottom: -27, marginLeft: 100, marginRight: 100, margin: 10}}>
					<TouchableOpacity
						onPress={() => setDisplayMap(!displayMap)}
						style={styles.button}
					>
						<Text style={styles.buttonText}>{displayMap ? 'Close Map' : `Display Map`}</Text>
					</TouchableOpacity>
				</View>
			}

			{restaurants.length !== 0 ? <Text style={{color: 'white', fontSize: 20, padding: 10}}>Results</Text> : <></>}
			
			<ScrollView style={styles.restaurantContainer} keyboardShouldPersistTaps={'handled'}>
				{restaurants !== [] &&
					restaurants.map((restaurant, index) => {
						return (
							<Pressable 
								key={restaurant.id} 
								onPress={() => {
									// Dylan Huynh: allows the user to be redirected to the restaurant profile of the restaurant they selected.
									try {
										dbGet('api_keys', 'key').then(keys => {
											businessDetail(restaurant.alias, keys.yelp).then(result => {navigation.navigate('RestaurantProfile', {data: result})})
										})
									} catch (error) {
										console.log(error)
									}

									
								}}
							>
								<View style={styles.restaurant}>
									<Image 
										style={styles.logo}
										source={{uri: restaurant.image_url}} 
									/>
									<View style={{flex: 1, marginLeft: 5}}>
										<Text style={styles.restaurantText}>{index + 1}. {restaurant.name}</Text>
										<Text style={styles.restaurantText}>
											{starRating(restaurant.id, restaurant.rating)} {restaurant.rating}
										</Text>
										<Text style={{
											fontSize: 17, 
											flexShrink: 1, 
											flexWrap: 'wrap', 
											color: restaurant.is_closed.toString() ? '#26B702' : '#FF0000'
										}}>
											{restaurant.is_closed.toString() ? `Open` : `Closed`}
										</Text>
										<Text style={styles.restaurantText}>{restaurant.location.address1}</Text>
									</View>
								</View>
							</Pressable>
						)
					})
				}
				{restaurants.length !== 0 && 
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={() => setPressed(pressed + 1)}
							style={styles.button}
						>
							<Text style={styles.buttonText}>See More Results</Text>
						</TouchableOpacity>
					</View>
				}
			</ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.backgroundDark,
	},
	searchContainer:{
        margin: 10,
		flexDirection: 'row'
    },
    searchBar: {
        padding: 10,
        flex: 1,
        borderRadius: 15,
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: colors.feastBlue,
        borderWidth: 2,
		color: colors.white
    },
	filter: {
		fontSize: 25,
		paddingTop: 11,
		paddingLeft: 9,
		color: '#75d9fc'
	},
	restaurantContainer: {
        flex: 1,
		padding: 10,
		marginBottom: 5
    },
	restaurant: {
		width: '100%',
		backgroundColor: colors.backgroundDarker,
		borderRadius: 25,
		height: 150,
		marginBottom: 20,
		padding: 20,
		flexDirection:'row',
		flexWrap: 'wrap',
	},
	restaurantText: {
		color: 'white',
		fontSize: 17,
		flexShrink: 1,
		flexWrap: 'wrap',
	},
	logo: {
		width: 125,
		height: 115,
		borderRadius: 15,
	},
	buttonContainer: {
		flex: 1,
		paddingLeft: 100,
		paddingRight: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: colors.feastBlue,
		width: '100%',
		padding: 15,
		borderRadius: 50,
		alignItems: 'center',
		marginBottom: 35
	},
	buttonText: {
		color: colors.black,
		fontWeight: '700',
		fontSize: 16
	},
	modalView: {
        margin: 20,
        height: 510,
        backgroundColor: '#a2bef0',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
		borderWidth:.1,
		borderBottomColor: 'red'
    },
	filterComponent1: {
		flexDirection: 'column',
		borderRadius: 5,
		borderColor: 'red',
		alignItems: 'center',
		height: 175,
		padding: 20,
		paddingEnd: 40,
		paddingTop: 10,
		paddingBottom: 5,
		justifyContent: 'space-between',
	},
	sortPriceView: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth:1,
		paddingBottom:10,
		// borderWidth: 1,
		borderColor: 'black'
	},
	centerText:{
		alignItems: 'center'
	},
	attributesFilter:{
		height: 140, 
		width: 340,
		paddingHorizontal: 30,
		flexDirection: 'column',
		flexWrap: 'wrap',
		// borderWidth: 1,
		borderRadius: 5,
		borderColor: 'red',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'space-between',
	},
	filterExitButtons:{
		backgroundColor: '#75d9fc',
		width: '100%',
		padding: 15,
		borderRadius: 50,
		alignItems: 'center',
		width: 120,
		margin: 10,
		marginTop: 10,
	},
	filterExitButtonsContainer:{
		flexDirection: 'row', 
		justifyContent: 'center',
	}
})