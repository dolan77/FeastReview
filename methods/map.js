import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const map = (restaurants, location) => {
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
					<Marker
						key={index}
						coordinate={{latitude: restaurant.coordinates.latitude,
							longitude: restaurant.coordinates.longitude}}
						title={restaurant.name}
					/>
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