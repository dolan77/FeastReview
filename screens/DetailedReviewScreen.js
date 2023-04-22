import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, Modal, SafeAreaView, TextInput} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';
import * as firebase from '../utils/firebase'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { starRating } from '../methods/star';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FeastHeader } from '../utils/components';

export default function DetailedReviewScreen({route}){
    const user = auth().currentUser;
    
    const reviewID = route.params[0];
    const reviewData = route.params[1];
    const navigation = useNavigation();


    React.useEffect(() => {
        retrieveComments();
        retrievePhotos();
        console.log('Running useEffect')
    }, []);

    var newComment = '';
    const [comment, setComment] = React.useState(newComment);
    const [modalVisible, setModalVisible] = React.useState(false);
    

    const [dbComments, setdbComments] = React.useState('')

    // Uploads the comment into the related review's "comments" collection.
    async function uploadComment(){
        try{
            console.log('In the upload comment function');
            var comment_id = user.uid + '_' + String(Date.now());
            await firebase.dbSetReviewComment(reviewID, comment_id, 
                                                {authorid: user.uid,
                                                content: comment,
                                                datemade: new Date(),
                                                reviewid: reviewID,
                                                username: user.displayName,
                                                });
            retrieveComments()
            setComment('')
        }
        catch (error){
            console.log(error)
        }
    }


    const retrieveComments = async () => {
        await firebase.dbGetReviewComments(reviewID).then(result => {setdbComments([...result])});
    }

    const [reviewPhotos, setReviewPhotos] = React.useState([])
    const retrievePhotos = async () => {
        await firebase.dbGetReviewPhotos(reviewData.image_urls).then((result) => {setReviewPhotos(result)});
    }
    

    const PopulateComments = () => {
        let table = [];

        for (let i = 0; i < dbComments.length; i++){
            table.push(
                <TouchableOpacity style={[style.ReviewBox, {marginHorizontal: 10}]} key={i} 
                onPress={() => navigation.navigate('OtherUserProfile', 
                {
                    otherID: dbComments[i].authorid
                })}>
                    <Text style={[style.whiteText, style.ReviewHeader]}>{dbComments[i].username}</Text>
                    <Text style={[style.whiteText, style.ReviewHeader]}>{dbComments[i].datemade.toDate().toLocaleString()}</Text>
                    <Text style={[style.ReviewBoxItems, style.ReviewText]}>{dbComments[i].content}</Text>
                </TouchableOpacity>
            )
        }
        return table;        
    }

    const PopulateReviewPhotos = () => {
        return reviewPhotos.map((photo, i) => {
            return <Image style={[style.photo]} source={{uri:photo}} key={i} />
        })
    }

    const reviewAverage = ((reviewData.star_atmos + reviewData.star_foods + reviewData.star_service) /3)


    return(
        <SafeAreaView style={style.container}>

            {/* Header of the page that contains "Review" and the back arrow. */}
            <FeastHeader title={"Review"} onPress={() => navigation.goBack()}/>

            
            <ScrollView style={[{marginTop:5,}]}>

                {/* Container for the main review we are viewing comments of */}
                <View style={[style.ReviewBox, {marginBottom: 15}]}>
                    <Text style={[style.whiteText, style.ReviewHeader]}>{reviewData.username}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{starRating(0, reviewAverage)}</Text>
                    <Text style={[style.whiteText, style.ReviewHeader, {color:'#63B8D6'}]}>{reviewData.restaurant_name}</Text>
                    <Text style={[style.whiteText, style.ReviewHeader]}>{reviewData.datemade.toDate().toDateString()}</Text>
                    <Text style={[style.ReviewBoxItems, style.ReviewText, {paddingBottom: 5}]}>{reviewData.content}</Text>
                    
                    {/* Container for the review's photos */}
                    {reviewPhotos.length > 0 &&
                    <ScrollView horizontal={true} style={style.photo_container} contentContainerStyle={style.photo_content_container}>
                        {PopulateReviewPhotos()}
                    </ScrollView>
                    }
                    

                    {/* Button to leave a comment */}
                    <TouchableOpacity style={style.commentButton} onPress={() => [console.log('pressed'), setModalVisible(true)]}>
                        <Ionicons style={[style.globalFont, {color: '#75d9fc'}]} name='chatbox-ellipses-outline'/>
                        <Text style={{color: '#75d9fc'}}>  Leave a comment</Text>
                    </TouchableOpacity>

                    {/* POPUP when user is writing the text for the comment */}
                    <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                        <View style={style.modalView}>
                            <Text style = {[style.ReviewBoxItems]}>Write a comment:</Text>
                            <TextInput
                            style = {style.input}
                            multiline={true}
                            onChange={(value) => setComment(value.nativeEvent.text)}
                            placeholder= "Write your comment here...."
                            maxLength ={1000}
                            />
                            <Text style={{color: comment.length < 20? 'red' : "green", textAlign: 'center', paddingBottom: 5}}>
                                Min 20 Characters{'\n'}{comment.length}/{1000}</Text>
                            
                            {/* View that holds the exit buttons in "Add Comment" */}
                            <View style = {style.filterExitButtonsContainer}>
                                {/* "Go Back" button */}
                                <TouchableOpacity
                                    onPress={() => [setModalVisible(false)]}
                                    style={style.exitButtons} >
                                    <Text style={style.buttonText}>Back</Text>
                                </TouchableOpacity>
                                {/* Comment "Submit" button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (comment.length >= 20){
                                            uploadComment();
                                            setModalVisible(false);
                                            }
                                        else{
                                        Alert.alert('Comment too short.') 
                                        }
                                        }
                                    }
                                    style={style.exitButtons} >
                                    <Text style={style.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Container for all comments made on review */}
                    
                        <View style={{marginBottom:15}}>
                            {dbComments.length > 0 ? PopulateComments() : <Text style={[style.globalFont, {alignSelf: 'center'}]}>No comments have been written yet....</Text>}
                        </View>
                </ScrollView>
            

        </SafeAreaView>
        
    )
}

const style = StyleSheet.create({
    buttonText: {
		color: 'black',
		fontWeight: '700',
		fontSize: 16
	},
    commentButton: {
        paddingLeft: 10,
        flexDirection: 'row',
        color: '#75d9fc'
    },
    container:{
        flex: 1,
        backgroundColor: '#3d4051',
    },
    exitButtons:{
		backgroundColor: '#75d9fc',
		width: '100%',
		padding: 15,
		borderRadius: 50,
		alignItems: 'center',
		width: 120,
		margin: 10,
		marginTop: 10,
	},
    filterExitButtonsContainer:{
		flexDirection: 'row', 
		justifyContent: 'center',
	},
    globalFont: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
    input: {
        textAlignVertical: 'top',
        height: 200,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    modalView: {
        margin: 20,
        height: 400,
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
    photo: {
		marginLeft: 5,
		borderWidth: 1,
		borderColor: 'gray',
        alignSelf: 'center',
        height: 110,
        width: 110*.75,
    },
    photo_container: {
        horizontal: 'true',
        width: 360,
        height: 100,
        // borderWidth: 1,
        borderRadius: 10,
        margin:5,
        // borderColor: 'white',
        alignSelf: 'center'
    },
    photo_content_container: {
        alignItems:'center',
        paddingHorizontal: 5,
    },
    ReviewBox: {
        backgroundColor: '#3f3a42',
        bordercolor: 'black',
        borderWidth: 3,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 10,
        justifyContent: 'center',
        paddingVertical: 10,
    },
    ReviewBoxItems:{
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    ReviewHeader: {
        paddingHorizontal: 10
    },
    ReviewText: {
        color: 'white',
        fontsize: 12,
        fontWeight: '650'
    },
    whiteText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
})