function statusGroupRefresh() {
	getStationUpdate();
	getRadioTextUpdate();
}

function getRadioTextUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/radiotext.json",
		data: "OnStreamingRefresh=null&prepare=yes&title=radiotext",
		dataType: "json",
		success: function (data) {
			// console.log(data);
			var transition = data['Transition'] || false;
			if (transition) {
				console.log('[streaming.js] Radio text update received');
				// console.log(data['Transition']);
				var title = data['Title'] || '*';
				var index = data['Index'] || -1;
				onRadioTextUpdateSucceeded(title, index - 1);
			}
		},
		error: function() {
			console.log('Error: AJAX getRadioTextUpdate() failed.');
		},
	});
}

function onRadioTextUpdateSucceeded(title, index) {
	$("#streaming-radio-text").load("streaming-radio-text.html");
	// console.log('[streaming.js] onRadioTextUpdateSucceeded() called refreshRadioText()...');
	refreshRadioText();
}

function getRadioText() {
	// console.log('[streaming.js] getRadioText() called...');
	$.ajax({
		type: "GET",
		url: "/rest/radiotitle.json",
		data: "OnStreamingRefresh=null&prepare=no&title=radiotitle",
		dataType: "json",
		success: function (data) {
			var title = data['Title'] || '*';
			var index = data['Index'] || -1;
			console.log('[streaming.js] Radio text received.');
			onRadioTextGetterSucceeded(title, index - 1);
		},
		error: function() {
			console.log('Error: AJAX getRadioText() failed.');
		},
	});
}

function onRadioTextGetterSucceeded(title, index) {
	if (title.length > 1 && index >= 0) {
		$('#data-table').bootstrapTable('updateCell', {
			index: index,
			field: 'URL',
			value: '<strong>' + title + '</strong>',
			silent: true
		})
		console.log('[streaming.js] Update table entry (' + index.toString() + ')');
	}
}

function refreshRadioText() {
	// console.log('[streaming.js] refreshRadioText() called...');
	setTimeout('getRadioText()', 1000);
}

function getStationUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/radioplay.json",
		data: "OnStreamingRefresh=null&prepare=yes&title=radioplay",
		dataType: "json",
		success: function (data) {
			// console.log(data);
			var streaming = data['Streaming'] || false;
			var transition = data['Transition'] || false;
			if (transition) {
				console.log('[streaming.js] Station update received.');
				onStationUpdateSucceeded(streaming);
			}
		},
		error: function() {
			console.log('Error: AJAX getStationUpdate() failed.');
		},
	});
}

function getStreamUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/radiostream.json",
		data: "OnStreamingRefresh=null&prepare=no&title=radiostream",
		dataType: "json",
		success: function (data) {
			// console.log(data);
			var streaming = data['Streaming'] || false;
			setStreamingButtons(streaming);
		},
		error: function() {
			console.log('[streaming.js] AJAX getStreamUpdate() failed.');
		},
	});
}

function onStationUpdateSucceeded(streaming) {
	// $('#data-table').bootstrapTable('refresh');
	$("#data-table").bootstrapTable('refresh', {silent: true});
	$("#streaming-page-header").load("streaming-page-header.html");
	setStreamingButtons(streaming);
}

function setStreamingButtons(streaming) {
	if (streaming) {
		$("#btnPlay").attr('disabled', 'true');
		$("#btnStop").removeAttr('disabled');
	} else {
		$("#btnPlay").removeAttr('disabled');
		$("#btnStop").attr('disabled', 'true');
	}
}

function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		if (action.length > 0) {		
			var found = false;
			if (!found && action === "PLAYSTREAM") {
				sendStreamPlayAction(action);
				found = true;
			}
			if (!found && action === "STOPSTREAM") {
				sendStreamPlayAction(action);
				found = true;
			}
			if (!found && action === "CREATESTREAM") {
				onCreateStationClick();
				found = true;
			}
			if (!found && action === "REVERTSTREAM") {
				sendStreamEditAction(action);
				found = true;
			}
			if (!found && action === "TOGGLEMODE") {
				toggleEditMode();
				// console.log('[streaming.js] onButtonClick() called refreshRadioText()...');
				refreshRadioText();
				found = true;
			}
			console.log('[streaming.js] Table menu button "' + action + '" clicked.');
		}
	}
	return false;
}

function sendStreamPlayAction(action) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnStationsButtonClick=" + action,
		success: function() {
			onButtonClickSucceeded();
		},
		error: function() {
			alert('Error: onButtonClick() failed.');
		}
	});
}

function sendStreamEditAction(action) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnStationsButtonClick=" + action,
		success: function() {
			onContextMenuEditActionSucceeded();
		},
		error: function() {
			alert('Error: onButtonClick() failed.');
		}
	});
}

function setButtonEvents() {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (button.hasAttribute("addClick")) {
			var value = button.getAttribute("addClick");
			if (value.toLowerCase() == "true") {
				button.onclick = onButtonClick;
				console.log('Set onClick for ' + button.id);
			}
		}
	}
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
					'Help on radio streaming',
					'/streamhelp.html?page=' + page.toString(),
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

function createPlayerContextData(action, hash) {
	// Create JSON object
	var data = {
		OnStationsMenuClick : hash,
		Hash : hash,
		Action : action
	};
	return data;
};

function onContextMenuPlayerAction(action, hash) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: createPlayerContextData(action, hash),
		success: function() {
			onContextMenuPlayerActionSucceeded()
		},
		error: function() {
			alert('Error: onContextMenuPlayerAction() failed.');
		}
	});
};


function createEditContextData(action, hash) {
	// Create JSON object
	var data = {
		OnEditorData : action,
		value : hash
	};
	return data;
};

function onContextMenuEditAction(action, hash) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: createEditContextData(action, hash),
		success: function() {
			onContextMenuEditActionSucceeded();
			closeStationConfirmationDialog();
		},
		error: function() {
			alert('Error: onContextMenuEditAction() failed.');
		}
	});
};

function onContextMenuSucceeded() {
	console.log('[streaming.js] Context menu click success action');
};

function onButtonClickSucceeded() {
	console.log('[streaming.js] Button click success action');
};

function onContextMenuEditActionSucceeded() {
	$("#data-table").bootstrapTable('refresh', {silent: true});
	// console.log('[streaming.js] onContextMenuEditActionSucceeded() called refreshRadioText()...');
	refreshRadioText();
}

function onContextMenuPlayerActionSucceeded() {
	// $("#data-table").bootstrapTable('refresh', {silent: true});
};


function showStationConfirmationDialog(header, text, size, logo, position, method, action, hash) {
	var top = position || 120;
	var param1 = "'" + action + "'";
	var param2 = "'" + hash + "'";
	var html;

	html =  '<div class="modal fade" id="stationConfirmationDialog" role="dialog">';
	html += ' <div class="modal-dialog ' + size + '" style="top: ' + top.toString() + 'px;">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <h4 style="margin-left: 20px; margin-right: 20px;" class="modal-body">' + text + '</h4>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="' + method + '(' + param1 + ', ' + param2 + ');"><span class="glyphicon glyphicon-ok" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap main container
	$('#main-container').append(html);

	// Show modal dialog	
	$('#stationConfirmationDialog').on('hidden.bs.modal', function (e) {
        	$(this).remove();
	}).modal().modal('show');
}

function closeStationConfirmationDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}

function onContextMenuEditConfirmation(method, station, action, hash) {
	var icon = '/images/glyphicons/confirm-square.png';
	var text = 'Do you really want to delete station &quot;' + station + '&quot; ?';
	showStationConfirmationDialog("Confirmation", text, "modal-sm", icon, 120, method, action, hash)
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
		var station = target.getAttribute('tvname') || "*";
		var found = false;
		if (!found && action === "PLAYSTREAM") {
			onContextMenuPlayerAction(action, hash);
			found = true;
		}
		if (!found && action === "STOPSTREAM") {
			onContextMenuPlayerAction(action, hash);
			found = true;
		}
		if (!found && action === "EDITSTREAM") {
			onEditStationClick(hash);
			found = true;
		}
		if (!found && action === "CREATESTREAM") {
			onCreateStationClick();
			found = true;
		}
		if (!found && action === "DELETESTREAM") {
			// onContextMenuEditAction(action, hash);
			onContextMenuEditConfirmation("onContextMenuEditAction", station, action, hash); 
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
		if (index === 3)
			return false;
		// Ignore elements with "value" property set
		var value = target.value || "*";
		if (value.length > 1)
			return false;
	}
	return true;
}

function onContextMenuAction(row, $element) {
	var nil = void(0);	
	var action = $element.data("item");
	if (action !== nil) {
		var found = false;
		if (!found && action === "PLAYSTREAM") {
			onContextMenuPlayerAction(action, row.Hash);
			found = true;
		}
		if (!found && action === "EDITSTREAM") {
			onEditStationClick(row.Hash);
			found = true;
		}
		if (!found && action === "CREATESTREAM") {
			onCreateStationClick();
			found = true;
		}
		if (!found && action === "DELETESTREAM") {
			// onContextMenuEditAction(action, row.Hash);
			onContextMenuEditConfirmation("onContextMenuEditAction", row.Originalname, action, row.Hash); 
			found = true;
		}
		console.log('[streaming.js] Context menu action "' + action + '" clicked for "' + row.Hash + '"');
	}
}

function onRowClick(event, row, $element) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnStationsRowClick=" + row.Hash,
		success: onRowClicked(),
		error: function() {
			alert('Error: onRowClick() failed.');
		},
	});
}

function onRowClicked() {
	console.log('[streaming.js] Clicked on row.');
};

function onRowDblClicked() {
	console.log('[streaming.js] Double clicked on row.');
};


function onRowDblClick(event, row, $element) {
    var json = JSON.stringify(row);
    $.ajax({
        type: "POST",
        url: "/ajax/response.html",
        data: "OnStationsDblClick=" + json,
	success: onRowDblClicked(),
        error: function() {
            alert('Error: onRowDblClick() failed.');
        }
    });
}

function onTableLoaded() {
	console.log('[streaming.js] Table is loaded.');
};

function onTableReordered(event, rows) {
	console.log('[streaming.js] Table was reoredered:');
	console.log(rows);
	$.ajax({
		type: "POST",
		url: "/rest/rearranged.json",
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(rows),
		success: function() {
			$('#data-table').bootstrapTable('refresh', {silent: true});
			console.log('[streaming.js] Table reoredered data sent.');
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


function toggleEditMode() {
	var button = $('#btnToggle');
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
		showPopupConfirmationMessage("Reorder rows via Drag'n'Drop enabled.", 'Edit stations');
		console.log('[playlist.js] Edit mode is enabled.');
	} else {
		disableTableEditMode();
		showPopupInfoMessage("Table is locked again.", 'Edit stations');
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
		contextMenu: '#stations-context-menu',
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
		contextMenu: '#stations-context-menu',
		contextMenuTrigger: 'both',
		onContextMenuItem: onContextMenuAction,
		beforeContextMenuRow: beforeContextMenuShow,
		reorderableRows: false,
		useRowAttrFunc: false,
		dragHandle: 'dnd-disabled'
	});	
};


