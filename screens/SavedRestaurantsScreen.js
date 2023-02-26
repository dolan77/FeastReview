import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'
import { starRating } from '../methods/star';
import { timeConvert } from '../methods/time';

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
        // console.log('test')
        // console.log(date.getDay())
        // console.log(Number(hours_and_min))
        //console.log(`${hours}${min}`)

        for (let i = 0; i < restaurant_data.length; i++){

            // TODO: figure out how to check if a store is opened/closed with the boys later.
            var date = new Date(); //Current Date
            var hours = date.getHours(); //To get the Current Hours
            var min = date.getMinutes(); //Current Minutes
            
            var hours_and_min = `${hours}${min}`
            if (min < 10){
                hours_and_min = `${hours}${min}0`
            }
            //console.log('ttt')
            //console.log(hours_and_min)
            // console.log(Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))
            //console.log(Number(restaurant_data[i].hours[0].open[date.getDay()].start) + ":" + Number(restaurant_data[i].hours[0].open[date.getDay()].end))
            //console.log(Number(restaurant_data[i].hours[0].open[date.getDay()].start) < Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))
            console.log(restaurant_data[i].hours[0].open[date.getDay()].start)

            if((Number(restaurant_data[i].hours[0].open[date.getDay()].start) < Number(hours_and_min)) && 
                (Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))){
                table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                    <Text style={styles.globalFont}>{restaurant_data[i].name} :
                        <Text style={styles.openColor}>Open</Text>
                    </Text>
                    <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}</Text>
                    <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                </TouchableOpacity>)
            }
            else{
                table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                    <Text style={styles.globalFont}>{restaurant_data[i].name} :
                        <Text style={styles.closedColor}> Closed</Text>
                    </Text>
                    <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                    <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}
                    </Text>
                    
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
        height: 110,
        marginTop: 10,
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10,
        
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