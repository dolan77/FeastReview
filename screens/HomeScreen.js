import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native'

export default function HomeScreen() {
	const navigation = useNavigation()

	logoff = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.replace("Login")
			})
			.catch(error => alert(error.message))
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity 
				style={styles.button}
				onPress={logoff}
			>
				<Text style={styles.buttonText}>Sign Out</Text>
			</TouchableOpacity>

			<Button title = "UserProfile" onPress={() => navigation.navigate('UserProfile')} />
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