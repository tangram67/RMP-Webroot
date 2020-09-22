
function thumbNailLoader(value, row, index) {
	var found = false;
	var mime = row.Mime;
	var glyphicon = "glyphicon-file";
	if (!found && mime.indexOf("folder") !== -1) {
		glyphicon = "glyphicon-folder-open";
		found = true;
	}	
	if (!found && mime.indexOf("audio") !== -1) {
		glyphicon = "glyphicon-music";
		found = true;
	}	
	if (!found && mime.indexOf("video") !== -1) {
		glyphicon = "glyphicon-film";
		found = true;
	}	
	if (!found && mime.indexOf("image") !== -1) {
		glyphicon = "glyphicon-picture";
		found = true;
	}	
	if (!found && mime.indexOf("zip") !== -1) {
		glyphicon = "glyphicon-compressed";
		found = true;
	}	
	if (!found && mime.indexOf("gz") !== -1) {
		glyphicon = "glyphicon-compressed";
		found = true;
	}	
	if (!found && mime.indexOf("tar") !== -1) {
		glyphicon = "glyphicon-compressed";
		found = true;
	}	
	if (!found && mime.indexOf("compressed") !== -1) {
		glyphicon = "glyphicon-compressed";
		found = true;
	}	
	if (!found && mime.indexOf("text") !== -1) {
		glyphicon = "glyphicon-book";
		found = true;
	}	
	return "<span class=\"glyphicon " + glyphicon + "\"></span>";
}

function useHTML5() {
	var nil = void(0);
	var canvas = document.createElement("canvas");
	if (canvas !== nil) {
		var context = canvas.getContext("2d");
		if (context !== nil)
			return true;
	}
	return false;
}


function showURL(url, name, mime) {
	console.log('[explorer.js] showURL() for URL "' + url + '" to file "' + name + '"');
	//var uri = 'data:' + mime + ';charset=utf-8,' + unescape(decodeURIComponent(url));
	var uri = unescape(decodeURIComponent(url, 'UTF-8'));
	var win = window.open(uri, name);
	win.focus();
}

function saveURL(url, name, mime) {
	console.log('[explorer.js] saveURL() for URL "' + url + '" to file "' + name + '" of type "' + mime + '"');
	var link = document.createElement('a');
	link.href = url;
	link.setAttribute('type', mime + ';charset=utf-8;');
	link.setAttribute('download', name);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function openURL(url, name, ext, mime) {
	var suported = ext === 'txt' || ext === 'log' || ext === 'conf' || ext === 'json' || ext === 'sh' || 
				   ext === 'cpp' || ext === 'hpp' || ext === 'c' || ext === 'h' || ext === 'pdf' || 
				   ext === 'js' || ext === 'css';
	if (suported) {
		showURL(url, name, mime);
	} else {
		saveURL(url, name, mime);
	}
}

function openHtmlPlayer(row) {
	console.log('[explorer.js] Open native HTML5 media player for file \"' + row.File + '\"');
	var nil = void(0);
	var ident = row.Hash;
	var stream = document.getElementById(ident);
	if (stream !== nil) {
		stream.play();
	} else {
		alert('[explorer.js] Error: openHtmlPlayer() failed for file \"' + row.File + '\", ID \"' + ident + '\" not found.');
	}
}

function openJavaPlayer(row) {
	console.log('[explorer.js] Open jPlayer for file "' + row.File + '"');
	$("#modalMediaPlayer").jPlayer("setMedia", {
		title: row.Name, 
		flac: '/fs0' + row.File,
		mp3: '/fs0' + row.File
	});
	$("#modalMediaPlayerDialog").modal('show');
}

function openMediaPlayer(row) {
	console.log('[explorer.js] Open Mediaplayer5 for file "' + row.File + '"');
	var nil = void(0);
	var ident = row.Hash;
	var element = document.getElementById(ident);
	if (element !== nil) {
		var audio = $(element);
		mediaplayer5.open(audio);
	} else {
		alert('[explorer.js] Error: openMediaPlayer() failed for file \"' + row.File + '\", ID \"' + ident + '\" not found.');
	}
}

function openImagePreview(ident) {
	var nil = void(0);
	var element = document.getElementById(ident);
	if (element !== nil) {
		var image = $(element);
		lightbox.start(image);
	} else {
		alert('[explorer.js] Error: openImagePreview() failed, ID \"' + ident + '\" not found.');
	}
}

function beforeContextMenuShow(event, row, button) {
	// Do not show context menu for action column
	// console.log('[streaming.js] Before show event : ', event);
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		// Ignore cell index 3
		var index = target.cellIndex || 0;
		if (index === 4)
			return false;
		// Ignore elements with "value" property set
		var value = target.value || "*";
		if (value.length > 1)
			return false;
	}
	return true;
}

function onFileChosen(event) {
	var files,
	    file,
	    name,
	    names = '',
	    extension,
	    display = document.getElementById("edDocumentSelected");
	console.log(event);
	console.log(event.target);
	files = event.target.files;
	for (var i = 0, last = files.length-1, len = files.length; i < len; i++) {
		file = files[i];
		name = file.name;
		extension = file.name.split(".").pop();
		if (i !== last) {
			names += (name + ', ');
		} else {
			names += name;
		}
		console.log('File <' + name + '> of type <' + extension + '> selected.');
	}
	if (names.length > 0) {
		display.value = names;
	} else {
		display.value = "<No files selected>";
	}
};

function setFileEvents() {
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.hasAttribute("addFileEvent")) {
			var value = input.getAttribute("addFileEvent");
			if (value.toLowerCase() == "true") {
			    input.addEventListener("change", onFileChosen, false);
				console.log('Set onFileChosen for ' + input.id);
			}
		}
	}
};

function onHeaderClick(event) {
	// var path = $('#explorer-header-path').attr('path');
	// mediaPlayerTestClick5(path);
	console.log('[explorer.js] onHeaderClick() called.');
}

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
					'File explorer help',
					'/explorerhelp.html',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[explorer.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[explorer.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}

function onRowClick(event, row, $element, field) {
	if (field === 4)
		return false;
	if (row.Folder) {
		sendRowClickEvent(row);
		sendPathChangeEvent(row.PathURL);
	} else {
		if (row.Regular) {
			var url = '/fs0' + row.FileURL;
			var supported = row.Ext ===	'flac' || row.Ext === 'mp3' || row.Ext === 'wav' || row.Ext === 'm4a';
			if (useHTML5() && row.Audio && row.HTML5) {
				if (supported) {
					//openJavaPlayer(row);
					openMediaPlayer(row);
					console.log('[explorer.js] Clicked on row for supported audio file <' + row.Name + '> Fullname <' + row.File + '>');
				} else {
					openURL(url, row.Name, row.Ext, row.Mime);
					console.log('[explorer.js] Clicked on row for generic audio file <' + row.Name + '> Fullname <' + row.File + '>');
				}
			} else {
				if (row.Image) {
					openImagePreview(row.Hash);					
					console.log('[explorer.js] Clicked on row for image file <' + row.Name + '> Fullname <' + row.File + '>');
				} else {
					openURL(url, row.Name, row.Ext, row.Mime);
					console.log('[explorer.js] Clicked on row for generic file <' + row.Name + '> Fullname <' + row.File + '>');
				}
			}
		}
	}
}

function sendRowClickEvent(row) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnExplorerClick=" + row.FileURL,
		success: onRowClicked(row),
		error: function() {
			alert('[explorer.js] Error: sendRowClickEvent() failed.');
		},
	});
};

function onRowClicked(row) {
	console.log('[explorer.js] Clicked on row for folder <' + row.Name + '> Fullname <' + row.File + '>');
};

function onTableLoaded() {
	console.log('[explorer.js] onTableLoaded() called.');
};

function setTableEvents() {
    $('#data-table').bootstrapTable()
		.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
		.on('click-row.bs.table', onRowClick)
		.on('post-body.bs.table', onTableLoaded);
};

function onPathButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var path = target.getAttribute('folder');
		console.log('[explorer.js] onPathButtonClick() called for <' + path + '>');
		sendPathChangeEvent(path);
	} else {
        alert('[explorer.js] Error: onPathButtonClick() target undefined.');
	}
};

function explorerViewRefresh() {
	console.log('[explorer.js] explorerViewRefresh() called.');
	$('#data-table').bootstrapTable('refresh', {pageNumber: 1, pageSize: 10});
	$('#explorer-header').load('explorer-header-text.html');
	$('#explorer-button-group').load('explorer-button-group.html');
	$('#explorer-audio-group').load('explorer-audio-group.html');
	$('#explorer-image-group').load('explorer-image-group.html');

};

function sendPathChangeEvent(path) {
	// Send synchronous event on path change	
	$.ajax({
		type: "GET",
		url: "/ajax/response.html",
		data: "OnPathChanged=null&prepare=yes&title=browse&path=" + path,
		success: function() {
			explorerViewRefresh();
			console.log('[explorer.js] Error: sendPathChangeEvent() succeded.');
		},
		error: function() {
			alert('[explorer.js] Error: sendPathChangeEvent() failed.');
		}
	});
};

function onActionButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var folder = false;
		if (event.cancelable) {
			event.preventDefault();
		}
		var action = target.getAttribute('value') || "*";
		var hash = target.getAttribute('hash') || "*";
		var file = target.getAttribute('tvname') || "*";
		var found = false;
		if (!found && action === "RENAMEFILE") {
			onExplorerActionClick(action, file, hash, folder);
			found = true;
		}
		if (!found && action === "RENAMEFOLDER") {
			folder = true;			
			onExplorerActionClick(action, file, hash, folder);
			found = true;
		}
		if (!found && action === "DELETEFILE") {
			onExplorerActionConfirmation("onExplorerEditAction", action, file, hash, folder); 
			found = true;
		}
		if (!found && action === "DELETEFOLDER") {
			folder = true;			
			onExplorerActionConfirmation("onExplorerEditAction", action, file, hash, folder); 
			found = true;
		}
		console.log('[explorer.js] Table row button "' + action + '" clicked for "' + hash + '"');
	}
	return false;
}


function showExplorerConfirmationDialog(header, text, size, logo, position, method, action, file, hash) {
	var top = position || 120;
	var param1 = "'" + action + "'";
	var param2 = "'" + urlEncode(file) + "'";
	var param3 = "'" + hash + "'";
	var html;

	html =  '<div class="modal fade" id="explorerConfirmationDialog" role="dialog">';
	html += ' <div class="modal-dialog ' + size + '" style="top: ' + top.toString() + 'px;">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db::application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <h4 style="margin-left: 20px; margin-right: 20px;" class="modal-body">' + text + '</h4>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="' + method + '(' + param1 + ', ' + param2 + ', ' + param3 + ');"><span class="glyphicon glyphicon-ok" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap main container
	$('#main-container').append(html);

	// Show modal dialog	
	$('#explorerConfirmationDialog').on('hidden.bs.modal', function (e) {
        	$(this).remove();
	}).modal().modal('show');
}

function closeExplorerConfirmationDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}

function onExplorerActionConfirmation(method, action, file, hash, folder) {
	var icon = '/images/glyphicons/confirm-square.png';
	var name = folder ? 'folder' : 'file'
	var text = 'Do you really want to delete ' + name + ' &quot;' + file + '&quot; ?';
	showExplorerConfirmationDialog("Confirmation", text, "modal-sm", icon, 120, method, action, file, hash)
}


function createExplorerContextData(action, file, hash) {
	// Create JSON object
	var data = {
		OnExplorerAction : action,
		source : file,
		hash : hash
	};
	return data;
};

function onExplorerEditAction(action, file, hash) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.json",
		data: createExplorerContextData(action, file, hash),
		success: function() {
			onExplorerEditActionSucceeded();
			closeExplorerConfirmationDialog();

		},
		error: function(xhr, textStatus, errorThrown) {
			closeExplorerConfirmationDialog();
			var text = errorThrown || textStatus || "Unexpected error";
			showMessageDialog(
				'File system error',
				'<h4>Execution failed: "' + text + '"</h4>',
				'modal-md',
				'/images/logo36.png'
			);
		}
	});
};

function onContextMenuSucceeded() {
	console.log('[explorer.js] Context menu click success action');
};

function onButtonClickSucceeded() {
	console.log('[explorer.js] Button click success action');
};

function onExplorerEditActionSucceeded() {
	$("#data-table").bootstrapTable('refresh', {silent: true});
	//$("#credentials-header-text").load("credentials-header-text.html");
	console.log('[credentials.js] Action button click success action');
}


function disableElement(name, disabled) {
	var $button	= $('#' + name);
	if (disabled) {
		$button.prop('disabled', true);
		$button.addClass('disabled');
		$button.attr('disabled','disabled');
	} else {
		$button.prop('disabled', false);
		$button.removeClass('disabled');
		$button.removeAttr('disabled');
	}
}


function onExplorerActionClick(action, file, hash, folder) {
	var name = folder ? 'folder' : 'file'
	showRenameFileDialog(
		'Rename ' + name,
		'Enter new file name:',
		 action,
		 file,
		'modal-md',
		'/images/logo36.png'
	);
}

function showRenameFileDialog(header, text, action, file, size, logo, glyphicon) {
	var html;
	var glyph = glyphicon || "glyphicon-ok";
	var attribute = action || "*";
	var value = urlEncode(file);
	var placeholder = sanitizeString(file);
	
	html =  '<div class="modal fade" id="renameFileDialog" role="dialog" input-value="' + value + '" input-action="' + attribute + '">';
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
	html += '    <input type="text" class="form-control" name="edInputDialogText" id="edInputDialogText" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="' + placeholder + '" />';
	html += '   </div>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="onRenameFileDialogDoneClick(event);"><span class="glyphicon ' + glyph + '" style="pointer-events:none" aria-hidden="true"></span></button>';
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
	$dialog = $('#renameFileDialog');
	$dialog.on('shown.bs.modal', function() {
		$("#edInputDialogText").on('keyup', function (e) {
			var event = e || window.event;
			var key = event.which || event.keyCode;
			if (key == 13) {
				// Enter pressed
				console.log('[explorer.js] showRenameFileDialog() Enter pressed.');
				onRenameFileDialogDoneClick(e);
				return false;
			}
		}).focus();
	}).on('hidden.bs.modal', function (e) {
       	$(this).remove();
    }).modal().modal('show');
}

function onRenameFileDialogDoneClick(event) {
	var value = $("#edInputDialogText").val() || "";
	value = sanitizeString(value);
	if (value.length > 0) {
		console.log('[messagedialog.js] onInputFormDoneClick() Input is <' + value + '>');
		sendRenameFileDialogResult(value);
	}	
}

function sendRenameFileDialogResult(value) {
	// Get action from modal form attribute
	var source = $('#renameFileDialog').attr('input-value') || "*";
	var action = $('#renameFileDialog').attr('input-action') || "*";
	var destination = urlEncode(value);
	
	// Store result value in DOM
	$('#renameFileDialog').attr('input-result', destination);
	
	// Create JSON object
	var data = {
		OnExplorerAction : action,
		source : source,
		destination : destination
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.json",
		data: data,
		success: function() {
			var value  = $('#inputDialog').attr('input-value')  || "*";
			var action = $('#inputDialog').attr('input-action') || "*";
			var result = $('#inputDialog').attr('input-result') || "*";
			closeRenameFileModalDialog();
			onExplorerEditActionSucceeded();
		},
		error: function(xhr, textStatus, errorThrown) {
			closeRenameFileModalDialog();
			var text = errorThrown || textStatus || "Unexpected error";
			showMessageDialog(
				'File system error',
				'<h4>Rename failed: "' + text + '"</h4>',
				'modal-md',
				'/images/logo36.png'
			);
		}
	});
}


function closeRenameFileModalDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}




