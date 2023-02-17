import React, { useState, useEffect } from 'react';
import { Text, View} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';

export default function LoadingScreen() {
	const [user, setUser] = useState({});

	const navigation = useNavigation()

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged((user) => {
			console.log("user", JSON.stringify(user));
			setUser(user);
		});

		return subscriber;
	}, []);


    return(
        <View>
            <View>
                <Text>This is the Loading screen</Text>
            </View>
        </View>
    );
}