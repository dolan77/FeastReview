import { StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native'
import * as React from 'react'
import { useNavigation } from '@react-navigation/core';
import {searchBusinesses, autocomplete, businessDetail} from '../utils/yelp.js';
import {dbGet, dbSet} from '../utils/firebase.js';

export default function SearchScreen() {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    //searchBusinesses(searchText, 'westminster, CA').then(results => {
    //    console.log(results);
    //});
    
    var searchText = '';

    dbGet('api_keys','key').then(keys => {
        searchBusinesses("mcdonalds", {lat:33.755131, long:-117.981018}, keys.yelp).then(result => console.log(result));
    });
    

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.searchBar}
                placeholder='Search for foods...'
                value = {searchText}
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
