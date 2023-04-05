import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'

import * as React from 'react';
import colors from '../utils/colors';



// pass in the user ID you want to view
export default function OtherUserProfileScreen({route}){
    // passed in data should be the (doc) in Firebase (unique user profile)
    // pull user from DB or have the user be passed into the DB
    const otherID = route.params.otherID;

    const [follow, setFollow] = React.useState('');
    const [color, setColor] = React.useState('');
    const [name, setName] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [otherUser, setOtherUser] = React.useState(null);
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
    const PopulateScreen = async () => {
        try{
            const otherUser = await firebase.dbGet('users', otherID); 
            setName(otherUser.name);
            setBio(otherUser.bio);
            setOtherUser(otherUser);
        }catch(error){
            console.log(error)
        }
 
    }
    // try to navigate to the reviews screen.
    const seeReview = async () => {
        
        navigation.navigate('Reviews', {
            dbID: otherID,
            type: 'user'
        })
    }

    // initiate the button and user name we create the view
    React.useEffect(() => {
        PopulateScreen();
        PopulateButton();
        getAvatarDB();
    },
    []
    )
    
    // Saves properties of selected image
    // Written by Kenny Du
    const [avatarPath, setAvatarPath] = React.useState();

    // Get user's previously uploaded profile picture from the database
    // Written by Kenny Du
    const getAvatarDB = async() => {
        try{
            await firebase.dbFileGetUrl('ProfilePictures/' + otherID).then(
                url => {
                    setAvatarPath(url)
                    }
            )
        }
        catch (error){
            console.log(name, 'does not have a profile picture on db')
        }
    }
    
    return (
        <View style = {styles.container}>
                <View style = {styles.UserBackground}>

                    <View style = {[{alignItems: 'center', flex: 1.5, justifyContent: 'space-evenly'}]}>
                        <Image style = {[styles.tinyLogo]} source ={avatarPath? {uri:avatarPath} : image}/>
                        
                        
                    </View>
                    <View style={[{alignItems: 'center', flex:1, justifyContent: 'center'}]}>
                    <Text style={styles.globalText}>{name}</Text>
                    <Text style={[styles.globalText, {alignSelf: 'center'}]}>Japanese Food Expert</Text>

                    </View>
                    
                    <View style={[{flex: 1.5, alignSelf: 'center'}]}>
                    <Text style={styles.globalText}>{bio}</Text>
                    </View>
                </View>


                <View style={styles.space}></View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={clickFollow}>
                        <Text style={styles.buttonText}>{follow}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button]} onPress={seeReview}>
                        <Text style={styles.buttonText}>See Reviews</Text>
                    </TouchableOpacity>
                </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        backgroundColor: '#3d4051',
        flex: 1
    },
    UserBackground: {
        backgroundColor:'#171414',
        flex: 3
    },
    tinyLogo: {
        width: 120,
        height: 120,
        borderRadius: 150,
        
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: colors.feastBlue,
        alignSelf: 'center',
        marginTop: 20
    },
    button: {
		backgroundColor: '#342B2B51',
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#000000',
        borderWidth: 1,
        height: 75
        
        
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
    buttonContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    space:{
        width: 10,
        height: 10
    },
    globalText:{
        color: 'white',
        fontWeight: '500',
		fontSize: 20,
    }

})