
function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		var disabled = target.getAttribute('disabled') || "*";
		if ("*" === disabled && action.length > 0) {		
			var found = false;
			if (!found && action === "CREATEUSER") {
				onCreateUserClick();
				found = true;
			}
			if (!found && action === "LOGONUSER") {
				changeLoginUser();
				found = true;
			}
			if (!found && action === "REVERTUSER") {
				sendCredentialEditAction(action);
				found = true;
			}
			if (!found && action === "TOGGLEMODE") {
				toggleEditMode();
				found = true;
			}
			console.log('[credentials.js] Button "' + action + '" clicked.');
		}
	}
	return false;
}

function sendCredentialEditAction(action) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnCredentialData=" + action,
		success: function() {
			onContextMenuEditActionSucceeded();
		},
		error: function(xhr, textStatus, errorThrown) {
			var text = errorThrown || textStatus || "Unexpected error";
			showMessageDialog(
				'Credential error',
				'<h4>Edit credential failed: "' + text + '"</h4>',
				'modal-md',
				'/images/logo36.png'
			);
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
					'Help on user management',
					'/streamhelp.html?page=' + page.toString(),
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[credentials.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[credentials.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function createEditContextData(action, username) {
	// Create JSON object
	var data = {
		OnCredentialData : action,
		username : username
	};
	return data;
};

function onContextMenuEditAction(action, username) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: createEditContextData(action, username),
		success: function() {
			onContextMenuEditActionSucceeded();
			closeUserConfirmationDialog();

		},
		error: function(xhr, textStatus, errorThrown) {
			closeUserConfirmationDialog();
			var text = errorThrown || textStatus || "Unexpected error";
			showMessageDialog(
				'Credential error',
				'<h4>Edit credential failed: "' + text + '"</h4>',
				'modal-md',
				'/images/logo36.png'
			);
		}
	});
};

function onContextMenuSucceeded() {
	console.log('[credentials.js] Context menu click success action');
};

function onButtonClickSucceeded() {
	console.log('[credentials.js] Button click success action');
};

function onContextMenuEditActionSucceeded() {
	$("#data-table").bootstrapTable('refresh', {silent: true});
	$("#credentials-header-text").load("credentials-header-text.html");
}

function changeLoginUser() {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnCredentialData=LOGONUSER",
		success: function() {
			changeLoginUserSucceeded();
		},
		error: function() {
			alert('Error: changeLoginUser() failed.');
		}
	});
}

function changeLoginUserSucceeded() {
	// Reload current page to force digest logon dialog
	window.location.href = "/app/system/credentials.html?prepare=yes";
}

function showUserConfirmationDialog(header, text, size, logo, position, method, action, username) {
	var top = position || 100;
	var param1 = "'" + action + "'";
	var param2 = "'" + username + "'";
	var html;

	html =  '<div class="modal fade" id="userConfirmationDialog" role="dialog">';
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
	$('#userConfirmationDialog').on('hidden.bs.modal', function (e) {
        	$(this).remove();
	}).modal().modal('show');
}

function closeUserConfirmationDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}

function onContextMenuEditConfirmation(method, action, username) {
	var icon = '/images/glyphicons/confirm-square.png';
	var text = 'Do you really want to remove user &quot;' + username + '&quot; ?';
	showUserConfirmationDialog("Confirmation", text, "modal-sm", icon, 100, method, action, username)
}

function onActionButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		var username = target.getAttribute('username') || "*";
		var disabled = target.getAttribute('disabled') || "*";
		if ("*" === disabled && action.length > 1) {
			var found = false;
			if (!found && action === "EDITUSER") {
				onEditUserClick(username);
				found = true;
			}
			if (!found && action === "CREATEUSER") {
				onCreateUserClick();
				found = true;
			}
			if (!found && action === "DELETEUSER") {
				// Show confirmation dialog for onContextMenuEditAction(action, username);
				onContextMenuEditConfirmation("onContextMenuEditAction", action, username);
				found = true;
			}
			if (!found && action === "TESTUSER") {
				// Show confirmation dialog for onContextMenuEditAction(action, username);
				onContextMenuEditConfirmation("onContextMenuEditAction", action, username);
				found = true;
			}
			console.log('[credentials.js] Table row button "' + action + '" clicked for "' + username + '"');
		}
	}
	return false;
}


function beforeContextMenuShow(event, row, button) {
	// Do not show context menu for action column
	// console.log('[credentials.js] Before show event : ', event);
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		// Ignore cell index 5 --> actions menu
		var index = target.cellIndex || 0;
		if (index === 5)
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
	var disabled = $element.hasClass("disabled");
	if (action !== nil && !disabled) {
		var found = false;
		if (!found && action === "EDITUSER") {
			onEditUserClick(row.C_Username);
			found = true;
		}
		if (!found && action === "CREATEUSER") {
			onCreateUserClick();
			found = true;
		}
		if (!found && action === "DELETEUSER") {
			// onContextMenuEditAction(action, row.C_Username);
			onContextMenuEditConfirmation("onContextMenuEditAction", action, row.C_Username);
			found = true;
		}
		console.log('[credentials.js] Context menu action "' + action + '" clicked for "' + row.C_Username + '"');
	}
}

function onRowClick(event, row, $element) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnCredentialsRowClick=" + row.C_Username,
		success: onRowClicked(),
		error: function() {
			alert('Error: onRowClick() failed.');
		},
	});
}

function onRowClicked() {
	console.log('[credentials.js] Clicked on row.');
};

function onRowDblClicked() {
	console.log('[credentials.js] Double clicked on row.');
};


function onRowDblClick(event, row, $element) {
    var json = JSON.stringify(row);
    $.ajax({
        type: "POST",
        url: "/ajax/response.html",
        data: "OnCredentialsDblClick=" + json,
	success: onRowDblClicked(),
        error: function() {
            alert('Error: onRowDblClick() failed.');
        }
    });
}

function onTableLoaded() {
	console.log('[credentials.js] Table is loaded.');
};

function onTableReordered(event, rows) {
	console.log('[credentials.js] Table was reoredered:');
	console.log(rows);
	$.ajax({
		type: "POST",
		url: "/rest/userordered.json",
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(rows),
		success: function() {
			$('#data-table').bootstrapTable('refresh', {silent: true});
			console.log('[credentials.js] Table reoredered data sent.');
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

function setActiveElements(userlevel) {
	if (userlevel > 2) {
		$("#btnAdd").removeAttr('disabled');
	} else {
		$("#btnAdd").attr('disabled', 'true');
	}
}

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
		console.log('[credentials.js] Edit mode is enabled.');
	} else {
		disableTableEditMode();
		showPopupInfoMessage("Table is locked again.", 'Edit stations');
		console.log('[credentials.js] Edit mode is disabled.');
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
		contextMenu: '#credentials-context-menu',
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
		contextMenu: '#credentials-context-menu',
		contextMenuTrigger: 'both',
		onContextMenuItem: onContextMenuAction,
		beforeContextMenuRow: beforeContextMenuShow,
		reorderableRows: false,
		useRowAttrFunc: false,
		dragHandle: 'dnd-disabled'
	});	
};


