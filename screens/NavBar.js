import * as React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './HomeScreen';
// import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './UserProfileScreen';


// Screen names
const homeName = 'Home';
const searchName = 'Search';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

export default function NavBar() {
    return(
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let rn = route.name;
                        
                        // Icons for the navigation bar.
                        // The 'outline' version of the icon makes it less bold, meaning it's not currently selected
                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (rn === searchName) {
                            iconName = focused ? 'search' : 'search-outline'
                        } else if (rn === profileName) {
                            iconName = focused ? 'person' : 'person-outline'
                        }

                        return <Ionicons name = {iconName} size = {size} color = {color}/>  // This can be put on the individual icons above for custom effects
                    }
            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
            {/* todo: need to create the search screen */}
            <Tab.Screen name={searchName} component={HomeScreen}/>   
            <Tab.Screen name={profileName} component={ProfileScreen}/>


            </Tab.Navigator>
    )
}