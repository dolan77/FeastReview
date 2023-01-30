import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, ScrollView, SafeAreaView, FlatList, Linking} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import React, {useState} from 'react';
import macaron from '../assets/macarons.jpg'
import Ionicons from 'react-native-vector-icons/Ionicons';

import openMap from 'react-native-open-maps';
import { PureNativeButton } from 'react-native-gesture-handler/lib/typescript/components/GestureButtons';
import image from "../assets/maps-icon.png"

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dbKey = require('../db_key.json');


// TODO:
// Back-End: figure out how to know which restaurant profile to display
// maybe pass in the restaurant-id when you click on a restaurant to display this profile

export default function RestaurantProfileScreen(){

    



    // I can pull from the database here before I create the view
    var restaurantName = "Amy's Bakery"
    var reviewCount = 10

    // test, this will be turned into an api call from YELP to hopefully edit easily
    // TODO: change this to a call from the yelp API
    const testData = [

        {weekday: "mon", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "tues", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "wed", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "thurs", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "fri", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "sat", open: "9:00 AM", closed: "9:00 PM"},
        {weekday: "sun", open: "9:00 AM", closed: "9:00 PM"},
    ];
    console.log(testData.length)
    const nagivation = useNavigation();

    
    // I can do an if statement here. if the user is a feaster, return a view without edits to the restaurant profile
    // if the user is an owner, return a view with edits to the profile

    // TODO:
    //  talk about importing a font package into node_modules. utilizes font-awesome or other stuff: https://reactnativeelements.com/docs/1.2.0/icon
    //  talk about importing a date-time picker for owners to edit hours: https://github.com/henninghall/react-native-date-picker
    
    /**
     * function to call a phone number
     * TODO
     */
    const triggerCall = () => {
        // this will be changed to a phone number we pull from the yelp API
        var number = '1'
        // call(args).catch(console.error);
        Linking.openURL(`tel:${number}`)
    };
    
    /**
     * function to open a url
     * 
     */
    const openSite = () => {
        // change the url to a pull from the yelp API
        var url = 'https://www.google.com/'
        Linking.openURL(url)
    }

    /**
     * method to navigate to the Reviews Tab
     */
    const navigateReview = () => {
        // TODO: someone figure out how to get this from the DB
        // I think since we are clicking to go open this restaurantscreen, it has to be passed in from somewhere
        var restaurant = '000000'

        // navigate to the reviews tab and send in the hash and the type of review we want to see
        nagivation.navigate('Reviews', 
        {
            details: restaurant,
            type: 'restaurant'
        })
    }

    /**
     * method to open the maps app on your phone
     */
    const navigateMaps = () => {
        // use the YELP API here. ask for help later
        // openMaps(latitude: (int), longitude: (int))
        // YELP: business has a coordinates value that gives lat and long in the format openMaps wants
    }

    return(
        <SafeAreaView style={style.container}>
            <ScrollView>
                <View>
                    
                    <ImageBackground
                    source = {macaron}
                    resizeMode='cover'>

                        
                        <View style={[style.headerCover]}>
                            <Text style={style.text}>
                                {restaurantName}
                                <Text>{"\n"}***** {reviewCount} reviews</Text>
                            </Text>
                        </View>
                    </ImageBackground>
                </View>

                <Text style={[style.scheduleText, {paddingLeft: 30, paddingTop: 15}]}>Hours</Text>
                
                <View style={[style.scheduleContainer, {justifyContent: 'space-evenly'}]}>
                        
                    <View style={style.scheduleContainer}>

                        <View>
                            {testData.map(hoursData => (
                                <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.weekday}:</Text>
                            ))}
                        </View>

                       
                        <View>
                            {testData.map(hoursData => (
                                <Text key={hoursData.weekday} style={style.scheduleText}>{"\t"}{hoursData.open} - {hoursData.closed}</Text>
                            ))}
                        </View>

                    </View>

                    <View>

                    <TouchableOpacity onPress={navigateMaps}>
                       <Image style={style.tinylogo} source={image} />
                    </TouchableOpacity>

                    <Text style={[{textAlign: 'center'}, style.scheduleText]}>Get Directions</Text>
                    <Text style={[{textAlign: 'center'}, style.scheduleText]}>Do OnPress Later</Text>

                    </View> 

                </View>

                
                <View style={[style.IconContainer]}>
                    <TouchableOpacity
                    onPress={triggerCall}>
                        <Ionicons name='call-outline' size={30} color='#ffffff'/>
                        
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={openSite}>
                        <Ionicons name='globe-outline' size={30} color='#ffffff'/>
                    </TouchableOpacity>


                    

                </View>

                <View style={style.buttonContainer}>
                   <TouchableOpacity
                   onPress={navigateReview}
                   style={style.button}
                >
                    <Text style={style.buttonText}>See Reviews</Text>
                   </TouchableOpacity>
                   
                </View>

            </ScrollView>
        </SafeAreaView>
    );

}



const style = StyleSheet.create({
    tinylogo:{
        height: 130,
        width: 130,
        borderRadius: 130
    },
    container:{
        flex: 1,
        backgroundColor: '#17202ac0',
    },
    header:{
        flex: 1
    },
    restaurantInfo:{
        flex: 2
    },
    restaurantDetail:{
        flex: 2
    },
    IconContainer:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
    },

    headerCover: {
		backgroundColor: '#17202ac0',
		width: '100%',
		padding: 15,
		justifyContent: 'center',
        color: 'white',
        flex: 1,
        height: 150,
	},
    text:{
        color: 'white',
        fontSize: 20
    },

    scheduleText:{
        color: 'white',
        fontSize: 17
        
    },
    scheduleContainer:{
        flexDirection: 'row',
    },

    scheduleInner:{
        color: "red"
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    }
})