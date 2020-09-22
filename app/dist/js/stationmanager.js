// showEditDialog(header, text, content, value, action, size, logo, glyphicon)

function onCreateStationClick() {
	showEditDialog(
		'New radio station',
		'Enter radio station properties',
		'/create-station.json',
		'*',
		'CREATESTREAM',
		'modal-md',
		'/images/logo36.png'
	);
}

function onEditStationClick(station) {
	var parameter = station || '*';
	showEditDialog(
		'Edit radio station',
		'Change radio station properties',
		'/edit-station.json',
		 parameter,
		'EDITSTREAM',
		'modal-md',
		'/images/logo36.png'
	);
}

function onEditDialogClosed(action, value) {
	console.log('[stationmanager.js] onEditDialogClosed() called for action "' + action + '" and value "' + value + '"');
	$("#data-table").bootstrapTable('refresh', {silent: true});
	refreshRadioText();
}

