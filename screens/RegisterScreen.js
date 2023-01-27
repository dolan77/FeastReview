import React, { useState, useEffect } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';

export const RegisterScreen = () => {
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordAgain, setPasswordAgain] = useState('')

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(user => {
			if (user) {
				navigation.replace("Home")
			}
		});
		return unsubscribe; // unsubscribe on unmount
	}, []);

  	createUser = () => {
		if (password !== passwordAgain) {
			console.log('Passwords do not match')
		}

		else if (password === '' || passwordAgain === '' || email === '' || displayName === '') {
			console.log('Not all details are entered!')
		}

		else {
			auth()
			.createUserWithEmailAndPassword(email, password)
			.then(userCreds => {
				const user = userCreds.user
				user.updateProfile({
					displayName: displayName
				})
				console.log(user.email, 'has signed up')
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
  
  	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior="padding"
		>
			<View style={styles.inputContainer}>
				<TextInput 
					placeholder='Display name'
					value={displayName}
					onChangeText={text => setDisplayName(text)}
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
		alignItems: 'center'
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
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#0782F9',
		borderWidth: 2
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16
	}
})