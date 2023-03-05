import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const map = (restaurants, location) => {

	/**
	 * Creates a marker for the map
	 * @param {*} restaurant restaurant object
	 * @param {*} index number of restaurant in the list
	 * @return returns a marker of that restaurant
	 */
	makeMarker = (restaurant, index) => {
		const title = (index + 1) + '. ' + restaurant.name
		return (
			<Marker
				key={index}
				coordinate={{latitude: restaurant.coordinates.latitude,
				longitude: restaurant.coordinates.longitude}}
				title={title}
			/>
		)
	}
	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				initialRegion={{
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
				}}
			>
				{restaurants.map((restaurant, index) => (
					makeMarker(restaurant, index)
				))}
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: -10
	},
	map: {
		width: '100%',
		height: '90%',
		
	}
})