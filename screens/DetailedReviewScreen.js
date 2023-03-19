import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, useState, SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';
import * as firebase from '../utils/firebase'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DetailedReviewScreen({route}){
    const reviewID = route.params[0];
    const reviewData = route.params[1];
    const navigation = useNavigation();

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
              style={styles.photo}
              width={is_portrait ? 110*(.75) : 110}
              height={is_portrait ? 110 : 110*(.75)} 
              source={{
                uri: image.path
          }}
        />
        )
    }


    return(
        <SafeAreaView style={style.container}>
            <View style={style.header}>
                <Text style={[style.globalFont]}>Review</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[style.globalFont, style.backArrow]} name='arrow-back-outline'/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[style.ReviewBox, {marginHorizontal: 10}]}>
                <Text style={[style.buttonText, style.ReviewHeader]}>{reviewData.username}</Text>
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

                <TouchableOpacity style={style.commentButton} onPress={() => console.log('pressed')}>
                    <Ionicons style={[style.globalFont, {color: '#75d9fc'}]} name='chatbox-ellipses-outline'/>
                    <Text style={{color: '#75d9fc'}}>  Leave a comment</Text>
                </TouchableOpacity>
            </TouchableOpacity>


            <ScrollView>
                <View>
                    <Text style={{color:'white'}} onPress={() => {[console.log(reviewID, '\n', reviewData), console.log(auth().currentUser)]}}>placeholder</Text>
                </View>
            </ScrollView>

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
        justifyContent: 'center',
        paddingVertical: 10
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