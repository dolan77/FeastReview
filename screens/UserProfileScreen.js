import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

// background color: #3d4051 change for View, bioSubscript, flexbio, flexbutton
export default function UserProfileScreen(){
    const user = auth().currentUser;

    
    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	  }, [navigation]);
    
    

    const [modalVisible, setModalVisible] = React.useState(false);
    // I am able to do user.email within the use state. if we are able to save the bio and pull from the database that would be epic but for now this is all i can do
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

    async function getBio() {
        // push changes to database, backend can do that
        try {
            const userBio = await firebase.dbGet('users', user.uid);
            setBio(userBio.bio)
        } catch (error) {
            console.log(error)
        }
    }



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

    console.log(user.email, 'has signed up')
    console.log(bio, 'state')
    
    React.useEffect(() => {
        getBio();
    },
    []
    )
    
    // modals refresh the screen, stacks do not. if you leave a stack and re-enter it refreshres but adding to the stack will not
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
                <Text>{"\n"}60 characters max</Text>
                <Text>Press Enter before you click the go back button if you want to submit your changes to bio</Text>
            </View>
        </Modal>
        
        <View style= {{flex: 3, backgroundColor: '#171414'}}>

            
            <View style = {[{justifyContent: 'center', alignItems: 'center', flex: 2}]}>
                <Image style = {[styles.tinyLogo, styles.topContent]} source ={image}/>
                <Text style = {styles.globalFont}>{user.email}</Text>
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

        <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('Followers')}>
            <Text style={styles.buttonText}>Followers</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('Following')}>
            <Text style={styles.buttonText}>Following</Text>
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
