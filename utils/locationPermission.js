import { PermissionsAndroid } from 'react-native';

/**
 * display location permission to user (android)
 */
async function requestLocationPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
			title: 'Geolocation Permission',
			message: 'Can we access your location?',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK',
			},
		);

		console.log('granted', granted);

		if (granted === 'granted') {
			console.log('You can use Geolocation');
			return true;
		} 
		else {
			console.log('You cannot use Geolocation');
			return false;
		}
	} 
	catch (err) {
		return false;
	}
};

module.exports = {requestLocationPermission}