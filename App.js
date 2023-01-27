import React, { useState, useEffect } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { RegisterScreen } from './screens/RegisterScreen';

const Stack = createNativeStackNavigator()

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}