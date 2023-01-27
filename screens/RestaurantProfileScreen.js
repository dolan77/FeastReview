import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal, ScrollView, SafeAreaView} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
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
    }
})


// style={style.headerCover}

export default function RestaurantProfileScreen(){
    // I can pull from the database here before I create the view
    var restaurantName = "Amy's Bakery"
    var reviewCount = 10


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
    return(
        <SafeAreaView style={style.container}>
            <ScrollView>
                <View>
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
                    <Text>Hours</Text>
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