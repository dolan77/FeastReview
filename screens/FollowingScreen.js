import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import * as React from 'react';
import * as firebase from '../utils/firebase'

export default function FollowingScreen({route}){
    const passedInFollowingUID = route.params.followingUID
    const passedInFollowingNames = route.params.followingNames
    // console.log('passedInUID: ' + passedInFollowingUID)
    // console.log('passedInNames: ' + passedInFollowingNames)

    const SeeOtherProfile = () => {
        console.log("Moving to see the other profile")
    }
    // console.log(passedInFollowing)

    // method will populate the screen with touble opactities that represent the Feasters the current user is following
    const PopulateFollowing = () => {
        let table = []

        for (let i = 0; i < passedInFollowingUID.length; i++){
            table.push(<TouchableOpacity onPress={SeeOtherProfile} key = {i}><Text style = {styles.globalText}>{passedInFollowingNames[i]}</Text></TouchableOpacity>)
        }
        return table
    }

    // the user is not following anyone
    if (passedInFollowingUID.length <= 0){
        return(
            <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
                <View>
                    <Text style = {styles.globalText}>You are not following anyone</Text>
                </View>
            </View>
        )
    }

    // the user is following at least one person
    else{
        // React.useEffect(() =>{
        //     populateFollowing();
        // }, [])

        return(
            <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
                <View>
                    <Text>You are following people</Text>
                    {PopulateFollowing()}
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    globalText:{
        color: 'white',
		fontWeight: '700',
		fontSize: 16,
    }
})