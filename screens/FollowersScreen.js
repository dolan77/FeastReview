import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, SafeAreaView, ScrollView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';

import * as firebase from '../utils/firebase'
import * as React from 'react';

import image from "../assets/feast_blue.png"

export default function FollowersScreen(props){
    const passedinUID = props.followersUID
    const passedinFollowersDoc = props.followersDoc
    const navigation = useNavigation();
    const [profilePictures, setprofilePictures] = React.useState([])

    React.useEffect(() =>{
        PopulateFollowers();
        PopulateProfilePictures();
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

    /** ask for help on this later */
    const PopulateProfilePictures = async () => {
        console.log('\n')
        let pictures = []
        try{
            for(let i = 0; i < passedinUID.length; i++){
                try{
                    //console.log('ProfilePictures/' + passedinUID[i])
                    await firebase.dbFileGetUrl('ProfilePictures/' + passedinUID[i]).then(
                        url => {
                            pictures.push(url)
                            }
                    ).catch((error) => {
                        switch (error.code) {

                            case 'storage/object-not-found':
                              console.log(passedinUID[i] + "File doesn't exist")
                              firebase.dbFileGetUrl('feast_blue.png').then(
                                url => {
                                    pictures.push(url)
                                })
                            case 'storage/unauthorized':
                              console.log(passedinUID[i] + "User doesn't have permission to access the object");
                              firebase.dbFileGetUrl('feast_blue.png').then(
                                url => {
                                    pictures.push(url)
                                })
                              break;

                            case 'storage/canceled':
                              console.log("User canceled the upload")
                              break;

                            case 'storage/unknown':
                              console.log("Unknown error occurred, inspect the server response")
                              break;
                          }
                      
                    })
                    
                }
                catch (error){
                    // console.log(passedinUID[i], 'does not have a profile picture on db')
                    // console.log(error)
                    
                }
            }
            console.log(pictures)
            setprofilePictures(pictures)
            console.log(profilePictures)
            
        }catch(error){
            console.log('outside')
            console.log(error)
        }
        

        
    }

    /**
     * Method that will populate the screen of Feasters that follow the user
     * @returns TouchableOpacity of another user
     */
    const PopulateFollowers = () => {
        let table = []

        for (let i = 0; i < passedinUID.length; i++){
            table.push(<TouchableOpacity onPress={() => SeeOtherProfile(passedinUID[i])} key = {i} style = {[styles.FollowingBox]}>
                <View>
                    {/* <Image style = {[styles.tinyLogo]} source ={profilePictures[i] != undefined? {uri:profilePictures[i]} : image}/> */}
                </View>
                <View style={[styles.FollowBoxItems]}>
                    <Text style = {[styles.FollowBoxHeader]}>{passedinFollowersDoc[i].name}</Text>
                    <Text style={[styles.FollowBoxText]}>This is a test bio, i really love to eat cookies for breakfast and dessert for lunch. I also like to eat pancakes</Text>
                </View>

                {/* <Text style={[styles.FollowBoxText]}>{passedinFollowersDoc[i].bio}</Text> */}
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
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 0,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: '#EECACA'
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
        height: 100,
        marginTop: 10,
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10,
    },
    FollowBoxItems:{
        justifyContent: 'center',
        paddingHorizontal: 10
        
    },
    FollowBoxHeader: {
        color: 'white',
        fontWeight: '700',
        fontSize: 25,
    },
    FollowBoxText:{
        color: 'white',
		fontWeight: '700',
		fontSize: 12,
    }

})