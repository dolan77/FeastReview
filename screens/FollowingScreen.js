import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import * as React from 'react';
import * as firebase from '../utils/firebase'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function FollowingScreen(props){
    const passedInFollowingUID = props.followingUID
    const passedInFollowingDoc = props.followingDoc
    const navigation = useNavigation();
    //.log('passedInUID: ' + passedInFollowingUID)
    //console.log('passedInNames: ' + passedInFollowingNames)
    React.useEffect(() =>{
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
    // console.log(passedInFollowing)

    // method will populate the screen with touchable opactities that represent the Feasters the current user is following
    const PopulateFollowing = () => {
        let table = []

        for (let i = 0; i < passedInFollowingUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedInFollowingUID[i])} key = {i} style = {[styles.FollowingBox, styles.FollowBoxItems]}>
                <Text style = {[styles.FollowBoxText]}>{passedInFollowingDoc[i].name}</Text>
                </TouchableOpacity>)
        }
        return table
    }

    
    // the user is following at least one person
    if (passedInFollowingUID.length > 0){
        const following = PopulateFollowing();
        return(
        <SafeAreaView style = {styles.container}>
            <ScrollView contentContainerStyle = {styles.scrollOuter}>
                <View>
                    <View>
                        {following}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        );
    }

    // the user is not following anyone
    else{
        return(
            <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
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