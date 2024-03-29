import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import * as firebase from '../utils/firebase'
import React, { useState, useLayoutEffect, useEffect } from 'react';

import image from "../assets/feast_blue.png"
import colors from '../utils/colors';
import { FeastHeader } from '../utils/components';
export default function FollowersScreen(props){
    const passedinUID = props.followersUID
    const passedinFollowersDoc = props.followersDoc
    const navigation = useNavigation();
    const [profilePictures, setprofilePictures] = useState([])

    useEffect(() =>{
        PopulateProfilePictures();
        PopulateFollowers();
        
    }, [])

    /**
     * Method that will navigate the user to see another user's profile
     */
    const SeeOtherProfile = (otherUID) => {
        console.log("Moving to see the other profile: " + otherUID)
        
        navigation.navigate('OtherUserProfile', 
        {
            otherID: otherUID
        })
    }

	/**
	 * Gets the profile pictures of all following users
	 */
    const PopulateProfilePictures = async () => {
        console.log('\n')
        let pictures = []
        try{
            for(let i = 0; i < passedinUID.length; i++){
                try{
                    await firebase.dbFileGetUrl('ProfilePictures/' + passedinUID[i]).then(
                        url => {
                            pictures.push(url)
                            }
                    )
                }
                catch (error){
                    await firebase.dbFileGetUrl('feast_blue.png').then(
                        url => {
                            pictures.push(url)
                            }
                        )
                }
            }
            setprofilePictures(pictures)
        }
		catch(error){
            console.log(error)
        }
    }

    /**
     * Method that will populate the screen of Feasters that follow the user
     * @returns TouchableOpacity of another user
     */
    console.log(passedinUID)
    const PopulateFollowers = () => {
        let table = []

        for (let i = 0; i < passedinUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedinUID[i])} key = {i} style = {[styles.FollowingBox]}>
                <View style={{justifyContent: 'center'}}>
                    <Image style = {[styles.tinyLogo]} source ={{uri:profilePictures[i]}}/>
                </View>
                <View style={[styles.FollowBoxItems]}>
                    <Text style = {[styles.FollowBoxHeader]}>{passedinFollowersDoc[i].name}</Text>
                    <Text style={[styles.FollowBoxText]}>{passedinFollowersDoc[i].bio}</Text>
                </View>
                </TouchableOpacity>)
        }
        return table
    }
    
    // the user is followed by at least one person
    if (passedinFollowersDoc.length > 0){
        return(
            <SafeAreaView style = {styles.container}>
                <FeastHeader title={"Followers"} onPress={() => navigation.goBack()} />
                <ScrollView contentContainerStyle = {styles.scrollOuter}>
                    <View>
                        <View>
                            {PopulateFollowers()}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            );


    }

    // the user has no followers
    else{
        return(
            <View style = {{flex: 1, backgroundColor: colors.backgroundDark}}>
                <FeastHeader title={"Followers"} onPress={() => navigation.goBack()} />
                <View>
                    <Text style = {styles.globalText}>You are not followed by anyone</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        backgroundColor: '#3d4051',
        flex: 1
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2.5,
        borderColor: colors.feastBlue,
    },
    scrollOuter:{
        flex: 1,
        padding: 10
    },

    globalText:{
        color: 'white',
		fontWeight: '700',
		fontSize: 16,
    },
    FollowingBox: {
        backgroundColor: '#3f3a42',
        height: 120,
        marginTop: 10,
        bordercolor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    FollowBoxItems:{
        padding: 10,
        width: 300,
        
    },
    FollowBoxHeader: {
        color: 'white',
        fontWeight: '700',
        fontSize: 25,
    },
    FollowBoxText:{
        color: 'white',
        fontsize: 12,
        fontWeight: '650'
    }

})