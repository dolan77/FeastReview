import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image} from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';


import * as React from 'react';

export default function MessagesScreen(){
    return(
        <View>
            <View>
                <Text>This is the MessagesScreen</Text>
            </View>
        </View>
    );
}