function statusGroupRefresh() {
	getPlaylistUpdate();
}

function getPlaylistUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/playlists.json",
		data: "OnPlaylistRefresh=null&prepare=yes&title=playlists",
		dataType: "json",
		success: function (data) {
			console.log(data);
			if (data['Transition']) {
				onPlaylistUpdateSucceeded();
				console.log('[playlist.js] Playlist name has changed, refresh playlist table.');
			}
		},
		error: function() {
			console.log('Error: AJAX getPlaylistUpdate() failed.');
		},
	});
}

function onAnchorClick(event, page) {
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
					'Help on track management',
					'/trackshelp.html?page=' + page.toString(),
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[playlist.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[playlist.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		if (event.cancelable) {
			event.preventDefault();
		}
		$.ajax({
		    type: "POST",
		    url: "/ajax/response.html",
		    data: "OnActionButtonClick=" + value,
			success: onButtonClicked(target),
		    error: function() {
		        alert('Error: onButtonClick() failed.');
		    }
		});
	} else {
        alert('Error: onButtonClick() undefined.');
	}
}

function onButtonClicked(target) {
	console.log('Click for button id: ' + target.id + ', name: ' + target.name + ', value: ' + target.value);
};


function onRowClick(event, row, $element) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnPlaylistClick=" + row.Filehash + '&playlist=' + row.Playlist,
		success: onRowClicked(row),
		error: function() {
			alert('Error: onRowClick() failed.');
		},
	});
}

function onRowClicked(row) {
	console.log('Click on row: ' + row.Title + ', Hash: ' + row.Filehash);
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

function coverArtLoader(title, hash, url) {
	var $cover = $('#div-coverart');
	$cover.load("/rest/coverart.html?&hash=" + hash + "&url=" + url + "&size=400");
};


function onActionButtonPlayAction(action, hash, playlist) {
	var nil = void(0);	
	if (action !== nil) {

		// Create action URL parameters
		var data = {
			OnContextMenuClick : hash,
			Hash : hash,
			Action : action,
			Playlist : playlist
		};

		$.ajax({
			type: "POST",
			url: "/ajax/response.html",
			data: data,
			success: function() {
				// onPlayActionSucceeded();
			},
			error: function() {
				alert('Error: onActionButtonPlayAction() failed.');
			}
		});
	}
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

function onContextMenuDeleteAction(action, row) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: createContextData(action, row),
		success: function() {
			onDeleteActionSucceeded()
		},
		error: function() {
			alert('Error: onContextMenuDeleteAction() failed.');
		}
	});
};

function onContextMenuPlayAction(action, row) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: createContextData(action, row),
		success: function() {
			onPlayActionSucceeded()
		},
		error: function() {
			alert('Error: onContextMenuPlayAction() failed.');
		}
	});
};

function onContextMenuDefaultAction(action, row) {
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
			alert('Error: onContextMenuDefaultAction() failed.');
		}
	});
};


function onContextMenuAlbumAction(action, row) {
	var nil = void(0);
	if (action !== nil) {
		var album = row.Albumhash;
		if (album !== nil) {
			if (album.length > 0) {
				window.location.href = "/app/library/tracks.html?prepare=yes&title=tracks&filter=" + album;
			}
		}
	}	
};

function onPlaylistUpdateSucceeded() {
	$("#recent-header").load("recent-header.html");
	$("#playlist-header").load("playlist-header.html");
	$("#data-table").bootstrapTable('refresh', {silent: true});
}

function onDeleteActionSucceeded() {
	$('#data-table').bootstrapTable('refresh');
	$('#playlist-header').load('playlist-header.html');
	$("#recent-header").load("recent-header.html");
};

function onPlayActionSucceeded() {
	window.location.href = "/app/playlist/nowplaying.html";
};

function onContextMenuClicked(data) {
	var hash = data['Album'];
	var title = data['Displaytitle'];
	var album = data['Displayname'];
	var action = data['Action'];
	var playlist = data['Selected'];
	showTablePopupMessage(action, hash, title, album, playlist);
	console.log('[playlist.js] Context for "' + action + '" : ' + title + ', Hash: ' + hash);
};

function onContextMenuSucceeded() {
	console.log('[playlist.js] Context menu click success action');
};

function onContextMenuAction(row, $element) {
	var nil = void(0);	
	var item = $element.data("item");
	if (item !== nil) {
		if (item == "DELETEALBUM" || item == "DELETESONG") {
			onContextMenuDeleteAction(item, row);
		} else {
			if (item == "PLAYALBUM" || item == "PLAYSONG") {
				onContextMenuPlayAction(item, row);
			} else {
				if (item === "GOTOALBUM") {
					onContextMenuAlbumAction(item, row);
				} else {
					onContextMenuDefaultAction(item, row);
				}	
			}
		}
	}
}

function beforeContextMenuShow(event, row, button) {
	// Do not show context menu for action column
	// console.log('[streaming.js] Before show event : ', event);
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		// Ignore cell index 6
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

function onActionButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		var hash = target.getAttribute('hash') || "*";
		var playlist = target.getAttribute('playlist') || "*";
		var found = false;
		if (!found && action === "PLAYSONG") {
			onActionButtonPlayAction(action, hash, playlist);
			found = true;
		}
		console.log('[playlist.js] Table row button "' + action + '" clicked for "' + hash + '"');
	}
	return false;
}

function onTableLoaded() {
	setImageEvents();
};

function onTableReordered(event, rows) {
	console.log('[playlist.js] Table was reoredered:');
	console.log(rows);
	$.ajax({
		type: "POST",
		url: "/rest/reordered.json",
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(rows),
		success: function() {
			$('#data-table').bootstrapTable('refresh', {silent: true});
			console.log('[playlist.js] Table reoredered data sent.');
		},
		error: function(xhr, statusText, error) {
			console.log('XHR Response: ' + xhr.responseText);
			console.log('XHR Status: ' + xhr.statusText);
			console.log('XHR Text: ' + statusText);
			console.log('XHR Error: ' + error);
			alert('Error: onTableReordered() failed.');
		}
	});
};


function onToggleEditClick() {
	var button = $('#btnToggleEdit');
	if (button.hasClass("edit-enabled")) {
		button.removeClass("edit-enabled btn-warning");
		button.addClass("btn-default");
		setEditMode(false);
	} else {
		button.addClass("edit-enabled btn-warning");
		button.removeClass("btn-default");
		setEditMode(true);
	}
}

function setEditMode(value) {
	if (value === true) {
		enableTableEditMode();
		showPopupConfirmationMessage("Reorder rows via Drag'n'Drop enabled.", 'Edit playlist');
		console.log('[playlist.js] Edit mode is enabled.');
	} else {
		disableTableEditMode();
		showPopupInfoMessage("Table is locked again.", 'Edit playlist');
		console.log('[playlist.js] Edit mode is disabled.');
	}
}


function setTableEvents() {
	$('#data-table').bootstrapTable()
	//.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
	//.on('dbl-click-row.bs.table', onRowDblClick)
	.on('click-row.bs.table', onRowClick)
	.on('post-body.bs.table', onTableLoaded)
	.on('reorder-row.bs.table', onTableReordered);
};

function enableTableEditMode() {
	// Use dragHandle: '>tbody>tr>td' here instead of simply null
	$('#data-table').bootstrapTable('refreshOptions', {
		contextMenu: null,
		contextMenuTrigger: 'none',
		onContextMenuItem: null,
		reorderableRows: true,
		useRowAttrFunc: true,
		dragHandle: '>tbody>tr>td'
	});
};

function disableTableEditMode() {
	$('#data-table').bootstrapTable('refreshOptions', {
		contextMenu: '#songs-context-menu',
		contextMenuTrigger: 'both',
		onContextMenuItem: onContextMenuAction,
		beforeContextMenuRow: beforeContextMenuShow,
		reorderableRows: false,
		useRowAttrFunc: false,
		dragHandle: 'dnd-disabled'
	});
};

function setTablePopupMenu() {
	$('#data-table').bootstrapTable({
		onDragClass: 'table_drag_and_drop',
		contextMenu: '#songs-context-menu',
		contextMenuTrigger: 'both',
		onContextMenuItem: onContextMenuAction,
		beforeContextMenuRow: beforeContextMenuShow,
		reorderableRows: false,
		useRowAttrFunc: false,
		dragHandle: 'dnd-disabled'
	});	
};

