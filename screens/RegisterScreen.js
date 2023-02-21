import React, { useState, useEffect } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';

export default function RegisterScreen() {
	const [userName, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordAgain, setPasswordAgain] = useState('')

	const navigation = useNavigation()

	// calls the Firebase api with user input to create a user object and put it in the
	// Firestore
  	createUser = () => {
		if (password !== passwordAgain) {
			console.log('Passwords do not match')
		}

		else if (password === '' || passwordAgain === '' || email === '' || userName === '') {
			console.log('Not all details are entered!')
		}

		else {
			auth()
				.createUserWithEmailAndPassword(email, password)
				.then((userCreds) => {
					console.log("Registration successful")
					if (userCreds) {
						auth()
							.currentUser.updateProfile({
								displayName: userName,
						  	})
						  	.then(() => navigation.replace("TabNavigator"))
						  	.catch((error) => {
								console.error(error);
						  	});
					  }
				})
				.catch(error => {
					if (error.code === 'auth/email-already-in-use') {
						console.log('That email address is already in use!');
					}

					if (error.code === 'auth/invalid-email') {
						console.log('That email address is invalid!');
					}

					console.error(error);
				});
		}
		
	}
	
	// displays an input form for user to make an account for FeastReview
  	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior="padding"
		>
			<Image 
				source={require('../assets/feast_blue.png')}  
				style={styles.logo} 
			/>
			<View style={styles.inputContainer}>
				<TextInput 
					placeholder='Username'
					value={userName}
					onChangeText={text => setUserName(text)}
					style={styles.input}
				/>
				<TextInput 
					placeholder='Email'
					value={email}
					onChangeText={text => setEmail(text)}
					style={styles.input}
				/>
				<TextInput 
					placeholder='Password'
					value={password}
					onChangeText={text => setPassword(text)}
					style={styles.input}
					secureTextEntry
				/>
				<TextInput 
					placeholder='Re-enter Password'
					value={passwordAgain}
					onChangeText={text => setPasswordAgain(text)}
					style={styles.input}
					secureTextEntry
				/>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={createUser}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Register</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate("Login")}
					style={[styles.button, styles.buttonOutline]}
				>
				<Text style={styles.buttonOutlineText}>Back</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#75d9fc'
	},
	inputContainer: {
		width: '80%'
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginStart: 5,
		margin: 5,
	},
	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40
	},
	button: {
		backgroundColor: 'white',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#e43d4c',
		borderWidth: 2
	},
	buttonText: {
		color: 'black',
		fontWeight: '700',
		fontSize: 16
	},
	buttonOutlineText: {
		color: '#e43d4c',
		fontWeight: '700',
		fontSize: 16
	},
	logo: {
		width: 175, 
		height: 175, 
		borderRadius: 175/ 2,
		marginBottom: 5,
		marginTop: -30
	}
})