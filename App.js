import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function App() {
	createUser = () => {
		auth()
			.createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
			.then(() => {
				console.log('User account created & signed in!');
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

	login = () => {
		auth()
			.signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
			.then(() => {
				console.log('User signed in!');
			})
			.catch(error => {
				if (error.code === 'auth/invalid-email') {
				console.log('That email address is invalid!');
				}

				console.error(error);
			});
	}

	logoff = () => {
		auth()
			.signOut()
			.then(() => console.log('User signed out!'));
	}

	// Set an initializing state whilst Firebase connects
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing) return null;

	if (!user) {
		return (
		<View>
			<Text>Login</Text>
			<Button title="Create User" onPress={this.createUser} />
			<Button title="Login" onPress={this.login} />
		</View>
		);
	}

	return (
		<View>
			<Text>Welcome {user.email}</Text>
			<Button title="Create User" onPress={this.createUser} />
			<Button title="Log off" onPress={this.logoff} />
		</View>
	);
}