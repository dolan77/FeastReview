import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Modal, ScrollView } from 'react-native'
import React, {useState} from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native';

export default function ReviewPage({route}) {
    const navigation = useNavigation();
    const user = auth().currentUser;
    const restaurantData = route.params.restaurantData;
    var userReview = 'Your Review';

    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: true});
	  }, [navigation]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [review, setReview] = React.useState(userReview);

    // Images used for the stars
    const starIconCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
    const starIconFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';

    // Star review rating contents for category 'Food'
    const [foodDefaultRating, setfoodDefaultRating] = useState(3);
    const [foodMaxRating, setfoodMaxRating] = useState([1,2,3,4,5]);
    const FoodRating = () => {
        return (
            <View style={styles.starRatingsStyle}>
                {
                    foodMaxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setfoodDefaultRating(item)}
                            >
                                <Image 
                                    style={styles.starImgStyle}
                                    source={
                                        item <= foodDefaultRating
                                        ? {uri: starIconFilled}
                                        : {uri: starIconCorner}
                                    }
                                />
                            </TouchableOpacity>
                            
                        )
                    })
                }
            </View>
        )
    }

    // Star review rating contents for category 'Atmosphere'
    const [atmosphereDefaultRating, setatmosphereDefaultRating] = useState(3);
    const [atmosphereMaxRating, setatmosphereMaxRating] = useState([1,2,3,4,5]);
    const AtmosphereRating = () => {
        return (
            <View style={styles.starRatingsStyle}>
                {
                    atmosphereMaxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setatmosphereDefaultRating(item)}
                            >
                                <Image 
                                    style={styles.starImgStyle}
                                    source={
                                        item <= atmosphereDefaultRating
                                        ? {uri: starIconFilled}
                                        : {uri: starIconCorner}
                                    }
                                />
                            </TouchableOpacity>
                            
                        )
                    })
                }
            </View>
        )
    }

    // Star review rating for category 'Price'

    // Star review rating contents for category 'Service'
    const [serviceDefaultRating, setserviceDefaultRating] = useState(3);
    const [serviceMaxRating, setserviceMaxRating] = useState([1,2,3,4,5]);
    const ServiceRating = () => {
        return (
            <View style={styles.starRatingsStyle}>
                {
                    serviceMaxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setserviceDefaultRating(item)}
                            >
                                <Image 
                                    style={styles.starImgStyle}
                                    source={
                                        item <= serviceDefaultRating
                                        ? {uri: starIconFilled}
                                        : {uri: starIconCorner}
                                    }
                                />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    // Changes the text content inside of the review box after the user presses Enter after editing.
    function changeReview(userReview) {
        setReview(userReview)
    };
    
    
      return(
        <View style={styles.container1}>
            {/* Restaurant Name */}
            <Text style={styles.restaurantName}>
                    {restaurantData.data.name}
            </Text>
            
            {/* Selectable star review rating for food. */}
            <FoodRating/>
            <Text style={styles.whiteText}> {'Food'} </Text>
            <Text style={styles.whiteText}> {foodDefaultRating + ' / ' + foodMaxRating.length} </Text>

            {/* Selectable star review rating for atmosphere. */}
            <AtmosphereRating/>
            <Text style={styles.whiteText}> {'Atmosphere'} </Text>
            <Text style={styles.whiteText}> {atmosphereDefaultRating + ' / ' + atmosphereMaxRating.length} </Text>

            {/* Selectable star review rating for Service. */}
            <ServiceRating/>
            <Text style={styles.whiteText}> {'Service'} </Text>
            <Text style={styles.whiteText}> {serviceDefaultRating + ' / ' + serviceMaxRating.length} </Text>


            {/* Text that contains the user's written review */}
            <ScrollView style = {styles.userReviewBox}
                // Allows you to fully see "Edit Review" if review is very long. 
                contentContainerStyle={{paddingBottom:20}}>

                {/* POPUP when user is writing the text for the review */}
                <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView}>
                    <Text style = {styles.whiteText}>Write a review:</Text>
                    <TextInput
                    style = {styles.input}
                    onSubmitEditing={(value) => changeReview(value.nativeEvent.text)}
                    defaultValue = {review}/>
                    <Button
                    title="go back"
                    onPress={() => setModalVisible(!modalVisible)}
                    />
                </View>
                </Modal>

                {/* Text that shows user's review after they finish typing */}
                <Text style = {[styles.whiteText]}>
                    {review}
                    <Text style = {styles.editButton} onPress={() => setModalVisible(true)}>{"\n\n"}Edit Review</Text>
                </Text>
            
            </ScrollView>
            
            {/* Button for 'Submit Review' */}
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack(null)}
                    // Send review content to the database
                    
                    >
                    <Text style={styles.whiteText}> Submit Review </Text>
                    
                </TouchableOpacity>
                    
            </View>
            
            
                
        </View>
        
      );





}

const styles = StyleSheet.create({
    container1: {
		backgroundColor: '#3d4051',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
	container: {
		backgroundColor: '#3d4051',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
    restaurantName: {
        marginTop: 10, 
        marginLeft: 20,
        fontSize: 18,
        color: 'white', 
        flex: .4,
        alignSelf: 'flex-start'
    },
    locationIcon: {
		color: 'white',
        // flex: 2, 
		fontSize: 30,
        alignItems: 'center',
        alignSelf: 'center', 
        flexWrap: 'wrap',
        letterSpacing: 10,
        paddingBottom: 5,
	},
    reviewText: {
        color: "white",
        justifyContent: 'center',
    },
    whiteText: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
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
    userReviewBox: {
        color: 'white',
        // flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop:10,
        marginBottom: 10,
        maxWidth: 370,
        width: 370,
        height: 280,
        maxHeight: 280,
        borderRadius:10,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
    },
    editButton: {
        fontSize: 18,
        color: '#73C9E0',
        fontWeight: 'bold',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    input: {
        height: 300,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },

    starRatingsStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 3
    },
    starImgStyle:{
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
        marginBottom:10,
		borderRadius: 10,
		alignItems: 'center'
	},

})