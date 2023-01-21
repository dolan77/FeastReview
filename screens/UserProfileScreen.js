import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';

const styles = StyleSheet.create({

    flexbio:{},

    tinyLogo: {
        width: 150,
        height: 150
    }
})

export default function UserProfileScreen(){
    const navigation = useNavigation();
    return(
    <View>
        <View>
            
            <Image style = {styles.tinyLogo} source ={image}/>
            <Text>This is a temp bio</Text>
        </View>
        <View>

        <Button title = "Reviews" onPress={() => navigation.navigate('Reviews')} />

        <Button title = "Followers" onPress={() => navigation.navigate('Followers')} />
            
        <Button title = "Following" onPress={() => navigation.navigate('Following')} />

        <Button title = "Messages" onPress={() => navigation.navigate('Messages')} />

        </View>
    </View>
    );
}
