import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

// background color: #3d4051 change for View, bioSubscript, flexbio, flexbutton
export default function UserProfileScreen(){
    const user = auth().currentUser;

    /*
    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	  }, [navigation]);
    */
    

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

        
        <View style= {{flex: 1}}>

            <View style = {styles.flexbio}>
                <Image style = {[styles.tinyLogo, styles.topContent]} source ={image}/>

                
                
                
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
                    maxLength={60}
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
                
                
                <Text style = {[styles.bioWrap]}>
                    {bio}
                    <Text style = {styles.editButton} onPress={() => setModalVisible(true)}>{"\n\n"}Edit Bio</Text>
                </Text>
            
            </View> 

            
            <View style = {styles.bioSubscript}>
            <Text style = {styles.bioSubscriptContent}>{user.displayName}</Text>
            <Text style = {styles.bioSubscriptContent}>Dessert Expert</Text>
            </View>
        </View> 



        
        <View style = {styles.flexbutton}>
        <View style={styles.horizontalLine} />

        <TouchableOpacity
        style={[styles.button]}
        onPress={seeReview}>
        <Text style={styles.buttonText}>See Your Reviews</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />
        <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('Followers')}>
            <Text style={styles.buttonText}>Followers</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />
        <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('Following')}>
            <Text style={styles.buttonText}>Following</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        </View>
    </View>
    );
}


const styles = StyleSheet.create({

    flexbio:{
        flexDirection: 'row',
        
    },

    flexbutton:{
        flex: 2,
        
       

    },

    space:{
        width: 10,
        height: 10
    },

    tinyLogo: {
        width: 100,
        height: 120,
        borderRadius: 150,
        flex: 1,
        marginLeft: 5,
        
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white'
    },

    topContent:{
        marginTop: 5
    },

    bioWrap:{
        flexWrap: 'wrap',
        flex: 2,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'baseline',
        paddingLeft: 10,
        paddingTop: 5,
        borderRadius: 10,
        fontSize: 15,
        color: 'white'
       
    },

    bioSubscript:{
        
    },

    bioSubscriptContent:{
        marginLeft: 10,
        color: 'white',
        paddingTop: 10
    },

    button: {
		backgroundColor: '#17202ac0',
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        
        
        
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},

    horizontalLine:{
        height: 2, 
        backgroundColor: '#ffffff'
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
        
    }

})