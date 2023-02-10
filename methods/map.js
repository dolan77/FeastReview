import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const map = (restaurants, location) => {
	return (
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
	)
}

const styles = StyleSheet.create({
	map: {
		width: '100%',
		height: '50%'
	}
})