export const timeConvert = (time) => {
	// Check correct time format and split into components
	time = time.toString ().match (/^([01]\d|2[0-3])([0-5]\d)?$/) || [time]

	if (time.length > 1) {
	  time = time.slice (1);  // Remove full string match value
	  time[3] = + time[0] < 12 ? 'AM' : 'PM' // Set AM/PM
	  time[1] = ':' + time[1] // add :
	  time[0] = + time[0] % 12 || 12 // Adjust hours
	}
	
	return time.join('')
}

