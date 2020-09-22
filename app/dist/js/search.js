function getSelectedPlaylist() {
	var playlist = getCookieByName("selected-playlist") || '*';
	if (playlist.length > 1) {
		playlist = urlDecode(playlist);
	}
	return playlist;
};
 
function setPageLoadDefaults(pattern, extended) {

	// Try to get search pattern from URL
	var url = null;
	var filter = null;
	var enabled = null;

	// Check if URL object supported
	try {
		url = new URL(window.location);
	} catch(e) {
		url = null;
	}

	// Check if create URL object succeeded
	if (!!url) {
		// Reap params from 'URL.searchParams'
		var params = url.searchParams;
		filter = params.get("filter");
		enabled = params.get("enabled");
	} else {
		// Get parameter values by parsing 'window.location.search'
		var params = urlParseParams(window.location.search);
		filter = params["filter"];
		enabled = params["enabled"];
	}
	
	// Set last search pattern in input component
	//   1. Use given URI parameters
	//   2. Use last parameter given by application
	var found = false;
	if (!found && !!filter) {			
		if (filter.length > 0) {
			found = true;
			$("#txtSearch").val(filter);				
			console.log('[search.js] Page called with filter pattern "' + filter + '"');
		}
	}
	if (!found && !!pattern) {			
		if (pattern.length > 0) {
			found = true;
			$("#txtSearch").val(pattern);
			console.log('[search.js] Set last used filter pattern "' + pattern + '"');
		}
	}

	// Set check box to enable filter by genre
	found = false;
	var value = false;
	if (!found && !!enabled) {
		found = true;
		value = "yes" === enabled;			
		console.log('[search.js] Page called with extended search "' + enabled + '"');
	}
	if (!found && !!extended) {
		found = true;
		value = "yes" === extended;			
		console.log('[search.js] Set last used extended search "' + extended + '"');
	}
	setCheckBoxValue("#chkFilterByGenre", value);
	console.log('[search.js] Filter by genre : ' + value);
};

function searchResultRefresh() {
	$("#search-result-body").load("search-result-body.html");
};

function getFirstWord(caption) {
	if (!!caption) {
		if (caption.length > 0) {
			var word = caption.substr(0, caption.indexOf(" "));
			if (!!word) {
				if (word.length > 0) {
					return urlEncode(word);
				}
			}	
			return urlEncode(caption);
		}
	}	
	return "_";
};

function executeSearchURL() {
	// Read radio group selection
	var didx = -1;
	var midx = -1;
	var domain = "";
	var media = "";

	// Get radio button selection	
	$('#search-input-domain :input').each(function() {
		var checked = $(this).attr('checked');
		if (!!checked) {
			var elem = $(this).next('label');
			if (!!elem) {
				domain = $(elem).text() || "";
				didx = $(elem).attr('index') || -1;
			}
		}
	});
	$('#search-input-media :input').each(function() {
		var checked = $(this).attr('checked');
		if (!!checked) {
			var elem = $(this).next('label');
			if (!!elem) {
				media = $(elem).text() || "";
				midx = $(elem).attr('index') || -1;
			}
		}
	});

	// Get sected gere from list box
	var genre = $("#lbxGenres").val() || "";

	// Get check box value to filter by genre
	var enabled = $("#chkFilterByGenre").hasClass("tagged");
	var value = enabled ? "yes" : "no";

	// Get search pattern from input	
	var filter = $("#txtSearch").val() || "";

	// Valid radio indexes found?	
	if (midx > -1 && didx > -1) {	

		// Construct search URI with parameters	
		var url = "/app/library/search.html?prepare=yes&title=search&filter=" + urlEncode(filter) + 
				"&domain=" + getFirstWord(domain) + "&type=" + getFirstWord(media) +
				"&genre=" + urlEncode(genre) + "&enabled=" + value;

		// Call page by URL parameter
		window.location.href = url;
		console.log('[search.js] Executed search URL "' + url + '"');

	} else {
		console.log('[search.js] Invalid parameters.');
	}
};

function sendSearchText() {

	// Read search data from HTML elements
	var filter = $("#txtSearch").val();

	// Create JSON object
	var data = {
		OnSearchData: "search",
		prepare: "yes",
		title: "search",
		Filter : filter 
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			console.log('Success: AJAX sendSearchText()');
		},
		error: function() {
			alert('Error: sendSearchText() failed.');
		}
	});
};


function onCoverClick(event) {
	var target = event.target || event.srcElement || event.originalTarget;
	var link = target.getAttribute('destination');
	window.location.href = link;
}


function onPlayArtistClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var artist = target.getAttribute('artist');
		var album = target.getAttribute('album');
		var hash = target.getAttribute('hash');
		var params = "OnLibraryClick=" + value + "&artist=" + artist + "&hash=" + hash + "&album=" + album;
		var json = { OnLibraryClick: value, artist: artist, hash: hash, album : album };
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + params,
			dataType: "json",
			data: json,
			success: function(data) {
				var album = data['Album'] || "";
				var artist = data['Artist'] || "";
				showButtonPopupMessage('Play artist "' + artist + '" now.', 'Play artist', album);
				onPlayActionSucceeded()
			},
			error: function() {
				alert('Error: onPlayArtistClick() failed.');
			}
		});
	} else {
        	alert('Error: onPlayArtistClick() undefined.');
	}
}

function onPlayAlbumClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var album = target.getAttribute('album');
		var hash = target.getAttribute('hash');
		var params = "OnLibraryClick=" + value + "&album=" + album + "&hash=" + hash;
		var json = { OnLibraryClick: value, album: album, hash: hash };
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + params,
			dataType: "json",
			data: json,
			success: function(data) {
				var hash = data['Hash'] || "";
				var album = data['Album'] || "";
				showButtonPopupMessage('Play album "' + album + '" now.', 'Play album', hash);
				onPlayActionSucceeded()
			},
			error: function() {
				alert('Error: onPlayAlbumClick() failed.');
			}
		});
	} else {
        	alert('Error: onPlayAlbumClick() undefined.');
	}
}

function onAddArtistClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var artist = target.getAttribute('artist');
		var album = target.getAttribute('album');
		var hash = target.getAttribute('hash');
		var params = "OnLibraryClick=" + value + "&artist=" + artist + "&hash=" + hash;
		var json = { OnLibraryClick: value, artist: artist, hash: hash };
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + params,
			dataType: "json",
			data: json,
			success: function(data) {
				var hash = data['Hash'] || "";
				var artist = data['Artist'] || "";
				var playlist = getSelectedPlaylist(); //data['Selected'] || "*";
				if (playlist !== "*") {
					showButtonPopupMessage('Add artist "' + artist + '" to "' + playlist + '"', 'Add artist', album);
				} else {
					showPopupErrorMessage('Please select playlist first.', 'Failure (Artist)');
				}
				onAddActionSucceeded()
			},
			error: function() {
				alert('Error: onAddArtistClick() failed.');
			}
		});
	} else {
        	alert('Error: onAddArtistClick() undefined.');
	}
}

function onAddAlbumClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var album = target.getAttribute('album');
		var hash = target.getAttribute('hash');
		var params = "OnLibraryClick=" + value + "&album=" + album + "&hash=" + hash;
		var json = { OnLibraryClick: value, album : album, hash: hash };
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + params,
			dataType: "json",
			data: json,
			success: function(data) {
				var hash = data['Hash'] || "";
				var album = data['Album'] || "";
				var playlist = getSelectedPlaylist(); //data['Selected'] || "*";
				if (playlist !== "*") {
					showButtonPopupMessage('Add album "' + album + '" to "' + playlist + '"', 'Add album', hash);
				} else {
					showPopupErrorMessage('Please select playlist first.', 'Failure (Album)');
				}
				onAddActionSucceeded()
			},
			error: function() {
				alert('Error: onAddAlbumClick() failed.');
			}
		});
	} else {
        	alert('Error: onAddAlbumClick() undefined.');
	}
}

function onPlayActionSucceeded() {
	window.location.href = "/app/playlist/nowplaying.html";
};

function onAddActionSucceeded() {
	console.log('[search.js] Add action succeeded.');
};


function onAnchorClick(event) {
	var nil = void(0);
	if (event.id.length > 0) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var value = event.getAttribute('value');
		if (value.length > 0) {		
			var found = false;
			if (!found && value === "EXECSEARCH") {
				// Execute search...
				executeSearchURL();
				onButtonClicked();
				found = true;
			}
			if (!found && value === "SHOWHELP") {
				showMessageDialog(
					'Search by tags...',
					'/searchhelp.html',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[search.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[search.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		console.log('[search.js] Click on button <' + target.id + '>');
		if (event.cancelable) {
			event.preventDefault();
		}
		var found = false;
		if (!found && target.id === "btnSearch") {
			// Post back configuration data
			found = true;
			$("#btnSearch").prop('disabled', true);
			executeSearchURL();
		}
		if (!found && target.id === "btnCancel") {
			found = true;
			$("#btnCancel").prop('disabled', true);
			console.log('[search.js] Disable cancel button.');
			sendButtonEvent(value);
		}
		if (!found) {
			// Send button click event
			var value = target.getAttribute('value');
			sendButtonEvent(value);
		}	
	} else {
        	alert('Error: onButtonClick() event target undefined.');
	}
}

function onButtonClicked() {
	var action = null;
	var button = $("#btnSearch")	
	if (button.prop('disabled')) {
		button.prop('disabled', false);
		searchResultRefresh();
		action = "Search in library";
	}
	button = $("#btnCancel")	
	if (button.prop('disabled')) {
		button.prop('disabled', false);
		$("#txtSearch").val('');
		$("#txtSearch").focus();
		action = "Cleared search input";
	}
	if (!!action) {
		console.log('[search.js] Async click on button, executed action <' + action + '>');
	}
};

function onCheckBoxChange(element) {
	var nil = void(0);
	if (element !== nil) {
		// Toggle tagged state class variable
		cbx = $(element);	
		cbx.toggleClass("tagged");
		console.log('[search.js] onCheckBoxChange: <' + cbx.attr('id') + '>, tagged = ' + cbx.hasClass("tagged"));
	} else {
        	alert('Error: onCheckBoxChange() element undefined.');
	}
};

function setCheckBoxValue(element, value) {
	var nil = void(0);
	if (element !== nil) {
		var $cbx = $(element);	
		if (value) {
			$cbx.addClass("tagged");
			$cbx.prop('checked', true);
		} else {
			$cbx.removeClass("tagged");
			$cbx.prop('checked', false);
		}
		console.log('[search.js] setCheckBoxEventValue: <' + $cbx.attr('id') + '>, tagged = ' + $cbx.hasClass("tagged"));
	} else {
        	alert('Error: setCheckBoxEventValue() element undefined.');
	}
};

function sendButtonEvent(value) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnButtonClick=" + value,
		success: function() {
			onButtonClicked();
		},
		error: function() {
			alert('Error: sendButtonEvent(' + value + ') failed.');
		}
	});
};

	   
function setButtonEvents() {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (button.hasAttribute("addClick")) {
			var value = button.getAttribute("addClick");
			if (value.toLowerCase() == "true") {
				button.onclick = onButtonClick;
			}
		}
	}
};


function setListBoxes() {
	$(".list-box-elements li a").click(function() {
		var nil = void(0);
		var value = $(this).text().trim();
		var input = $(this).parents('.list-box-elements').nextAll('.list-box-input');
		if (input !== nil) {
			$(input).val(value);
			var id = $(input).attr('id');
			console.log('Listbox <' + id + '> changed: ' + value);	
			if (id === "lbxDrivesXXX") {
				if (value[value.length-1] !== '/') {
					value += '/';
				}
				$("#edLibraryPath").val(value);
			}
		}
	});
};


function setRadioGroupEvents() {
	// Bind onclick() functions to entries
	$('#search-input-domain :input').each(function() {
		var id = this.id || "-";
		console.log('[search.js] setRadioGroupEvents() Add click event to radio button <' + id + '>');
		$(this).on('click', function(e) {
			var target = e.target || e.srcElement || e.originalTarget;
			if (void(0) != target) {
				$('#search-input-domain :input').removeAttr("checked");
				target.setAttribute("checked", "true");
				var id = target.id || "-";
				console.log('[search.js] Radio button <' + id + '> clicked.');
			}
		});
	});
	$('#search-input-media :input').each(function() {
		var id = this.id || "-";
		console.log('[search.js] setRadioGroupEvents() Add click event to radio button <' + id + '>');
		$(this).on('click', function(e) {
			var target = e.target || e.srcElement || e.originalTarget;
			if (void(0) != target) {
				$('#search-input-media :input').removeAttr("checked");
				target.setAttribute("checked", "true");
				var id = target.id || "-";
			}
		});
	});
};

function setSelectEvents() {
	$('.combobox').combobox({
		beforeShow: function() { $('select').blur(); }
	}).on("change", onSelectChange);
};


