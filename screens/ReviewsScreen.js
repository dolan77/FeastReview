import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';

export default function ReviewsScreen({route}){
    // dbID is the ID of a restaurant/Feaster. type = where we pull the info from
    const dbID = route.params.dbID;
    const reviewType = route.params.type

    const PopulateReviews = async (reviewType) => {
        
    }
    // if the reviewType is a user. we get all reviews by the user
    if (reviewType === 'user'){

    }
    // the reviewType is a restaurant, so we get all reviews for that restaurant
    else{

    }
    return(
        <View>
            <View>
                <Text>This is ReviewsScreen</Text>
            </View>
            <View>
                {PopulateReviews()}
            </View>
        </View>
    );

}