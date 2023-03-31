import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

import ImagePicker from 'react-native-image-crop-picker';
import colors from '../utils/colors';

export default function EditProfileScreen(){
    const user = auth().currentUser;

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [bio, setBio] = React.useState('');
    const [avatarPath, setAvatarPath] = React.useState();


    React.useEffect(() => {
        getBio();
        getAvatarDB();
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

        /**
     * Method that handle the user's ability to change their profile picture
     * Written by Kenny Du
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

    return (
        <View style = {{flex: 1, backgroundColor: '#3d4051'}}>
            <View style = {styles.container}>
                <View style = {{flexDirection: 'row'}}>
                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.profileLabel}>Profile Picture</Text>
                        <Image style = {[styles.tinyLogo]} source ={{uri:avatarPath}}/>
                    </View>

                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.editButton} onPress = {() => {console.log('Pressed edit photo'); changePicture()}}>Edit</Text>
                    </View>
                </View>

                <View>
                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.profileLabel}>Username</Text>
                    </View>
                </View>

                <View>
                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.profileLabel}>Title</Text>
                    </View>
                </View>

                <View>
                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.profileLabel}>Biography</Text>
                    </View>

                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.editButton} onPress = {() => setModalVisible(true)}>Edit</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
		backgroundColor: '#3d4051',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
    bioSubscriptContent:{
        alignItems: 'center',
        paddingHorizontal: 15
    },
    editButton: {
        color: colors.feastBlue,
        fontWeight: 'bold',
    },
    globalFont:{
        color: colors.white,
        fontSize: 20,
        fontWeight: '500', 
    },
    tinyLogo: {
        width: 120,
        height: 120,
        borderRadius: 150,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: colors.feastBlue
    },
    profileLabel:{
        color: colors.gray,
        fontSize: 14,
        fontWeight: 'bold'
    }
});