import React, { useState, useEffect } from 'react';
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import MessagesScreen from './screens/MessagesScreen';
import FollowersScreen from './screens/FollowersScreen';
import FollowingScreen from './screens/FollowingScreen';
import RestaurantProfileScreen from './screens/RestaurantProfileScreen';


const Stack = createNativeStackNavigator()


export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />

        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Your Profile" component={UserProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Messages" component={MessagesScreen} />
				<Stack.Screen name="Followers" component={FollowersScreen} />
				<Stack.Screen name="Following" component={FollowingScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}