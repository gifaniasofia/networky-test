export const formatDateTime = (start_date?: string, start_time?: number): string  => {

	if (!start_date || !start_time) {
		return '-';
	}

	// Convert start_date to a Date object
	const dateObj = new Date(start_date);

	// Get the day and month in the desired format
	const day = dateObj.toLocaleString('en-us', { day: 'numeric' });
	const month = dateObj.toLocaleString('en-us', { month: 'short' });

	// Convert start_time to a Date object for time conversion
	const timeObj = new Date(start_time * 1000); // Multiply by 1000 to convert seconds to milliseconds

	// Get the hours and minutes in 12-hour format
	const hours = timeObj.toLocaleString('en-us', { hour: 'numeric', hour12: true });
	// const minutes = timeObj.toLocaleString('en-us', { minute: 'numeric' });

	// Combine the date and time in the desired format
	const formattedDateTime = `${month} ${day} | ${hours}`;

	return formattedDateTime;
};