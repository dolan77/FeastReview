import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'

import * as React from 'react';



// pass in the user ID you want to view
export default function OtherUserProfileScreen({route}){
    // passed in data should be the (doc) in Firebase (unique user profile)
    // pull user from DB or have the user be passed into the DB
    const otherID = route.params;

    const [follow, setFollow] = React.useState('');
    const [color, setColor] = "blue";
    const navigation = useNavigation();
    
    const user = auth().currentUser;

    /**
     * method for when the user clicks on the follow button or not
     * https://firebase.google.com/docs/firestore/manage-data/add-data
     */
    const clickFollow = () => {
        try {
            console.log(user.uid)
            firebase.dbGet('users', user.uid)
            /*
            firebase.dbGet('users', user.uid).then(doc => {
                if (doc.following.includes(otherID.id)){
                    setFollow('Unfollow');
                    setColor('gray');
                    firebase.dbSet('users', user.uid, {following: arrayRemove(otherID.id)});
                }
                else{
                    setFollow('Follow');
                    setColor('blue');
                    firebase.dbSet('users', user.uid, {following: arrayUnion(otherID.id)});
                }
            }
                
                
                );
                */

        } catch (error) {
            console.log("error");
        }




        /* if(userResult.following.includes(otherID.id)){
            // if condition pass, change the following button to unfollow
            setFollow('Unfollow');
            setColor('gray');
            firebase.dbSet('users', user.uid, {following: arrayRemove(otherID.id)});
            
        }
        // else we not following that user and want to follow them
        else{
            setFollow('Follow');
            setColor('blue');
            firebase.dbSet('users', user.uid, {following: arrayUnion(otherID.id)});
        } */
        
    }

    /**
     * method to show the other user's display name when you click on their profile
     * @returns Text to be shown on our application that involves the other user's display name
     */
    const showOtherUserName = () => {
        return(
            <View>
            <Text>
                {firebase.dbGet('users', otherID.id).then(doc => doc.name)}
            </Text>
            </View>
        )
    }

    /*
    // get the firebase result as a variable to use
    var userResult;
    
    // call the DB to get the user and see if the otherID is in the user's following list
    firebase.dbGet('users', user.uid).then(doc => userResult = doc);
    console.log(userResult);
    */




    // we get the current user's info from our firebase and check to see if the "following" array includes the looked up user's ID
    clickFollow();
    return (
        <View>
            <View style = {styles.display}>
                <Image style = {[styles.tinyLogo]} source ={image}/>

                <Text>
                {firebase.dbGet('users', otherID.id).then(doc => doc.name)}
                </Text>

                <TouchableOpacity style={[styles.button, {color: color}]}>
                    <Text style={styles.buttonText}>{follow}</Text>
                </TouchableOpacity>

            </View>
            






        </View>
    )
}



const styles = StyleSheet.create({
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