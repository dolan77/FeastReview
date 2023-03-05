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
import {getMostUsedAdjectives} from '../utils/tasteometer'

// function that returns the screen for a Restaurant's profile
export default function RestaurantProfileScreen({route}){
    const nagivation = useNavigation();
    const dayOfTheWeek = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const restaurantData = route.params;
    const [saved, setSaved] = React.useState('')
    const [color, setColor] = React.useState('')
    const [hoursCollapsed, setHoursCollapsed] = React.useState('')
    const [adjectives, setAdjectives] = React.useState('')

    const today = new Date().getDay()
    const todayStart = timeConvert(restaurantData.data.hours[0].open[today].start)
    const todayEnd = timeConvert(restaurantData.data.hours[0].open[today].end)

    const user = auth().currentUser;



    React.useEffect( () => {
        PopulateButton();
        loadMostUsedAdjectives();
    }, []);


    const clickSaved = async () => {
        try{
            const currentUser = await firebase.dbGet('users', user.uid);

            if (Object.hasOwn(currentUser.saved_restaurants,restaurantData.data.alias)){
                await firebase.dbUpdateArrayRemove('users', user.uid, 'saved_restaurants', [restaurantData.data.alias]);
                PopulateButton();
            }
            else{
                await firebase.dbUpdateArrayAdd('users', user.uid, 'saved_restaurants', [restaurantData.data.alias]);
                PopulateButton();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const PopulateButton = async () => {
        try {
            const currentUser = await firebase.dbGet('users', user.uid);
            // if we are following the user, prompt the unfollow button
            if (Object.hasOwn(currentUser.saved_restaurants,restaurantData.data.alias)){
                
                setSaved('Remove');
                setColor('#636362');
                
            }
            // we are not following the user,prompt the follow button
            else{
                
                setSaved('Save');
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
                        <Text key={hoursData.day} style={hoursData.day == today ? style.todayLeftText : style.leftText}>{dayOfTheWeek[hoursData.day]}</Text>
                    ))}

                    <Text>

                    </Text>
                </View>
                <View>
                    {restaurantData.data.hours[0].open.map(hoursData => (
                        <Text key={hoursData.day} style={hoursData.day == today ? style.todayRightText : style.rightText}>{timeConvert(hoursData.start)} - {timeConvert(hoursData.end)}</Text>
                    ))}
                    <Text>
                        
                    </Text>
                </View>

            </View>
          </Animated.View>
        );
    };

    /**
     * Load the most used adjectives from database and split into two columns for rendering
     * by Nathan Lai
     */
    const loadMostUsedAdjectives = () => {
        getMostUsedAdjectives(restaurantData.data.alias).then((result) => {
            adjectiveColumns = [];
            console.log(result);
            result.forEach(adjective => {
                adjectiveColumn = [adjective[0], adjective[1].total, 0, 0];
                adjectiveColumn[2] = adjective[1].positive ? adjective[1].positive : 0;
                adjectiveColumn[3] = adjective[1].negative ? adjective[1].negative : 0;
                adjectiveColumns.unshift(adjectiveColumn);
            })
            setAdjectives(adjectiveColumns);
        });
    };

    /**
     * method to add a review to the current restaurant
     */
    const addReview = (hoursData) => {
        // CODE FOR SOMEONE ELSE TO DO
        nagivation.navigate('Create Review', {restaurantData})
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
                            <Text style={restaurantData.data.hours[0].is_open_now ? style.openText: style.closedText}> {restaurantData.data.hours[0].is_open_now ? "Open" : "Closed"} </Text>
                            <Text style={style.hoursButtonText}> until </Text>
                            <Text style={style.hoursButtonText}> {restaurantData.data.hours[0].is_open_now ? todayEnd : todayStart} </Text>
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

                <View>
                    <View style={style.button}>
                        <Text style={style.buttonText}>Most Review Mentions</Text>
                    </View>
                    <View style={style.adjectivesContainer}>   
                        <View>
                            {adjectives ? adjectives.map(adjective => (
                                <View key={adjective} style={{flexDirection:'row', alignContent: 'center'}}>
                                    <Text style={style.centerText}>{adjective[0]}</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={style.rightText}>{adjective[1]}</Text>
                                        <Ionicons name="chatbubbles" color='white' size = {20}></Ionicons>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={style.rightText}>{adjective[2]}</Text>
                                        <Ionicons name="thumbs-up" color='green' size = {20}></Ionicons>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={style.rightText}>{adjective[3]}</Text>
                                        <Ionicons name="thumbs-down" color='red' size = {20}></Ionicons>
                                    </View>
                                </View>
                            )) : ""}
                            <Text></Text>
                        </View>
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
    leftText:{
        color: 'white',
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'left',
        marginHorizontal:15,
        lineHeight:30
        
    },
    todayLeftText:{
        color: 'cornflowerblue',
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'left',
        marginHorizontal:15,
        lineHeight:30
        
    },
    rightText:{
        color: 'white',
        fontSize: 20,
        textAlign: 'right',
        marginHorizontal:15,
        lineHeight:30
    },
    todayRightText:{
        color: 'cornflowerblue',
        fontSize: 20,
        textAlign: 'right',
        marginHorizontal:15,
        lineHeight:30
    },
    centerText:{
        color: 'white',
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginHorizontal:15,
        lineHeight:30
    },
    adjectivesContainer:{
        flexDirection: 'row',
        marginHorizontal:10,
        justifyContent:'space-evenly',
        backgroundColor:'#262833',
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
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