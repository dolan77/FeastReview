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
import { Timestamp } from 'react-native-reanimated/lib/types/lib/reanimated2/commonTypes';
import {getMostUsedAdjectives} from '../utils/tasteometer'
import colors from '../utils/colors'

function fixHoursRepeated(data) {
	let hours = []
	let prev = -1
	data.map(item => {
		if (item.day === prev) {
			item.day = item.day + 'repeat'
		}
		hours.push(item)
		prev = item.day
	})
}

import { FeastHeader } from '../utils/components';
// function that returns the screen for a Restaurant's profile
export default function RestaurantProfileScreen({route}){
    const navigation = useNavigation();
    const dayOfTheWeek = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const restaurantData = route.params;
    const [saved, setSaved] = React.useState('')
    const [color, setColor] = React.useState('')
    const [hoursCollapsed, setHoursCollapsed] = React.useState('')
    const [reviews, setReviews] = React.useState('')
    const [limit, setLimit] = React.useState(1);
    const [pressed, setPressed] = useState(1)
    const [adjectives, setAdjectives] = React.useState('')

    
    const today = new Date().getDay()
    const todayStart = timeConvert(restaurantData.data.hours[0].open[today].start)
    const todayEnd = timeConvert(restaurantData.data.hours[0].open[today].end)

    const user = auth().currentUser;
    // console.log(restaurantData.data.hours[0].open[0])

    React.useEffect(() => {
		if (pressed !== 1) {
            if (10 * limit > reviews.length){
                setLimit(reviews.length)
            }
            else{
                setLimit(10 * limit)
            }
			
			
		}
        //AverageReview();
	}, [pressed])

    React.useEffect( () => {
        console.log(restaurantData.data.hours[0])


        PopulateButton();
        GetReviews();
        AverageReview();
        PopulateReviews();
        loadMostUsedAdjectives();
		fixHoursRepeated(restaurantData.data.hours[0].open)
    }, 
    [])

    // review = [review_id, {data}]
    const AverageReview = () => {
        let average = 0;
        let table = [];
        //console.log(reviews)
        for (let i = 0; i < reviews.length; i++){
            average += (reviews[i][1].star_atmos + reviews[i][1].star_foods + reviews[i][1].star_service) /3
        }
        average = average / reviews.length
        
        table.push(<Text key = {0}>{starRating(0, average)}</Text>)
        return table
    }
    /**
     * method that handles the event where the user clicks the save restuarant button
     * Made by Dylan Huynh
     */
    const clickSaved = async () => {
        console.log(user.uid);
        try{
            firebase.dbCreateBlank(restaurantData.data.alias, 'restaurant_alias').then(
                () =>{
                    firebase.dbUpdate('restaurants', restaurantData.data.alias, restaurantData.data)
                    firebase.dbGet('users', user.uid).then(result => {
                        console.log(result)
                        if(result.saved_restaurants.includes(restaurantData.data.alias)){
                            // let toSave = {}
                            // toSave[`saved_restaurants.${restaurantData.data.alias}`] = 1

                            // "saved_restuarnatsts." + alias
                            firebase.dbUpdateArrayRemove('users', user.uid, 'saved_restaurants', [restaurantData.data.alias]).then(result => PopulateButton())
                        }
                        else{
                            firebase.dbUpdateArrayAdd('users', user.uid, 'saved_restaurants', [restaurantData.data.alias]).then(result => PopulateButton())
                        }
                    })

                }
            )
            // console.log(currentUser.saved_restaurants)
            
            // if (Object.hasOwn(currentUser.saved_restaurants, restaurantData.data.alias)){
            //     let toSave = {}
            //     toSave[`saved_restaurants.${restaurantData.data.alias}`] = 1;
            //     firebase.dbDelete('users', user.uid, toSave).then(result => PopulateButton())
            //     // PopulateButton();
            // }
            // else{
            //     await firebase.dbUpdateOnce('users', user.uid, `saved_restaurants.${restaurantData.data.alias}`, restaurantData.data)
            //     PopulateButton();
            // }
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * method that changes the text and color of the "save restaurant" button
     * Made by Dylan Huynh
     */
    const PopulateButton = async () => {
        try {
            
            const currentUser = await firebase.dbGet('users', user.uid);
            // if we are following the restaurant, prompt the unfollow button
            console.log(currentUser)
            if (currentUser.saved_restaurants.includes(restaurantData.data.alias)){
                console.log('in if statement')
                setSaved('Remove Restaurant');
                setColor(colors.backgroundDarker);
                
            }
            // we are not following the restaurant, prompt the follow button
            else{
                setSaved('Save Restaurant');
                setColor(colors.feastBlueDark);
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
     * Expands the hours button
     * Made by Nathan Lai
     */
    const toggleHoursCollapsed = () => setHoursCollapsed(!hoursCollapsed);
    const HoursExpandible = ({ expanded = false }) => {
        const [height] = useState(new Animated.Value(0));
      
        useEffect(() => {
          Animated.timing(height, {
            toValue: !expanded ? (restaurantData.data.hours[0].open.length > 7 
				? (25 * (restaurantData.data.hours[0].open.length - 7)) + 250 : 250) 
				: 0,
            duration: 300,
            useNativeDriver: false
          }).start();
        }, [expanded, height]);
      
        // console.log('rerendered');
      
        return (
          <Animated.View style={{height}}>
            <View style={style.scheduleContainer}>   
                <View>
                    {restaurantData.data.hours[0].open.map((hoursData, index) => (
                        <Text key={hoursData.day + index} style={hoursData.day == today ? style.todayLeftText : style.leftText}>{dayOfTheWeek[hoursData.day]}</Text>
                    ))}

                    <Text>

                    </Text>
                </View>
                <View>
                    {restaurantData.data.hours[0].open.map((hoursData, index) => (
                        <Text key={hoursData.day + index} style={hoursData.day == today ? style.todayRightText : style.rightText}>{timeConvert(hoursData.start)} - {timeConvert(hoursData.end)}</Text>
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
    const addReview = () => {
        navigation.navigate('Create Review', {restaurantData})
    }

    const handlePress = () => {
        setPressed(pressed + 1)
    }


    const GetReviews = () => {
        try {
            firebase.dbGetReviews(restaurantData.data.alias).then(result => {
                setReviews([...result])
            })
           
            
        } catch (error) {
            console.log(error)
        }
    }

    const PopulateReviews = () => {
        //console.log('in populatereviews: ' + limit)
        //console.log('pressed: ' + pressed)
        let table = []
        if (reviews.length != 0){
            
            for(let i = 0;  i < limit; i++){
                const reviewAverage = ((reviews[i][1].star_atmos + reviews[i][1].star_foods + reviews[i][1].star_service) /3)
                
                table.push(
                <TouchableOpacity key={i} style={[style.ReviewBox, {marginHorizontal: 10}]} onPress={() => {navigation.navigate('Detailed Review Screen', reviews[i])}}>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{reviews[i][1].username}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{starRating(0,reviewAverage)}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{reviews[i][1].datemade.toDate().toDateString()}</Text>
                    <Text style={[style.ReviewBoxItems, style.ReviewText]}>{reviews[i][1].content}</Text>
                </TouchableOpacity>)

                // console.log(reviews[i][1].authorid)
            }  
        }

        else{
            table.push(<Text key={0} style={[style.buttonText, style.ReviewHeader, {alignSelf: 'center', marginVertical: 10}]}>There are no reviews on the restaurant</Text>)
        }
        return(table)
    }

    // returns the screen of the restaurant that the current user is looking at. This contains information about the restaurant's
    // hours, name, rating, reviews, directions, phone number, and website to the restaurant
    return(
        <SafeAreaView style={style.container}>
            <FeastHeader title={'Restaurant'} onPress={() => navigation.goBack()}/>
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
                                {AverageReview()}
                                {/* {averageReview} */}
                                {/* <Text>{starRating(restaurantData.data.id, averageReview)}</Text> */}
                                <Text style={[style.text]}>{reviews.length} reviews</Text>
                                
                            </View>
                            
                        </View>
                    </ImageBackground>
                
                </View>

                
                
                <View style = {{backgroundColor: colors.black}}>
                
                <View style = {style.container}>
                    <TouchableOpacity onPress={toggleHoursCollapsed} style={style.buttonContainer}>
                        <View style={style.hoursButton}>
                            <Text style={restaurantData.data.hours[0].is_open_now ? style.openText: style.closedText}> {restaurantData.data.hours[0].is_open_now ? "Open" : "Closed"} </Text>
                            <Text style={style.hoursButtonText}> until </Text>
                            <Text style={style.hoursButtonText}> {restaurantData.data.hours[0].is_open_now ? todayEnd : todayStart} </Text>
                            <Ionicons style= {{paddingLeft: 25}} name={hoursCollapsed ? "add-circle-outline" : "remove-circle-outline"} size={40} color={colors.white}/>
                        </View>
                    </TouchableOpacity>
                    <HoursExpandible expanded={hoursCollapsed} />
                </View>

                <View style={style.horizontalLine} />
                
                    <View style={[style.IconContainer]}>
                        <TouchableOpacity
                        onPress={triggerCall}>
                            <Ionicons style= {{padding: 5}} name='call-outline' size={40} color={colors.white}/>
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={openSite}>
                            <Ionicons style= {{padding: 5}} name='globe-outline' size={40} color={colors.white}/>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={createOpenLink({ end: restaurantData.data.location.address1})}>
                        <Ionicons style = {{padding: 5}} name = 'compass-outline' color={colors.white} size = {40}/>
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
                                        <Ionicons name="chatbubbles" color={colors.white} size = {20}></Ionicons>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={style.rightText}>{adjective[2]}</Text>
                                        <Ionicons name="thumbs-up" color={colors.goodGreen} size = {20}></Ionicons>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={style.rightText}>{adjective[3]}</Text>
                                        <Ionicons name="thumbs-down" color={colors.badRed} size = {20}></Ionicons>
                                    </View>
                                </View>
                            )) : ""}
                            <Text></Text>
                        </View>
                    </View>
                </View>

                <View style={[style.buttonContainer]}>

                   <TouchableOpacity
                   onPress={addReview}
                   style={style.button}
                >
                    <Text style={style.buttonText}>Add Review</Text>
                   </TouchableOpacity>



                    <TouchableOpacity style={[style.button, {backgroundColor: color, marginBottom: 20}]} onPress={clickSaved}>
                        <Text style={style.buttonText}>{saved}</Text>
                    </TouchableOpacity>

                </View>

                <View style={{backgroundColor: colors.black}}>
                    <View style={style.horizontalLine} />
                    <Text style={style.ReviewTop}>Restaurant Reviews</Text>
                    <View style={style.horizontalLine} />
                </View>
                {/* {This part will render the reviews} */}
                <View>
                   {PopulateReviews()}
                </View>
                
                {reviews.length !== 0 && 
					<View style={style.buttonContainer}>
						<TouchableOpacity
							onPress={handlePress}
							style={style.button}
						>
							<Text style={style.buttonText}>See More Results</Text>
						</TouchableOpacity>
					</View>
				}

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
    ReviewTop: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 25,
        marginVertical: 10,
        alignSelf: 'center'
    },
    horizontalLine:{
        height: 2, 
        backgroundColor: colors.white
    },
    container:{
        flex: 1,
        backgroundColor: colors.backgroundDark,
    },
    IconContainer:{
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },

    headerCover: {
		backgroundColor: colors.backgroundDarker + colors.modTransparent,
		width: '100%',
		padding: 15,
		justifyContent: 'center',
        color: colors.white,
        flex: 1,
        height: 150,
	},
    text:{
        color: colors.white,
        fontSize: 20
    },
    scheduleContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginHorizontal:10,
        backgroundColor: colors.backgroundDarker,
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
    },
    hoursButton:{
        flexDirection: 'row',
        backgroundColor: colors.backgroundDarker,
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.black,
        borderWidth: 1,
        height: 75,
        marginTop: 20
    },
    hoursButtonText:{
        color: colors.white,
        textAlign:'center',
        fontSize: 30
    },
    openText:{
        color: colors.goodGreen,
        textAlign:'center',
        fontSize: 30
    },
    closedText:{
        color: colors.badRed,
        textAlign:'center',
        fontSize: 30
    },
    leftText:{
        color: colors.white,
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'left',
        marginHorizontal:15,
        lineHeight:30
        
    },
    todayLeftText:{
        color: colors.feastBlue,
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'left',
        marginHorizontal:15,
        lineHeight:30
        
    },
    rightText:{
        color: colors.white,
        fontSize: 20,
        textAlign: 'right',
        marginHorizontal:15,
        lineHeight:30
    },
    todayRightText:{
        color: colors.feastBlue,
        fontSize: 20,
        textAlign: 'right',
        marginHorizontal:15,
        lineHeight:30
    },
    centerText:{
        color: colors.white,
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
        backgroundColor: colors.backgroundDarker,
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
		alignItems: 'center',

    },

    button: {
		backgroundColor: colors.backgroundDarker,
		width: '100%',
		padding: 15,
		alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.black,
        borderWidth: 1,
        height: 75,
        marginTop: 20
        
        
	},
	buttonText: {
		color: colors.white,
		fontWeight: '700',
		fontSize: 16,
	},

    buttonOutline: {
        backgroundColor: colors.white,
        marginTop: 5,
        borderColor: colors.feastBlue,
        borderWidth: 2
    },
    buttonText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: colors.feastBlue,
        fontWeight: '700',
        fontSize: 16
    },
    ReviewBox: {
        backgroundColor: colors.backgroundDarker,
        
        bordercolor: colors.black,
        borderWidth: 3,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
        paddingVertical: 10
        
    },
    ReviewBoxItems:{
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    ReviewText: {
        color: colors.white,
        fontsize: 12,
        fontWeight: '650'
    },
    ReviewHeader: {
        paddingHorizontal: 10
    }
})