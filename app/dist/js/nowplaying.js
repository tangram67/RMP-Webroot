
function repeatButtonRefresh() {
	$("#now-playing-repeat").load("now-playing-repeat.html");
};

function progressImageRefresh(progress) {
	var $image = $("#img-progress");
	if ($image.length) {
		var time = $image.attr('time') || '0:00';
		$image.attr('src', '/rest/progress.png?progress=' + progress.toString() + '&' + 'size=' + time.length.toString() + '&' + createUniqueUriParam());
	}
};

function onRepeatButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var value = target.getAttribute('value');
		$.ajax({
			type: "POST",
			url: "/rest/modes.json",
			data: "OnActionButtonClick=" + value,
			success: function(data) {

				// Get current values from JSON data
				var directMode = data['Direct'] || false;
				var haltMode = data['Halt'] || false;

				// Set modes and show result message
				var changed = setDirectPlayMode(directMode);
				if (changed) {
					showDirectPlayMessage(directMode);
				}
				changed = setHaltMode(haltMode);
				if (changed) {
					showHaltModeMessage(haltMode);
				}

				// Show repeat button groups
				repeatButtonRefresh();
			},
			error: function() {
				alert('Error: onRepeatButtonClick() failed.');
			}
		});
		onButtonClicked(target);
	} else {
        	alert('Error: onRepeatButtonClick() undefined.');
	}
	return false;
}

function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var value = target.getAttribute('value');
		$.ajax({
		    type: "POST",
		    url: "/ajax/response.html",
		    data: "OnActionButtonClick=" + value,
		    error: function() {
		        alert('Error: onButtonClick() failed.');
		    }
		});
		onButtonClicked(target);
	} else {
        	alert('Error: onButtonClick() undefined.');
	}
}

function onButtonClicked(target) {
	console.log('Click for button id: ' + target.id + ', name: ' + target.name + ', value: ' + target.value);
};

function onRowClick(event, row, $element) {

	// Check for right click
	var right = false;
	var ev = window.event || event;
	if ("which" in ev) {
		// Gecko (Firefox), WebKit (Safari/Chrome) and Opera
		right = ev.which == 3;
	} else if ("button" in ev) {
		// MSIE and Opera
		right = ev.button == 2;
	}

	var $properties = $('#mode-properties');
	if (!right && $properties.hasClass('direct-play')) {
		console.log('Execute direct play for ' + row.Filehash);
		onContextMenu('PLAYSONG', row);
	} else {
		$.ajax({
			type: "POST",
			url: "/ajax/response.html",
			data: "OnPlaylistClick=" + row.Filehash + '&playlist=' + row.Playlist,
			error: function() {
				alert('Error: onRowClick() failed.');
			}
		});
		onRowClicked(row);
	}
}

function onRowClicked(row) {
	console.log('Click on row: ' + row.Originaltitle + ', Hash: ' + row.Filehash);
};

function onRowDblClick(event, row, $element) {
    var json = JSON.stringify(row);
    $.ajax({
        type: "POST",
        url: "/ajax/response.html",
        data: "OnPlaylistDblClick=" + json,
        error: function() {
            alert('Error: onRowDblClick() failed.');
        }
    });
}


function onImageHover(event) {
	var image = event.target;
	if (image.hasAttribute("path")) {
		var path = image.getAttribute("path");
		console.log('Hover image path: ' + path);
	}
}

function onImageClick(event) {
	var image = event.target;
	if (image.hasAttribute("path")) {
		var path = image.getAttribute("path");
		console.log('Click image path: ' + path);
	}
}


function onHeaderArtistClick() {
	var artist = $("#nowplaying-heading-tag").attr('artist') || '*';
	if (artist.length > 0) {
		if (artist == '@') {
			window.location.href = "/app/playlist/streaming.html";
			console.log('Click on artist header panel for radio stream.');
		} else {
			if (artist.length > 1) {
				var uri = urlEncode(artist);
				window.location.href = "/app/library/albums.html?prepare=yes&title=albums&filter=" + uri;
				console.log('Click on artist header panel: ' + uri);
			}
		}
	} else {
		console.log('Empty artist on header panel click.');
	}
}

function onHeaderInfoClick() {
	var artist = $("#nowplaying-heading-tag").attr('artist') || '*';
	if (artist.length > 1) {
		var uri = getWikipediaArtistSearchUrl(artist);
		var win = window.open(uri, artist);
		win.focus();
		console.log('Click on artist header panel: ' + uri);
	} else {
		console.log('Empty artist on header panel click.');
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
		if (image.hasAttribute("addClick")) {
			var value = image.getAttribute("addClick");
			if (value.toLowerCase() == "true") {
				image.onclick = onImageClick;
			}
		}
	}
}


function setLoadEvents() {
	// div.onload doesn't seem to work...
	console.log('setLoadEvents() called.');
	$('#now-playing-repeat').on('load', setBottomButtonEvents);
};

function setBottomButtonEvents() {
	console.log('setBottomButtonEvents() called:');
	$.each(["btnPrevious1","btnNext1","btnFastReverse1","btnFastForward1"], function(index, name) {
		console.log(' Element : ' + name);
		var element = document.getElementById(name);
		if (element.hasAttribute("addClick")) {
			var value = element.getAttribute("addClick");
			if (value.toLowerCase() == "true") {
				element.onclick = onButtonClick;
			}
		}
	});
};

function showPlayerButtons(enabled) {
	$(".btn-player").each(function() {
		if (enabled) {
			if ($(this).hasAttr('disabled')) {
				$(this).removeAttr("disabled");
			}
		} else {
			if (!$(this).hasAttr('disabled')) {
				$(this).attr("disabled", "true");
			}
		}
	});
}

function statusGroupRefresh() {
	//$("#nowplaying-progress").load("now-playing-progress.html");
	$("#nowplaying-time-info").load("now-playing-duration.html");
	getNowPlayingUpdate();
	getRepeatButtonUpdate();
	getProgressValues();
};

function getNowPlayingUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/current.json",
		data: "OnStatusGroupRefresh=null&prepare=yes&title=current",
		dataType: "json",
		success: function (data) {
			console.log(data);
			var transition = data['Transition'] || false;
			var streaming = data['Streaming'] || false;
			if (transition) {
				console.log('[nowplaying.js] Player state has changed, refresh playlist view.');
				$("#data-table").bootstrapTable('refresh', {silent: true});
				$("#nowplaying-header-info").load("now-playing-header.html");
				$("#nowplaying-track-info").load("now-playing-info.html");
				$("#div-coverart").load("now-playing-coverart.html");
				showPlayerButtons(!streaming);
			}
		},
		error: function() {
			console.log('Error: AJAX getNowPlayingUpdate() failed.');
		}
	});
}

function getNowPlayingButtons() {
	$.ajax({
		type: "GET",
		url: "/rest/current.json",
		data: "OnStatusGroupRefresh=null&prepare=no&title=current",
		dataType: "json",
		success: function (data) {
			console.log(data);
			var streaming = data['Streaming'] || false;
			showPlayerButtons(!streaming);
		},
		error: function() {
			console.log('Error: AJAX getNowPlayingButtons() failed.');
		}
	});
}

function getRepeatButtons(event) {
	$.ajax({
		type: "GET",
		url: "/rest/modes.json",
		data: "OnStatusGroupRefresh=null&prepare=no&title=buttons",
		dataType: "json",
		success: function(data) {
			var directMode = data['Direct'] || false;
			if (directMode) {
				setDirectPlayMode(directMode);
			}
		},
		error: function() {
			console.log('Error: AJAX getRepeatButtons() failed.');
		}
	});
}

function getRepeatButtonUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/repeat.json",
		data: "OnStatusGroupRefresh=null&prepare=yes&title=modes",
		dataType: "json",
		success: function (data) {
			var transition = data['Transition'] || false;
			if (transition) {
				console.log('Modes had changed, refresh buttons.');
				repeatButtonRefresh();
			}
		},
		error: function() {
			console.log('Error: AJAX getRepeatButtonUpdate() failed.');
		}
	});
}

function getProgressValues() {
	$.ajax({
		type: "GET",
		url: "/rest/progress.json",
		data: "OnStatusGroupRefresh=null&prepare=no&title=progress",
		dataType: "json",
		success: function (data) {
			// Read current values from JSON data			
			var timestamp = data['Timestamp'];
			var progress  = data['Progress'];

			// Normalize progress
			if (progress > 100.0)
				progress = 100.0;
			if (progress < 0.0)
				progress = 0.0;

			// Set progress bar properties
			$("#pgsNowplaying").attr('style', "width:" + Math.floor(progress).toString() + "%;");
			$("#pgsNowplaying").text(timestamp);
			progressImageRefresh(progress);
		},
		error: function() {
			console.log('Error: AJAX getProgressValues() failed.');
		}
	});
};


function getDirectMode() {
	var mode = getCookieByName("player-direct-mode");
	if (!!mode) {
		if (mode.length > 3) {
			console.log('[nowplaying.js] getDirectMode() Direct mode = "' + mode + '"');
			return (mode === "true");
		}
	}
	console.log('[nowplaying.js] Error::getDirectMode() No mode cookie found.');
	return false;
};


function coverArtLoader(title, hash, url) {
	var $cover = $('#div-coverart');
	$cover.load("/rest/coverart.html?hash=" + hash + "&url=" + url + "&size=400");
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

function onContextMenu(action, row) {
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
};

function onContextMenuClicked(data) {
	var hash = data['Album'];
	var title = data['Displaytitle'];
	var album = data['Displayname'];
	var action = data['Action'];
	var playlist = data['Selected'];
	showTablePopupMessage(action, hash, title, album, playlist);
	console.log('[nowplaying.js] Context for "' + action + '" : ' + title + ', Hash: ' + hash);
};

function onContextMenuSucceeded() {
	console.log('[nowplaying.js] Context menu click success action');
};


function onTableLoaded() {
	setImageEvents();
};


function setTableEvents() {
	var $table = $('#data-table');
	$table.bootstrapTable()
		.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
		.on('click-row.bs.table', onRowClick)
		//.on('dbl-click-row.bs.table', onRowDblClick)
		.on('post-body.bs.table', onTableLoaded);
};

function setDirectPlayMode(enabled) {
	var changed = false;

	// Enable direct play
	if (enabled) {
		changed = enableDirectPlayMode();
	} else {
		changed = disableDirectPlayMode();
	}

	return changed;
}

function setHaltMode(enabled) {
	var changed = false;

	// Enable halt mode
	if (enabled) {
		changed = enableHaltMode();
	} else {
		changed = disableHaltMode();
	}

	return changed;
}


function showDirectPlayMessage(enabled) {
	if (enabled) {
		showPopupConfirmationMessage("Play song on row click.", 'Direct play');
	} else {
		showPopupCancelMessage("Direct play mode canceled.", 'Direct play');
	}
}

function showHaltModeMessage(enabled) {
	if (enabled) {
		showPopupConfirmationMessage("Stop playback after current song.", 'Halt mode');
	} else {
		showPopupCancelMessage("Halt mode canceled.", 'Halt mode');
	}
}


function enableHaltMode() {
	var $properties = $('#mode-properties');
	if (!$properties.hasClass('halt-mode')) {
		$properties.addClass('halt-mode');
		console.log('[nowplaying.js] Enabled halt mode.');
		return true;
	} else {
		console.log('[nowplaying.js] Halt mode already enabled.');
	}
	return false;
};

function disableHaltMode() {
	var $properties = $('#mode-properties');
	if ($properties.hasClass('halt-mode')) {
		$properties.removeClass('halt-mode');
		console.log('[nowplaying.js] Disabled halt mode.');
		return true;
	} else {
		console.log('[nowplaying.js] Halt mode mode already disabled.');
	}
	return false;
};


function enableDirectPlayMode() {
	var $table = $('#data-table');
	var $properties = $('#mode-properties');
	if (!$properties.hasClass('direct-play')) {
		$table.bootstrapTable('refreshOptions', {
			contextMenu: null,
			contextMenuTrigger: 'none',
			onContextMenuItem: null
			// contextMenu: '#player-context-menu',
			// contextMenuTrigger: 'right',
			// onContextMenuItem: onContextMenuAction
		});
		$properties.addClass('direct-play');
		console.log('[nowplaying.js] Enabled direct play mode.');
		return true;
	} else {
		console.log('[nowplaying.js] Direct play mode already enabled.');
	}
	return false;
};

function disableDirectPlayMode() {
	var $table = $('#data-table');
	var $properties = $('#mode-properties');
	if ($properties.hasClass('direct-play')) {
		$table.bootstrapTable('refreshOptions', {
			contextMenu: '#player-context-menu',
			contextMenuTrigger: 'both',
			onContextMenuItem: onContextMenuAction
		});
		$properties.removeClass('direct-play');
		console.log('[nowplaying.js] Disabled direct play mode.');
		return true;
	} else {
		console.log('[nowplaying.js] Direct play mode already disabled.');
	}
	return false;
};


function initTablePopupMenu(enabled) {
	var $properties = $('#mode-properties');
	if (enabled) {
		setTablePopupMenu();
		if ($properties.hasClass('direct-play')) {
			$properties.removeClass('direct-play');
		}
	} else {
		resetTablePopupMenu();
		if (!$properties.hasClass('direct-play')) {
			$properties.addClass('direct-play');
		}
	}
}

function setTablePopupMenu() {
	$('#data-table').bootstrapTable({
		contextMenu: '#player-context-menu',
		contextMenuTrigger: 'both',
		onContextMenuItem: onContextMenuAction,
		//formatNoMatches: '...',
		formatNoMatches: function () {
			return '...';
		}
	});
};

function resetTablePopupMenu() {
	$('#data-table').bootstrapTable({
		contextMenu: null,
		contextMenuTrigger: 'none',
		onContextMenuItem: null,
		//formatNoMatches: '...',
		formatNoMatches: function () {
			return '...';
		}
	});
};


function onContextMenuAction(row, $element) {
	var nil = void(0);	
	var item = $element.data("item");
	if (item !== nil) {
		if (!onContextArtistAction(item, row)) {
			onContextMenu(item, row);
		}
	}
}

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


function onProgressClick(event) {
	var elem = document.getElementById('nowplaying-progress');
	console.log('Called onProgressClick() PageX = ' + event.pageX + ' OffsetX = ' + event.offsetX + ' Left = ' + elem.offsetLeft + ' Width = ' + elem.offsetWidth);
	var progress = event.offsetX * 100.0 / elem.offsetWidth;
	if (progress > 0.0 && progress < 100.0) {
		console.log('Called onProgressClick() Progress = ' + progress + ' %');
		sendProgressClick(progress, 'click');
	}
	// document.getElementById('progressBar').value = progress;
};

function onProgressMove(event) {
	var elem = document.getElementById('nowplaying-progress');
	var pageX = event.touches[0].pageX;
	var offsetLeft = 0;
	var offsetWidth = 0;
	var rect = elem.getBoundingClientRect();
	if (!!rect) {
		offsetLeft = rect.left;
		offsetWidth = rect.width;
	}
	if (pageX > offsetLeft) {
		var offsetX = pageX - offsetLeft;
		console.log('Called onProgressMove() PageX = ' + pageX + ' OffsetX = ' + offsetX + ' Left = ' + offsetLeft + ' Width = ' + offsetWidth);
		var progress = offsetX * 100.0 / offsetWidth;
		if (progress > 0.0 && progress < 100.0) {
			console.log('Called onProgressMove() Progress = ' + progress + ' %');
			sendProgressClick(progress, 'slide');
		}
	}
	// document.getElementById('progressBar').value = progress;
};

function sendProgressClick(progress, action) {

	// Create JSON object
	var data = {
		OnProgressClick : "progress",
		title : "progress",
		prepare : "no",
		action : action,
		progress : progress
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			console.log('Success: AJAX sendProgressClick()');
		},
		error: function() {
			alert('Error: sendProgressClick() failed.');
		}
	});
};

