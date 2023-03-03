import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

import ImagePicker from 'react-native-image-crop-picker';

// background color: #3d4051 change for View, bioSubscript, flexbio, flexbutton

// function that returns the screen for the current user
export default function UserProfileScreen(){
    const user = auth().currentUser;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const navigation = useNavigation();
    
    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: true});
	  }, [navigation]);
    
    React.useEffect(() => {
        getBio();
    }, [])
    
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
            followers_names = []
            following = []
            following_names = []
            // get the people who follow the current user
            firebase.dbGetFollowers(user.uid).then(result => {
                result.forEach( (doc, key) => {
                    followers.push(key)
                    followers_names.push(doc.name)
                    // console.log(key + ":" + JSON.stringify(doc))
                })
                // console.log('followers: ' + followers)
                // console.log('followerNames: ' + followers_names)
            
            // after getting the followers, get the user and who they are following
            })
            .then(result2 => {
                firebase.dbGet('users', user.uid).then(result => {
                    firebase.dbGetFollowed(result.following).then(result => {
                        result.forEach( (doc, key) => {
                            following.push(key)
                            following_names.push(doc.name)
                        })
                    // wait to get who the user is following, then navigate to the Followers and Following Screen
                    })
                    .then(result3 => {
                        navigation.navigate('FollowersAndFollowing', {
                            followers : followers,
                            followers_names : followers_names,
                            following: following,
                            following_names: following_names
                        })
                    })
                })
            })            
            
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * method that will transition to the screen where the user can view their saved restaurants
     */
    const seeRestaurants = async() => {
        try {
            firebase.dbGet('users', user.uid).then(result => {
                //console.log(result)
                let restaurant_data = []
                Object.keys(result.saved_restaurants).forEach((key) => {
                    // I can pass the saved restaurant data to the Screen to Populate later.
                    restaurant_data.push(result.saved_restaurants[key])
                    // console.log(result.saved_restaurants[key])
                });
                // console.log(restaurant_data)
                navigation.navigate('SavedRestaurants', {
                    restaurants: restaurant_data
                })
                // console.log(result.saved_restaurants)
            })
    
        } catch (error) {
            console.log(error)
        }
        
        // cache the restaurant's data within the RestaurantProfileScreen to show it as buttons similar to Search.
    }

    const testURI = 'https://firebasestorage.googleapis.com/v0/b/feast-review.appspot.com/o/ProfilePictures%2FlxzNHne51XWIk3dKSfyyybCGOF82?alt=media&token=c3e4009e-976c-46f3-bc84-7a249d26d660'
    // Saves properties of selected image
    const [avatarPath, setAvatarPath] = React.useState();

    // Get user's previously uploaded profile picture from the database
    // const getAvatarDB = async() => {
    //     try{
    //         await firebase.dbFileGetUrl('ProfilePictures/' + user.uid).then(
    //             url => {
    //                 const dbImage = [{path: url}]
    //                 // setAvatar(dbImage)
    //                 console.log('dbImage: ', dbImage)
    //                 console.log('avatar: ', avatar)
    //                 }
    //         )
    //     }
    //     catch (error){
    //         console.log(error)
    //     }
    // }

    
    // firebase.dbFileGetUrl(user.uid).then(url => {setAvatar(url); console.log(url)}) 
    /**
     * method that handle the user's ability to change their profile picture
     */
    const changePicture = async() => {
        try{
            await ImagePicker.openPicker({
                        width: 120,
                        height: 120,
                        cropping: true,
                        // includeBase64: true,
                        cropperCircleOverlay: true
                    }).then(image? image => {
                        setAvatarPath(image.path);
                        console.log('image: ', image);
                        firebase.dbFileAdd('ProfilePictures/' + user.uid, image.path)
                    }: console.log('cancelled'));
        }
        catch (error){
            console.log(error)
        }
        
    }
    
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
                <Image style = {[styles.tinyLogo]} source ={uri= testURI}/>
                <Text style = {[styles.globalFont, {fontSize: 15}, {color: '#75d9fc'}, {paddingTop: 3}]}
                    onPress = {() => {console.log('Pressed edit photo'); changePicture()}}>
                    Edit Photo</Text>
                <Text style = {styles.globalFont}>{user.displayName}</Text>
                <Text style = {styles.globalFont}>Dessert Expert</Text>
            </View> 

            <View style = {[{flex: 1}, styles.bioSubscriptContent]}>
                <Text style={[styles.globalFont]}>{bio}</Text>
                <Text style = {[styles.editButton, styles.globalFont, {fontSize: 15}, {color: '#75d9fc'}]} onPress={() => setModalVisible(true)}>Edit Bio</Text>
                
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

        </View>
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
        alignItems: 'center',
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
        fontSize: 20,
        fontWeight: '500',
        
    }
})
