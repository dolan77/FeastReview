import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth from '@react-native-firebase/auth';
import React, { useState, useLayoutEffect, useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import * as firebase from '../utils/firebase'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import image from "../assets/feast_blue.png"
import colors from '../utils/colors';
import { FeastHeader } from '../utils/components';

export default function FollowingScreen(props){
    const passedInFollowingUID = props.followingUID
    const passedInFollowingDoc = props.followingDoc
    const navigation = useNavigation();

    const [FollowingProfilePictures, setFollowingProfilePictures] = useState([])

    useEffect(() =>{
        PopulateProfilePictures();
        PopulateFollowing();
        
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
            for(let i = 0; i < passedInFollowingUID.length; i++){
                try{
                    await firebase.dbFileGetUrl('ProfilePictures/' + passedInFollowingUID[i]).then(
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
            console.log(pictures.length)
            await setFollowingProfilePictures(pictures)

            console.log(FollowingProfilePictures)
        }
		catch(error){
            console.log(error)
        }
    }

    // method will populate the screen with touchable opactities that represent the Feasters the current user is following
    const PopulateFollowing = () => {
        let table = []

        for (let i = 0; i < passedInFollowingUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedInFollowingUID[i])} key = {i} style = {[styles.FollowingBox]}>
                <View style={{justifyContent: 'center'}}>
                    <Image style = {[styles.tinyLogo]} source ={{uri:FollowingProfilePictures[i]}}/>
                </View>
                <View style={[styles.FollowBoxItems]}>
                    <Text style = {[styles.FollowBoxHeader]}>{passedInFollowingDoc[i].name}</Text>
                    <Text style={[styles.FollowBoxText]}>{passedInFollowingDoc[i].bio}</Text>
                </View>
                </TouchableOpacity>)
        }
        return table
    }

    
    // the user is following at least one person
    if (passedInFollowingDoc.length > 0){
        const following = PopulateFollowing();
        return(
        <SafeAreaView style = {styles.container}>
            <FeastHeader title={"Following"} onPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle = {styles.scrollOuter}>
                <View>
                    <View>
                        {PopulateFollowing()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        );
    }

    // the user is not following anyone
    else{
        return(
            
            <View style = {{flex: 1, backgroundColor: colors.backgroundDark}}>
                <FeastHeader title={"Following"} onPress={() => navigation.goBack()} />
                <View>
                    <Text style = {styles.globalText}>You are not following anyone</Text>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container:{
        backgroundColor: '#3d4051',
        flex: 1
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
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2.5,
        borderColor: colors.feastBlue,
    },

})