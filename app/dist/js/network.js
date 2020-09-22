function getFirstWord(caption) {
	if (!!caption) {
		if (caption.length > 0) {
			var word = caption.substr(0, caption.indexOf(" "));
			if (!!word) {
				if (word.length > 0) {
					return urlEncode(word);
				}
			}	
			return urlEncode(caption);
		}
	}	
	return "_";
};

function setListBoxes() {
	$(".list-box-elements li a").click(function() {
		var nil = void(0);
		var value = $(this).text().trim();
		var input = $(this).parents('.list-box-elements').nextAll('.list-box-input');
		if (input !== nil) {
			$(input).val(value);
		}
	});
};

function statusLabelRefresh() {
	$("#mount-status-label").load("mount-status-label.html");
};
function buttonGroupRefresh() {
	$("#mount-button-group").load("mount-status-buttons.html");
};

function onStatusMessageClick(event) {
	window.location.href = "/app/system/messages.html";
}

function onCheckBoxChange(element) {
	var nil = void(0);
	if (element !== nil) {
		// Toggle tagged state class variable
		cbx = $(element);	
		cbx.toggleClass("tagged");
		console.log('[network.js] onCheckBoxChange: <' + cbx.attr('id') + '>, tagged = ' + cbx.hasClass("tagged"));
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
		console.log('[network.js] setCheckBoxEventValue: <' + $cbx.attr('id') + '>, tagged = ' + $cbx.hasClass("tagged"));
	} else {
        	alert('Error: setCheckBoxEventValue() element undefined.');
	}
};


function getMountStatusUpdate() {
	$.ajax({
		type: "GET",
		url: "/rest/mount.json",
		data: "OnMountStatusChange=null&prepare=yes&title=mount",
		dataType: "json",
		success: function (data) {
			if (data['Transition']) {
				// Read JSON data
				setNetworkConfig(data);
				statusLabelRefresh();
				buttonGroupRefresh();
				var state = strToInt(data["State"] || "0");
				var message = urlDecode(data["Message"] || "undefined");
				console.log('[network.js] Mount state state has changed <' + message + '> (' + state + ')');
			}
		},
		error: function() {
			console.log('[network.js] Error: AJAX getMountStatusUpdate() failed.');
		},
	});
}


function getNetworkConfig() {
	$.ajax({
		type: "GET",
		url: "/rest/network.json",
		data: "OnNetworkData=null&title=config&prepare=yes",
		dataType: "json",
		success: function (data) {
			console.log(data);
			setNetworkConfig(data);
			setHostConfig(data);
		},
		error: function() {
			console.log('[network.js] Error: AJAX getNetworkConfig() failed.');
		},
	});
};


function setNetworkConfig(data) {

	// Get current selected filesystem
	var filesystem = data["MountType"] || '*';
	if (filesystem === '*') {
		filesystem = getFirstWord($("#lbxFileSystems").val());
	}
	var defaultmount = filesystem === "SMB" ? "//192.168.1.2/music" : "192.168.1.2:/music";

	// Read JSON data			
	var options    = data["MountOptions"] || "vers=3,nolock";
	var localpath  = data["LocalMountPath"] || "/usr/local/dbApps/media/";
	var remotepath = data["RemoteMountPath"] || defaultmount;
	var username   = urlDecode(data["RemoteUserName"], "");
	var password   = urlDecode(data["RemotePassword"], "");
	var allowmount = data['AllowMount'] || false;

	// Set element values
	$("#edRemotePath").val(remotepath);
	$("#edLocalPath").val(localpath);
	$("#edMountOptions").val(options);
	$("#edUserName").val(username);
	$("#edUserPassword").val(password);
	
	// Set appropriate check box
	setCheckBoxValue("#chkMountPoint", allowmount);
};

function setHostConfig(data) {

	// Read JSON data			
	var hostname = data["ExternalHostName"] || "example.dyndns.org:8088";

	// Set element values
	$("#edHostName").val(hostname);
};


function sendNetworkConfig() {

	// Read data and flags from HTML elements
	var hostname   = $("#edHostName").val();
	var options    = $("#edMountOptions").val();
	var localpath  = $("#edLocalPath").val();
	var remotepath = $("#edRemotePath").val();
	var username   = $("#edUserName").val();
	var password   = $("#edUserPassword").val();
	var allowmount = $("#chkMountPoint").hasClass("tagged");
	var filesystem = getFirstWord($("#lbxFileSystems").val());
	
	// Create JSON object
	var data = {
		OnNetworkData: "settings",
		title: "settings",
		prepare: "no",
		ExternalHostName : hostname,
		MountType : filesystem,
		AllowMount : allowmount,
		MountOptions : options,
		LocalMountPath : localpath,
		RemoteMountPath : remotepath,
		RemoteUserName : username,
		RemotePassword : password
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			showPopupConfirmationMessage('Saved network settings', 'Network settings');
			console.log('[network.js] Success: AJAX sendNetworkConfig()');
		},
		error: function() {
			alert('[network.js] Error: sendNetworkConfig() failed.');
		}
	});
};

function sendButtonEvent(value) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnNetworkButtonClick=" + value,
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
	        alert('[network.js] Error: onSelectChange() Event target undefined.');
	}
}

function onInputChange(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = $(this).val();
		if (value) {
			console.log('Input <' + target.id + '> changed: ' + value);	
		}
	} else {
	        alert('[network.js] Error: onInputChange() Event target undefined.');
	}
}


function togglePasswordVisibility() {
	var edit = document.getElementById("edUserPassword");
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


function onAnchorClick(event) {
	var nil = void(0);
	if (event.id.length > 0) {
		if (event.cancelable) {
			event.preventDefault();
		}
		var value = event.getAttribute('value');
		if (value.length > 0) {		
			var found = false;
			if (!found && value === "SHOWINFO") {
				// Show system information popup
				onSystemClick();
				found = true;
			}
			if (!found && value === "SHOWHELP") {
				showMessageDialog(
					'Settings help',
					'/settingshelp.html?page=1001',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[network.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[network.js] Invalid event value.');
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
		if (target.id === "btnSave") {
			// Post back configuration data
			sendNetworkConfig();
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
	/*if (!executed) {
		executed = true;
		buttonGroupRefresh();
	}*/
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


function setInputEvents() {
	$('input').change(onInputChange);
};
