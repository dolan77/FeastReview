import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Image, ScrollView } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import Geolocation from 'react-native-geolocation-service';
import { starRating } from '../methods/star.js';
import { map } from '../methods/map.js';
import { searchBusinesses } from '../utils/yelp.js';
import { dbGet, dbSet } from '../utils/firebase.js';
import { requestLocationPermission } from '../utils/locationPermission.js'
import { SearchBar} from '../components/SearchBar.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchScreen() {
	const [searchText, setSearchText] = useState('')
	const [location, setLocation] = useState(false)
	const [restaurants, setRestaurants] = useState([])
	const [pressed, setPressed] = useState(1)
    const navigation = useNavigation();

	/**
	 * After refresh, the app will get the user's location
	 * written by Matthew Hirai
	 */
	useEffect(() => {
		setPressed(1)
		setSearchText('')
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
	getLocation = () => {
		const result = requestLocationPermission();
		result
			.then(res => {
				if (res) {
					Geolocation.getCurrentPosition(
					position => {
						setLocation(position)
					},
					error => {
						// See error code charts below.
						console.log(error.code, error.message);
						setLocation(false)
					},
					{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
					);
				}
			});
	};
	
	/**
	 * Calls the yelp api function then sets the results to restaurant state
	 * @param {*} limit amount of results that will be displayed (default value of 10)
	 * by Nathan Lai
	 */
	handleSearch = ({limit = 10}) => {
		dbGet('api_keys','key')
			.then(keys => {
				searchBusinesses(
					searchText, 
					{lat: location.coords.latitude, long: location.coords.longitude},
					limit, 
					keys.yelp
				)
				.then(result => {
					setRestaurants([...result])
				});
		});
	}

	/**
	 * Allows live complete by putting searchtext together with handleSearch
	 * @param {*} text the string that the user types
	 * by Nathan Lai
	 */
	autoComplete = (text) => {
		setSearchText(text);
		handleSearch(10);
	}

	/**
	 * Increments the amount of times the 'See More Results' button is pressed
	 * by Nathan Lai
	 */
	handlePress = () => {
		setPressed(pressed + 1)
	}

	/**
	 * displays a map with markers of the restaurants that the user searched
	 * by Matthew Hirai
	*/
    return (
        <View style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput 
					style={styles.searchBar}
					placeholder='Search for foods...'
					placeholderTextColor='white'
					value = {searchText}
					onChangeText={text => autoComplete(text)}
					onSubmitEditing={handleSearch}
				/>
			</View>
			{restaurants.length !== 0 ? map(restaurants, location) : <></>}
			{restaurants.length !== 0 ? <Text style={{color: 'white', fontSize: 20, padding: 10}}>Results</Text> : <></>}
			<ScrollView style={styles.restaurantContainer}>
				{restaurants !== [] &&
					restaurants.map(restaurant => {
						return (
							<View key={restaurant.id} style={styles.restaurant}>
								<Image 
									style={styles.logo}
									source={{uri: restaurant.image_url}} 
								/>
								<View style={{flex: 1, marginLeft: 5}}>
									<Text style={styles.restaurantText}>{restaurant.name}</Text>
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
						)
					})
				}
				{restaurants.length !== 0 && 
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={handlePress}
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
    },
    searchBar: {
        padding: 10,
        flexDirection:'row',
        borderRadius: 15,
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: '#75d9fc',
        borderWidth: 2,
		color: 'white'
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
})