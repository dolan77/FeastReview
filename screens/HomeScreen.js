import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native'

import image from "../assets/feast_blue.png"

export default function HomeScreen() {
	const navigation = useNavigation()
	const user = auth().currentUser

	React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	  }, [navigation]);

	logoff = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.replace("Login")
			})
			.catch(error => alert(error.message))
	}

	// RestaurantProfile and UserProfile might not be needed on the stack in the future. they are there for testing
	return (
		<ScrollView options={{backgroundColor: 'red'}}>
			<Image style = {[styles.fittedSize]} source={image}/>
			<Image style = {[styles.fittedSize]} source={image}/>
			<Image style = {[styles.fittedSize]} source={image}/>
			<Image style = {[styles.fittedSize]} source={image}/>
			<View style={styles.container}>
				<TouchableOpacity 
					style={styles.button}
					onPress={logoff}
				>
					<Text>{user.displayName}</Text>
				</TouchableOpacity>

				<Button title = "User Profile" onPress={() => navigation.navigate('Your Profile')} />
				<Button title = "Restaurant Profile" onPress={() => navigation.navigate('RestaurantProfile')} />
		</View>
		</ScrollView>
		
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3d4051',
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
	},

	fittedSize: {
		backgroundColor: '#020878',
		width: 385,
		height: 385,
		flex: 1,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: 'black',
		alignSelf: 'center',
		margin: 3
		// paddingVertical: 25
	}
})