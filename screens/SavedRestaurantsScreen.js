import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'
import { starRating } from '../methods/star';
import { timeConvert } from '../methods/time';

import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';
import { FeastHeader } from '../utils/components';
// if a user clicks on their saved restaurants. navigate them to the restaurant screen
export default function SavedRestaurantsScreen({route}){
    restaurant_data = route.params.restaurants
    const navigation = useNavigation();
    const user = auth().currentUser;
    const [restaurants, setRestaurants] = React.useState([])

    React.useEffect(() => {
        PopulateRestaurants()
    }, [])
    // method to view the restaurant the user clicks on
    const seeRestaurant = (restaurant_data) => {
        navigation.navigate('RestaurantProfile', {
            data: restaurant_data
        })
    }
    /**
     * method that checks to see if the restaurant is open
     * @param {*} current_restaurant current restaurant's hours we want to check
     * @param {*} date the date we want to check the restaurant 
     * @param {*} hours_and_min the hours and minutes 
     * @returns a boolean value that represents if the restaurant is opened or closed
     */
    const isOpen = (current_restaurant, date, hours_and_min) => {
        if (current_restaurant[date.getDay()].is_overnight){
            return ((Number(current_restaurant[date.getDay()].end) < Number(hours_and_min)) && 
            (Number(hours_and_min) < Number(current_restaurant[date.getDay()].start))) ? false : true
        }
        return ((Number(current_restaurant[date.getDay()].start) < Number(hours_and_min)) && 
            (Number(hours_and_min) < Number(current_restaurant[date.getDay()].end))) ? true : false
    }

    /**
     * method that populates the screen
     * @returns a list of Touchable Opacities that contain the user's saved restaurants
     */
    const PopulateRestaurants = async () => {
        console.log(restaurant_data)
        let table = [];
        let global_avg = 0
        // for every restaurant in the saved_restaurant list
        // restaurant_data = [alias_1, alias_2, alias_3, etc.]
        for (let i = 0; i < restaurant_data.length; i++){
            
            var date = new Date(); //Current Date
            var hours = date.getHours(); //To get the Current Hours
            var min = date.getMinutes(); //Current Minutes
            global_avg = 0
            
            // help visualize time better
            var hours_and_min = `${hours}${min}`
            if (min < 10){
                hours_and_min = `${hours}0${min}`
            }
            //console.log(restaurant_data[i].hours[0].open)
            //console.log(hours_and_min)
            //console.log(restaurant_data[i].image_url)
            await firebase.dbGet('restaurants', restaurant_data[i]).then(result =>{
                // result = adjectives + the typical restaurant data
                // result.total_rating
                console.log(result)

                

                table.push(
                    <TouchableOpacity onPress={() => seeRestaurant(result)} key = {i} style = {[styles.RestaurantBox, styles.RestaurantBoxItems]}>
                    <Image style={styles.restaurantImage} source={{ uri: result.image_url}}/>
                    <View>
                        <Text style={[styles.globalFontHeader, {width: '85%'}]}>{result.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'baseline'}}>
                            <Ionicons name="time" size={20} color="white"/>
                            <Text style = {isOpen(result.hours[0].open, date, hours_and_min) ?  styles.openColor: styles.closedColor}>
                            {isOpen(result.hours[0].open, date, hours_and_min) ? "Open": "Close"}
                        </Text>
                        <Text style={[styles.globalFont]}> until </Text>
                        <Text style={[styles.globalFont]}>{isOpen(result.hours[0].open, date, hours_and_min) ? timeConvert(result.hours[0].open[date.getDay()].end) : timeConvert(result.hours[0].open[date.getDay()].start)}</Text>
                        
                        </View>
                        
                        {result.total_rating == undefined? <Text style={[styles.globalFont]}>No Ratings</Text>: <Text style={[styles.globalFont]}>{starRating(i, result.total_rating)}</Text>}

                        {/* <Text>{starRating(restaurant_data[i].id, global_avg)}</Text> */}
                        {/* <Text style={styles.globalFont}>{timeConvert(restaurant_data[i].hours[0].open[date.getDay()].start)} - {timeConvert(restaurant_data[i].hours[0].open[date.getDay()].end)}</Text> */}
                        <View style={{}}>
                            
                            <Text style={styles.globalFont}><Ionicons name="pin" size={20} color="white"/> {result.location.address1}, </Text>
                            <Text style={styles.globalFont}>{result.location.city} {result.location.state}, {result.location.country}</Text>
                        </View>
                        
                    </View>
                    
                </TouchableOpacity>
                )})
           
        }
        setRestaurants(table)
    };

    if (restaurant_data.length == 0) {
        return(
            
            <View style={styles.container}>
                <FeastHeader title={"Saved Restaurants"} onPress={() => navigation.goBack()} />
                <View style={styles.noRestaurant}>
                
                    <Text style = {[styles.globalFont, {textAlign: 'center'}]}>You did not save a restaurant, please save one note at a later time</Text>
                </View>
            </View>
        )
    }
    return(
        <SafeAreaView style={styles.container}>
            <FeastHeader title={"Saved Restaurants"} onPress={() => navigation.goBack()} />

            <ScrollView>

                <View style={styles.restaurantContainer}>
                    {restaurants}
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
    noRestaurant:{
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '50%',
        paddingHorizontal: 10,
    },
    restaurantImage:{
        width: 100, 
        height: 100, 
        borderRadius: 20, 
        marginHorizontal: 10,
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
        height: 175,
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