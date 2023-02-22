import FollowersScreen from "./FollowersScreen";
import FollowingScreen from "./FollowingScreen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as firebase from "../utils/firebase"
import * as React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

const Tab = createMaterialTopTabNavigator();

export default function FollowersAndFollowing({route}){
    // https://stackoverflow.com/questions/60439210/how-to-pass-props-to-screen-component-with-a-tab-navigator
    let followers = []
    let following = []
    let followersNames = []
    let followingNames = []
    const user = auth().currentUser;

    const populateFollowers = async () => {
        try{
            const currentUser = await firebase.dbGet('users', user.uid)
            followers = currentUser.followers
            for (let i = 0; i < followers.length; i++){
            
                // loop thru the UID's the user is following and add their name
                otherUser = await firebase.dbGet('users', currentUser.followers[i]);
                // console.log(otherUser)
                followersNames.push(otherUser.name)
            }
            console.log('followers in FollowersAndFollowing: ' + followers)
        }catch(error){
            console.log(error)
        }
    }


    const populateFollowing = async () => {
        try {
            const currentUser = await firebase.dbGet('users', user.uid)
            following = currentUser.following
            for (let i = 0; i < following.length; i++){
                otherUser = await firebase.dbGet('users', currentUser.following[i]);
                followingNames.push(otherUser.name)
            }
            console.log('following in FollowersAndFollowing: ' + following)
        } catch (error) {
            console.log(error)
        }
    }
    React.useEffect( () => {
        populateFollowers();
        populateFollowing();
    })

    return(
        <Tab.Navigator>
            <Tab.Screen name="followers" children={() => <FollowingScreen followingUID={following} followingNames={followingNames}/>}/>
            <Tab.Screen name="following" children={() => <FollowersScreen followersUID={followers} followersNames={followersNames}/>}/>
        </Tab.Navigator>
    )
}