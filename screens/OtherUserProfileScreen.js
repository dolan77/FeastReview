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
    const otherID = route.params.otherID;

    const [follow, setFollow] = React.useState('');
    const [color, setColor] = React.useState('');
    const [name, setName] = React.useState('');
    const navigation = useNavigation();
    
    const user = auth().currentUser;
    // console.log(otherID.id);
    /**
     * method for when the user clicks on the follow button or not
     * https://firebase.google.com/docs/firestore/manage-data/add-data
     */
    const clickFollow = async () => {
        try {

            const currentUser = await firebase.dbGet('users', user.uid);

            // if we are following the user, unfollow them
            if (currentUser.following.includes(otherID)){
                await firebase.dbUpdateArrayRemove('users', user.uid, 'following', [otherID])
                PopulateButton();
            }

            // we are not following the user, follow them
            else{
                await firebase.dbUpdateArrayAdd('users', user.uid, 'following', [otherID]);
                PopulateButton();
            }
                

        } catch (error) {
            console.log("error");
        }
    }

    /**
     * method to change the button depending if the current user is following the other user
     */
    const PopulateButton = async () => {
        try {
            const currentUser = await firebase.dbGet('users', user.uid);
            // if we are following the user, prompt the unfollow button
            if (currentUser.following.includes(otherID)){
                
                setFollow('Unfollow');
                setColor('#636362');
                
            }
            // we are not following the user,prompt the follow button
            else{
                
                setFollow('Follow');
                setColor('#0782F9');
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * method to show the other user's display name when you click on their profile
     * @returns Text to be shown on our application that involves the other user's display name
     */
    const ShowOtherUserName = async () => {
        try{
            const otherUser = await firebase.dbGet('users', otherID); 
            setName(otherUser.name);    
        }catch(error){
            console.log(error)
        }
 
    }

    // initiate the button and user name we create the view
    React.useEffect(() => {
        ShowOtherUserName();
        PopulateButton();
    },
    []
    )
    
    
    
    
    return (
        <View>
            <View style = {styles.display}>
                <Image style = {[styles.tinyLogo]} source ={image}/>


                <View>
                <Text style={{borderRadius: 1, borderColor: 'black'}}>{name}</Text>

                </View>
                
                <View>
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={clickFollow}>
                    <Text style={styles.buttonText}>{follow}</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.space}></View>

                <View>
                <TouchableOpacity style={[styles.button]}>
                    <Text style={styles.buttonText}>See Reviews</Text>
                </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    display:{
        alignItems: "center"
    },
    tinyLogo: {
        width: 100,
        height: 100,
        borderRadius: 150,
        
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white'
    },
    button: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    space:{
        width: 10,
        height: 10
    },

})