import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native'
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'

export default function HomeScreen() {
	const navigation = useNavigation()
	const user = auth().currentUser

	/*
	React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	  }, [navigation]);
	*/

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

	// RestaurantProfile and UserProfile might not be needed on the stack in the future. they are there for testing
	return (
		
		<View style={styles.container}>
			<TouchableOpacity 
				style={styles.button}
				onPress={logoff}
			>
				<Text>{user.displayName}</Text>
			</TouchableOpacity>

			<Button title = "UserProfile" onPress={() => navigation.navigate('Your Profile')} />
			<Button title = "RestaurantProfile" onPress={nagivateRestaurant} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
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
	}
})