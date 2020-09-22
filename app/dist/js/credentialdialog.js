
function callCloseEditorMethod(action, result) {
	console.log('[stationdialog.js] callCloseMethod() called for action "' + action + '" and result "' + result + '"');
	if (typeof window["onEditDialogClosed"] === "function") {
		onEditDialogClosed(action, result);
	} else {
		console.log('[credentialdialog.js] Method onEditDialogClosed() not found.');
	}
}

function onEditTextKeyPressed(e) {
	var event = e || window.event;
	var key = event.which || event.keyCode;
	if (key == 13) {
		// Enter pressed
		console.log('[credentialdialog.js] onEditTextKeyPressed() Enter pressed.');
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
		html += '    <label class="control-label">Username</label>';
		html += '    <input type="text" class="form-control" name="edUserName" id="edUserName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Givenname</label>';
		html += '    <input type="text" class="form-control" name="edGivenName" id="edGivenName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Lastname</label>';
		html += '    <input type="text" class="form-control" name="edLastName" id="edLastName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Password</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn">';
		html += '        <button name="btnVisibility" id="btnVisibility" class="btn btn-default" onclick="togglePasswordVisibility();" title="Show password">';
		html += '          <span name="spnVisibility" id="spnVisibility" class="glyphicon glyphicon-eye-open" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </button>';
		html += '      </span>';
		html += '      <input type="password" class="form-control" name="edPassword" id="edPassword" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    </div>';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Access level</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn station-list-box-elements">';
		html += '        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1" href="#">';
		html += '          <span class="caret" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </a>';
		html += '        <ul id="ul-select" class="dropdown-menu">';
		html += '          <li value="User"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;User</a></li>';
		html += '          <li value="Advanced"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Advanced</a></li>';
		html += '          <li value="Administrator"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Administrator</a></li>';
		html += '        </ul>';
		html += '      </span>';
		html += '      <input type="text" class="form-control list-box-input" id="edPriviledge" name="edPriviledge" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Loading..." />';
		html += '    </div>';
		html += '    <div class="spacer6"></div>';
	} else {
		html += '    <label class="control-label">Username</label>';
		html += '    <input type="text" class="form-control" name="edUserName" id="edUserName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Username..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Givenname</label>';
		html += '    <input type="text" class="form-control" name="edGivenName" id="edGivenName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Givenname..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Lastname</label>';
		html += '    <input type="text" class="form-control" name="edLastName" id="edLastName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Lastname..." />';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Password</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn">';
		html += '        <button name="btnVisibility" id="btnVisibility" class="btn btn-default" onclick="togglePasswordVisibility();" title="Show password">';
		html += '          <span name="spnVisibility" id="spnVisibility" class="glyphicon glyphicon-eye-open" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </button>';
		html += '      </span>';
		html += '      <input type="password" class="form-control" name="edPassword" id="edPassword" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Password..." />';
		html += '    </div>';
		html += '    <div class="spacer8"></div>';

		html += '    <label class="control-label">Access level</label>';
		html += '    <div class="input-group">';
		html += '      <span class="input-group-btn station-list-box-elements">';
		html += '        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1" href="#">';
		html += '          <span class="caret" style="pointer-events:none" aria-hidden="true"></span>';
		html += '        </a>';
		html += '        <ul id="ul-select" class="dropdown-menu">';
		html += '          <li value="User"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;User</a></li>';
		html += '          <li value="Advanced"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Advanced</a></li>';
		html += '          <li value="Administrator"><a><span class="glyphicon glyphicon-none" style="pointer-events:none;" aria-hidden="true"></span>&nbsp;&nbsp;Administrator</a></li>';
		html += '        </ul>';
		html += '      </span>';
		html += '      <input type="text" class="form-control list-box-input" id="edPriviledge" name="edPriviledge" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Priviledge..." />';
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
		// Get action from modal form attribute
		var action = $('#editDialog').attr('dialog-action') || "*";
		var edit = action === "EDITUSER";
		if (edit) {
			// Username is locked on edit, set focus to given name
			$("#edGivenName").on('keyup', onEditTextKeyPressed).focus();
			$("#edUserName").on('keyup', onEditTextKeyPressed);
		} else {
			// Set focus to given name to enter new user properties
			$("#edUserName").on('keyup', onEditTextKeyPressed).focus();
			$("#edGivenName").on('keyup', onEditTextKeyPressed);
		}
		$("#edLastName").on('keyup', onEditTextKeyPressed);
		$("#edPassword").on('keyup', onEditTextKeyPressed);
		console.log('[credentialdialog.js] Show dialog for action "' + action + '"');
	}).on('hidden.bs.modal', function (e) {
       		$(this).remove();
    	}).modal().modal('show');

	// Load dynamic content into edit dialog body
	if (load) {
		var url = '/rest' + content;

		// Create JSON object
		var request = {
			OnCredentialData: null,
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
				var givenname = data['Givenname'] || '*';
				var lastname = data['Lastname'] || '*';
				var username = data['Username'] || '*';
				var password = data['Password'] || '*';
				var priviledge = data['Priviledge'] || '*';
				if (givenname.length > 1 && lastname.length > 1 && username.length > 1 && password.length > 0 && priviledge.length > 1) {
					$("#edGivenName").val(givenname);
					$("#edLastName").val(lastname);
					$("#edUserName").val(username).attr('disabled', 'true');
					$("#edPassword").val(password);
					$("#edPriviledge").val(priviledge);
				} else {
					var param = $('#editDialog').attr('dialog-value') || "*";
					var text = 'Unknown user : "' + param + '"';
					$("#edGivenName").val(text);
					$("#edLastName").val(text);
					$("#edUserName").val(text);
					$("#edPassword").val(text);
					$("#edPriviledge").val(text);
				}
			},
			error: function() {
				var param = $('#editDialog').attr('dialog-value') || "*";
				var text = 'Loading user "' + param + '" failed.';
				$("#edGivenName").val(text);
				$("#edLastName").val(text);
				$("#edUserName").val(text);
				$("#edPassword").val(text);
				$("#edPriviledge").val(text);
			}
		});
	}
}

function togglePasswordVisibility() {
	var edit = document.getElementById("edPassword");
	var button = document.getElementById("btnVisibility");
	var $span = $("#spnVisibility");
	if (edit.type === "password") {
		edit.type = "text";
		button.title="Hide password"
		$span.removeClass("glyphicon-eye-open");
		$span.addClass("glyphicon-eye-close");
	} else {
		edit.type = "password";
		button.title="Show password"
		$span.addClass("glyphicon-eye-open");
		$span.removeClass("glyphicon-eye-close");
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

function sanitizeHTML(value) {
	if (value) {
		if (value.length > 0) {
			return value.replace(/[<>]/g, '');
		}
	}
	return "";
}

function onEditDialogDoneClick(event) {
	var givenname = sanitizeHTML($("#edGivenName").val() || '*');
	var lastname = sanitizeHTML($("#edLastName").val() || '*');
	var username = sanitizeHTML($("#edUserName").val() || '*');
	var priviledge = $("#edPriviledge").val() || '*';
	var password = $("#edPassword").val() || '*';
	var score = getPasswordStrength(password);

	if (givenname.length > 1 && lastname.length > 1 && username.length > 1 && password.length > 7 && score > 99 && priviledge.length > 1) {
		sendEditResult(givenname, lastname, username, password, priviledge);
		console.log('[credentialdialog.js] onEditDialogDoneClick() Result user "' + username + '" updated.');
	} else {
		var text = "Undefined error...";
		if (givenname.length < 2) {
			text = "Invalid givenname.";
		} else if (lastname.length < 2) {
			text = "Invalid lastname.";
		} else if (username.length < 2) {
			text = "Invalid username.";
		} else if (password.length < 8) {
			text = "Password too short.";
		} else if (score < 100) {
			text = "Password too weak.";
		} else if (priviledge.length < 2) {
			text = "Invalid priviledge.";
		}
		showAlertErrorMessage(text + '<br>Please check your input!');
	}
}

function sendEditResult(givenname, lastname, username, password, priviledge) {
	// Get action from modal form attribute
	var action = $('#editDialog').attr('dialog-action') || "*";
	var value = $('#editDialog').attr('dialog-value') || "*";
	
	// Create JSON object
	var data = {
		OnCredentialData: action,
		prepare: "no",
		value : value,
		Givenname : givenname,
		Lastname : lastname,
		Username : username,
		Password : password,
		Priviledge : priviledge
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

