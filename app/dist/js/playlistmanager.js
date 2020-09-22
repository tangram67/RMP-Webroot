function onNewPlaylistClick(name) {
	inputFormQuery(
		'New playlist',
		'Enter playlist name:',
		'NEWPLAYLIST',
		'modal-sm',
		'/images/logo36.png'
	);
}

function onRenamePlaylistClick() {
	showRenameDialog(
		'Rename playlist',
		'New playlist name:',
		'/rename-playlist.html',
		'RENAMEPLAYLIST',
		'modal-sm',
		'/images/logo36.png'
	);
}

function onDeletePlaylistClick() {
	showSelectDialog(
		'Delete playlist',
		'/delete-playlist.html',
		'DELETEPLAYLIST',
		'modal-sm',
		'/images/logo36.png',
		'glyphicon-trash'
	);
}

function onSelectPlaylistClick(name) {
	var nil = void(0);
	var valid = false;
	if (name !== nil) {
		if (name.length > 0) {
			valid = true;
		}
	}
	if (!valid) {
		showSelectDialog(
			'Select playlist',
			'/select-playlist.html',
			'SELECTPLAYLIST',
			'modal-sm',
			'/images/logo36.png'
		);
	} else {
		showSelectedPlaylist(name);
	}
}

function showSelectedPlaylist(name) {
	window.location.href = "/app/playlist/playlist.html?prepare=yes&title=playlist&name=" + urlEncode(name);
}

function showRecentSongs() {
	window.location.href = "/app/playlist/recent.html?prepare=yes&title=recent&name=state";
}

function onMessageDialogClosed(action, result) {
	console.log('[playlistmanager.js] onMessageDialogClosed() called for action "' + action + '" and result "' + result + '"');
	if (action === "DELETEPLAYLIST") {
		showRecentSongs();
	} else {
		showSelectedPlaylist(result);
	}
}

