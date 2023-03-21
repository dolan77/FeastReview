import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, useState, SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';
import * as firebase from '../utils/firebase'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DetailedReviewScreen({route}){
    const user = auth().currentUser;
    
    const reviewID = route.params[0];
    const reviewData = route.params[1];
    const navigation = useNavigation();

    React.useEffect(() => {
        firebase.dbGetReviewComments(reviewID).then(result => {setdbComments([...result])});
        console.log('Running useEffect')
    }, []);

    var newComment = 'Your comment';
    const [comment, setComment] = React.useState(newComment);

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
        }
        catch (error){
            console.log(error)
        }
    }

    // const [reviewPhotos, setReviewPhotos] = React.useState();
    // const getReviewPhotos = async() => {
    //     try{
    //         await {

    //         }
    //     }
    // }


    // Display review images
    const RenderItem = ({image, index}) => {
        // console.log('img: ' , image);
        var is_portrait = image.height > image.width
        return(
            <Image
              style={style.photo}
              width={is_portrait ? 110*(.75) : 110}
              height={is_portrait ? 110 : 110*(.75)} 
              source={{
                uri: image.path
          }}
        />
        )
    }

    const PopulateComments = () => {
        let table = [];

        for (let i = 0; i < dbComments.length; i++){
            table.push(
                <TouchableOpacity style={[style.ReviewBox, {marginHorizontal: 10}]} key={i} onPress={() => [console.log(dbComments[i])]}>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{dbComments[i].username}</Text>
                    <Text style={[style.buttonText, style.ReviewHeader]}>{dbComments[i].datemade.toDate().toDateString()}</Text>
                    <Text style={[style.ReviewBoxItems, style.ReviewText]}>{dbComments[i].content}</Text>
                </TouchableOpacity>
            )
        }
        return table;        
    }


    return(
        <SafeAreaView style={style.container}>

            {/* Header of the page that contains "Review" and the back arrow. */}
            <View style={style.header}>
                <Text style={[style.globalFont]}>Review</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[style.globalFont, style.backArrow]} name='arrow-back-outline'/>
                </TouchableOpacity>
            </View>

            {/* Container for the main review we are viewing comments of */}
            <TouchableOpacity style={[style.ReviewBox]} onPress={() => [console.log(dbComments)]}>
                <Text style={[style.buttonText, style.ReviewHeader]}>{reviewData.username}</Text>
                <Text style={[style.buttonText, style.ReviewHeader, {color:'#63B8D6'}]}>{reviewData.restaurant_name}</Text>
                <Text style={[style.buttonText, style.ReviewHeader]}>{reviewData.datemade.toDate().toDateString()}</Text>
                <Text style={[style.ReviewBoxItems, style.ReviewText]}>{reviewData.content}</Text>
                
                <ScrollView horizontal={true} style={style.photo_container} contentContainerStyle={style.photo_content_container}>
                {/* <FlatList
                  data={images}
                  renderItem={({item}) => <RenderItem image={item}/>}
                  keyExtractor={item => item.id}
                  numColumns={5} >
                </FlatList> */}
                </ScrollView>

                <TouchableOpacity style={style.commentButton} onPress={() => [console.log('pressed'), uploadComment()]}>
                    <Ionicons style={[style.globalFont, {color: '#75d9fc'}]} name='chatbox-ellipses-outline'/>
                    <Text style={{color: '#75d9fc'}}>  Leave a comment</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            {/* Container for all comments made on review */}
            {/* <View> */}
                <ScrollView style={[{marginTop:5}, , {borderTopWidth:2}, {borderWidth:1}]}>
                    <View>
                        <Text style={{color:'white'}} onPress={() => {[console.log(reviewID, '\n', reviewData), console.log('\ntypeof ', dbComments)]}}>
                            placeholder
                        </Text>
                        {dbComments.length > 0 ? PopulateComments() : <Text style={[style.globalFont, {alignSelf: 'center'}]}>No comments have been written yet....</Text>}
                    </View>
                </ScrollView>
            {/* </View> */}
            

        </SafeAreaView>
        
    )
}

const style = StyleSheet.create({
    buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
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
    globalFont: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
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
    photo: {
		marginLeft: 5,
		borderWidth: 1,
		borderColor: 'gray',
        alignSelf: 'center'
    },
    photo_container: {
        horizontal: 'true',
        width: 360,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        margin:5,
        borderColor: 'white',
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
})