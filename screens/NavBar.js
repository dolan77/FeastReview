import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './HomeScreen';
import ProfileScreen from './UserProfileScreen';
import SearchScreen from './SearchScreen';
import ReviewsScreen from './ReviewsScreen';
import MessagesScreen from './MessagesScreen';
import FollowersScreen from './FollowersScreen';
import FollowingScreen from './FollowingScreen';
import RestaurantProfileScreen from './RestaurantProfileScreen';
import OtherUserProfileScreen from './OtherUserProfileScreen';
import CreateReviewScreen from './CreateReviewScreen';
import FollowersAndFollowingScreen from './FollowersAndFollowingScreen';
import SavedRestaurantsScreen from './SavedRestaurantsScreen';
import DetailedReviewScreen from './DetailedReviewScreen';
import colors from '../utils/colors'
import EditProfileScreen from './EditProfileScreen';

// Screen names
const homeName = 'Home';
const searchName = 'Search';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

// Stack screens for each tab
const HomeStack = () => <StackScreens initial_route='Home Screen'/>
const SearchStack = () => <StackScreens initial_route='Search Screen'/>
const ProfileStack = () => <StackScreens initial_route='Your Profile'/>

// Creates a bottom tab navigator with three buttons: home, search, and outline. Pressing each of the buttons will
// take you to its corresponding screens.
export default function NavBar({A_Stack}) {
    const AppStack = A_Stack;
    return(
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, size}) => {
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

                        return <Ionicons name = {iconName} size = {size} color = {colors.feastBlueDark}/>  // This can be put on the individual icons above for custom effects
                    }
                })}
            >

                <Tab.Screen options={{headerShown: false}} name={homeName} component={HomeStack}/>
                <Tab.Screen options={{headerShown: false}} name={searchName} component={SearchStack}/>   
                <Tab.Screen options={{headerShown: false}} name={profileName} component={ProfileStack}/>

            </Tab.Navigator>
    )
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator()

function StackScreens(props) {
    return(
        <Stack.Navigator  initialRouteName={props.initial_route}>
				<Stack.Screen options={{ headerShown: false }} name="Home Screen" component={HomeScreen} />
                <Stack.Screen options={{ headerShown: false }} name='Search Screen' component={SearchScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Your Profile" component={ProfileScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Reviews" component={ReviewsScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Messages" component={MessagesScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Followers" component={FollowersScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Following" component={FollowingScreen} />
				<Stack.Screen options={{ headerShown: false }} name="RestaurantProfile" component={RestaurantProfileScreen} />
				<Stack.Screen options={{ headerShown: false }} name="OtherUserProfile" component={OtherUserProfileScreen}/>
				<Stack.Screen options={{ headerShown: false }} name="Create Review" component={CreateReviewScreen} />
				<Stack.Screen options={{ headerShown: false }}name='FollowersAndFollowing' component={FollowersAndFollowingScreen}/>
                <Stack.Screen options={{ headerShown: false}}name='SavedRestaurants' component = {SavedRestaurantsScreen} />
                <Stack.Screen options={{ headerShown: false}}name="Detailed Review Screen" component={DetailedReviewScreen} />
                <Stack.Screen options={{ headerShown: false}}name="EditProfile" component={EditProfileScreen} />
			</Stack.Navigator>
    )
}
