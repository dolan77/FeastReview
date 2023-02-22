import FollowersScreen from "./FollowersScreen";
import FollowingScreen from "./FollowingScreen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';

const Tab = createMaterialTopTabNavigator();
export default function FollowersAndFollowing({route}){
    // https://stackoverflow.com/questions/60439210/how-to-pass-props-to-screen-component-with-a-tab-navigator

    return(
        <Tab.Navigator>
            <Tab.Screen name="following" children={() => <FollowingScreen followingUID={route.params.following} followingNames={route.params.following_names}/>}/>
            <Tab.Screen name="followers" children={() => <FollowersScreen followersUID={route.params.followers} followersNames={route.params.followers_names}/>}/>
        </Tab.Navigator>
    )
}