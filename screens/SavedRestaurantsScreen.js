import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'
import { starRating } from '../methods/star';
import { timeConvert } from '../methods/time';

import Ionicons from 'react-native-vector-icons/Ionicons';

// if a user clicks on their saved restaurants. navigate them to the restaurant screen
export default function SavedRestaurantsScreen({route}){
    restaurant_data = route.params.restaurants
    const navigation = useNavigation();
    const user = auth().currentUser;

    // method to view the restaurant the user clicks on
    const seeRestaurant = (restaurant_data) => {
        navigation.navigate('RestaurantProfile', {
            data: restaurant_data
        })
    }
    /**
     * method that populates the screen
     * @returns a list of Touchable Opacities that contain the user's saved restaurants
     */
    const PopulateRestaurants = () => {
        let table = [];
        // for every restaurant in the saved_restaurant list
        for (let i = 0; i < restaurant_data.length; i++){

            var date = new Date(); //Current Date
            var hours = date.getHours(); //To get the Current Hours
            var min = date.getMinutes(); //Current Minutes
            
            // help visualize time better
            var hours_and_min = `${hours}${min}`
            if (min < 10){
                hours_and_min = `${hours}0${min}`
            }
            //console.log(restaurant_data[i].hours[0].open)
            //console.log(hours_and_min)
            // if we are working with an overnight restaurant, determining closing hours is start > curr_time > end
            if (restaurant_data[i].hours[0].open[date.getDay()].is_overnight){
                // if start > curr_hrs > end. we are within the range where the restaurant is closed
                // example: end - 0100 start - 0900. if it is 0700. 0700 > 0100 and 0700 < 0900. so we are closed
                if((Number(restaurant_data[i].hours[0].open[date.getDay()].end) < Number(hours_and_min)) && 
                (Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].start))){

                    table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                        <Text style={styles.globalFont}>{restaurant_data[i].name} :
                            <Text style={styles.closedColor}>Closed</Text>
                        </Text>
                        <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                        <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}
                        </Text>
                    </TouchableOpacity>)
                }
                // we are within the hours the restaurant is open
                else{

                    table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                        <Text style={styles.globalFont}>{restaurant_data[i].name} :
                            <Text style={styles.openColor}> Open</Text>
                        </Text>
                        <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                        <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}
                        </Text>
                    </TouchableOpacity>)
                }
            }
            // we are not working with an overnight restaurant. we can do start < curr time < end
            else{
                // if the current time is > start_time and < end_time. we are within the hours of openning
                if((Number(restaurant_data[i].hours[0].open[date.getDay()].start) < Number(hours_and_min)) && 
                (Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))){
                    table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                        <Text style={styles.globalFont}>{restaurant_data[i].name} :
                            <Text style={styles.openColor}>Open</Text>
                        </Text>
                        <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                        <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}</Text>
                    </TouchableOpacity>)
                }
                // current time is within closing time
                else{
                    table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                        <Text style={styles.globalFont}>{restaurant_data[i].name} :
                            <Text style={styles.closedColor}> Closed</Text>
                        </Text>
                        <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                        <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}
                        </Text>
                    </TouchableOpacity>)
                }
            }
        }
        return table
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.globalFont]}>Saved Restaurants</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[styles.globalFont, styles.backArrow]} name='arrow-back-outline'/>
                </TouchableOpacity>
            </View>

            <ScrollView>

                <View style={styles.restaurantContainer}>
                    {PopulateRestaurants()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#171414',
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
        
        

    },
    backArrow: {
        fontSize: 40
    },
    globalFont: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
    container: {
        backgroundColor: '#3d4051',
        flex:1
    },
    RestaurantBox: {
        backgroundColor: '#3f3a42',
        height: 120,
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10,
        marginTop: 10,
        
    },
    RestaurantBoxItems:{
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
    },
    restaurantContainer:{
        padding: 10
    }
})