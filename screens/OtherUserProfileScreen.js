import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'

import * as React from 'react';

const style = StyleSheet.create({
    display:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    tinyLogo: {
        width: 100,
        height: 120,
        borderRadius: 150,
        flex: 1,
        marginLeft: 5,
        
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },

})

// pass in the user ID you want to view
export default function OtherUserProfileScreen({route}){
    const [follow, setFollow] = React.useState('');
    const [color, setColor] = "gray";
    const navigation = useNavigation();

    const otherID = route.params;
    
    const user = auth().currentUser;
    // passed in data should be the (doc) in Firebase (unique user profile)
    // pull user from DB or have the user be passed into the DB

    // get the firebase result as a variable to use
    var userResult;

    // call the DB to get the user and see if the otherID is in the user's following list
    firebase.dbGet('users', user.uid).then(doc => userResult = doc);

    // we get the current user's info from our firebase and check to see if the "following" array includes the looked up user's ID
    clickFollow();

    /**
     * method for when the user clicks on the follow button or not
     */
    const clickFollow = () => {
        if(userResult.following.includes(otherID)){
            // if condition pass, change the following button to unfollow
            setFollow('Unfollow');
        }
        // else we are following that player
        else{
            setFollow('Follow')
        }
    }
    return (
        <View>
            <View style = {style.display}>
                <Image style = {[styles.tinyLogo]} source ={image}/>
                <Text>{userResult.name}</Text>

                <TouchableOpacity style={style.button}>
                    <Text style={style.buttonText}>{follow}</Text>
                </TouchableOpacity>

            </View>
            






        </View>
    )
}