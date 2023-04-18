import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, useState, SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';
import * as firebase from '../utils/firebase'
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { starRating } from '../methods/star';
import ViewMoreText from 'react-native-view-more-text';

export default function ReviewsScreen({route}){
    // dbID is the ID of a restaurant/Feaster. type = where we pull the info from
    const dbID = route.params.dbID;
    // const reviewType = route.params.type
    const navigation = useNavigation();

    const [reviews, setReviews] = React.useState('')
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
        GetReviews();
        PopulateReviews();
    }, 
    [])

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
                // console.log(reviews[i])
                table.push(
                <TouchableOpacity key={i} style={[style.ReviewBox, {marginHorizontal: 10}]}
                    onPress={() => navDetailedReview(reviews[i])} >
                    <Text style={[style.buttonText, style.ReviewHeader]}>{reviews[i][1].username}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{starRating(0, reviewAverage)}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader, {color:'#63B8D6'}]}>{reviews[i][1].restaurant_name}</Text>
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
            <View style={style.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[style.globalFont, style.backArrow]} name='arrow-back-outline'/>
                </TouchableOpacity>
                <Text style={[style.globalFont]}>Your Reviews</Text>
            </View>
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
                            {limit != reviews.length && <Text style={style.buttonText}>See More Results</Text>}
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
        backgroundColor: '#3d4051',
    },
    buttonContainer: {
        alignItems: 'center'
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
    },
    ReviewBox: {
        backgroundColor: '#3f3a42',
        
        bordercolor: 'black',
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
        color: 'white',
        fontsize: 12,
        fontWeight: '650'
    },
    ReviewHeader: {
        paddingHorizontal: 10
    },
    header: {
        backgroundColor: '#171414',
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backArrow: {
        fontSize: 40
    },
    globalFont: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
})