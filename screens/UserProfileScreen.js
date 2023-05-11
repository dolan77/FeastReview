import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

import ImagePicker from 'react-native-image-crop-picker';
import colors from '../utils/colors';
import expertise from '../utils/expertise';
import { ScrollView } from 'react-native-gesture-handler';

// background color: #3d4051 change for View, bioSubscript, flexbio, flexbutton

// function that returns the screen for the current user
export default function UserProfileScreen(){
    const user = auth().currentUser;
    const [bio, setBio] = React.useState('Loading...');
    const [title, setTitle] = React.useState('Loading...');
    const [username, setUsername] = React.useState('Loading...');
    const navigation = useNavigation();
    
    React.useEffect(() => {
        getUserInfo();
        getAvatarDB();
    }, [])


    /**
     * Gets the user's name, title and biography for profile from FireBase
     * @returns promise
     */
    function getUserInfo(){
        return firebase.dbGet('users', user.uid).then(userProfile => {
            if(!Object.hasOwn(userProfile, 'title') || !userProfile.title){
                setTitle('No title selected!');
            }
            else {
                setTitle(userProfile.title);
            }
            
            if(Object.hasOwn(userProfile, 'name') && userProfile.name){
                setUsername(userProfile.name);
            }

            if(Object.hasOwn(userProfile, 'bio') && userProfile.bio){
                setBio(userProfile.bio);
            }
        })
        .catch(error => console.log(error));
    }
    
    /**
     * nagivate to the ReviewsScreen
     */
    function seeReview () {
        navigation.navigate('Reviews', 
        {
            dbID: user.uid,
            type: 'user'
        })
    } 

    /**
     * method that allows the user to trasnfer to the "FollowersAndFollowing" Screen.
     */
    const moveToFollow = () => {
        // uid : doc_data
        try {
            followers = []
            followers_doc = []
            following = []
            following_doc = []
            // get the people who follow the current user
            firebase.dbGetFollowers(user.uid).then(result => {
                result.forEach( (doc, key) => {
                    followers.push(key)
                    followers_doc.push(doc)
                })
            
            // after getting the followers, get the user and who they are following
            })
            .then(result2 => {
                firebase.dbGet('users', user.uid).then(result => {
                    console.log('before dbGetFollowed')
                    // check if the user's following list is not 0
                    if(result.following.length != 0){
                        firebase.dbGetFollowed(result.following).then(result => {
                            result.forEach( (doc, key) => {
                                following.push(key)
                                following_doc.push(doc)
                            })
                        // wait to get who the user is following, then navigate to the Followers and Following Screen
                        })
                        .then(result3 => {
                            navigation.navigate('FollowersAndFollowing', {
                                followers : followers,
                                followers_doc : followers_doc,
                                following: following,
                                following_doc: following_doc
                            })
                        })
                    }
                    else{
                        navigation.navigate('FollowersAndFollowing', {
                            followers : followers,
                            followers_doc : followers_doc,
                            following: following,
                            following_doc: following_doc
                        })
                    }

                })
            })            
            
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * method that will transition to the screen where the user can view their saved restaurants
     * Made by Dylan Huynh
     */
    const seeRestaurants = async() => {
        try {
            firebase.dbGet('users', user.uid).then(result => {
                //console.log(result)
                // let restaurant_data = []
                // Object.keys(result.saved_restaurants).forEach((key) => {
                //     // I can pass the saved restaurant data to the Screen to Populate later.
                //     restaurant_data.push(result.saved_restaurants[key])
                //     // console.log(result.saved_restaurants[key])
                // });
                // console.log(restaurant_data)
                navigation.navigate('SavedRestaurants', {
                    restaurants: result.saved_restaurants
                })
                // console.log(result.saved_restaurants)
            })
    
        } catch (error) {
            console.log(error)
        }
        
        // cache the restaurant's data within the RestaurantProfileScreen to show it as buttons similar to Search.
    }

    // Saves properties of selected image
    // Written by Kenny Du
    const [avatarPath, setAvatarPath] = React.useState();

    // Get user's previously uploaded profile picture from the database
    // Written by Kenny Du
    const getAvatarDB = async() => {
        try{
            await firebase.dbFileGetUrl('ProfilePictures/' + user.uid).then(
                url => {
                    setAvatarPath(url)
                    }
            )
        }
        catch (error){
            console.log(user.displayName, 'does not have a profile picture on db')
            await firebase.dbFileGetUrl('feast_blue.png').then(
                url => {
                    setAvatarPath(url)
                }
            )
        }
    }

    // log off made by Matthew Hirai
    const logoff = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.replace("Login")
			})
			.catch(error => alert(error.message))
	}

    // this returns the User Profile Screen onto the application on the mobile device. The screen consists of a picture, user name, biography, expertise, and three
    // buttons to navigate to another screen. The user is also able to edit their bio, which leads to a different screen and updates the bio on the database.
    return(
    <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
        <View style= {{flex: 3, backgroundColor: '#171414'}}>
            <View style = {[{justifyContent: 'center', alignItems: 'center', flex: 2.5}]}>
                <Image style = {[styles.tinyLogo]} source ={{uri:avatarPath}}/>
                <Text style = {[styles.globalFont, {fontSize: 25}]}>{username}</Text>
                <Text style = {[styles.globalFont, expertise.titleStyle(title)]}>{title}</Text>
            </View> 

            <View style = {[{flex: 1}, styles.bioSubscriptContent]}>
                <Text style={[styles.globalFont]}>{bio}</Text>
            </View>
            
            <View style = {[{flex: 0.5}, styles.bioSubscriptContent]}>
                <Text style = {[styles.editButton, styles.globalFont, {fontSize: 15}, {color: colors.feastBlue}]} onPress = {() => {navigation.navigate('EditProfile')}}>Edit Profile</Text>
            </View>

        </View> 
        
        <View style = {styles.flexbutton}>

        <TouchableOpacity
        style={[styles.button]}
        onPress={seeReview}>
        <Text style={styles.buttonText}>See Your Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={moveToFollow} style = {styles.button}>
            <Text style={styles.buttonText}>Followers and Following</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={seeRestaurants} style = {styles.button}>
            <Text style={styles.buttonText}>Saved Restaurants</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logoff} style={styles.button}>
            <Text style={styles.buttonText}>Log Off</Text>
        </TouchableOpacity>
        </View>
    </View>
    );
}


const styles = StyleSheet.create({

    flexbutton:{
        flex: 3,
        justifyContent: 'space-evenly'
    },

    space:{
        width: 10,
        height: 10
    },

    tinyLogo: {
        width: 120,
        height: 120,
        borderRadius: 150,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: colors.feastBlue
    },

    bioSubscriptContent:{
        alignItems: 'center',
        paddingHorizontal: 15
    },

    button: {
		backgroundColor: colors.backgroundDarker,
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#000000',
        borderWidth: 1,
        height: 75
        
        
	},
	buttonText: {
		color: colors.white,
		fontWeight: '700',
		fontSize: 16,
	},


    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color:'white'
    },
    modalView: {
        margin: 20,
        height: 500,
        backgroundColor: colors.feastBlue,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
    },
    modalText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 16
    },
    editButton: {
        color: colors.white,
        fontWeight: 'bold',
        
    },

    globalFont:{
        color: colors.white,
        fontSize: 20,
        fontWeight: '500',
        
    }
})
