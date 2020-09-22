// showEditDialog(header, text, content, value, action, size, logo, glyphicon)

function onCreateUserClick() {
	showEditDialog(
		'New user credential',
		'Enter user access properties',
		'/create-user.json',
		'*',
		'CREATEUSER',
		'modal-md',
		'/images/logo36.png'
	);
}

function onEditUserClick(username) {
	var parameter = username || '*';
	showEditDialog(
		'Edit user credential',
		'Change user access properties',
		'/edit-user.json',
		 parameter,
		'EDITUSER',
		'modal-md',
		'/images/logo36.png'
	);
}

function onEditDialogClosed(action, value) {
	console.log('[credentialmanager.js] onEditDialogClosed() called for action "' + action + '" and value "' + value + '"');
	$("#data-table").bootstrapTable('refresh', {silent: true});
	$("#credentials-header-text").load("credentials-header-text.html");
}

