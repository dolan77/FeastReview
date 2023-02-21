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
import NavBar from './screens/NavBar';
import OtherUserProfileScreen from './screens/OtherUserProfileScreen';
import CreateReviewScreen from './screens/CreateReviewScreen';

import RegisterScreen from './screens/RegisterScreen';
import FollowersAndFollowing from './screens/FollowersAndFollowingScreen';

const Stack = createNativeStackNavigator()

function NavTabs(){
	return <NavBar/>
}

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Login'>
				<Stack.Screen options={{ headerShown: false }} name="TabNavigator" component={NavTabs} />
				<Stack.Screen name = "FollowersAndFollowing" component={FollowersAndFollowing} />
				<Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
		        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
				
			</Stack.Navigator>
		</NavigationContainer>
	);
}
