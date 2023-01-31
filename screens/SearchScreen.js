import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button} from 'react-native'
import React, { useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import Geolocation from 'react-native-geolocation-service';
import {searchBusinesses, autocomplete, businessDetail} from '../utils/yelp.js';
import {dbGet, dbSet} from '../utils/firebase.js';
import { requestLocationPermission } from '../utils/locationPermission.js'


export default function SearchScreen() {
	const [searchText, setSearchText] = useState('')
	const [location, setLocation] = useState(false)
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

	/**
	 * uses the geolocation package to get the user's current latitude and longitude
	 */
	getLocation = () => {
		const result = requestLocationPermission();
		result.then(res => {
			if (res) {
				Geolocation.getCurrentPosition(
				position => {
					console.log("position", position)
				},
				error => {
					// See error code charts below.
					console.log(error.code, error.message);
					setLocation(false)
				},
				{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
				);
			}
		});
	};

	handleSearch = (event) => {
		getLocation()
		console.log(location)
		// dbGet('api_keys','key').then(keys => {
		// 	searchBusinesses(searchText, {lat:33.755131, long:-117.981018}, keys.yelp)
		// 	.then(result => console.log(result));
		// });

		setSearchText('')
	}
    

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.searchBar}
                placeholder='Search for foods...'
                value = {searchText}
				onChangeText={text => setSearchText(text)}
				onSubmitEditing={handleSearch}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3A3A3A',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#4A9B6A',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    searchBar: {
        padding:10,
        flexDirection:'row',
        backgroundColor: '#3A3A3A',
        borderRadius: 15,
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: '#4A9B6A',
        borderWidth: 2
    },
    searchInput: {
        fontSize: 20,
        color: '#000000'
    }
})
