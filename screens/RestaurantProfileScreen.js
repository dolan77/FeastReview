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
    // console.log(restaurantData)
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
        // TODO: someone figure out how to get this from the DB
        // I think since we are clicking to go open this restaurantscreen, it has to be passed in from somewhere
        var restaurant = '000000'

        // navigate to the reviews tab and send in the hash and the type of review we want to see
        nagivation.navigate('Reviews', 
        {
            details: restaurant,
            type: 'restaurant'
        })
    }

    const addReview = () => {
        // CODE FOR SOMEONE ELSE TO DO
    }


    // printing the rating for the restaurant as star icons
    var stars = [];
    for(let i = 0; i < parseInt(restaurantData.data.rating); i++){
        stars.push(<View key={i}><Ionicons name="star" color="white" size={20}/></View>);
        
    }
    if (restaurantData.data.rating % 1 == 0.5){
        stars.push(<View key={i}><Ionicons name="star-half" color="white" size={20}/></View>);
    }

    return(
        <SafeAreaView style={style.container}>
            <ScrollView>
                <View>
                    
                    <ImageBackground
                    source = {{uri: restaurantData.data.image_url}}
                    resizeMode='cover'>

                        
                        <View style={[style.headerCover]}>
                            <Text style={style.text}>
                                {restaurantData.data.name}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                {stars}
                                <Text style={[style.text]}>{"\t\t"}{restaurantData.data.review_count} reviews</Text>
                                
                            </View>
                            
                        </View>
                    </ImageBackground>
                    <View style={style.horizontalLine}></View>
                </View>

                <Text style={[style.scheduleText, {paddingLeft: 20, paddingTop: 15, fontSize: 20, fontWeight: 'bold'}]}>Hours</Text>
                
                
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

                    <View>

                    <TouchableOpacity onPress={createOpenLink({ latitude: restaurantData.data.coordinates.latitude, longitude: restaurantData.data.coordinates.longitude})}>
                       <Image style={style.tinylogo} source={image} />
                    </TouchableOpacity>
                    <Text style={[{textAlign: 'center'}, style.scheduleText]}>Get Directions</Text>

                    </View> 

                </View>

                
                <View style={[style.IconContainer]}>
                    <TouchableOpacity
                    onPress={triggerCall} style={[{backgroundColor: 'white', borderRadius: 20, marginRight: 5}]}>
                        <Ionicons style= {{padding: 5}} name='call-outline' size={30} color='black'/>
                        
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={openSite} style={[{backgroundColor: 'white', borderRadius: 20}]}>
                        <Ionicons style= {{padding: 5}} name='globe-outline' size={30} color='black'/>
                    </TouchableOpacity>


                    

                </View>

                <View style={style.buttonContainer}>
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
    header:{
        flex: 1
    },
    restaurantInfo:{
        flex: 2
    },
    restaurantDetail:{
        flex: 2
    },
    IconContainer:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
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
        fontSize: 17
        
    },
    scheduleContainer:{
        flexDirection: 'row',
    },

    scheduleInner:{
        color: "red"
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },

    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
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