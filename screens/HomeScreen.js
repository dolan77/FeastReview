import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native'
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'
import Ionicons from 'react-native-vector-icons/Ionicons';

import image from "../assets/feast_blue.png"

export default function HomeScreen() {
	const [user, setUser] = useState({});

	const navigation = useNavigation()

	
	React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	}, [navigation]);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged((user) => {
			console.log("user", JSON.stringify(user));
			setUser(user);
		});

		return subscriber;
	}, []);

	logoff = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.replace("Login")
			})
			.catch(error => alert(error.message))
	}
	// navigation.navigate('RestaurantProfile',{data: result})
	// testing passing in data from a McDonalds. Search must handle passing data of that specific restaurant
	const nagivateRestaurant = () => {
		firebase.dbGet('api_keys', 'key')
		.then(keys => {yelp.businessDetail("mcdonalds-westminster-10", keys.yelp)
		.then(result => navigation.navigate('RestaurantProfile',{data: result}))});
	}

	// testing following this user.
	const navigateOtherUserProfile = () => {
		navigation.navigate("OtherUserProfile", {id: "pm6f9wpKmZM9GyEVL2HJuowhEda2"});
	}

	// RestaurantProfile and UserProfile might not be needed on the stack in the future. they are there for testing
	return (
		<View style = {styles.container}>

			{/* ScrollView allows you to scroll down the feed */}
			<ScrollView style={{flex:1, backgroundColor: '#3d4051'}}>
				
				{/* First "review" container */}
				<View style = {styles.reviewContainer}>
					{/* Picture and name of the reviewer */}
					<View style = {{flexDirection: "row"}}>
						<Image style = {[styles.profileIcon]} source={image}/>
						<Text style = {styles.emailWrap}> {user.email}</Text>
					</View>

					{/* Reviewer's comments on the restaurant. */}
					<View >
						<Text style = {styles.reviewContent}>
							Food here is about average for the pricepoint, but you HAVE to try the Sister Meal Deluxe!! BEST THING EVER 💋💋💅💅'
						</Text>
					</View>

					{/* Name of the restaurant reviewed */}
					<View style = {{flexDirection: "row"}}>
						<Ionicons style={styles.locationIcon} name="location-outline">
							<Text> - </Text>
						</Ionicons>
						<Text style = {styles.restaurantName}>Hey Sisters LA</Text>
					</View>

				</View>
				
				

				<Image style = {[styles.tempPicture]} source={image}/>
				<Image style = {[styles.tempPicture]} source={image}/>
				<Image style = {[styles.tempPicture]} source={image}/>
				
				
				<View style={styles.container}>
					<TouchableOpacity 
						style={styles.button}
						onPress={logoff}
					>
						<Text style={{color: "white"}}>{user.displayName} LOG OUT </Text>
					</TouchableOpacity>

					<Button title = "User Profile" onPress={() => navigation.navigate('Your Profile')} />
					<Button title = "RestaurantProfile" onPress={nagivateRestaurant} />
            		<Button title = "Matthew's Profile" onPress={navigateOtherUserProfile} />
				</View>
			</ScrollView>
		</View>
		
		

	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3d4051',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
	reviewContainer: {
		backgroundColor: '#5b628a',
		flex: 1,
		width: 380,
		length: 200,
		justifyContent: 'center',
		alignSelf: 'center',
		margin: 5,
		borderRadius: 15,
		borderWidth: 1,
	},
	emailWrap: {
		flexWrap: 'wrap',
        flex: 2,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 15,
        justifyContent: 'center',
		alignSelf: 'center',
        paddingLeft: 5,
		paddingRight: 5,
        paddingTop: 5,
        fontSize: 20,
        color: 'white'
	},
	reviewContent: {
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		paddingTop: 10,
		color: 'white',
		flexWrap: 'wrap',
		alignSelf: 'center',
		fontSize: 14
	},
	locationIcon: {
		color: 'white', 
		fontSize: 30, 
		marginLeft: 20, 
		marginBottom: 10,
	},
	restaurantName: {
		color: 'white',
		alignSelf: 'flex-start',
		marginTop: 5,
		fontSize: 18,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	},

	profileIcon: {
		width: 75,
		height: 110,
		flex: 1,
		marginLeft: 5,
		marginTop: 5,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'white',	
	},


	tempPicture: {
		backgroundColor: '#020878',
		width: 250,
		height: 250,
		flex: 1,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: 'black',
		alignSelf: 'center',
		margin: 3,
	}
})
