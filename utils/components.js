import * as React from 'react';
import {View, Text, TouchableOpacity, Pressable, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'
import { useNavigation } from '@react-navigation/core';
import { starRating } from '../methods/star.js';
import {businessDetail} from '../utils/yelp'

/**
 * Component used for headers
 * Pass two parameters as properties or else there will be error probably
 * @param title, name on top of header
 * @param onPress, function for the back arrow, usually navigate back
 */
export class FeastHeader extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (<View style={styles.header}>
            <TouchableOpacity onPress={this.props.onPress}>
                <Ionicons style={[styles.globalFont, styles.backArrow]} name='arrow-back-outline'/>
            </TouchableOpacity>
            <Text style={[styles.globalFont]}>{this.props.title}</Text>
        </View>);
    }
}

/**
 * Review
 * @param restaurant, restaurant data object from searching function
 * @param yelpKey, yelp key
 * @param navigation, the navigation object
 * @index index, 
 * 
 */
export class FeastReview extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Pressable 
                key={this.props.restaurant.id} 
                onPress={() => {
                    // Dylan Huynh: allows the user to be redirected to the restaurant profile of the restaurant they selected.
                    try {
                        businessDetail(this.props.restaurant.alias, this.props.yelpKey).then(result => {this.props.navigation.navigate('RestaurantProfile', {data: result})})

                    } catch (error) {
                        console.log(error)
                    }

                    
                }}
            >
                <View style={styles.restaurant}>
                    <Image 
                        style={styles.logo}
                        source={{uri: this.props.restaurant.image_url}} 
                    />
                    <View style={{flex: 1, marginLeft: 5}}>
                        <Text style={styles.restaurantText}>{this.props.index + 1}. {this.props.restaurant.name}</Text>
                        <Text style={styles.restaurantText}>
                            {starRating(this.props.restaurant.id, this.props.restaurant.rating)} {this.props.restaurant.rating}
                        </Text>
                        <Text style={{
                            fontSize: 17, 
                            flexShrink: 1, 
                            flexWrap: 'wrap', 
                            color: colors.goodGreen
                        }}>
                            {`Open`}
                        </Text>
                        <Text style={styles.restaurantText}>{this.props.restaurant.location.address1}</Text>
                    </View>
                </View>
            </Pressable>
        )
    }
}

const styles = {
    globalFont:{
        color: colors.white,
        fontSize: 20,
        fontWeight: '500', 
    },
    header: {
        backgroundColor: colors.black,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backArrow: {
        fontSize: 40
    },
    restaurant: {
		width: '100%',
		backgroundColor: colors.backgroundDarker,
		borderRadius: 25,
		height: 150,
		marginBottom: 20,
		padding: 20,
		flexDirection:'row',
		flexWrap: 'wrap',
	},
	restaurantText: {
		color: colors.white,
		fontSize: 17,
		flexShrink: 1,
		flexWrap: 'wrap',
	},
    logo: {
		width: 125,
		height: 115,
		borderRadius: 15,
	},
}