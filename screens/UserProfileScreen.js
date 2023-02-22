import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

// background color: #3d4051 change for View, bioSubscript, flexbio, flexbutton

// function that returns the screen for the current user
export default function UserProfileScreen(){
    const user = auth().currentUser;

    
    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: true});
	  }, [navigation]);
    
    

    const [modalVisible, setModalVisible] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const navigation = useNavigation();

    
    /**
     * 
     * @param {value.nativeEvent.text} newValue - this is the value of the textbox
     */
    async function changeBio(newValue) {
        // push changes to database, backend can do that
        try {
            await firebase.dbUpdateOnce('users', user.uid, "bio", newValue);
        } catch (error) {
            console.log(error)
        }
    }

    // function that retrieves the bio from the firestore database
    async function getBio() {
        // push changes to database, backend can do that
        try {
            const userBio = await firebase.dbGet('users', user.uid);
            setBio(userBio.bio)
        } catch (error) {
            console.log(error)
        }
    }


    // function that will update the bio on the user's screen
    const updateBio = (newValue) => {
        setBio(newValue)
        changeBio(newValue)
    }
    
    /**
     * nagivate to the ReviewsScreen
     */
    function seeReview () {
        navigation.navigate('Reviews', 
        {
            details: user.uid,
            type: 'user'
        })
    } 

    // console.log(user.email, 'has signed up')
    // console.log(bio, 'state')
    
    const seeFollow = async () => {
        try{
            const currentUser = await firebase.dbGet('users', user.uid);
            
        let following_names = []
        for (let i = 0; i < currentUser.following.length; i++){
            
            // loop thru the UID's the user is following and add their name
            otherUser = await firebase.dbGet('users', currentUser.following[i]);
            // console.log(otherUser)
            following_names.push(otherUser.name)
        }
        // console.log('following_names' + following_names)
        // console.log('currentuser following: ' + currentUser.following)
        navigation.navigate('Following',
        {
            followingUID: currentUser.following,
            followingNames: following_names
        })
        }
        catch (error){
            console.log(error)
        }
        
    }

    const seeFollowers = async () => {
        const currentUser = await firebase.dbGet('users', user.uid);
        let followersNames = [];
        for (let i = 0; i < currentUser.followers.length; i++){
            otherUser = await firebase.dbGet('users', currentUser.followers[i]);
            followersNames.push(otherUser.name)
        }
        navigation.navigate('Followers',
        {
            followersUID: currentUser.followers,
            followersNames: followersNames
        })
    }
    // TESTING SENDING TO TOP NAVBAR
    const moveToFollow = () => {
        // uid : doc_data
        try {
            followers = []
            followers_names = []
            following = []
            following_names = []

            console.log(user.uid)
            // get the people who follow the current user
            firebase.dbGetFollowers(user.uid).then(result => {
                // console.log(result)
                result.forEach( (doc, key) => {
                    followers.push(key)
                    followers_names.push(doc.name)
                    // console.log(key + ":" + JSON.stringify(doc))
                })
                console.log(followers)
                console.log(followers_names)
            })
            // get the user then get a map of who they are following
            firebase.dbGet('users', user.uid).then(result => {
                firebase.dbGetFollowed(result.following).then(result => {
                    result.forEach( (doc, key) => {
                        following.push(key)
                        following_names.push(doc.name)
                    })
                    console.log(following)
                    console.log(following_names)
                })
            })
            // finish this at home
            navigation.navigate('FollowersAndFollowing', {
                followers : followers
            })
            
        } catch (error) {
            console.log(error)
        }
        // navigation.navigate('FollowersAndFollowing');
    }
    React.useEffect(() => {
        getBio();
    },
    []
    )
    
    // this returns the User Profile Screen onto the application on the mobile device. The screen consists of a picture, user name, biography, expertise, and three
    // buttons to navigate to another screen. The user is also able to edit their bio, which leads to a different screen and updates the bio on the database.
    return(
    <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            
            setModalVisible(!modalVisible);
            }}>
            <View style = {styles.modalView}>
                <Text styles = {{fontWeight: 'bold'}}>Your New bio will be...</Text>
                <TextInput
                style={styles.input}
                maxLength={100}
                numberOfLines = {4}
                onSubmitEditing={(value) => updateBio(value.nativeEvent.text)}
                />
                <Button
                title="go back"
                onPress={() => setModalVisible(!modalVisible)}
                />
                <Text>{"\n"}100 characters max</Text>
                <Text>Press Enter before you click the go back button if you want to submit your changes to bio</Text>
            </View>
        </Modal>
        
        <View style= {{flex: 3, backgroundColor: '#171414'}}>

            
            <View style = {[{justifyContent: 'center', alignItems: 'center', flex: 2}]}>
                <Image style = {[styles.tinyLogo, styles.topContent]} source ={image}/>
                <Text style = {styles.globalFont}>{user.displayName}</Text>
                <Text style = {styles.globalFont}>Dessert Expert</Text>
            </View> 

            <View style = {[{flex: 1}]}>
                <Text style={[styles.globalFont, styles.bioSubscriptContent]}>
                    {bio}
                    <Text style = {styles.editButton} onPress={() => setModalVisible(true)}>{"\n\n"}Edit Bio</Text>
                </Text>
            </View>

        </View> 
        
        <View style = {styles.flexbutton}>

        <TouchableOpacity
        style={[styles.button]}
        onPress={seeReview}>
        <Text style={styles.buttonText}>See Your Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.button} onPress={seeFollowers}>
            <Text style={styles.buttonText}>Followers</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.button} onPress={seeFollow}>
            <Text style={styles.buttonText}>Following</Text>
        </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={moveToFollow}>
            <Text>Test the Followers Tab</Text>
        </TouchableOpacity>
    </View>
    );
}


const styles = StyleSheet.create({

    flexbutton:{
        flex: 2,
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
        borderColor: '#EECACA'
    },

    bioSubscriptContent:{
        paddingHorizontal: 15
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


    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      modalView: {
        margin: 20,
        height: 500,
        backgroundColor: '#a2bef0',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        }
    },
    editButton: {
        color: 'white',
        fontWeight: 'bold',
        
    },

    globalFont:{
        color: 'white',
        fontSize: 20
    }
})
