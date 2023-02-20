import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';

export default function FollowersScreen({route}){
    const passedinUID = route.params.followersUID
    const passedinFollowersName = route.params.followersNames
    const navigation = useNavigation();

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

    const PopulateFollowers = () => {
        let table = []

        for (let i = 0; i < passedinUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedinUID[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                <Text style = {[styles.FollowBoxText]}>{passedinFollowersName[i]}</Text>
                </TouchableOpacity>)
        }
        return table
    }
    
    // the user has no followers
    if (passedinUID.length <= 0){
        return(
            <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
                <View>
                    <Text style = {styles.globalText}>You are not followed by anyone</Text>
                </View>
            </View>
        )
    }

    // the user is followed by at least one person
    else{
        // React.useEffect(() =>{
        //     populateFollowing();
        // }, [])

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