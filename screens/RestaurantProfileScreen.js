import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, ScrollView, SafeAreaView, FlatList, Linking} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import React, {useState} from 'react';
import macaron from '../assets/macarons.jpg'
const style = StyleSheet.create({
    container:{
        flex: 1
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
    paddingLeft: 15,
    
   },
   scheduleContainer:{
    // flexDirection: 'row'

    
    flexDirection: 'row'
   },

   scheduleInner:{
    color: "red"
   }
})


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
     * TODO
     */
    const openSite = () => {
        // change the url to a pull from the yelp API
        var url = 'https://www.google.com/'
        Linking.openURL(url)
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

                
                <View>
                    <Text style={style.scheduleText}>Hours</Text>

                    
                    <View style={style.scheduleContainer}>


                       
                        <View>
                            {testData.map(hoursData => (
                                <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.weekday}:</Text>
                            ))}
                        </View>

                       
                        <View>
                            {testData.map(hoursData => (
                                <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.open} - {hoursData.closed}</Text>
                            ))}
                        </View>

                    </View> 

                </View> 
                <View style={style.scheduleText}>
                    <Text>Call, Website, Directions</Text>

                    <TouchableOpacity
                    onPress={triggerCall}>
                        
                        <Text style={{color: 'red'}}>Phone Icon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={openSite}>
                    <Text style={{color: 'red'}}>Website Icon</Text>
                    </TouchableOpacity>
                    

                </View>

                <View>
                    <Text>Details</Text>
                </View>

                <View>
                    <Text>Reviews</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );

}