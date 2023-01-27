import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, ScrollView, SafeAreaView, FlatList, InteractionManager} from 'react-native'
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


// style={style.headerCover}


export default function RestaurantProfileScreen(){
    // I can pull from the database here before I create the view
    var restaurantName = "Amy's Bakery"
    var reviewCount = 10

    // test, this will be turned into an api call from YELP to hopefully edit easily
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

    // have a const data to represent the info we pull from the database

    // TODO:
    //  https://youtu.be/zpvWDZ-mV8E
    //  FlatList to create a list of things, I can use this for the time section of a restaurant
    //  pull data from db: restaurant_profile -> hours -> { mon: {open: closed: }, tues: {open: closed: }, ...}
    //  populate list using the video above
    //  talk about importing a font package into node_modules. utilizes font-awesome or other stuff: https://reactnativeelements.com/docs/1.2.0/icon
    //  talk about importing a date-time picker for owners to edit hours: https://github.com/henninghall/react-native-date-picker


/*     {testData.map(hoursData => (
    <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.weekday}:
        <Text style={style.scheduleInner}>{"\t\t"}{hoursData.open} - {hoursData.closed}</Text>
        
    </Text>
    
))} */
    
    
    return(
        <SafeAreaView style={style.container}>
            <ScrollView>
                <View>
                    {/* Image Banner and Restaurant Name, rating, review count */}
                    <ImageBackground
                    source = {macaron}
                    resizeMode='cover'>
                        <View style={[style.headerCover]}>
                            <Text style={style.text}>{restaurantName}

                            <Text>{"\n"}***** {reviewCount} reviews</Text>
                            
                            </Text>
                            
                        </View>
                    </ImageBackground>
                </View>

                <View>
                    
                    {/* tested grabbing data from a static array */}
                    <Text>Hours</Text>
                    <View style={style.scheduleContainer}>

                    
                    <View>
                        {testData.map(hoursData => (
                            <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.weekday}:
                            </Text>
                            
                        ))}


                    </View>

                    <View>
                        {testData.map(hoursData => (
                            <Text key={hoursData.weekday} style={style.scheduleText}>{hoursData.open} - {hoursData.closed}
                            </Text>
                            
                        ))}
                    </View>

                    </View>

                </View>

                <View>
                    <Text>Call, Website, Directions</Text>
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