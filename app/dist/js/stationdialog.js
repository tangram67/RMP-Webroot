
function callCloseEditorMethod(action, result) {
	console.log('[stationdialog.js] callCloseMethod() called for action "' + action + '" and result "' + result + '"');
	if (typeof window["onEditDialogClosed"] === "function") {
		onEditDialogClosed(action, result);
	} else {
		console.log('[stationdialog.js] Method onEditDialogClosed() not found.');
	}
}

function onEditTextKeyPressed(e) {
	var event = e || window.event;
	var key = event.which || event.keyCode;
	if (key == 13) {
		// Enter pressed
		console.log('[stationdialog.js] onEditTextKeyPressed() Enter pressed.');
		onEditDialogDoneClick(e);
		return false;
	}
}

// function showEditDialog(header, content, action = 'SELECTPLAYLIST', size = 'modal-sm', logo = '/images/logo.gif', glyphicon = 'glyphicon-ok')
function showEditDialog(header, text, content, value, action, size, logo, glyphicon) {
	var parameter = value || "*";
	var attribute = action || "*";
	var glyph = glyphicon || "glyphicon-ok";
	var load = parameter.length > 1;
	var html;

	html =  '<div class="modal fade" id="editDialog" role="dialog" dialog-action="' + attribute + '" dialog-value="' + parameter + '">';
	html += ' <div class="modal-dialog ' + size + '">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <div id="editDialogBody" style="margin-left: 20px; margin-right: 20px;" class="modal-body">';
	html += '    <h4>' + text + '</h4>';
	if (load) {
		html += '    <label class="control-label">Name</label>';
		html += '    <input type="text" class="form-control" name="edStationName" id="edStationName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    <div class="spacer8"></div>';
		html += '    <label class="control-label">URL</label>';
		html += '    <input type="text" class="form-control" name="edStationURL" id="edStationURL" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    <div class="spacer8"></div>';
		html += '    <label class="control-label">Metadata display order</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn station-list-box-elements">';
		html += '        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">';
		html += '          <span class="caret" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </a>';
		html += '        <ul id="ul-select" class="dropdown-menu">';
		html += '          <li value="Artist - Track"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Artist - Track</a></li>';
		html += '          <li value="Track - Artist"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Track - Artist</a></li>';
		html += '          <li value="Disabled"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Disabled</a></li>';
		html += '        </ul>';
		html += '      </span>';
		html += '      <input type="text" class="form-control list-box-input" id="lbxMetadata" name="lbxMetadata" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    </div>';
		html += '    <div class="spacer6"></div>';
	} else {
		html += '    <label class="control-label">Name</label>';
		html += '    <input type="text" class="form-control" name="edStationName" id="edStationName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Station name..." />';
		html += '    <div class="spacer8"></div>';
		html += '    <label class="control-label">URL</label>';
		html += '    <input type="text" class="form-control" name="edStationURL" id="edStationURL" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Stream URL..." />';
		html += '    <div class="spacer8"></div>';
		html += '    <label class="control-label">Metadata display order</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn station-list-box-elements">';
		html += '        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">';
		html += '          <span class="caret" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </a>';
		html += '        <ul id="ul-select" class="dropdown-menu">';
		html += '          <li value="Artist - Track"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Artist - Track</a></li>';
		html += '          <li value="Track - Artist"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Track - Artist</a></li>';
		html += '          <li value="Disabled"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Disabled</a></li>';
		html += '        </ul>';
		html += '      </span>';
		html += '      <input type="text" class="form-control list-box-input" id="lbxMetadata" name="lbxMetadata" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Display order..." />';
		html += '    </div>';
		html += '    <div class="spacer6"></div>';
	}
	html += '   </div>';
	html += '   <div class="modal-footer">';
	html += '    <div class="btn-group" role="group">';
	html += '     <button type="button" class="btn btn-default" onclick="onEditDialogDoneClick(event)"><span class="glyphicon ' + glyph + '" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '     <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    </div>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap container:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$('#main-container').append(html);
	setEditListBoxes();
	
	// Show modal dialog
	$dialog = $('#editDialog');
	$dialog.on('shown.bs.modal', function() {
		$("#edStationName").on('keyup', onEditTextKeyPressed).focus();
		$("#edStationURL").on('keyup', onEditTextKeyPressed);
	}).on('hidden.bs.modal', function (e) {
       		$(this).remove();
    	}).modal().modal('show');

	// Load dynamic content into edit dialog body
	if (load) {
		var url = '/rest' + content;

		// Create JSON object
		var request = {
			OnEditorData: null,
			prepare: "no",
			value: parameter,
			action : action
		};
		
		// Post AJAX with JSON data
		$.ajax({
			type: "GET",
			url: url,
			data: request,
			dataType: "json",
			success: function(data) {
				// Read Properties from JSON data			
				var name = data['Name'] || '*';
				var url = data['URL'] || '*';
				var mode = data['Mode'] || '*';
				if (name.length > 1 && url.length > 1 && mode.length > 1) {
					$("#edStationName").val(name);
					$("#edStationURL").val(url);
					$("#lbxMetadata").val(mode);
				} else {
					var param = $('#editDialog').attr('dialog-value') || "*";
					var text = 'Unknown hash "' + param + '"';
					$("#edStationName").val(text);
					$("#edStationURL").val(text);
					$("#lbxMetadata").val(text);
				}
			},
			error: function() {
				var param = $('#editDialog').attr('dialog-value') || "*";
				var text = 'Loading hash "' + param + '" failed.';
				$("#edStationName").val(text);
				$("#edStationURL").val(text);
				$("#lbxMetadata").val(text);
			}
		});
	}
}

function setEditListBoxes() {
	$(".station-list-box-elements li a").click(function() {
		var nil = void(0);
		var value = $(this).text().trim();
		var input = $(this).parents('.station-list-box-elements').nextAll('.list-box-input');
		if (input !== nil) {
			$(input).val(value);
		}
	});
};


function onEditDialogDoneClick(event) {
	var name = $("#edStationName").val() || "*";
	var url = $("#edStationURL").val() || "*";
	var mode = $("#lbxMetadata").val() || "*";
	if (name.length > 0 && url.length > 0 && mode.length > 0) {
		sendEditResult(name, url, mode);
	}	
	console.log('[stationdialog.js] onEditDialogDoneClick() Result name "' + name + '" and URL "' + url + '"');
}

function sendEditResult(name, url, mode) {
	// Get action from modal form attribute
	var action = $('#editDialog').attr('dialog-action') || "*";
	var value = $('#editDialog').attr('dialog-value') || "*";
	
	// Create JSON object
	var data = {
		OnEditorData: action,
		prepare: "no",
		value : value,
		name : name,
		url : url,
		mode : mode
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			var action = $('#editDialog').attr('dialog-action') || "*";
			var value  = $('#editDialog').attr('dialog-value')  || "*";
			closeModalDialog();
			callCloseEditorMethod(action, value);
		},
		error: function() {
			closeModalDialog();
			alert('Error: sendEditResult() failed.');
		}
	});
}

