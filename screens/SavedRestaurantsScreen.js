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
     * method that checks to see if the restaurant is open
     * @param {*} current_restaurant current restaurant we want to check
     * @param {*} date the date we want to check the restaurant 
     * @param {*} hours_and_min the hours and minutes 
     * @returns a boolean value that represents if the restaurant is opened or closed
     */
    const isOpen = (current_restaurant, date, hours_and_min) => {
        if (current_restaurant.hours[0].open[date.getDay()].is_overnight){
            return ((Number(current_restaurant.hours[0].open[date.getDay()].end) < Number(hours_and_min)) && 
            (Number(hours_and_min) < Number(current_restaurant.hours[0].open[date.getDay()].start))) ? false : true
        }
        return ((Number(current_restaurant.hours[0].open[date.getDay()].start) < Number(hours_and_min)) && 
            (Number(hours_and_min) < Number(current_restaurant.hours[0].open[date.getDay()].end))) ? true : false
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
            //console.log(restaurant_data[i].image_url)
            
            // if (restaurant_data[i].hours[0].open[date.getDay()].is_overnight){
                // if start > curr_hrs > end. we are within the range where the restaurant is closed
                // example: end - 0100 start - 0900. if it is 0700. 0700 > 0100 and 0700 < 0900. so we are closed
                table.push(
                    <TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                    <Image style={{width: 100, height: 100, borderRadius: 20, marginHorizontal: 10}} source={{ uri: restaurant_data[i].image_url}}/>
                    <View>
                        <Text style={styles.globalFontHeader}>{restaurant_data[i].name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'baseline'}}>
                            <Ionicons name="time" size={20} color="white"/>
                            <Text style = {isOpen(restaurant_data[i], date, hours_and_min) ?  styles.openColor: styles.closedColor}>
                            {isOpen(restaurant_data[i], date, hours_and_min) ? "Open": "Close"}
                        </Text>
                        <Text style={[styles.globalFont]}> until </Text>
                        <Text style={[styles.globalFont]}>{isOpen(restaurant_data[i], date, hours_and_min) ? timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end) : timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)}</Text>
                        
                        </View>
                        
                        <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
                        {/* <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}</Text> */}
                        <View style={{}}>
                            
                            <Text style={styles.globalFont}><Ionicons name="pin" size={20} color="white"/> {restaurant_data[i].location.address1}, </Text>
                            <Text style={styles.globalFont}>{restaurant_data[i].location.city} {restaurant_data[i].location.state}, {restaurant_data[i].location.country}</Text>
                        </View>
                        
                    </View>
                    
                </TouchableOpacity>)
                
            // }
            // we are not working with an overnight restaurant. we can do start < curr time < end
            // else{
            //     // if the current time is > start_time and < end_time. we are within the hours of openning
            //     table.push(<TouchableOpacity onPress={() => seeRestaurant(restaurant_data[i])} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
            //         <Image style={{width: 100, height: 100}} source={{ uri: restaurant_data[i].image_url}}/>
            //         <Text style={styles.globalFont}>{restaurant_data[i].name} :
            //             <Text style={(Number(restaurant_data[i].hours[0].open[date.getDay()].start) < Number(hours_and_min)) && 
            //             (Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))? styles.openColor: styles.closedColor}>{(Number(restaurant_data[i].hours[0].open[date.getDay()].start) < Number(hours_and_min)) && 
            //             (Number(hours_and_min) < Number(restaurant_data[i].hours[0].open[date.getDay()].end))? "Open": "Close"}
            //             </Text>
            //         </Text>
            //         <Text>{starRating(restaurant_data[i].id, restaurant_data[i].rating)}</Text>
            //         <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}</Text>
            //     </TouchableOpacity>)
            // }
        }
        return table
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.globalFontHeader]}>Saved Restaurants</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[styles.globalFontHeader, styles.backArrow]} name='arrow-back-outline'/>
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
    globalFontHeader: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
    globalFont: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    container: {
        backgroundColor: '#3d4051',
        flex:1
    },
    // 3f3a42, 363838
    RestaurantBox: {
        backgroundColor: '#3f3a42',
        height: 150,
        bordercolor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        
    },
    RestaurantBoxItems:{
        
        alignItems: 'center',
        
    },
    openColor:{
        color:'#4CF439',
        fontSize: 18,
        fontWeight: '500',
    },
    closedColor:{
        color:'#E80F13',
        fontSize: 18,
        fontWeight: '500',
    },
    restaurantContainer:{
        padding: 10
    }
})