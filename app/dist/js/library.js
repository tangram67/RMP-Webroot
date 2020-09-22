function getSelectedPlaylist() {
	var playlist = getCookieByName("selected-playlist");
	if (!!playlist) {
		if (playlist.length > 0) {
			playlist = urlDecode(playlist);
		} else {
			playlist = '*';
		}
	} else {
		playlist = '*';
	}
	return playlist;
}

function onCoverClick(event) {
	var target = event.target || event.srcElement || event.originalTarget;
	var link = target.getAttribute('destination');
	window.location.href = link;
}

function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var artist = target.getAttribute('artist');
		var album = target.getAttribute('album');
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
		    type: "POST",
		    url: "/ajax/response.html",
		    data: "OnArtistClick=" + value + "&artist=" + artist + "&album=" + album,
		    error: function() {
		        alert('Error: onArtistClick() failed.');
		    }
		});
	} else {
        	alert('Error: onButtonClick() undefined.');
	}
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
		var json = { OnLibraryClick: value, artist: artist, hash: hash, album: album };
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
				var playlist = getSelectedPlaylist();
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
				var playlist = getSelectedPlaylist();
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

function onShowAlbumClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var uri = target.getAttribute('uri') || '.';
		if (uri.length > 1) {
			window.location.href = uri;
			console.log('Show album for URL: ' + uri);
		} else {
	        	alert('Error: onShowAlbumClick() attribute HREF undefined.');
		}
	} else {
        	alert('Error: onShowAlbumClick() target undefined.');
	}
}


function onListViewCellClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var uri = target.getAttribute('uri') || '.';
		if (uri.length > 1) {
			window.location.href = uri;
			console.log('Show album for URL: ' + uri);
		//} else {
	        //	alert('Error: onListViewClick() attribute HREF undefined.');
		}
	} else {
        	alert('Error: onListViewClick() target undefined.');
	}
}

function onListViewHeaderClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var uri = target.getAttribute('uri') || '.';
		if (uri.length > 1) {
			window.location.href = uri;
			console.log('Show albums for URL: ' + uri);
		} else {
	        	alert('Error: onListViewHeaderClick() attribute HREF undefined.');
		}
	} else {
        	alert('Error: onListViewHeaderClick() target undefined.');
	}
}


function onHeaderArtistClick() {
	var artist = $("#tags-heading-tag").attr('artist');
	var uri = urlEncode(artist);
	if (uri.length > 0) {
		window.location.href = "/app/library/albums.html?prepare=yes&title=albums&filter=" + uri;
		console.log('Click on artist header panel: ' + uri);
	} else {
		console.log('Empty artist on header panel click.');
	}
}

function onHeaderInfoClick() {
	var artist = $("#tags-heading-tag").attr('artist');
	if (artist.length > 0) {
		var uri = getWikipediaArtistSearchUrl(artist);
		var win = window.open(uri, artist);
		win.focus();
		console.log('Click on artist header panel: ' + uri);
	} else {
		console.log('Empty artist on header panel click.');
	}
}


function onRowClick(event, row, $element) {
	console.log('Click for title: ' + row.Title + ', Hash: ' + row.Filehash);
	var result = false;
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnTracksClick=" + row.Filehash,
		success: onRowClicked(row),
		error: function() {
			alert('Error: OnTracksClick() failed.');
		},
	});
}


function onRowDblClick(event, row, $element) {
    var json = JSON.stringify(row);
    $.ajax({
        type: "POST",
        url: "/ajax/response.html",
        data: "OnTracksDblClick=" + json,
        error: function() {
            alert('Error: OnTracksDblClick() failed.');
        }
    });
}

function onImageHover(event) {
	var image = event.target;
	if (image.hasAttribute("path")) {
		var path = image.getAttribute("path");
		console.log('Hover for path: ' + path);
	}
}

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
}

function setImageEvents() {
	var images = document.getElementsByTagName('img');
	for (var i = 0; i < images.length; i++) {
		var image = images[i];
		if (image.hasAttribute("addHover")) {
			var value = image.getAttribute("addHover");
			if (value.toLowerCase() == "true") {
				image.onmouseover = onImageHover;
			}
		}
	}
}

function triggerEvent(elementName, eventName) {
	var element = document.getElementById(elementName);
	if (window.CustomEvent) {
		element.dispatchEvent(new CustomEvent(eventName));
	} else if (document.createEvent) {
		var ev = document.createEvent('HTMLEvents');
		ev.initEvent(eventName, true, false);
		element.dispatchEvent(ev);
	} else { // Internet Explorer
		element.fireEvent('on' + eventName);
	}
}

function setButtonEventsById() {
	$('#btnPlay').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnPause').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnStop').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnPrevious').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnNext').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnFastReverse').on('click', function (event) {
		onButtonClick(event);
	});
	$('#btnFastForward').on('click', function (event) {
		onButtonClick(event);
	});
};


function statusGroupRefresh() {
	$("#statusgroup").load("statusgroup.html");
	$("#gpiotable").load("gpiotable.html");
	$("#gpio-1").load("gpio-1.html");
	$("#gpio-2").load("gpio-2.html");
};


function coverArtLoader(title, hash, url) {
	var $cover = $('#div-coverart');
	$cover.load("coverart.html?&hash=" + hash + "&url=" + url + "&size=400");
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
			if (!found && value === "SHOWHELP") {
				showMessageDialog(
					'Help on library management',
					'/libraryhelp.html?page=2000',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[library.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[library.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function onRowClicked(row) {
	console.log('Click on row: ' + row.Title + ', Hash: ' + row.Filehash);

};


function onActionButtonPlayAction(action, hash) {
	var nil = void(0);	
	if (action !== nil) {

		// Create action URL parameters
		var data = {
			OnContextMenuClick : hash,
			Hash : hash,
			Action : action
		};

		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + data,
			dataType: "json",
			data: data,
			success: function() {
				onPlayActionSucceeded();
			},
			error: function() {
				alert('Error: onActionButtonPlayAction() failed.');
			}
		});
	}
};

function openMediaPlayer(hash) {
	console.log('[library.js] Open Mediaplayer5 for file "' + hash + '"');
	var nil = void(0);
	var element = document.getElementById(hash);
	if (element !== nil) {
		var audio = $(element);
		mediaplayer5.open(audio);
	} else {
		alert('[library.js] Error: openMediaPlayer() failed, file for "' + hash + '" not found.');
	}
}

function onActionButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		var hash = target.getAttribute('hash') || "*";
		var found = false;
		if (!found && action === "PLAYSONG") {
			onActionButtonPlayAction("ADDPLAYSONG", hash);
			found = true;
		}
		if (!found && action === "STREAMSONG") {
			openMediaPlayer(hash);
			found = true;
		}
		console.log('[streaming.js] Table row button "' + action + '" clicked for "' + hash + '"');
	}
	return false;
}


function beforeContextMenuShow(event, row, button) {
	// Do not show context menu for action column
	// console.log('[streaming.js] Before show event : ', event);
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		// Ignore cell index 3
		var index = target.cellIndex || 0;
		if (index === 6)
			return false;
		// Ignore elements with "value" property set
		var value = target.value || "*";
		if (value.length > 1)
			return false;
	}
	return true;
}

function onImageContextMenu(action, album) {
	var nil = void(0);	
	if (action !== nil && album != nil) {
		var params = "OnContextMenuClick=" + album + "&album=" + album + "&action=" + action;
		var json = { OnContextMenuClick: album, album: album, action: action };
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + params,
			dataType: "json",
			data: json,
			success: function(data) {
				// Async call, no local parameters...				
				var action = data['Action'] || "";
				var album = data['Album'] || "";
				showImagePopupMessage(action, album);
				onImageContextMenuClicked();
			},
			error: function() {
				alert('Error: onImageContextMenuClicked() failed.');
			},
		});
	}
};

function onImageContextMenuClicked() {
	// Refresh images
	$('#tracks-table').bootstrapTable('refresh');
};

function onTableLoaded() {
	setImageEvents();
};

function showImagePopupMessage(action, album) {
	var nil = void(0);	
	if (action !== nil) {
		if (action.length > 0) {
			var ok = false;			
			var title = 'ERROR: Unknown aktion';
			var message = 'No valid message found.';
			if (!ok && action === 'CLEARIMAGE') {
				title = "Clear image";
				message = 'Cleared cached album image.';
				ok = true;
			}
			if (!ok && action === 'CLEARCACHE') {
				title = "Clear cache";
				message = 'Cleared all cached images.';
				ok = true;
			}
			if (ok) {
				showButtonPopupMessage(message, title);
			}
		}
	}
};


function setTableEvents() {
    $('#tracks-table').bootstrapTable()
		.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
		.on('click-row.bs.table', onRowClick)
		//.on('dbl-click-row.bs.table', onRowDblClick)
		.on('post-body.bs.table', onTableLoaded);
};


function createContextParams(action, row) {
	var list = '*';
	if (row.Playlist !== null) {
		if (row.Playlist.length > 0) {
			list = row.Playlist;
		}
	}
	return 'OnContextMenuClick=' + row.Filehash + 
		'&Hash=' + row.Filehash + 
		'&Album=' + row.Albumhash + 
		'&Name=' + urlEncode(row.Originalalbum) + 
		'&Title=' + urlEncode(row.Originaltitle) +
		'&Displayname=' + urlEncode(row.Album) + 
		'&Displaytitle=' + urlEncode(row.Title) +
		'&Playlist=' + urlEncode(list) + 
		'&Action=' + action;
};

function createContextData(action, row) {
	var list = '*';
	if (row.Playlist !== null) {
		if (row.Playlist.length > 0) {
			list = row.Playlist;
		}
	}
	// Create JSON object
	var data = {
		OnContextMenuClick : row.Filehash,
		Hash : row.Filehash,
		Album : row.Albumhash,
		Name : row.Originalalbum,
		Title : row.Originaltitle,
		Displayname : row.Album,
		Displaytitle : row.Title,
		Playlist : list,
		Action : action
	};
	return data;
};

function onContextMenuPlayAction(action, row) {
	var nil = void(0);	
	if (action !== nil) {
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + createContextParams(action, row),
			dataType: "json",
			data: createContextData(action, row),
			success: function() {
				onPlayActionSucceeded();
			},
			error: function() {
				alert('Error: onContextMenuClick() failed.');
			}
		});
	}
};

function onContextMenuDefaultAction(action, row) {
	var nil = void(0);	
	if (action !== nil) {
		$.ajax({
			type: "POST",
			url: "/rest/selected.json?" + createContextParams(action, row),
			dataType: "json",
			data: createContextData(action, row),
			success: function(data) {
				onContextMenuClicked(data);
				onContextMenuSucceeded();
			},
			error: function() {
				alert('Error: onContextMenuClick() failed.');
			}
		});
	}
};

function onContextArtistAction(action, row) {
	var nil = void(0);
	if (action !== nil) {
		if (action.length > 0) {
			var value = actionToValue(action)
			if (value > 0) {
				var domain = "all";
				var filter = "*";
				var goon = true;
				var found = false;
				switch (value) {
					// "GOTOARTIST"
					case 7000: 
						domain = "artist";
						if (row.Compilation) {
							if (row.Originalartist != nil && row.Originalartist != null) {
								if (row.Originalartist.length > 0) {
									filter = row.Originalartist;
									found = true;
								}
							}
						}
						if (!found) {
							if (row.Artist != nil && row.Artist != null) {
								if (row.Artist.length > 0) {
									filter = row.Artist;
								}
							}
						}
						break;
					// "GOTOCOMPOSER"
					case 7002: 
						domain = "composer";
						if (row.Originalcomposer != nil && row.Originalcomposer != null) {
							if (row.Originalcomposer.length > 0) {
								filter = row.Originalcomposer;
							}
						}
						break;
					// "GOTOCONDUCTOR"
					case 7003: 
						domain = "conductor";
						if (row.Originalconductor != nil && row.Originalconductor != null) {
							if (row.Originalconductor.length > 0) {
								filter = row.Originalconductor;
							}
						}
						break;
					// "GOTOORCHESTRA"
					case 7004: 
						domain = "band";
						if (row.Albumartist != nil && row.Albumartist != null) {
							if (row.Albumartist.length > 0) {
								filter = row.Albumartist;
							}
						}
						break;
					// "GOTOTITLE"
					case 7005: 
						domain = "title";
						if (row.Originaltitle != nil && row.Originaltitle != null) {
							if (row.Originaltitle.length > 0) {
								filter = row.Originaltitle;
							}
						}
						break;
					default:
						goon = false;
						break;
				}
				if (goon && filter.length > 0) {
					var value = urlEncode(filter);
					window.location.href = "/app/library/albums.html?prepare=yes&title=albums&domain=" + domain + "&filter=" + value;
					return true;
				}
			}
		}
	}
	return false;
};

function onContextBrowserAction(action, row) {
	var nil = void(0);	
	if (action !== nil) {
		window.location.href = "/app/system/explorer.html?prepare=yes&title=explorer&path=" + row.URL;
	}
};

function onPlayActionSucceeded() {
	window.location.href = "/app/playlist/nowplaying.html";
};

function onAddActionSucceeded() {
	console.log('[library.js] Add action succeeded.');
};

function onContextMenuClicked(data) {
	var hash = data['Album'];
	var title = data['Displaytitle'];
	var album = data['Displayname'];
	var action = data['Action'];
	var playlist = getSelectedPlaylist();
	showTablePopupMessage(action, hash, title, album, playlist);
	console.log('[library.js] Context for "' + action + '" : ' + title + ', Hash: ' + hash);
};

function onContextMenuSucceeded() {
	console.log('[library.js] Context menu click success action');
};


function setTablePopupMenu() {
    $('#tracks-table').bootstrapTable({
		contextMenu: '#tracks-context-menu',
		contextMenuTrigger: 'both',
		beforeContextMenuRow: beforeContextMenuShow,
		onContextMenuItem: function(row, $element) {
			var nil = void(0);	
			var item = $element.data("item");
			if (item !== nil) {
				if (item === "ADDPLAYALBUM" || item === "ADDPLAYSONG") {
					onContextMenuPlayAction(item, row);
				} else {
					if (item === "BROWSEPATH") {
						onContextBrowserAction(item, row);
					} else {
						if (!onContextArtistAction(item, row)) {
							onContextMenuDefaultAction(item, row);
						}	
					}
				}
			}
		}
	});
};


function setImagePopupMenu() {
	$("#img-coverart").contextMenu({
		contextMenu: "#image-context-menu",
		onContextMenuItem: function ($item, $element) {
			var action = $item.attr('id');
			var album = $element.attr('hash');
			onImageContextMenu(action, album);
		}
	});
};


function onSwipeLeft() {
	var link = $('#navigation').attr('prev');
	window.location.href = link;
};

function onSwipeRight() {
	var link = $('#navigation').attr('next');
	window.location.href = link;
};

function onSwipeUp() {
};

function onSwipeDown() {
};

function setSwipeEvents() {
	$('#thumbnails').on('swipeleft',  onSwipeLeft)
		            .on('swiperight', onSwipeRight)
		            .on('swipeup',    onSwipeUp)
		            .on('swipedown',  onSwipeDown);
	$.detectSwipe.threshold = 128;
	$.detectSwipe.preventDefault = false;
};

