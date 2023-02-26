import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'
import { starRating } from '../methods/star';

// if a user clicks on their saved restaurants. navigate them to the restaurant screen
export default function SavedRestaurantsScreen({route}){
    restaurant_data = route.params.restaurants
    const navigation = useNavigation();
    const user = auth().currentUser;

    const seeRestaurant = (restaurant_data) => {
        navigation.navigate('RestaurantProfile', {
            data: restaurant_data
        })
    }
    const PopulateRestaurants = () => {
        let table = [];
        for (let i = 0; i < restaurant_data.length; i++){
            // console.log(restaurant_data[i].hours[0].is_open_now)
            if (restaurant_data[i].hours[0].is_open_now){
                table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                    <Text style={styles.globalFont}>{restaurant_data[i].name}</Text>
                    <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                    <Text style={styles.openColor}>Open</Text>
                </TouchableOpacity>)
            }
            else{
                table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                    <Text style={styles.globalFont}>{restaurant_data[i].name}</Text>
                    <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                    <Text style={styles.closedColor}>Closed</Text>
                </TouchableOpacity>)
                
            }
                


            
        }
        return table
    };
    //console.log('test')
    //console.log(restaurant_data)
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <View><Text style={styles.globalFont}>Saved Restaurants</Text></View>
                </View>
                <View>
                    {PopulateRestaurants()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    globalFont: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
    container: {
        backgroundColor: '#3d4051',
        flex:1
    },
    FollowingBox: {
        backgroundColor: '#3f3a42',
        height: 100,
        marginTop: 10,
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10
    },
    FollowBoxItems:{
        
        justifyContent: 'center',
        paddingLeft: 10
    },
    openColor:{
        color:'#4CF439',
        fontSize: 20,
        fontWeight: '500',
    },
    closedColor:{
        color:'#E80F13',
        fontSize: 20,
        fontWeight: '500',
    }
})