import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import * as firebase from '../utils/firebase'
import * as yelp from '../utils/yelp'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';

import { requestLocationPermission } from '../utils/locationPermission.js'
import image from "../assets/feast_blue.png"
import Loader from '../methods/Loader';

export default function HomeScreen() {
	const user = auth().currentUser
	const [isFollowing, setIsFollowing] = useState(true)
	const [reviews, setReviews] = useState([])
	const [following, setFollowing] = useState([])
	const [followingPfp, setFollowingPfp] = useState([])
	const [reviewPhotos, setReviewPhotos] = useState([])
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true)
	const navigation = useNavigation()

	/**
	 * Requests the user for their permission to get there location
	 * Calls the getFollowers method
	 */
	useEffect(() => {
		const res = requestLocationPermission();
		res.then(() => {
			console.log("Got location")
		})
		.catch(() => {
			console.log("Failed to get location")
		})

		setReviews([])
		setFollowing([])
		setFollowingPfp([])
		setReviewPhotos([])
		getFollowers(user.uid)
	}, [])

	/**
	 * Refreshes the page to check for new reviews from following
	 */
	const onRefresh = useCallback(() => {
		setRefreshing(true);

		setReviews([])
		setFollowing([])
		setFollowingPfp([])
		setReviewPhotos([])
		getFollowers(user.uid)

		setTimeout(() => {
		  setRefreshing(false)
		}, 2000);
	  }, []);
	
	/**
	 * Gets the user's following and sets them to the reviews state
	 * Gets the following user's profile pic
	 * @param {*} uid user's unique id
	 */
	getFollowers = (uid) => {
		//get user data
		firebase.dbGet('users', uid)
		.then(userData => {

			//get list of users being followed
			firebase.dbGetFollowed(userData.following)
			.then(followingList => {

				//get individual users being followed
				followingList.forEach( (doc, key) => {

					// gets all user's reviews
					firebase.dbGetReviews(key, "authorid")
					.then(dbReviews => {

						// if there are reviews
						if (dbReviews.size !== 0) {
							setReviews(prev => [...prev, ...dbReviews]) //add users reviews to overall reviews list

							//individual reviews from user
							dbReviews.forEach((review, restaurant_alias) => {
								if (review.image_urls.length !== 0) {
									firebase.dbGetReviewPhotos(review.image_urls) //get all photos for the review
									.then(photos => {
										setReviewPhotos(prev => [...prev, {[key + restaurant_alias] : photos}]) // adds photo to list of all photos
									})
									.catch((error) => {
										console.log("Error with getting review photos: ", error)
									})
								}
							})
						}
					})
					.catch((error) => {
						console.log("Error with getting reviews: ", error)
						setLoading(false)
					})

					firebase.dbFileGetUrl('ProfilePictures/' + key)
					.then(url => {
                        setFollowingPfp(prev => [...prev, {"id": key, "pfp": url}]) // add pfp to all pfp list
                    })
					.catch((error) => {
						setLoading(false)
                        switch (error.code) {
                            case 'storage/object-not-found':
                              //console.log(passedinUID[i] + "File doesn't exist")
                              firebase.dbFileGetUrl('feast_blue.png').then(
                                url => {
                                    setFollowingPfp(prev => [...prev, {"id": key, "pfp": url}])
                                })
                            case 'storage/unauthorized':
                              //console.log(passedinUID[i] + "User doesn't have permission to access the object");
                              firebase.dbFileGetUrl('feast_blue.png').then(
                                url => {
                                    setFollowingPfp(prev => [...prev, {"id": key, "pfp": url}])
                                })
                              break;

                            case 'storage/unknown':
                              console.log("Unknown error occurred, inspect the server response")
                              break;
                        }
					})
					setFollowing(prev => [...prev, {"id": key, "name": doc.name}]) // add user to following list

					setTimeout(() => {
						setLoading(false);
					}, 1000);
				})
			})
			.catch((error) => {
				console.log("Error with getting following: ", error)
				setIsFollowing(false)
				setLoading(false)
			})
		})
		.catch((error) => {
			console.log("Error with getting user info: ", error)
			setLoading(false)
		})
	}

	/**
	 * Displays following profile pictures
	 */
	display = (id) => {
		try {
			const profile = followingPfp.find(user => user.id === id)
			return profile.pfp
		}
		catch {
			return undefined
		}
	}

	/**
	 * Get username of following user
	 */
	getUserName = (id) => {
		const followingUser = following.find(user => user.id === id)
		return followingUser.name
	}

	/**
	 * Displays "Read More" when clicked
	 * @param {*} onPress event
	 */
	renderReadMore = (onPress) => {
		return(
		  <Text onPress={onPress} style={[styles.reviewContent, {color: '#75d9fc', paddingTop: 0}]}>Read more</Text>
		)
	}

	/**
	 * Displays "Read Less" when clicked
	 * @param {*} onPress event
	 */
	renderReadLess = (onPress) => {
		return(
		  <Text onPress={onPress} style={[styles.reviewContent, {color: '#75d9fc', paddingTop: 0}]}>Read less</Text>
		)
	}

	/**
     * Method that will navigate the user to see another user's profile
     */
    const SeeOtherProfile = (otherUID) => {
        console.log("Moving to see the other profile: " + otherUID)
        
		navigation.navigate('OtherUserProfile', 
        {
            otherID: otherUID
        })

    }
	
	return (
		<View style = {styles.container}>
			{!isFollowing && 
				<Text style={{color: 'white', fontSize: 18}}>
					Start following Feasters to get started!!!
				</Text>
			}

			{(loading && isFollowing) && <Loader />}

			{/* ScrollView allows you to scroll down the feed */}

			{isFollowing && 
				<ScrollView 
					style={{flex:1, backgroundColor: '#3d4051'}}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{reviews.map(review => {
						return (
							<TouchableOpacity 
								style = {styles.reviewContainer} 
								key={review[0]} 
								onPress={() => SeeOtherProfile(review[1].authorid)}
							>
								<View style = {{flexDirection: "row"}}>
									<Image style = {styles.profileIcon} source={display(review[1].authorid) !== undefined ? {uri: display(review[1].authorid)} : image}/>
									<Text style = {styles.emailWrap}> {getUserName(review[1].authorid)}</Text>
								</View>

								<ViewMoreText
										numberOfLines={5}
										renderViewMore={renderReadMore}
										renderViewLess={renderReadLess}
										textStyle={styles.reviewContent}
									>
									<Text>
										{review[1].content}
									</Text>
								</ViewMoreText>

								{review[1].image_urls.length !== 0 && 
									<ScrollView horizontal={true} style={styles.photo_container} contentContainerStyle={styles.photo_content_container}>
										{reviewPhotos.map(images => {
											if (images[review[1].authorid + review[0]]) {
												return images[review[1].authorid + review[0]].map((image, i) => {
													return (
														<Image 
															key={image + i}
															source={{uri: image}} 
															style={{width: 100, height: 100, borderRadius: 10, margin: 2}}
														/>
													)
												})
											}
										})}
									</ScrollView>
								}

								<View style = {{flexDirection: "row"}}>
									<Ionicons style={styles.locationIcon} name="location-outline">
										<Text style={{color: 'white'}}> - </Text>
									</Ionicons>
									<Text style = {styles.restaurantName}>{review[1].restaurant_name}</Text>
								</View>
							</TouchableOpacity>
						)
					})}
				</ScrollView>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3d4051',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
	reviewContainer: {
		backgroundColor: '#5b628a',
		flex: 1,
		width: 360,
		justifyContent: 'center',
		alignSelf: 'center',
		margin: 5,
		borderRadius: 15,
		borderWidth: 1,
	},
	emailWrap: {
		flexWrap: 'wrap',
        flex: 2,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 15,
        justifyContent: 'center',
		alignSelf: 'center',
        paddingLeft: 5,
		paddingRight: 5,
        paddingTop: 5,
        fontSize: 20,
        color: 'white'
	},
	reviewContent: {
		padding: 10,
		color: 'white',
		fontSize: 14
	},
	locationIcon: {
		color: '#DF1616', 
		fontSize: 30, 
		marginLeft: 20, 
		marginBottom: 10,
	},
	restaurantName: {
		color: 'white',
		alignSelf: 'flex-start',
		marginTop: 5,
		fontSize: 18,
	},
	profileIcon: {
		width: 75,
		height: 75,
		marginLeft: 5,
		marginTop: 5,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'white',	
	},

	tempPicture: {
		backgroundColor: '#020878',
		width: 250,
		height: 250,
		flex: 1,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: 'black',
		alignSelf: 'center',
		margin: 3,
	},

	photo_container: {
        horizontal: 'true',
        width: 340,
        height: 100,
        margin: 5,
        alignSelf: 'center'
    },
	photo_content_container: {
        alignItems:'center',
        paddingHorizontal: 5,
    },
})
