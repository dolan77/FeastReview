import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';

export default function ReviewsScreen({route, navigation}){
    // dbID is the ID of a restaurant/Feaster. type = where we pull the info from
    const {dbID, type} = route.params;


    return(
        <View>
            <View>
                <Text>This is ReviewsScreen</Text>
            </View>
        </View>
    );

}