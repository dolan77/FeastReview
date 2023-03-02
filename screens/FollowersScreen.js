import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, SafeAreaView, ScrollView} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';

export default function FollowersScreen(props){
    const passedinUID = props.followersUID
    const passedinFollowersName = props.followersNames
    const navigation = useNavigation();
    React.useEffect(() =>{
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
     * Method that will populate the screen of Feasters that follow the user
     * @returns TouchableOpacity of another user
     */
    const PopulateFollowers = () => {
        let table = []

        for (let i = 0; i < passedinUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedinUID[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                <Text style = {[styles.FollowBoxText]}>{passedinFollowersName[i]}</Text>
                </TouchableOpacity>)
        }
        return table
    }
    
    // the user is followed by at least one person
    if (passedinUID.length > 0){
        return(
            <SafeAreaView style = {styles.container}>
                <ScrollView contentContainerStyle = {styles.scrollOuter}>
                    <View>
                        <View>
                            <Text style = {styles.FollowBoxText}>Followers...</Text>
                        </View>
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
            <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
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
        height: 75,
        marginTop: 10,
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10
    },
    FollowBoxItems:{
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    FollowBoxText:{
        color: 'white',
		fontWeight: '700',
		fontSize: 25,
    }

})