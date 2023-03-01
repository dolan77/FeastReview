import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, Modal, ScrollView, SafeAreaView, FlatList, Linking, Animated} from 'react-native'
import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {timeConvert} from "../methods/time"
import { starRating } from '../methods/star';
import openMap, { createMapLink, createOpenLink } from 'react-native-open-maps';
import image from "../assets/maps-icon.png"
import * as firebase from '../utils/firebase'
import auth from '@react-native-firebase/auth';

// function that returns the screen for a Restaurant's profile
export default function RestaurantProfileScreen({route}){
    const nagivation = useNavigation();
    const dayOfTheWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const restaurantData = route.params;
    const [saved, setSaved] = React.useState('')
    const [color, setColor] = React.useState('')
    const [hoursCollapsed, setHoursCollapsed] = React.useState('')
    // console.log(restaurantData)
    // console.log(restaurantDafta.data.hours[0])
    const user = auth().currentUser;
    // console.log(restaurantData.data.hours[0].open[0])

    React.useEffect( () => {
        PopulateButton();
    }

    )
    const clickSaved = async () => {
        console.log(user.uid);
        try{
            const currentUser = await firebase.dbGet('users', user.uid);
            console.log(currentUser.saved_restaurants)
            
            if (Object.hasOwn(currentUser.saved_restaurants, restaurantData.data.alias)){
                let toSave = {}
                toSave[`saved_restaurants.${restaurantData.data.alias}`] = 1;
                await firebase.dbDelete('users', user.uid, toSave)
                PopulateButton();
            }
            else{
                await firebase.dbUpdateOnce('users', user.uid, `saved_restaurants.${restaurantData.data.alias}`, restaurantData.data)
                PopulateButton();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const PopulateButton = async () => {
        try {
            const currentUser = await firebase.dbGet('users', user.uid);
            // if we are following the restaurant, prompt the unfollow button
            if (Object.hasOwn(currentUser.saved_restaurants, restaurantData.data.alias)){
                
                setSaved('Remove Restaurant');
                setColor('#636362');
                
            }
            // we are not following the restaurant, prompt the follow button
            else{
                setSaved('Save Restaurant');
                setColor('#0782F9');
            }
        } catch (error) {
            console.log(error)
        }
    }
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

    /**
     * Expands the hours button
     * Made by Nathan Lai
     */
    const toggleHoursCollapsed = () => setHoursCollapsed(!hoursCollapsed);
    const HoursExpandible = ({ expanded = false }) => {
        const [height] = useState(new Animated.Value(0));
      
        useEffect(() => {
          Animated.timing(height, {
            toValue: !expanded ? 250 : 0,
            duration: 300,
            useNativeDriver: false
          }).start();
        }, [expanded, height]);
      
        // console.log('rerendered');
      
        return (
          <Animated.View style={{height}}>
            <View style={style.scheduleContainer}>   
                <View>
                    {restaurantData.data.hours[0].open.map(hoursData => (
                        <Text key={hoursData.day} style={style.daysText}>{dayOfTheWeek[hoursData.day]}</Text>
                    ))}

                    <Text>

                    </Text>
                </View>
                <View>
                    {restaurantData.data.hours[0].open.map(hoursData => (
                        <Text key={hoursData.day} style={style.hoursText}>{timeConvert(hoursData.start)} - {timeConvert(hoursData.end)}</Text>
                    ))}
                    <Text>
                        
                    </Text>
                </View>

            </View>
          </Animated.View>
        );
    };

    /**
     * method to add a review to the current restaurant
     */
    const addReview = (hoursData) => {
        // CODE FOR SOMEONE ELSE TO DO
        // nagivation.navigate('Create Review', {restaurantData})
    }

    // returns the screen of the restaurant that the current user is looking at. This contains information about the restaurant's
    // hours, name, rating, reviews, directions, phone number, and website to the restaurant
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
                                <Text>{starRating(restaurantData.data.id, restaurantData.data.rating)}</Text>
                                <Text style={[style.text]}>{restaurantData.data.review_count} reviews</Text>
                                
                            </View>
                            
                        </View>
                    </ImageBackground>
                
                </View>

                
                
                <View style = {{backgroundColor: '#161414'}}>
                
                <View style = {style.container}>
                    <TouchableOpacity onPress={toggleHoursCollapsed} style={style.buttonContainer}>
                        <View style={style.hoursButton}>
                            <Text style={restaurantData.data.is_closed ? style.openText: style.closedText}> {restaurantData.data.hours[0].is_open_now ? "Open" : "Closed"} </Text>
                            <Text style={style.hoursButtonText}> until </Text>
                            <Text style={style.hoursButtonText}> {restaurantData.data.hours[0].is_open_now ? restaurantData.data.hours[0].open[0].end : restaurantData.data.hours[0].open[0].start} </Text>
                            <Ionicons style= {{paddingLeft: 25}} name={hoursCollapsed ? "add-circle-outline" : "remove-circle-outline"} size={40} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <HoursExpandible expanded={hoursCollapsed} />
                </View>

                <View style={style.horizontalLine} />
                
                    <View style={[style.IconContainer]}>
                        <TouchableOpacity
                        onPress={triggerCall}>
                            <Ionicons style= {{padding: 5}} name='call-outline' size={40} color='white'/>
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={openSite}>
                            <Ionicons style= {{padding: 5}} name='globe-outline' size={40} color='white'/>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={createOpenLink({ end: restaurantData.data.location.address1})}>
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



                    <TouchableOpacity style={[style.button, {backgroundColor: color}]} onPress={clickSaved}>
                        <Text style={style.buttonText}>{saved}</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );

}


// CSS for the View that is being returned
// onPress={createOpenLink({ end: restaurantData.data.location.address1})}
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
    scheduleContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginHorizontal:10,
        backgroundColor:'#262833',
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
    },
    hoursButton:{
        flexDirection: 'row',
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
    hoursButtonText:{
        color: 'white',
        textAlign:'center',
        fontSize: 30
    },
    openText:{
        color: 'green',
        textAlign:'center',
        fontSize: 30
    },
    closedText:{
        color: 'red',
        textAlign:'center',
        fontSize: 30
    },
    daysText:{
        color: 'white',
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'left',
        marginHorizontal:15,
        lineHeight:30
        
    },
    hoursText:{
        color: 'white',
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'right',
        marginHorizontal:15,
        lineHeight:30
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