
function showPopupMessage(message, title, icon) {
	var image = icon || '/images/logo72.png';
	var header = title || 'Notify...';
	var text = message || 'Message body text.';
	console.log('[popups.js] Show popup "' + header + ": " + text + '" with icon URL <' + image + '>');
	$.notify({
		icon: image,
		title: header,
		message: text
	},{
		type: 'popup',
		delay: 2500,
		icon_type: 'image',
		mouse_over: 'pause',
		newest_on_top: true,
		allow_dismiss: true,
		animate: {
			enter: 'animated fadeInRight',
			exit: 'animated fadeOutRight'
		},
		offset: {
			x: 14,
			y: 64
		},
		template: '<div data-notify="container" class="col-xs-8 col-sm-4 alert alert-{0}" role="alert">' +
				  '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				  '<img data-notify="icon" class="img-thumbnail pull-left">' +
				  '  <span data-notify="title">{1}</span>' +
				  '  <span data-notify="message">{2}</span>' +
				  '</div>'
	});
};

function showPopupIconMessage(message, title, icon, delay) {
	var image = icon || '/images/glyphicons/error-square.png';
	var header = title || 'Unknown';
	var text = message || 'Missing message text.';
	console.log('[popups.js] Show popup "' + header + ": " + text + '"');
	$.notify({
		icon: image,
		title: header,
		message: text
	},{
		type: 'popup',
		delay: delay,
		icon_type: 'image',
		newest_on_top: true,
		allow_dismiss: true,
		animate: {
			enter: 'animated fadeInRight',
			exit: 'animated fadeOutRight'
		},
		offset: {
			x: 14,
			y: 64
		},
		template: '<div data-notify="container" class="col-xs-8 col-sm-3 alert alert-{0}" role="alert">' +
				  '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
				  '<img data-notify="icon" class="img pull-left">' +
				  '  <span data-notify="title">{1}</span>' +
				  '  <span data-notify="message">{2}</span>' +
				  '</div>'
	});
};

function showPopupErrorMessage(message, title) {
	var icon = '/images/glyphicons/error-square.png';
	showPopupIconMessage(message, title, icon, 0);
};

function showPopupInfoMessage(message, title) {
	var icon = '/images/glyphicons/info-square.png';
	showPopupIconMessage(message, title, icon, 2500);
};

function showPopupCancelMessage(message, title) {
	var icon = '/images/glyphicons/cancel-square.png';
	showPopupIconMessage(message, title, icon, 2500);
};

function showPopupWarningMessage(message, title) {
	var icon = '/images/glyphicons/warning-triangle.png';
	showPopupIconMessage(message, title, icon, 0);
};

function showPopupConfirmationMessage(message, title) {
	var icon = '/images/glyphicons/confirm-square.png';
	showPopupIconMessage(message, title, icon, 2500);
};

/*
	"PLAYSONG",     "Play song"
	"PLAYALBUM",    "Play album"
	"NEXTSONG",     "Enqueue song"
	"NEXTALBUM",    "Enqueue album"
	"DELETESONG",   "Remove song"
	"DELETEALBUM",  "Remove album"
	"ADDSONG",      "Add song to playlist"
	"ADDALBUM",     "Add album to playlist"
	"ADDPLAYSONG",  "Play song now"
	"ADDPLAYALBUM", "Play album now"
	"ADDNEXTSONG",  "Enqueue song to playlist"
	"ADDNEXTALBUM", "Enqueue album to playlist"
	"GOTOARTIST",   "Goto artist view"
	"GOTOALBUM",    "Goto album/tracks view"
	"BROWSEPATH",   "Browse file location"
	"CLEARIMAGE",   "Clear cached image"
	"CLEARCACHE",   "Clear all cached images"
	"TESTACTION",   "Test click..."
*/
function actionToValue(action) {
	var nil = void(0);
	if (action != nil) {
		if (action.length > 0) {
			if (action === "PLAYSONG")      return 1000;
			if (action === "PLAYALBUM")     return 1001;
			if (action === "NEXTSONG")      return 2000;
			if (action === "NEXTALBUM")     return 2001;
			if (action === "DELETESONG")    return 3000;
			if (action === "DELETEALBUM")   return 3001;
			if (action === "ADDSONG")       return 4000;
			if (action === "ADDALBUM")      return 4001;
			if (action === "ADDPLAYSONG")   return 5000;
			if (action === "ADDPLAYALBUM")  return 5001;
			if (action === "ADDNEXTSONG")   return 6000;
			if (action === "ADDNEXTALBUM")  return 6001;
			if (action === "GOTOARTIST")    return 7000;
			if (action === "GOTOALBUM")     return 7001;
			if (action === "GOTOCOMPOSER")  return 7002;
			if (action === "GOTOCONDUCTOR") return 7003;
			if (action === "GOTOORCHESTRA") return 7004;
			if (action === "GOTOTITLE")     return 7005;
			if (action === "BROWSEPATH")    return 8000;
			if (action === "CLEARIMAGE")    return 8001;
			if (action === "CLEARCACHE")    return 8002;
			if (action === "TESTACTION")    return 9999;
		}
	}
	return 0;
};

function showTablePopupMessage(action, hash, title, album, playlist) {
	var nil = void(0);	
	var command = actionToValue(action);
	var header = 'ERROR: Unknown aktion';
	var message = 'No valid message found.';
	var icon = '/images/logo72.png';
	var error = 0;
	var goon = true;
	var ok = false;
	var list = '';
	if (playlist !== nil) {
		if (playlist.length > 0) {
			if (playlist !== '*') {
				list = playlist;
			}
		}
	}
	switch (command) {
		case 1000: 
			// "PLAYSONG" --> "Play song"
			header = "Play song";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play song &quot;' + title + '&quot; now.';
			ok = true;
			break;
		case 1001:
			// "PLAYALBUM" --> "Play album"
			header = "Play album";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play album &quot;' + album + '&quot; now.';
			ok = true;
			break;
		case 2000:
			// "NEXTSONG" --> "Enqueue song"
			header = "Enqueue song";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play song &quot;' + title + '&quot; next.';
			ok = true;
			break;
		case 2001:
			// "NEXTALBUM" --> "Enqueue album"
			header = "Enqueue album";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play album &quot;' + album + '&quot; next.';
			ok = true;
			break;
		case 3000:
			// "DELETESONG" --> "Remove song"
			header = "Remove song";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			if (list.length > 0) {
				message = 'Delete song &quot;' + title + '&quot; from &quot;' + list + '&quot;';
			} else {
				message = 'Delete song &quot;' + title + '&quot;';
				error = 1001;
			}
			goon = false;
			ok = true;
			break;
		case 3001:
			// "DELETEALBUM" --> "Remove album"
			header = "Remove album";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			if (list.length > 0) {
				message = 'Delete album &quot;' + album + '&quot; from &quot;' + list + '&quot;';
			} else {
				message = 'Delete album &quot;' + album + '&quot;';
				error = 1002;
			}
			goon = false;
			ok = true;
			break;
		case 4000:
			// "ADDSONG" --> "Add song to playlist"
			header = "Add song";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			if (list.length > 0) {
				message = 'Add song &quot;' + title + '&quot; to &quot;' + list + '&quot;';
			} else {
				message = 'Add song &quot;' + title + '&quot;';
				error = 1003;
			}
			ok = true;
			break;
		case 4001:
			// "ADDALBUM" --> "Add album to playlist"
			header = "Add album";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			if (list.length > 0) {
				message = 'Add album &quot;' + album + '&quot; to &quot;' + list + '&quot;';
			} else {
				message = 'Add album &quot;' + album + '&quot;';
				error = 1004;
			}
			ok = true;
			break;
		case 5000:
			// "ADDPLAYSONG" --> "Play song now"
			header = "Play song now";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play song &quot;' + title + '&quot; now.';
			ok = true;
			break;
		case 5001:
			// "ADDPLAYALBUM" --> "Play album now"
			header = "Play album now";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Play album &quot;' + album + '&quot; now.';
			ok = true;
			break;
		case 6000:
			// "ADDNEXTSONG" --> "Enqueue song to playlist"
			header = "Enqueue song to playlist";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Add and play song &quot;' + title + '&quot;';
			if (list.length > 0) {
				message = 'Add and play song &quot;' + title + '&quot; to &quot;' + list + '&quot;';
			} else {
				message = 'Add and play song "' + title + '"';
				error = 1005;
			}
			ok = true;
			break;
		case 6001:
			// "ADDNEXTALBUM" --> "Enqueue album to playlist"
			header = "Enqueue album to playlist";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			if (list.length > 0) {
				message = 'Add and play album &quot;' + album + '&quot; to &quot;' + list + '&quot;';
			} else {
				message = 'Add and play album &quot;' + album + '&quot;';
				error = 1006;
			}
			ok = true;
			break;
		case 7000:
			// "GOTOARTIST" --> "Goto artist view"
			header = "Goto artist view";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Goto artist of album &quot;' + album + '&quot;';
			goon = false;
			ok = true;
			break;
		case 7001:
			// "GOTOALBUM" --> "Goto album/tracks view"
			header = "Goto album view";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Goto tracks for &quot;' + album + '&quot;';
			goon = false;
			ok = true;
			break;
		case 7002:
			// "GOTOCOMPOSER" --> "Goto composer view"
			header = "Goto composer view";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Goto composer for &quot;' + album + '&quot;';
			goon = false;
			ok = true;
			break;
		case 7003:
			// "GOTOCONDUCTOR" --> "Goto conductor view"
			header = "Goto conductor view";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Goto conductor for &quot;' + album + '&quot;';
			goon = false;
			ok = true;
			break;
		case 7004:
			// "GOTOORCHESTRA" --> "Goto album artist/band/orchestra/ view"
			header = "Goto album view";
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
			message = 'Goto band/orchestra for &quot;' + album + '&quot;';
			goon = false;
			ok = true;
			break;
		case 8000:
			header = "Explorer";
			message = "Browse file location";
			goon = false;
			ok = true;
			break;
		case 8001:
			header = "Clear image";
			message = 'Cleared cached album image.';
			ok = true;
			break;
		case 8002:
			title = "Clear cache";
			message = 'Cleared all cached images.';
			ok = true;
			break;
		case 9999:
			header = "Test click...";
			message = 'Test message.';
			ok = true;
			break;
		default:
			break;
	}
	if (ok) {
		if (error === 0) {
			if (goon) {
				showPopupMessage(message, header, icon);
			}
		} else {
			var hint = '???';
			switch (error) {
				case 1001:
					hint = 'Delete song';
					break;
				case 1002:
					hint = 'Delete album';
					break;
				case 1003:
					hint = 'Add song';
					break;
				case 1004:
					hint = 'Add album';
					break;
				case 1005:
					hint = 'Enqueue song';
					break;
				case 1006:
					hint = 'Enqueue album';
					break;
				default:
					break;
			}
			showPopupErrorMessage('Please select playlist first.', 'Failure (' + hint + ')');
		}
	} else {
		showPopupErrorMessage(message, header);
	}
};

function showButtonPopupMessage(message, title, hash) {
	var nil = void(0);
	var header = title || 'ERROR: Unknown aktion';
	var text = message || 'No valid message found.';
	var icon = '/images/logo72.png';
	if (hash != nil) {
		if (hash.length > 0) {
			icon = "/rest/thumbnails/" + hash + "-72.jpg";
		}
	}
	showPopupMessage(text, header, icon);
};

function showTextualPopupMessage(message, title) {
	var icon = '/images/logo72.png';
	showPopupMessage(message, title, icon);
};

function getSelectedPlaylist() {
	// Return synchronous AJAX request data	
	var nil = void(0);	
	var xhr = $.ajax({
		type: "GET",
		url: "/rest/selected.json",
		data: "OnDialogData=null&prepare=no&title=selected",
		dataType: "json",
		async: false,
		error: function() {
			console.log('Error: AJAX getDialogData() failed.');
		}
	});
	var json = xhr.responseText;
	if (json !== nil) {
		if (json.length > 0) {
			var playlist = data['Selected'];
			if (playlist !== nil) {
				if (playlist.length > 0) {
					return playlist;
				}
			}
		}
	}
	return '';	
}

