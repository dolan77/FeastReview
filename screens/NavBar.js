import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './HomeScreen';
import ProfileScreen from './UserProfileScreen';
import SearchScreen from './SearchScreen';

import LoginScreen from './LoginScreen';
import ReviewsScreen from './ReviewsScreen';
import MessagesScreen from './MessagesScreen';
import FollowersScreen from './FollowersScreen';
import FollowingScreen from './FollowingScreen';
import RestaurantProfileScreen from './RestaurantProfileScreen';
import OtherUserProfileScreen from './OtherUserProfileScreen';
import CreateReviewScreen from './CreateReviewScreen';
import FollowersAndFollowingScreen from './FollowersAndFollowingScreen';



// Screen names
const homeName = 'Home';
const searchName = 'Search';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

// Creates a bottom tab navigator with three buttons: home, search, and outline. Pressing each of the buttons will
// take you to its corresponding screens.
export default function NavBar({A_Stack}) {
    const AppStack = A_Stack;
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
                })}
            >

                <Tab.Screen options={{headerShown: false}} name={homeName} component={HomeScreens}/>
                <Tab.Screen options={{headerShown: false}} name={searchName} component={SearchScreens}/>   
                <Tab.Screen options={{headerShown: false}} name={profileName} component={ProfileScreens}/>

            </Tab.Navigator>
    )
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator()

function HomeScreens() {
    return(
        <Stack.Navigator  initialRouteName='Home Screen'>
				<Stack.Screen name="Home Screen" component={HomeScreen} />
				<Stack.Screen name="Your Profile" component={ProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Messages" component={MessagesScreen} />
				<Stack.Screen name="Followers" component={FollowersScreen} />
				<Stack.Screen name="Following" component={FollowingScreen} />
				<Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
				<Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen}/>
				<Stack.Screen name="Create Review" component={CreateReviewScreen} />
				
			</Stack.Navigator>
    )
}

function SearchScreens() {
    return(
        <Stack.Navigator  initialRouteName='Search Screen'>
				<Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name='Search Screen' component={SearchScreen} />
				<Stack.Screen name="Your Profile" component={ProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Messages" component={MessagesScreen} />
				<Stack.Screen name="Followers" component={FollowersScreen} />
				<Stack.Screen name="Following" component={FollowingScreen} />
				<Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
				<Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen}/>
				<Stack.Screen name="Create Review" component={CreateReviewScreen} />
				
			</Stack.Navigator>
    )
}

function ProfileScreens() {
    return(
        <Stack.Navigator initialRouteName="Your Profile Screen">
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Your Profile Screen" component={ProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Messages" component={MessagesScreen} />
				<Stack.Screen name="Followers" component={FollowersScreen} />
				<Stack.Screen name="Following" component={FollowingScreen} />
				<Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
				<Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen}/>
				<Stack.Screen name="Create Review" component={CreateReviewScreen} />
                <Stack.Screen name='FollowersAndFollowing' component={FollowersAndFollowingScreen}/>
				
			</Stack.Navigator>
    )
}