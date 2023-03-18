import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native'
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { requestLocationPermission } from '../utils/locationPermission.js'
import image from "../assets/feast_blue.png"

export default function HomeScreen() {
	const user = auth().currentUser
	const [reviews, setReviews] = useState([])
	const [following, setFollowing] = useState([])

	const navigation = useNavigation()

	/**
	 * Requests the user for their permission to get there location
	 * Calls teh getFollowers method
	 */
	useEffect(() => {
		const res = requestLocationPermission();
		res.then(() => {
			console.log("Got location")
		})
		.catch(() => {
			console.log("Failed to get location")
		})

		setReviews([])
		setFollowing([])
		getFollowers(user.uid)
	}, [])

	/**
	 * Logs the user out of the app
	 */
	logoff = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.navigate("Login")
			})
			.catch(error => alert(error.message))
	}
	
	/**
	 * Gets the user's following and sets them to the reviews state
	 * @param {*} uid user's unique id
	 */
	getFollowers = (uid) => {
		firebase.dbGet('users', uid)
		.then(result => {
			firebase.dbGetFollowed(result.following).then(result => {
				result.forEach( (doc, key) => {
					firebase.dbGetReviews(key, "authorid")
					.then(dbReviews => {
						if (dbReviews.size !== 0) {
							setReviews(prev => [...prev, ...dbReviews])
						}
					})

					setFollowing(prev => [...prev, {"id": key, "name": doc.name}])
				})
			})
		})
	}

	displayReviews = () => {
		const followingUser = following.find(user => user.id == "pm6f9wpKmZM9GyEVL2HJuowhEda2")
		console.log(followingUser.name)
	}

	getUserName = (id) => {
		const followingUser = following.find(user => user.id == id)
		return followingUser.name
	}
	
	return (
		<View style = {styles.container}>

			{/* ScrollView allows you to scroll down the feed */}
			<ScrollView style={{flex:1, backgroundColor: '#3d4051'}}>
				{reviews.map(review => {
					return (
						<View style = {styles.reviewContainer} key={review[0]}>
							
							<View style = {{flexDirection: "row"}}>
								<Image style = {[styles.profileIcon]} source={image}/>
								<Text style = {styles.emailWrap}> {getUserName(review[1].authorid)}</Text>
							</View>

							<View >
								<Text style = {styles.reviewContent}>
									{review[1].content}
								</Text>
							</View>

							<View style = {{flexDirection: "row"}}>
								<Ionicons style={styles.locationIcon} name="location-outline">
									<Text> - </Text>
								</Ionicons>
								<Text style = {styles.restaurantName}>{review[0]}</Text>
							</View>
						</View>
					)
				})}
				<View style={styles.container}>
					<TouchableOpacity 
						style={styles.button}
						onPress={logoff}
					>
						<Text style={{color: "white"}}>LOG OUT </Text>
					</TouchableOpacity>
				</View>
				<View style={styles.container}>
					<TouchableOpacity 
						style={styles.button}
						onPress={displayReviews}
					>
						<Text style={{color: "white"}}>R</Text>
					</TouchableOpacity>
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
