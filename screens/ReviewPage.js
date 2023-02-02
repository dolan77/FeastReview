import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Modal } from 'react-native'
import React, {useState} from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import {Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ReviewPage() {
    const navigation = useNavigation();
    const user = auth().currentUser;
    var userReview = 'Your Review';

    React.useLayoutEffect(() => {
		navigation.setOptions({headerShown: true});
	  }, [navigation]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [review, setReview] = React.useState(userReview);


    const starIconCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
    const starIconFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';

    const [defaultRating, setdefaultRating] = useState(null);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5]);
    const StarRating = () => {
        return (
            <View style={styles.starRatingsStyle}>
                {
                    maxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setdefaultRating(item)}
                            >
                                <Image 
                                    style={styles.starImgStyle}
                                    source={
                                        item <= defaultRating
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
    
    function changeReview(userReview) {
        setReview(userReview)
    };
    
    
      return(
        <View style={styles.container1}>
            {/* Restaurant Name */}
            <Text style={styles.restaurantName}>
                    Restaurant Name
            </Text>
            
            <StarRating/>

            {/* Stars ratings placeholder */}

            <View style = {{flexDirection: 'row'}}>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
            </View>

            <View style = {{flexDirection: 'row'}}>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
            </View>

            <View style = {{flexDirection: 'row'}}>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
                <Ionicons style={styles.locationIcon} name= "star-outline" ></Ionicons>
            </View>

            {/* Text that contains the user's written review */}
            <View style = {styles.userReviewBox}>

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
                    />
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
        // flex: 1,
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        width: 380,
        borderRadius:10,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
    },
    editButton: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
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
        marginTop: 30,
    },
    starImgStyle:{
        width: 40,
        height: 40,
        resizeMode: 'cover',
    }

})