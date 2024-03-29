import React, { useState, useEffect } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';

export default function LoginScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [forgotPassword, setForgotPassword] = useState(false)

	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(user => {
			if (user) {
				navigation.replace("TabNavigator")
			}
		});
		return unsubscribe; // unsubscribe on unmount
	}, []);

	/**
	 * calls the firebase api to sign in the user
	 */
	login = () => {
		if(email && password){
			auth()
			.signInWithEmailAndPassword(email, password)
			.then(userCreds => {
				const user = userCreds.user
				console.log(user.email, 'has logged in')
				if (user) navigation.navigate("TabNavigator");
			})
			.catch(error => {
				if (error.code === 'auth/invalid-email') {
					console.log('That email address is invalid!');
				}

				// console.error(error);
				alert("Invalid Email Address or Password!")
			});
		}
		else {
			console.error("Please fill in all fields");
		}
	}

	/**
	 * calls the firebase api to send the email to the user for a password reset
	 */
	passwordReset = () => {
		if(email){
			auth()
				.sendPasswordResetEmail(email)
				.then((link) => {
					console.log('Email sent! to', email)
					alert('Email sent!')
				})
				.catch((error) => {
					// console.error('Please enter email first')
					alert('Please enter a valid email first.')
				})
		}
		else {
			console.error("Please enter email first");
		}
	}

	// displays inputs for user to log in
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
				<TouchableOpacity
					onPress={() => passwordReset()}
				>
					<Text style={styles.forgot}>Forgot Password</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={login}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				onPress={() => navigation.navigate("Register")}
			>
				<Text style={{color: 'black'}}>Don't have account? Click here to register</Text>
			</TouchableOpacity>
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
		marginBottom: 10
	},
	forgot: {
		textAlign: 'right',
		paddingHorizontal: 2,
		color: 'black'
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
	buttonText: {
		color: 'black',
		fontWeight: '700',
		fontSize: 16
	},
	logo: {
		width: 175, 
		height: 175, 
		borderRadius: 175/ 2,
		marginBottom: 75,
		marginTop: -30
	}
})