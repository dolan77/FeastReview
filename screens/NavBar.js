import * as React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Ionicons } from '@expo/vector-icons';

// Screens
import ProfileScreen from './UserProfileScreen';
import SearchScreen from './SearchScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import UserProfileScreen from './UserProfileScreen';
import ReviewsScreen from './ReviewsScreen';
import MessagesScreen from './MessagesScreen';
import FollowersScreen from './FollowersScreen';
import FollowingScreen from './FollowingScreen';
import RestaurantProfileScreen from './RestaurantProfileScreen';
import OtherUserProfileScreen from './OtherUserProfileScreen';
import RegisterScreen from './RegisterScreen';
import CreateReviewScreen from './CreateReviewScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Screen names
const homeName = 'Home';
const searchName = 'Search';
const profileName = 'Profile';

const Stack = createNativeStackNavigator()
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

                <Tab.Screen name={homeName} component={StackScreens}/>
                <Tab.Screen name={searchName} component={StackScreens}/>   
                <Tab.Screen name={profileName} component={StackScreens}/>


            </Tab.Navigator>
    )

	function StackScreens(){
		return (
			<Stack.Navigator initialRouteName='Login'>
				<Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
		        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Your Profile" component={UserProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Messages" component={MessagesScreen} />
				<Stack.Screen name="Followers" component={FollowersScreen} />
				<Stack.Screen name="Following" component={FollowingScreen} />
				<Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
				<Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen}/>
                <Stack.Screen name="Search" component={SearchScreen}/>
                <Stack.Screen name="Create Review" component={CreateReviewScreen} />
			</Stack.Navigator>
		)
	}
}