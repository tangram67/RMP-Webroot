
function onTableLoaded() {
	console.log('[erroneous.js] Table loaded.');
};

function onTableRowClick(e, row, $element) {
	var URL = row.URL;
	if (URL.length > 0) {
		window.location.href = "/app/system/explorer.html?prepare=yes&title=explorer&path=" + URL;
		console.log('[erroneous.js] Goto folder <' + URL + '>');
	}
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
					'Help on erroneous files',
					'/erroneoushelp.html',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[erroneous.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[erroneous.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function setTableEvents() {
    $('#data-table').bootstrapTable()
		.on('click-row.bs.table', onTableRowClick)
		.on('post-body.bs.table', onTableLoaded);
};

