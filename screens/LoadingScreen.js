import React, { useState, useEffect } from 'react';
import { Text, View} from 'react-native'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { dbSet } from '../utils/firebase'

export default function LoadingScreen() {
	const navigation = useNavigation()

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged((user) => {
			console.log("user", JSON.stringify(user));
			dbSet(
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
			).then(() => {
				navigation.navigate("TabNavigator")
			})
		});

		return subscriber;
	}, []);


    return(
        <View>
            <View>
                <Text>LOADING...</Text>
            </View>
        </View>
    );
}