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


export default function SearchScreen() {
	const defaultLocation = {"coords": {"accuracy": 5, "altitude": 5, "altitudeAccuracy": 0.5, "heading": 0, "latitude": 33.78383050167186, "longitude": -118.11367992726652, "speed": 0}, "mocked": false, "provider": "fused", "timestamp": 1676767775647}

	const [searchText, setSearchText] = useState('')
	const [location, setLocation] = useState(defaultLocation)
	const [restaurants, setRestaurants] = useState([])
	const [pressed, setPressed] = useState(1)
	const [displayMap, setDisplayMap] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);
	const [filterString, setFilterString] = useState('&')

    const navigation = useNavigation();

	/**
	 * After refresh, the app will get the user's location
	 * written by Matthew Hirai
	 */
	useEffect(() => {
		setPressed(1)
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
			handleSearch({limit})
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
	handleSearch = ({limit = 10}, filter = "") => {
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
					setFilterString('&')
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
	 * adds a query param to the filterString state
	 * @param {*} filter string that user presses from the filter modal
	 * written by Matthew Hirai
	 */
	filtering = (filter) => {
		if (filterString.length != 1) {
			setFilterString((prev) => prev + '&')
		}
		if (attributes.includes(filter)) {
			setFilterString((prev) => prev + `attributes=${filter}`)
		}

		else if (sort_by.includes(filter)) {
			setFilterString((prev) => prev + `sort_by=${filter}`)
		}

		else if (prices.some(p => p.number === filter)) {
			setFilterString((prev) => prev + `price=${filter}`)
		}
	}

	/**
	 * calls the handleSearch function with filters
	 * written by Matthew Hirai
	 */
	saveFilters = () => {
		handleSearch(10, filterString)
		setFilterString('&')
		setModalVisible(false)
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
					<View style = {styles.modalView}>
						<Text>Filter</Text>

						{/* Container for all filter components */}
						<View style = {styles.sortPriceView}>

							{/* View for the 'Sort By' filter by Kenny Du */}
							<View style={styles.filterComponent1}>
								<Text style={{fontSize:15}}>Sort By</Text>
								{sort_by.map((sorting) => {
									return (
										<View style={{padding: 5}} key={sorting}>
											<TouchableOpacity onPress={() => filtering(sorting)}>
												<Text>{sorting.replaceAll('_', ' ')}</Text>
											</TouchableOpacity>
										</View>
									)
								})}
							</View>
							
							{/* View for the 'Price' filter by Kenny Du */}
							<View style={styles.filterComponent1}>
								<Text>Price</Text>
								{prices.map((p) => {
									return (
										<View style={[{alignSelf: 'center'}, {borderWidth:1}]} key={p.number} >
											<TouchableOpacity onPress={() => filtering(p.number)}>
												<Text>{p.price}</Text>
											</TouchableOpacity>
										</View>
									)
								})}
							</View>
						</View>
							
							{/* View for the 'Attributes' filter by Kenny Du */}
							<View style={styles.filterComponent}>
								<Text>Attributes</Text>
								{attributes.map((attribute) => {
									return (
										<View style={{padding: 5}} key={attribute} >
											<TouchableOpacity onPress={() => filtering(attribute)}>
												<Text>{attribute.replaceAll('_', ' ')}</Text>
											</TouchableOpacity>
										</View>
									)
								})}
						</View>

						
						
						<TouchableOpacity
							onPress={() => setModalVisible(!modalVisible)}
							style={styles.button}
							options={padding=5}
						>
							<Text style={styles.buttonText}>{"Back"}</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							onPress={saveFilters}
							style={styles.button}
						>
							<Text style={styles.buttonText}>{"Save"}</Text>
						</TouchableOpacity>

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
		backgroundColor: '#3A3A3A',
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
        borderColor: '#75d9fc',
        borderWidth: 2,
		color: 'white'
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
		backgroundColor: '#575757',
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
		backgroundColor: '#75d9fc',
		width: '100%',
		padding: 15,
		borderRadius: 50,
		alignItems: 'center',
		marginBottom: 35
	},
	buttonText: {
		color: 'black',
		fontWeight: '700',
		fontSize: 16
	},
	modalView: {
        margin: 20,
        height: 500,
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
		flexWrap: 'wrap',
		borderWidth: 1,
		borderRadius: 5,
		borderColor: 'red',
		alignItems: 'center',
		alignSelf: 'center',
		// width:100.5,
		height: 220,
		padding: 40,
		// justifyContent: 'space-evenly'
	},
	sortPriceView: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth:1,
		borderColor: 'green'
	},
	centerText:{
		alignItems: 'center'
	}
})