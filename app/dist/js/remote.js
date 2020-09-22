function setListBoxes() {
	$(".list-box-elements li a").click(function() {
		var nil = void(0);
		var value = $(this).text().trim();
		var input = $(this).parents('.list-box-elements').nextAll('.list-box-input');
		if (input !== nil) {
			$(input).val(value);
			var id = $(input).attr('id');
			if (id === "lbxDrives") {
				if (value[value.length-1] !== '/') {
					value += '/';
				}
				$("#edLibraryPath").val(value);
				console.log('Listbox <' + id + '> changed: ' + value);	
			}
		}
	});
};

function buttonGroupRefresh() {
	$("#remote-button-group").load("remote-button-group.html");
	$("#terminal-button-group").load("terminal-button-group.html");
	$("#filter-button-group").load("filter-button-group.html");
	$("#phase-button-group").load("phase-button-group.html");
};

function deviceSelectRefresh() {
	location.reload();
};

function onCheckBoxChange(element) {
	var nil = void(0);
	if (element !== nil) {
		// Toggle tagged state class variable
		cbx = $(element);	
		cbx.toggleClass("tagged");
		console.log('[remote.js] onCheckBoxChange: <' + cbx.attr('id') + '>, tagged = ' + cbx.hasClass("tagged"));
	} else {
        	alert('Error: onCheckBoxChange() element undefined.');
	}
};

function setCheckBoxValue(element, value) {
	var nil = void(0);
	if (element !== nil) {
		var $cbx = $(element);	
		if (value) {
			$cbx.addClass("tagged");
			$cbx.prop('checked', true);
		} else {
			$cbx.removeClass("tagged");
			$cbx.prop('checked', false);
		}
		console.log('[remote.js] setCheckBoxEventValue: <' + $cbx.attr('id') + '>, tagged = ' + $cbx.hasClass("tagged"));
	} else {
        	alert('Error: setCheckBoxEventValue() element undefined.');
	}
};

function getRemoteConfig() {
	$.ajax({
		type: "GET",
		url: "/rest/remote.json",
		data: "OnRemoteData=null&prepare=yes&title=config",
		dataType: "json",
		success: function (data) {
			console.log(data);

			// Read flags from JSON data			
			var enabled   = data['RemoteDeviceEnabled'] || false;
			var canonical = data['CanonicalSampleRate'] || false;
			var terminal = data['TerminalDeviceEnabled'] || false;

			// Set appropriate check box
			setCheckBoxValue("#chkTerminalEnabled", terminal);
			setCheckBoxValue("#chkRemoteEnabled", enabled);
			setCheckBoxValue("#chkUseCanonical", canonical);
			
		},
		error: function() {
			console.log('Error: AJAX getRemoteConfig() failed.');
		},
	});
};


function sendRemoteConfig() {

	// Read data and flags from HTML elements
	var terminal = $("#lbxSerial").val(); 
	var device = $("#lbxRemote").val(); 
	var enabled = $("#chkRemoteEnabled").hasClass("tagged");
	var canonical = $("#chkUseCanonical").hasClass("tagged");
	var control = $("#chkTerminalEnabled").hasClass("tagged");
	
	// Create JSON object
	var data = {
		OnRemoteData: "settings",
		prepare: "no",
		title: "settings",
		Device : device, 
		Terminal : terminal, 
		RemoteDeviceEnabled : enabled,
		TerminalDeviceEnabled : control,
		CanonicalSampleRate : canonical
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			buttonGroupRefresh();
			showPopupConfirmationMessage('Saved advanced device settings', 'Advanced settings');
			window.setTimeout(function() {
				buttonGroupRefresh();
			}, 650);		
			console.log('[remote.js] Success: AJAX sendRemoteConfig()');
		},
		error: function() {
			alert('Error: sendRemoteConfig() failed.');
		}
	});
};

function sendButtonEvent(value) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnActionButtonClick=" + value,
		success: function() {
			onButtonClicked();
		},
		error: function() {
			alert('Error: sendButtonEvent(' + value + ') failed.');
		}
	});
};
	   
function onSelectChange(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = $(this).val();
		if (value) {
			if (target.id === "cbxDriveList") {
				if (value[value.length-1] !== '/') {
					value += '/';
				}
				$("#edLibraryPath").val(value);
				console.log('Combobox <' + target.id + '> changed: ' + value);	
			}
		}
	} else {
        alert('[remote.js] Error: onSelectChange() Event target undefined.');
	}
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
			if (!found && value === "DEVICEREFRESH") {
			// Post event value
				sendButtonEvent(value);
				showPopupInfoMessage('Send status request to dCS device.','Status request');
				window.setTimeout(function() {
					buttonGroupRefresh();
				}, 650);		
				found = true;
			}
			if (!found && value === "SHOWINFO") {
				// Show system information popup
				onSystemClick();
				found = true;
			}
			if (!found && value === "SHOWHELP") {
				showMessageDialog(
					'Settings help',
					'/settingshelp.html?page=1002',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[remote.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[remote.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}


function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		if (event.cancelable) {
			event.preventDefault();
		}
		if (target.id === "btnRescanAudio") {
			$("#btnRescanAudio").prop('disabled', true);
		}
		if (target.id === "btnRescanPorts") {
			$("#btnRescanPorts").prop('disabled', true);
		}
		if (target.id === "btnSave") {
			// Post back configuration data
			sendRemoteConfig();
		} else {
			// Send button click event
			var value = target.getAttribute('value');
			sendButtonEvent(value);
		}
	} else {
        	alert('Error: onButtonClick() Event target undefined.');
	}
}

function onButtonClicked() {
	var executed = false;
	var button = $("#btnRescanAudio")
	if (button.prop('disabled')) {
		button.prop('disabled', false);
		if (!executed) {
			executed = true;
			deviceSelectRefresh();
		}
	}
	button = $("#btnRescanPorts")
	if (button.prop('disabled')) {
		button.prop('disabled', false);
		if (!executed) {
			executed = true;
			deviceSelectRefresh();
		}
	}
	if (!executed) {
		executed = true;
		buttonGroupRefresh();
	}
};

function setButtonEvents() {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (button.hasAttribute("addClick")) {
			var value = button.getAttribute("addClick");
			if (value.toLowerCase() == "true") {
				button.onclick = onButtonClick;
			}
		}
	}
};

function setSelectEvents() {
	$('.combobox').combobox({
		beforeShow: function() { $('select').blur(); }
	}).on("change", onSelectChange);
};

