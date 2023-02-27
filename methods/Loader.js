import { StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native'

export default function Loader() {
	return (
		<View style={[StyleSheet.absoluteFillObject, styles.container]}>
			<Lottie source={require('../assets/loading.json')} autoPlay loop/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		zIndex: 1
	}
})
