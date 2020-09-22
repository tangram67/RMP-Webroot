
function executeFunctionByName(method, context /*, args */) {
	// Experimental.....
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = method.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

function onDialogClosed(method) {
	executeFunctionByName(method, "window");
}


function callCloseDialogMethod(action, result) {
	console.log('[messagedialog.js] callCloseDialogMethod() called for action "' + action + '" and result "' + result + '"');
	if (typeof window["onMessageDialogClosed"] === "function") {
		onMessageDialogClosed(action, result);
	} else {
		console.log('[messagedialog.js] Method onMessageDialogClosed() not found.');
	}
}


// function showMessageDialog(header, content, size = 'modal-sm', logo = '/images/logo.gif')
function showMessageDialog(header, content, size, logo) {
	var load = content.length && content[0] == '/';
	var html;

	html =  '<div class="modal fade" id="messageDialog" role="dialog">';
	html += ' <div class="modal-dialog ' + size + '">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	if (load) {
		html += '   <div id="messageModalBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body"><span>Loading data </span><span class="glyphicon glyphicon-refresh normal-right-spinner"></span></div>';
	} else {
		html += '   <div id="messageModalBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body">' + content + '</div>';
	}
	html += '   <div class="modal-footer">';
	html += '    <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-ok" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap container:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$('#main-container').append(html);

	// Show modal dialog	
	$('#messageDialog').on('hidden.bs.modal', function (e) {
        	$(this).remove();
	}).modal().modal('show');

	// Load dynamic content into modal message dialog body
	if (load) {
		var title = 'dialog';
		var uri = content.indexOf('?') > 0 ? '&' : '?';
		var url = '/rest' + content + uri + 'OnDialogData=null&prepare=no&title=' + title;
		var $body = $('#messageModalBody');
		$body.load(url, function(responseTxt, statusTxt, xhr) {
			if (statusTxt == 'success') {
				return;
			}
			$body.html('[' + title + '] Failure: ' + xhr.status + ' - ' + xhr.statusText);
		});
	}
}


// function showSelectDialog(header, content, action = 'SELECTPLAYLIST', size = 'modal-sm', logo = '/images/logo.gif', glyphicon = 'glyphicon-ok')
function showSelectDialog(header, content, action, size, logo, glyphicon) {
	var attribute = action || "select";
	var method = "onSelectDialogClosed(item);";
	var glyph = glyphicon || "glyphicon-ok";
	var load = content.length && content[0] == '/';
	var html;

	html =  '<div class="modal fade" id="selectDialog" role="dialog" dialog-action="' + attribute + '" on-close-action="' + method + '">';
	html += ' <div class="modal-dialog ' + size + '">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	if (load) {
		html += '   <div id="selectModalBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body"><span>Loading data </span><span class="glyphicon glyphicon-refresh normal-right-spinner"></span></div>';
	} else {
		html += '   <div id="selectModalBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body">' + content + '</div>';
	}
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="onSelectDialogDoneClick(event)"><span class="glyphicon ' + glyph + '" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap container:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$('#main-container').append(html);
	
	// Bind onclick() functions to static entries
	if (!load) {
		bindSelectDialogEvents();
	}

	// Show modal dialog
	$dialog = $('#selectDialog');
	$dialog.on('hidden.bs.modal', function (e) {
		$(this).remove();
	});
	$dialog.modal();
	$dialog.modal('show');

	// Load dynamic content into select dialog body
	if (load) {
		var title = 'select';
		var uri = content.indexOf('?') > 0 ? '&' : '?';
		var url = '/rest' + content + uri + 'OnDialogData=null&prepare=no&title=' + title;
		var $body = $('#selectModalBody');
		$body.load(url, function(responseTxt, statusTxt, xhr) {
			if (statusTxt == 'success') {
				bindSelectDialogEvents();
				return;
			}
			$body.html('[' + title + '] Failure: ' + xhr.status + ' - ' + xhr.statusText);
		});
	}
}

function bindSelectDialogEvents() {
	// Bind onclick() functions to entries
	$('#selectModalBody :input').each(function() {
		$(this).on('click', function(e) {
			var target = e.target || e.srcElement || e.originalTarget;
			if (void(0) != target) {
				$('#selectModalBody :input').removeAttr("checked");
				target.setAttribute("checked", "true");
			}
		});
	});
}

function onSelectDialogDoneClick(event) {
	var index = -1;
	var value = "";

	$('#selectModalBody :input').each(function() {
		var checked = $(this).attr('checked');
		if (void(0) != checked) {
			var elem = $(this).next('label');
			if (void(0) != elem) {
				value = $(elem).text() || "";
				index = $(elem).attr('index') || -1;
			}
		}
	});

	console.log('[messagedialog.js] onSelectDialogDoneClick() Selected item [' + index.toString() + '] is <' + value + '>');
	if (index >= 0 && value.length > 0) {
		sendSelectResult(value, index);
	}	
}

function sendSelectResult(item, index) {
	// Get action from modal form attribute
	var action = $('#selectDialog').attr('dialog-action') || "select";
	var method = $('#selectDialog').attr('on-close-action') || "";
	$('#selectDialog').attr('dialog-result', item);
	
	// Create JSON object
	var data = {
		OnDialogData: action,
		prepare: "no",
		title: "select",
		selected : item,
		index : index
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			var action = $('#selectDialog').attr('dialog-action') || "select";
			var result = $('#selectDialog').attr('dialog-result') || "result";
			closeModalDialog();
			mainMenuRefresh();
			callCloseDialogMethod(action, result);
		},
		error: function() {
			closeModalDialog();
			alert('Error: sendSelectResult() failed.');
		}
	});
}


// function showRenameDialog(header, content, action = 'SELECTPLAYLIST', size = 'modal-sm', logo = '/images/logo.gif', glyphicon = 'glyphicon-ok')
function showRenameDialog(header, text, content, action, size, logo, glyphicon) {
	var attribute = action || "rename";
	var method = "onDeleteDialogClosed(item);";
	var glyph = glyphicon || "glyphicon-ok";
	var load = content.length && content[0] == '/';
	var html;

	html =  '<div class="modal fade" id="renameDialog" role="dialog" dialog-action="' + attribute + '" on-close-action="' + method + '">';
	html += ' <div class="modal-dialog ' + size + '">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <div id="renameModalBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body">';
	if (load) {
		html += '    <div id="renameModalBodyData"><span>Loading data </span><span class="glyphicon glyphicon-refresh normal-right-spinner"></span></div>';
	} else {
		html += '    <div id="renameModalBodyData">' + content + '</div>';
	}
	html += '    <div id="renameModalBodyInput">';
	html += '     <h4>' + text + '</h4>';
	html += '     <input type="text" class="form-control" name="edRenameDialogText" id="edRenameDialogText" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="*" />';
	html += '    </div>';
	html += '   </div>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="onRenameDialogDoneClick(event)"><span class="glyphicon ' + glyph + '" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap container:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$('#main-container').append(html);

	// Bind onclick() functions to static entries
	if (!load) {
		bindRenameDialogEvents();
	}

	// Show modal dialog
	$dialog = $('#renameDialog');
	$dialog.on('shown.bs.modal', function() {
		$("#edRenameDialogText").on('keyup', function (e) {
			var event = e || window.event;
			var key = event.which || event.keyCode;
			if (key == 13) {
				// Enter pressed
				console.log('[messagedialog.js] showRenameDialog() Enter pressed.');
				onRenameDialogDoneClick(e);
				return false;
			}
		}).focus();
	}).on('hidden.bs.modal', function (e) {
       		$(this).remove();
    	}).modal().modal('show');

	// Load dynamic content into rename dialog body
	if (load) {
		var title = 'rename';
		var uri = content.indexOf('?') > 0 ? '&' : '?';
		var url = '/rest' + content + uri + 'OnDialogData=null&prepare=no&title=' + title;
		var $body = $('#renameModalBodyData');
		$body.load(url, function(responseTxt, statusTxt, xhr) {
			if (statusTxt == 'success') {
				bindRenameDialogEvents();
				return;
			}
			$body.html('[' + title + '] Failure: ' + xhr.status + ' - ' + xhr.statusText);
		});
	}
}

function bindRenameDialogEvents() {
	// Bind onclick() functions to entries
	$('#renameModalBodyData :input').each(function() {
		
		// Set default value for input 
		var checked = this.hasAttribute('checked');
		if (checked) {
			var valid = "true" === this.getAttribute('checked')
			if (valid) {
				var elem = $(this).next('label');
				if (void(0) != elem) {
					value = $(elem).text() || "";
					if (value.length > 0) {
						$('#edRenameDialogText').val(value);
					}
				}
			}
		}
		
		// Set on list item click action
		$(this).on('click', function(e) {
			var target = e.target || e.srcElement || e.originalTarget;
			if (void(0) != target) {
				$('#renameModalBodyData :input').removeAttr("checked");
				target.setAttribute("checked", "true");
				var elem = $(target).next('label');
				if (void(0) != elem) {
					value = $(elem).text() || "";
					if (value.length > 0) {
						$('#edRenameDialogText').val(value);
					}
				}				
			}
		});
		
	});
}

function onRenameDialogDoneClick(event) {
	var index = -1;
	var value = "";

	$('#renameModalBodyData :input').each(function() {
		var checked = $(this).attr('checked');
		if (void(0) != checked) {
			var elem = $(this).next('label');
			if (void(0) != elem) {
				value = $(elem).text() || "";
				index = $(elem).attr('index') || -1;
			}
		}
	});

	value = sanitizeString(value);
	if (index >= 0 && value.length > 0) {
		console.log('[messagedialog.js] onRenameDialogDoneClick() Selected item [' + index.toString() + '] is <' + value + '>');
		sendRenameResult(value, index);
	}	
}

function sendRenameResult(item, index) {
	// Get action from modal form attribute
	var action = $('#renameDialog').attr('dialog-action') || "rename";
	var method = $('#renameDialog').attr('on-close-action') || "";
	var value = $("#edRenameDialogText").val() || "";
	$('#renameDialog').attr('dialog-result', value);
	
	// Create JSON object
	var data = {
		OnDialogData: action,
		prepare: "no",
		title: "rename",
		selected : item,
		renamed : value,
		index : index
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			var action = $('#renameDialog').attr('dialog-action') || "rename";
			var result = $('#renameDialog').attr('dialog-result') || "result";
			closeModalDialog();
			mainMenuRefresh();
			callCloseDialogMethod(action, result);
		},
		error: function() {
			closeModalDialog();
			alert('Error: sendRenameResult() failed.');
		}
	});
}


// function inputFormQuery(header, text, action = 'NEWLAYLIST', size = 'modal-sm', logo = '/images/logo.gif', glyphicon = 'glyphicon-ok')
function inputFormQuery(header, text, action, size, logo, glyphicon, placeholder) {
	var html;
	var glyph = glyphicon || "glyphicon-ok";
	var method = "onInputDialogClosed(item);";
	var attribute = action || "input";
	var value = placeholder || '*';
	
	html =  '<div class="modal fade" id="inputDialog" role="dialog" input-action="' + attribute + '" on-close-action="' + method + '">';
	html += ' <div class="modal-dialog ' + size + '">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <div id="inputDialogBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body">';
	html += '    <h4>' + text + '</h4>';
	html += '    <input type="text" class="form-control" name="edInputDialogText" id="edInputDialogText" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="' + value + '" />';
	html += '   </div>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="onInputFormDoneClick(event);"><span class="glyphicon ' + glyph + '" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap container:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$('#main-container').append(html);
	
	// Show modal input form	
	$dialog = $('#inputDialog');
	$dialog.on('shown.bs.modal', function() {
		$("#edInputDialogText").on('keyup', function (e) {
			var event = e || window.event;
			var key = event.which || event.keyCode;
			if (key == 13) {
				// Enter pressed
				console.log('[messagedialog.js] inputFormQuery() Enter pressed.');
				onInputFormDoneClick(e);
				return false;
			}
		}).focus();
	}).on('hidden.bs.modal', function (e) {
        	$(this).remove();
    	}).modal().modal('show');
}

function onInputFormDoneClick(event) {
	var value = $("#edInputDialogText").val() || "";
	value = sanitizeString(value);
	if (value.length > 0) {
		console.log('[messagedialog.js] onInputFormDoneClick() Input is <' + value + '>');
		sendInputResult(value);
	}	
}

function sendInputResult(value) {
	// Get action from modal form attribute
	var action = $('#inputDialog').attr('input-action') || "input";
	var method = $('#inputDialog').attr('on-close-action') || "";
	$('#inputDialog').attr('input-result', value);
	
	// Create JSON object
	var data = {
		OnDialogData: action,
		prepare: "no",
		title: "input",
		input : value
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			var action = $('#inputDialog').attr('input-action') || "input";
			var result = $('#inputDialog').attr('input-result') || "result";
			closeModalDialog();
			mainMenuRefresh();
			callCloseDialogMethod(action, result);
		},
		error: function() {
			closeModalDialog();
			alert('Error: sendInputResult() failed.');
		}
	});
}


function closeModalDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}

