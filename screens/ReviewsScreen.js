import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, useState, SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import colors from '../utils/colors';
import {businessDetail} from '../utils/yelp.js';
import * as React from 'react';
import * as firebase from '../utils/firebase'
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { starRating } from '../methods/star';
import ViewMoreText from 'react-native-view-more-text';
import { FeastHeader } from '../utils/components';

export default function ReviewsScreen({route}){
    // dbID is the ID of a restaurant/Feaster. type = where we pull the info from
    const dbID = route.params.dbID;
    // const reviewType = route.params.type
    const navigation = useNavigation();

    const [reviews, setReviews] = React.useState('')
    const [pfps, setpfps] = React.useState('')
    const [limit, setLimit] = React.useState(5);
    const [pressed, setPressed] = React.useState(1)

    const user = auth().currentUser;

    React.useEffect(() => {
		if (pressed !== 1) {
            if (5 + limit > reviews.length){
                setLimit(reviews.length)
            }
            else{
                setLimit(5 + limit)
            }
		}
	}, [pressed])

    React.useEffect( () => {
        // getProfilePics();
        GetReviews();
        
        PopulateReviews();
        
    }, 
    [])

    

    // const getProfilePics = () => {
    //     try{
    //         firebase.firebase.dbFileGetUrl('ProfilePictures/' + dbID).then(
                
    //             url => {
    //                 console.log(url)
    //                 setpfps(url)
    //             })
            
    //     }
    //     catch(error){
    //         firebase.dbFileGetUrl('feast_blue.png').then(
    //         url => {
    //             console.log(url)
    //             setpfps(url)
    //             }
    //         )
    //     }   

    // }
    const GetReviews = () => {
        try {
            firebase.dbGetReviews(dbID, field="authorid").then(result => {
                setReviews([...result])
            })

            console.log(reviews.length)
           
            
        } catch (error) {
            console.log(error)
        }
    }

    const handlePress = () => {
        setPressed(pressed + 1)
    }

    renderReadMore = (onPress) => {
		return(
		  <Text onPress={onPress} style={{color: '#75d9fc', padding: 5, marginLeft:10, borderWidth: 0}}>Read more</Text>
		)
	}
	renderReadLess = (onPress) => {
		return(
		  <Text onPress={onPress} style={{color: '#75d9fc', padding: 5, marginLeft:10}}>Read less</Text>
		)
	}

    const PopulateReviews = () => {
        let table = []
        if (reviews.length != 0){
            for(let i = 0;  i < limit; i++){
                const reviewAverage = ((reviews[i][1].star_atmos + reviews[i][1].star_foods + reviews[i][1].star_service) /3)
                // console.log(reviewAverage)
                // console.log(reviews[i][1])
                table.push(
                <TouchableOpacity key={i} style={[style.ReviewBox, {marginHorizontal: 10}]}
                    onPress={() => navDetailedReview(reviews[i])} >
                    {/* <Image style = {[style.tinyLogo]} source ={{uri: pfps}}/> */}
                    <Text style={[style.buttonText, style.ReviewHeader]}>{reviews[i][1].username}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{starRating(0, reviewAverage)}</Text>
                    <TouchableOpacity
                    onPress={(() => {
                        try {
                            firebase.dbGet('api_keys', 'key').then(keys => {
                                businessDetail(reviews[i][1].restaurant_alias, keys.yelp).then(result => {navigation.navigate('RestaurantProfile', {data: result})})
                            })
                        } catch (error) {
                            console.log(error)
                        }
                    })}
                    >
                        <Text style={[style.buttonText, style.ReviewHeader, {color:'#63B8D6'}]}>{reviews[i][1].restaurant_name}</Text>
                    </TouchableOpacity>
                    
                    <Text style={[style.buttonText, style.ReviewHeader]}>{reviews[i][1].datemade.toDate().toDateString()}</Text>
                    <ViewMoreText
									numberOfLines={5}
									renderViewMore={renderReadMore}
									renderViewLess={renderReadLess}
									textStyle={[style.ReviewBoxItems, style.ReviewText]}
								>
								<Text>
									{reviews[i][1].content}
								</Text>
							</ViewMoreText>
                </TouchableOpacity>)

                // console.log(reviews[i][1].authorid)
            }
            
        }

        else{
            table.push(<Text key={0} style={[style.buttonText, style.ReviewHeader, {alignSelf: 'center', marginVertical: 10}]}>You do not have any reviews on a restaurant</Text>)
        }
        return(table)
    }

    const navDetailedReview = (params) => {
        navigation.navigate('Detailed Review Screen', params)
    }

    return(

        <SafeAreaView style={style.container}>
            <FeastHeader title={"Your Reviews"} onPress={() => navigation.goBack()}/>

            <ScrollView>


                <View>
                    <View>
                        {PopulateReviews()}
                    </View>

                    {reviews.length !== 0 && 
                        <View style={style.buttonContainer}>
                            <TouchableOpacity
                                onPress={handlePress}
                                style={style.button}
                            >
                            {limit != reviews.length && <Text style={[style.buttonText, {marginVertical:20, color: colors.feastBlue}]}>See More Results</Text>}
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </ScrollView>
        </SafeAreaView>

    );

}


const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.backgroundDark,
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2.5,
        borderColor: colors.feastBlue,
    },

    buttonContainer: {
        alignItems: 'center'
    },
    buttonText: {
		color: colors.white,
		fontWeight: '700',
		fontSize: 16,
	},

    buttonOutline: {
        backgroundColor: colors.white,
        marginTop: 5,
        borderColor: colors.feastBlueDark,
        borderWidth: 2
    },
    buttonOutlineText: {
        color: colors.feastBlueDark,
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
    },
    globalFont: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '500',
    },
})