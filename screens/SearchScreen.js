import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Image, ScrollView } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import Geolocation from 'react-native-geolocation-service';
import {searchBusinesses, autocomplete, businessDetail} from '../utils/yelp.js';
import {dbGet, dbSet} from '../utils/firebase.js';
import { requestLocationPermission } from '../utils/locationPermission.js'
import { SearchBar} from '../components/SearchBar.js';

export default function SearchScreen() {
	const [searchText, setSearchText] = useState('')
	const [location, setLocation] = useState(false)
	const [restaurants, setRestaurants] = useState([])
	const [pressed, setPressed] = useState(1)
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

	/**
	 * After refresh, the app will get the user's location
	 */
	useEffect(() => {
		setPressed(1)
		setSearchText('')
		getLocation()
	}, [])

	/**
	 * If pressed state is changed, it will call the handleSearch 
	 * function with a new limit
	 */
	useEffect(() => {
		if (pressed !== 1) {
			const limit = 10 * pressed
			console.log("here", limit)
			handleSearch({limit})
		}
	}, [pressed])

	/**
	 * uses the geolocation package to get the user's current latitude and longitude
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
	 * @param {*} limit amount of results that will be displayed (default value of 10)
	 * calls the yelp api function to return search results
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
	 * increments the amount of times the 'See More Results' button is pressed
	 */
	handlePress = () => {
		setPressed(pressed + 1)
	}
    

    return (
        <ScrollView style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput 
					style={styles.searchBar}
					placeholder='Search for foods...'
					placeholderTextColor='white'
					value = {searchText}
					onChangeText={text => setSearchText(text)}
					onSubmitEditing={handleSearch}
				/>
			</View>
			<View style={styles.restaurantContainer}>
				{restaurants.length !== 0 ? <Text style={{color: 'white', fontSize: 20}}>Results</Text> : <></>}
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
									<Text style={styles.restaurantText}>{restaurant.rating}</Text>
									<Text style={styles.restaurantText}>
										{restaurant.is_closed.toString() ? 'Open' : 'Closed'}
									</Text>
									<Text style={styles.restaurantText}>{restaurant.location.address1}</Text>
									{/* {restaurant.coordinates.latitude} {restaurant.coordinates.longitude} */}
								</View>
							</View>
						)
					})
				}
			</View>
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
        borderColor: '#4A9B6A',
        borderWidth: 2,
		color: 'white'
    },
	restaurantContainer: {
        flex: 1,
		padding: 10,
		display: 'flex',
		marginBottom: 55
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
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginBottom: 35
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	},
})
