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


	
	
    return(
        <Loader />
    );
}