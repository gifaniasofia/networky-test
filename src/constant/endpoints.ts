const urlStaticDataJSON = process.env.NEXT_PUBLIC_BASE_URL_JSON_DATA;

export default {
	authData: `${ urlStaticDataJSON }/auth.json`,
	homeData: `${ urlStaticDataJSON }/home.json`,
	navigationData: `${ urlStaticDataJSON }/navigation.json`,
	privacyData: `${ urlStaticDataJSON }/privacy.json`,
	termsData: `${ urlStaticDataJSON }/terms.json`,
	faqData: `${ urlStaticDataJSON }/faq.json`,
	contactData: `${ urlStaticDataJSON }/contact.json`,
	createEventData: `${ urlStaticDataJSON }/create.json`,
	publishData: `${ urlStaticDataJSON }/publish.json`,
	cancelEventData: `${ urlStaticDataJSON }/cancel.json`,
	googleMapsTimezone: 'https://maps.googleapis.com/maps/api/timezone/json',
	urlApiTimezone: '/api/timezone',
	googleMapsGeocode: 'https://maps.googleapis.com/maps/api/geocode/json',
	urlApiGeocode: '/api/geocode'
};