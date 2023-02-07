import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, ScrollView, SafeAreaView, FlatList, Linking} from 'react-native'
import { useNavigation } from '@react-navigation/core';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import openMap, { createMapLink, createOpenLink } from 'react-native-open-maps';
import image from "../assets/maps-icon.png"


// TODO:
// Back-End: figure out how to know which restaurant profile to display
// maybe pass in the restaurant-id when you click on a restaurant to display this profile

export default function RestaurantProfileScreen({route}){
    const nagivation = useNavigation();
    const dayOfTheWeek = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"]
    const restaurantData = route.params;
     console.log(restaurantData)
    // console.log(restaurantData.data.hours[0].open[0])
    
    /**
     * function to call a phone number
     */
    const triggerCall = () => {
        Linking.openURL(`tel:${restaurantData.data.phone}`)
    };
    
    /**
     * function to open a url
     * 
     */
    const openSite = () => {
        Linking.openURL(restaurantData.data.url)
    }

    /**
     * method to navigate to the Reviews Tab
     */
    const navigateReview = () => {

        // navigate to the reviews tab and send in the hash and the type of review we want to see
        // pass in alias and type of review we want to ReviewsScreen
        nagivation.navigate('Reviews', 
        {
            dbID: restaurantData.data.alias,
            type: 'restaurant'
        })
    }

    const addReview = () => {
        // CODE FOR SOMEONE ELSE TO DO
    }

    // latitude: restaurantData.data.coordinates.latitude, longitude: restaurantData.data.coordinates.longitude

    // printing the rating for the restaurant as star icons
    var stars = [];
    for(let i = 0; i < parseInt(restaurantData.data.rating); i++){
        stars.push(<View key={i}><Ionicons name="star" color="gold" size={20}/></View>);
        
    }
    if (restaurantData.data.rating % 1 == 0.5){
        stars.push(<View key={i}><Ionicons name="star-half" color="gold" size={20}/></View>);
    }

    return(
        <SafeAreaView style={style.container}>
            <ScrollView>
                <View stlye={{flex: 3}}>
                <View>
                    
                    <ImageBackground
                    source = {{uri: restaurantData.data.image_url}}
                    resizeMode='cover'>

                        
                        <View style={[style.headerCover]}>
                            <Text style={style.text}>
                                {restaurantData.data.name}
                            </Text>
                            <View>
                                <Text>{stars}</Text>
                                <Text style={[style.text]}>{restaurantData.data.review_count} reviews</Text>
                                
                            </View>
                            
                        </View>
                    </ImageBackground>
                
                </View>

                
                
                <View style = {{backgroundColor: '#161414'}}>
                <View style={style.horizontalLine} />
                    <Text style={[style.scheduleText, {fontSize: 20, fontWeight: 'bold', alignSelf: 'center', paddingTop: 20}]}>Hours</Text>

                    <View style={[style.scheduleContainer, {justifyContent: 'space-evenly', marginTop:5},]}>
                            
                        <View style={style.scheduleContainer}>

                        
                            <View>
                                {restaurantData.data.hours[0].open.map(hoursData => (
                                    <Text key={hoursData.day} style={style.scheduleText}>{dayOfTheWeek[hoursData.day]}:</Text>
                                ))}
                            </View>

                        
                            <View>
                                {restaurantData.data.hours[0].open.map(hoursData => (
                                    <Text key={hoursData.day} style={style.scheduleText}>{"\t"}{hoursData.start} - {hoursData.end}</Text>
                                ))}
                            </View>

                        </View>

                    </View>

                
                    <View style={[style.IconContainer]}>
                        <TouchableOpacity
                        onPress={triggerCall}>
                            <Ionicons style= {{padding: 5}} name='call-outline' size={40} color='white'/>
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={openSite}>
                            <Ionicons style= {{padding: 5}} name='globe-outline' size={40} color='white'/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={createOpenLink({ end: restaurantData.data.location.address1})}>
                        <Ionicons style = {{padding: 5}} name = 'compass-outline' color='white' size = {40}/>
                        </TouchableOpacity>

                    </View>
                    <View style={style.horizontalLine} />

                </View>


                </View>

                <View style={[style.buttonContainer]}>
                   <TouchableOpacity
                   onPress={navigateReview}
                   style={style.button}
                >
                    <Text style={style.buttonText}>See Reviews</Text>
                   </TouchableOpacity>

                   <TouchableOpacity
                   onPress={addReview}
                   style={style.button}
                >
                    <Text style={style.buttonText}>Add Review</Text>
                   </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );

}


// CSS for the View that is being returned
const style = StyleSheet.create({
    tinylogo:{
        height: 130,
        width: 130,
        borderRadius: 130
    },
    horizontalLine:{
        height: 2, 
        backgroundColor: '#ffffff'
    },
    container:{
        flex: 1,
        backgroundColor: '#3d4051',
    },
    IconContainer:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },

    headerCover: {
		backgroundColor: '#17202ac0',
		width: '100%',
		padding: 15,
		justifyContent: 'center',
        color: 'white',
        flex: 1,
        height: 150,
	},
    text:{
        color: 'white',
        fontSize: 20
    },

    scheduleText:{
        color: 'white',
        fontSize: 20
        
    },
    scheduleContainer:{
        flexDirection: 'row',
    },

    buttonContainer: {
       

    },

    button: {
		backgroundColor: '#342B2B51',
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#000000',
        borderWidth: 1,
        height: 75,
        marginTop: 20
        
        
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},

    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    }
})