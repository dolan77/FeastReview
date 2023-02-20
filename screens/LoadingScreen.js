import React, { useState, useEffect } from 'react';
import { Text, View} from 'react-native'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import * as firebase from '../utils/firebase'
import Loader from '../methods/Loader'

export default function LoadingScreen() {
	const navigation = useNavigation()

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged((user) => {
			redirect(user)
		});

		return unsubscribe;
	}, []);

	const redirect = (user) => {
		addUserToDb(user).then(() => {
			setTimeout(() => {
				navigation.navigate("TabNavigator")
			}, 1000);
		})
	}

	const addUserToDb = async (user) => {
		const res = await firebase.dbSet(
			"users", 
			user.uid, 
			{
				bio: "",
				bookmarks: [],
				expertise: {},
				followers: [],
				following: [],
				username: user.displayName,
				reviews: []
			}
		)
	}
	
    return(
        <Loader />
    );
}