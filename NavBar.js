import * as React from 'react';
// import { View, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

// Screens
import HomeScreen from './screens/HomeScreen'
// import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './screens/UserProfileScreen'


// Screen names
const homeName = 'Home';
const searchName = 'Search';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

export default function NavBar() {
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconname;
                        let rn = route.name;

                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (rn === searchName) {
                            iconName = focused ? 'search' : 'search-outline'
                        } else if (rn === profileName) {
                            iconName = focused ? 'person' : 'person-outline'
                        }

                        return <Ionicons name = {iconName} size = {size} color = {color}/>  // this can be put on the individual icons above for custom effects
                    }
            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
            {/* todo: need to create the search screen */}
            <Tab.Screen name={searchName} component={HomeScreen}/>   
            <Tab.Screen name={profileName} component={ProfileScreen}/>


            </Tab.Navigator>
        </NavigationContainer>
    )
}