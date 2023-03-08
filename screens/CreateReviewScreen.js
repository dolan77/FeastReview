import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Modal, ScrollView, Pressable } from 'react-native'
import React, {useState} from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native';
import * as firebase from '../utils/firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultipleImagePicker from 'react-native-image-crop-picker';
import { FlatList } from 'react-native-gesture-handler';
import {incrementAdjectives, adjectivesSentimentIncrement} from '../utils/tasteometer'

export default function ReviewPage({route}) {
    const navigation = useNavigation();
    const user = auth().currentUser;
    const restaurantData = route.params.restaurantData;
    var userReview = 'Your Review';
    

    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: false});
	  }, [navigation]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [review, setReview] = React.useState(userReview);

    // Images used for the stars
    const starIconCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
    const starIconFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';

    // Uploads all review contents to the database's 'reviews' collection
    async function uploadReview(){
        try{
            console.log('In the upload review function');
            var review_id = restaurantData.data.alias + '_' + user.uid + '_' + String(Date.now());
            //incrementAdjectives(review, restaurantData.data.alias);
            adjectivesSentimentIncrement(review,restaurantData.data.alias);
            //adjectivesSentimentIncrement(review,restaurantData.data.alias).forEach(result => console.log(result));

            await firebase.dbSet('reviews', review_id, {authorid: user.uid,
                                                        content: review,
                                                        datemade: new Date(),
                                                        image_urls: Get_Image_URLs(review_id),
                                                        restaurant_alias: restaurantData.data.alias,
                                                        star_atmos: atmosphereDefaultRating,
                                                        star_foods: foodDefaultRating,
                                                        star_service: serviceDefaultRating
                                                        });
            uploadPhotos();
        }
        catch (error){
            console.log(error)
        }
    }

    // firebase.dbFileAdd(images[0].fileName, images[0].realPath)
    var image_urls = []
    
    // Uploads user's review photos to the database storage.
    async function uploadPhotos(){
        try{
            images.map((image, index) => firebase.dbFileAdd(image_urls[index], image.path))
        }
        catch (error){
            console.log(error)
        }
    }

    // Creates an array of the uploaded photos, replacing their names with the review_id and identifier.
    function Get_Image_URLs(review_id){
        image_urls = images.map((image, index) => review_id + '_' + index)
        return image_urls
    }

    // Prompts user to select images to upload.
    const [images, setImages] = useState([]);
    async function GetPhotos(){
        try {
            await MultipleImagePicker.openPicker({
                mediaType:'image',
                multiple:true
            }).then(response => {setImages(response); console.log(response)})
            // setImages(response)
            // console.log('images[] = ', images)
        } catch (error){
            console.log(error.code, error.message)
        }
    }


    // Display user-selected images
    const RenderItem = ({image, index}) => {
        // console.log('img: ' , image);
        var is_portrait = image.height > image.width
        return(
            <Image
              style={styles.photo}
              width={is_portrait ? 110*(.75) : 110}
              height={is_portrait ? 110 : 110*(.75)} 
              source={{
                uri: image.path
          }}
        />
        )
    }

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
                        multiline={true}
                        onChange={(value) => changeReview(value.nativeEvent.text)}
                        defaultValue = {review}
                        maxLength ={1200}
                        />
                        <Text style={{color: review.length < 100? 'red' : "green", textAlign: 'center', paddingBottom: 5}}>
                            Min 100 Characters{'\n'}{review.length}/{1200}</Text>
                        <Button
                        title="go back"
                        onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </Modal>

                {/* Text that shows user's review after they finish typing */}
                <Text style = {styles.whiteText} placeholder="Your review">
                    {review}
                    <Text style = {styles.editButton} onPress={() => setModalVisible(true)}>{"\n\n"}Edit Review</Text>
                </Text>        
            </ScrollView>

            {/* Container for image upload and previews. */}
            <ScrollView horizontal={true} style={styles.photo_container} contentContainerStyle={styles.photo_content_container}>
                <Ionicons name='duplicate-outline' size={80} color='#73C9E0' 
                    onPress={async () => {console.log('Pressed add image icon'); GetPhotos()}}/>
                <FlatList
                  data={images}
                  renderItem={({item}) => <RenderItem image={item}/>}
                  keyExtractor={item => item.id}
                  numColumns={5} >
                </FlatList>
            </ScrollView>
            
            {/* Button for 'Submit Review' */}
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    // Send review content to the database
                    onPress={() => 
                        {if (review.length >= 100){
                            uploadReview();
                            navigation.goBack(null);
                            }
                        else {
                            console.warn('Review length too short: ', review.length)
                        }
                        } 
                    }
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
        fontSize: 20,
        color: 'white', 
        flex: .45,
        alignSelf: 'flex-start'
    },
    locationIcon: {
		color: 'white',
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
        fontSize: 15,
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
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop:10,
        marginBottom: 10,
        maxWidth: 370,
        width: 370,
        height: 200,
        maxHeight: 200,
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
        textAlignVertical: 'top',
        height: 300,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },

    starRatingsStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 1,
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
    photo_container: {
        horizontal: 'true',
        width: 380,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
    },
    photo_content_container: {
        alignItems:'center',
        paddingHorizontal: 5
    },
    photo: {
		marginLeft: 5,
		borderWidth: 1,
		borderColor: 'gray',
        alignSelf: 'center'
    }

})