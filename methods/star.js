import Ionicons from 'react-native-vector-icons/Ionicons';

export const starRating = (id, rating) => {
	let stars = []
	for(let i = 0; i < Math.floor(rating); i++) {
		stars.push(<Ionicons key={id + i} name="star" color="white" size={20} />);
	}

	if (rating % 1 !== 0) {
		stars.push(<Ionicons key={id + '0.5'} name="star-half" color="white" size={20} />);
	}

	return stars
}