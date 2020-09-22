
function getWikipediaArtistSearchUrl(artist) {
	if (artist !== "") {	
		var uri = "https://en.wikipedia.org/wiki/Special:Search?search=" + urlEncode(artist);
		return uri;
	}
	return "";
};

