function setListBoxes() {
	$(".list-box-elements li a").click(function() {
		var nil = void(0);
		var value = $(this).text().trim();
		var input = $(this).parents('.list-box-elements').nextAll('.list-box-input');
		if (input !== nil) {
			$(input).val(value);
			var id = $(input).attr('id');
			var found = false;
			console.log('Listbox <' + id + '> changed: ' + value);	
			if (!found && id === "lbxDrives1") {
				if (value.length > 0) {
					if (value[value.length-1] !== '/') {
						value += '/';
					}
				}
				$("#edLibraryPath1").val(value);
				found = true;
			}
			if (!found && id === "lbxDrives2") {
				if (value.length > 0) {
					if (value[value.length-1] !== '/') {
						value += '/';
					}
				}
				$("#edLibraryPath2").val(value);
				found = true;
			}
			if (!found && id === "lbxDrives3") {
				if (value.length > 0) {
					if (value[value.length-1] !== '/') {
						value += '/';
					}
				}
				$("#edLibraryPath3").val(value);
				found = true;
			}
		}
	});
};

function statusGroupRefresh() {
	if (!$("#web-status-group").hasClass("shrinked"))
		$("#web-status-items").load("web-status-group.html");
	if (!$("#app-status-group").hasClass("shrinked"))
		$("#app-status-items").load("app-status-group.html");
	if (!$("#player-status-group").hasClass("shrinked"))
		$("#player-status-items").load("player-status-group.html");
};

function statusLabelRefresh() {
	$("#scanner-status-label").load("scanner-status-label.html");
};

function deviceSelectRefresh() {
	location.reload();
};

function driveSelectRefresh() {
	location.reload();
};

function logFileRefresh() {
	$("#application-log-text").load("application-log-text.html");
	$("#exception-log-text").load("exception-log-text.html");
	$("#webserver-log-text").load("webserver-log-text.html");
};

function appLogRefresh() {
	$("#application-log-text").load("application-log-text.html");
};

function webLogRefresh() {
	$("#webserver-log-text").load("webserver-log-text.html");
};

function exceptLogRefresh() {
	$("#exception-log-text").load("exception-log-text.html");
};

function moduleLicenseRefresh() {
	$("#active-module-licenses").load("active-module-licenses.html");
};

function reloadCurrentPage() {
	window.location.href = '/app/system/settings.html?prepare=yes#upload-anchor';
	location.reload(true);
};


function browseExplorerPath(path) {
	if ("" !== path) {	
		window.location.href = "/app/system/explorer.html?prepare=yes&title=explorer&path=" + encodeURIComponent(path);
	} else {
		alert('Error: browseExplorerPath() called for empty path.');
	}
};


function setStatusCollapseEvents() {
	var web = $('#web-status-items');
	var app = $('#app-status-items');		
	var player = $('#player-status-items');

	// Add collapse events
	web.on('shown.bs.collapse', onCollapseShownWeb);
	web.on('hidden.bs.collapse', onCollapseHiddenWeb);
	app.on('shown.bs.collapse', onCollapseShownApp);
	app.on('hidden.bs.collapse', onCollapseHiddenApp);
	player.on('shown.bs.collapse', onCollapseShownPlayer);
	player.on('hidden.bs.collapse', onCollapseHiddenPlayer);

	// Unroll list items (use class "in" instead, but here you have a nice effect on page load)
	web.collapse('show');
	app.collapse('show');
	player.collapse('show');
}

function onHeaderClick(ident) {
	var nil = void(0);
	var element = document.getElementById(ident);
	if (element !== nil) {
		var group = $(element);
		if (!group.hasClass("collapse-transact")) {
			group.addClass("collapse-transact");
			var ok = false;
			var items = nil;
			var span = nil;
			if (!ok && ident === "web-status-group") {
				items = $("#web-status-items");
				span = $("#web-status-span");
				ok = true;
			}
			if (!ok && ident === "app-status-group") {
				items = $("#app-status-items");
				span = $("#app-status-span");
				ok = true;
			}
			if (!ok && ident === "player-status-group") {
				items = $("#player-status-items");
				span = $("#player-status-span");
				ok = true;
			}
			if (ok) {
				span.removeClass("glyphicon-collapse-down");
				span.removeClass("glyphicon-collapse-up");
				span.addClass("glyphicon-expand");

				if (group.hasClass("shrinked")) {
					items.collapse('show');
					console.log('[system.js] onHeaderClick() Show called for <' + ident + '>');
				} else {
					items.collapse('hide');
					console.log('[system.js] onHeaderClick() Hide called for <' + ident + '>');
				}
			} else {
				console.log('[system.js] onHeaderClick() No items found for <' + ident + '>');
			}
		} else {
			console.log('[system.js] onHeaderClick() Ignored for <' + ident + '>');
		}
	} else {
        alert('Error: onHeaderClick() element undefined for <' + ident + '>');
	}
};

function onCollapseShownWeb() {
	onCollapseAction("web-status-group", true, "onCollapseShownWeb()");
};
function onCollapseHiddenWeb() {
	onCollapseAction("web-status-group", false, "onCollapseHiddenWeb()");
};
function onCollapseShownApp() {
	onCollapseAction("app-status-group", true, "onCollapseShownApp()");
};
function onCollapseHiddenApp() {
	onCollapseAction("app-status-group", false, "onCollapseHiddenApp()");
};
function onCollapseShownPlayer() {
	onCollapseAction("player-status-group", true, "onCollapseShownPlayer()");
};
function onCollapseHiddenPlayer() {
	onCollapseAction("player-status-group", false, "onCollapseHiddenPlayer()");
};

function onCollapseAction(ident, visible, comment) {
	var nil = void(0);
	var element = document.getElementById(ident);
	if (element !== nil) {
		var group = $(element);
		var header = nil;		
		var span = nil;
		console.log('[system.js] ' + comment + ' called for <' + ident + '>');
		var ok = false;
		if (!ok && ident === "web-status-group") {
			ok = true;
			span = $("#web-status-span");
			header = $("#web-status-header");
		}
		if (!ok && ident === "app-status-group") {
			ok = true;
			span = $("#app-status-span");
			header = $("#app-status-header");
		}
		if (!ok && ident === "player-status-group") {
			ok = true;
			span = $("#player-status-span");
			header = $("#player-status-header");
		}
		if (ok) {
			if (group.hasClass("collapse-transact")) {
				span.removeClass("glyphicon-expand");
				if (visible) {
					span.removeClass("glyphicon-collapse-down");
					span.addClass("glyphicon-collapse-up");
					header.addClass("active");
					group.removeClass("shrinked");
				} else {
					span.removeClass("glyphicon-collapse-up");
					span.addClass("glyphicon-collapse-down");
					header.removeClass("active");
					group.addClass("shrinked");
				}
				group.removeClass("collapse-transact");
			} else {
				console.log('[system.js] ' + comment + ' Ignored for <' + ident + '>');
			}
		} else {
			console.log('[system.js] ' + comment + ' No group found for <' + ident + '>');
		}
	} else {
        alert('Error: ' + comment + ' element undefined for <' + ident + '>');
	}
};


function onClipboardClick(element) {
	var nil = void(0);
	if (element !== nil) {
		var button = $(element);
		var ident = button.attr('id');
		var ok = false;
		if (!ok && ident === "btnCopyApplicationLog")
			ok = $("#txtAppicationLog").copyToClipboard();
		if (!ok && ident === "btnCopyExceptionLog")
			ok = $("#txtExceptionLog").copyToClipboard();
		if (!ok && ident === "btnCopyWebserverLog")
			ok = $("#txtWebserverLog").copyToClipboard();
		if (ok)		
			console.log('[system.js] onClipboardClick::copyToClipboard() executed for <' + ident + '>');
		else
			console.log('[system.js] onClipboardClick::copyToClipboard() failed for <' + ident + '>');
	} else {
        alert('Error: onClipboardClick() element undefined.');
	}
};


function onCheckBoxChange(element) {
	var nil = void(0);
	if (element !== nil) {
		// Toggle tagged state class variable
		cbx = $(element);	
		cbx.toggleClass("tagged");
		console.log('[system.js] onCheckBoxChange: <' + cbx.attr('id') + '>, tagged = ' + cbx.hasClass("tagged"));
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
		console.log('[system.js] setCheckBoxEventValue: <' + $cbx.attr('id') + '>, tagged = ' + $cbx.hasClass("tagged"));
	} else {
        	alert('Error: setCheckBoxEventValue() element undefined.');
	}
};

function getPlayerConfig() {
	$.ajax({
		type: "GET",
		url: "/rest/config.json",
		data: "OnConfigData=null&prepare=yes&title=config",
		dataType: "json",
		success: function (data) {
			console.log(data);

			// Check for major property changes
			var check = data["Musicpath1"] || '*';
			if (check === '*') {
		        	alert('Error:<br>Application was updated, but browser cache was not cleared.<br>Please follow the instructions on he help screen.<br>Otherwise the settings page will not work as expected!');
			}

			// Read flags from JSON data			
			var allowGroupNameSwap        = data['AllowGroupNameSwap'] || false;
			var allowArtistNameRestore    = data['AllowArtistNameRestore'] || false;
			var allowFullNameSwap         = data['AllowFullNameSwap'] || false;
			var allowTheBandPrefixSwap    = data['AllowTheBandPrefixSwap'] || false;
			var allowDeepNameInspection   = data['AllowDeepNameInspection'] || false;
			var allowVariousArtistsRename = data['AllowVariousArtistsRename'] || false;
			var allowMovePreamble         = data['AllowMovePreamble'] || false;
			var watchLibraryEnabled       = data['WatchLibraryEnabled'] || false;
			var sortAlbumsByYear          = data['SortAlbumsByYear'] || false;
			var sortCaseSensitive         = data['SortCaseSensitive'] || false;
			var displayOrchestra          = data['DisplayOrchestra'] || false;
			var displayRemain             = data['DisplayRemainingTime'] || false;
			var enableDithering           = data['EnableDithering'] || false;

			// Read library folders from configuration
			// Enable folder 1 by default...
			var testFolder1 = data['EnableFolder1'] || 42;
			var enableFolder1 = true;
			if (testFolder1 !== 42) {
				enableFolder1 = data['EnableFolder1'];
			};
			var testFolder2 = data['EnableFolder1'] || 42;
			var enableFolder2 = false;
			if (testFolder2 !== 42) {
				enableFolder2 = data['EnableFolder2'];
			};
			var testFolder3 = data['EnableFolder1'] || 42;
			var enableFolder3 = false;
			if (testFolder3 !== 42) {
				enableFolder3 = data['EnableFolder3'];
			};

			// Set appropriate check box
			setCheckBoxValue("#chkTheBandPrefixSwap",    allowTheBandPrefixSwap);
			setCheckBoxValue("#chkDeepNameInspection",   allowDeepNameInspection);
			setCheckBoxValue("#chkArtistNameRestore",    allowArtistNameRestore);
			setCheckBoxValue("#chkFullNameSwap",         allowFullNameSwap);
			setCheckBoxValue("#chkMovePreamble",         allowMovePreamble);
			setCheckBoxValue("#chkWatchEnabled",         watchLibraryEnabled);
			setCheckBoxValue("#chkSortByYear",           sortAlbumsByYear);
			setCheckBoxValue("#chkSortCase",             sortCaseSensitive);
			setCheckBoxValue("#chkDisplayOrchestra",     displayOrchestra);
			setCheckBoxValue("#chkDisplayRemainingTime", displayRemain);
			setCheckBoxValue("#chkDitheringEnabled",     enableDithering);
			setCheckBoxValue("#chkLibraryPathEnabled1",  enableFolder1);
			setCheckBoxValue("#chkLibraryPathEnabled2",  enableFolder2);
			setCheckBoxValue("#chkLibraryPathEnabled3",  enableFolder3);
			//setCheckBoxValue("#chkGroupNameSwap",        allowGroupNameSwap);
			//setCheckBoxValue("#chkVariousArtistsRename", allowVariousArtistsRename);
			
			// Set input values
			var path1 = data["Musicpath1"];
			var path2 = data["Musicpath2"];
			var path3 = data["Musicpath3"];
			var pattern = data["Filepattern"];
			var hostname = data["ExternalHostName"];
			var categories = data["VariousArtistsCategories"];

			$("#edLibraryPath1").val(path1);
			$("#edLibraryPath2").val(path2);
			$("#edLibraryPath3").val(path3);
			$("#edFilePattern").val(pattern);
			$("#edHostName").val(hostname);
			$("#edVariourArtists").val(categories);

		},
		error: function() {
			console.log('Error: AJAX getPlayerConfig() failed.');
		},
	});
};


function sendPlayerConfig() {

	// Read data and flags from HTML elements
	var rows = $("#lbxPages").val();
	var limit = $("#lbxHistory").val();
	var period = $("#lbxTimes").val();
	var device = $("#lbxDevices").val();
	var pattern = $("#edFilePattern").val();
	var categories = $("#edVariourArtists").val();
	var hostname = $("#edHostName").val();

	var allowGroupNameSwap        = false; //$("#chkGroupNameSwap").hasClass("tagged");
	var allowArtistNameRestore    = $("#chkArtistNameRestore").hasClass("tagged");
	var allowFullNameSwap         = $("#chkFullNameSwap").hasClass("tagged");
	var allowTheBandPrefixSwap    = $("#chkTheBandPrefixSwap").hasClass("tagged");
	var allowDeepNameInspection   = $("#chkDeepNameInspection").hasClass("tagged");
	var allowVariousArtistsRename = false; // $("#chkVariousArtistsRename").hasClass("tagged");
	var allowMovePreamble         = $("#chkMovePreamble").hasClass("tagged");
	var watchLibraryEnabled       = $("#chkWatchEnabled").hasClass("tagged");
	var sortAlbumsByYear          = $("#chkSortByYear").hasClass("tagged");
	var sortCaseSensitive         = $("#chkSortCase").hasClass("tagged");
	var displayOrchestra          = $("#chkDisplayOrchestra").hasClass("tagged");
	var displayRemain             = $("#chkDisplayRemainingTime").hasClass("tagged");
	var enableDithering           = $("#chkDitheringEnabled").hasClass("tagged");

	var enableFolder1 = $("#chkLibraryPathEnabled1").hasClass("tagged");
	var enableFolder2 = $("#chkLibraryPathEnabled2").hasClass("tagged");
	var enableFolder3 = $("#chkLibraryPathEnabled3").hasClass("tagged");

	var path1 = $("#edLibraryPath1").val();
	var path2 = $("#edLibraryPath2").val();
	var path3 = $("#edLibraryPath3").val();

	// Create JSON object
	var data = {
		OnConfigData: "settings",
		prepare: "no",
		title: "settings",
		Device : device, 
		Filepattern : pattern,
		ExternalHostName : hostname,
		VariousArtistsCategories : categories,
		Musicpath1 : path1,
		EnableFolder1 : enableFolder1,
		Musicpath2 : path2,
		EnableFolder2 : enableFolder2,
		Musicpath3 : path3,
		EnableFolder3 : enableFolder3,
		AllowGroupNameSwap : allowGroupNameSwap,
		AllowArtistNameRestore : allowArtistNameRestore,
		AllowFullNameSwap : allowFullNameSwap,
		AllowTheBandPrefixSwap : allowTheBandPrefixSwap,
		AllowDeepNameInspection : allowDeepNameInspection,
		AllowVariousArtistsRename : allowVariousArtistsRename,
		AllowMovePreamble : allowMovePreamble,
		WatchLibraryEnabled : watchLibraryEnabled,
		SortCaseSensitive : sortCaseSensitive,
		SortAlbumsByYear : sortAlbumsByYear,
		DisplayOrchestra : displayOrchestra,
		DisplayRemainingTime : displayRemain,
		EnableDithering : enableDithering,
		DisplayCountLimit : limit,
		TablePageLimit : rows,
		PeriodTime : period
	};
	
	// Post AJAX with JSON data
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: data,
		success: function() {
			showPopupConfirmationMessage('Saved music player settings', 'Player settings');
			console.log('Success: AJAX sendPlayerConfig()');
		},
		error: function() {
			alert('Error: sendPlayerConfig() failed.');
		}
	});
};

function sendButtonEvent(domain, value) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: domain + "=" + value,
		success: function() {
			onButtonClicked();
		},
		error: function() {
			alert('Error: sendButtonEvent(' + domain + ', ' + value + ') failed.');
		}
	});
};
	   
function sendReloadEvent() {
	console.log('[system.js] Send logger reload.');
	// Use "GET" to trigger prepared request...
	$.ajax({
		type: "GET",
		url: "/ajax/response.html",
		data: "OnReloadFiles=null&prepare=yes&title=logger",
		success: function() {
			logFileRefresh();
			console.log('[system.js] Reloaded logger view.');
		},
		error: function() {
			alert('Error: sendReloadEvent() failed.');
		}
	});
};

function sendUpdateVersionRequest() {
	$.ajax({
		type: "GET",
		url: "https://www.dbrinkmeier.de/download/version.json",
		dataType: "json",
		success: function(data) {
			var version = data['Version'] || '*';
			console.log('Success: AJAX sendUpdateVersionRequest() Result = "' + version + '"');
			if (version.length > 4) {
				var current = $("#APP_VER").text();
				if (current !== null) {
					if (current.length > 4) {
						var cv = parseInt(current.substring(1,5), 10);
						var nv = parseInt(version.substring(1,5), 10);
						if (!(isNaN(cv) || isNaN(nv))) {
							if (nv > cv) {
								var text = 'Application update available "' + version + '"';
								showPopupWarningMessage(text, 'Update reminder');
								console.log(text);
							}
						}
					}
				}
			}
		},
		error: function(request, status, error) {
			console.log('Error: AJAX sendUpdateVersionRequest() failed "' + request.responseText + '" (' + status.toString() + '/' + error.toString() + ')');
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
        alert('Error: onSelectChange() Event target undefined.');
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
			if (!found && value === "LOADLOG") {
				// Refresh log file views
				$("#btnReloadLogs").prop('disabled', true);
				sendButtonEvent("OnLoggerButtonClick", value);
				found = true;
			}
			if (!found && value === "EXECDEFRAG") {
				// Send request to defrag memory allocation
				sendButtonEvent("OnActionButtonClick", value);
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
					'/settingshelp.html?page=1000',
					'modal-md',
					'/images/logo36.png'
				);
				found = true;
			}
			if (!found) {
		        	console.log('[system.js] No event defined for "' + value + '"');
			}
		} else {
	        	console.log('[system.js] Invalid event value.');
		}
	} else {
        	alert('Error: onAnchorClick() Event id undefined.');
	}
}


function onButtonClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var domain = "OnActionButtonClick";
		if (event.cancelable) {
			event.preventDefault();
		}

		// Application action buttons
		if (target.id === "btnRescan") {
			$("#btnRescan").prop('disabled', true);
			$("#spnRescan").addClass('normal-right-spinner');
		}
		if (target.id === "btnRebuild") {
			$("#btnRebuild").prop('disabled', true);
			$("#spnRebuild").addClass('normal-right-spinner');
		}
		if (target.id === "btnClear") {
			$("#btnClear").prop('disabled', true);
		}
		if (target.id === "btnRescanAudio") {
			$("#btnRescanAudio").prop('disabled', true);
		}
		if (target.id === "btnRescanDrives") {
			$("#btnRescanDrives").prop('disabled', true);
		}
		if (target.id === "btnDownloadLicense") {
			$("#btnDownloadLicense").prop('disabled', true);
		}

		// Logger reload buttons
		if (target.id === "btnReloadLogs") {
			domain = "OnLoggerButtonClick";
			$("#btnReloadLogs").prop('disabled', true);
		}
		if (target.id === "btnAppLogs") {
			domain = "OnLoggerButtonClick";
			$("#btnAppLogs").prop('disabled', true);
		}
		if (target.id === "btnWebLogs") {
			domain = "OnLoggerButtonClick";
			$("#btnWebLogs").prop('disabled', true);
		}
		if (target.id === "btnExceptLogs") {
			domain = "OnLoggerButtonClick";
			$("#btnExceptLogs").prop('disabled', true);
		}

		// Save settings or execute actions
		if (target.id === "btnSave") {
			// Post back configuration data
			sendPlayerConfig();
		} else {
			var found = false;
			var path = "*";
			if (!found && target.id === "btnBrowseLibrary1") {
				path = $("#edLibraryPath1").val();
				found = true;
			}
			if (!found && target.id === "btnBrowseLibrary2") {
				path = $("#edLibraryPath2").val();
				found = true;
			}
			if (!found && target.id === "btnBrowseLibrary3") {
				path = $("#edLibraryPath3").val();
				found = true;
			}
			if (!found) {
				// Send button click event
				var value = target.getAttribute('value');
				sendButtonEvent(domain, value);
			} else {
				if (path !== "*") {
					browseExplorerPath(path);
				}
			}
		}	
	} else {
        	alert('Error: onButtonClick() Event target undefined.');
	}
}

function onButtonClicked() {
	var ok = false;	
	var action = "none";
	if (!ok) {
		var button = $("#btnRescan")	
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			$("#spnRescan").removeClass('normal-right-spinner');
			statusLabelRefresh();
			action = "Rescan music library";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnRebuild")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			$("#spnRebuild").removeClass('normal-right-spinner');
			statusLabelRefresh();
			action = "Rebuild music library";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnClear")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			statusLabelRefresh();
			action = "Clear music library";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnRescanAudio")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			deviceSelectRefresh();
			action = "Rescan audio hardware";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnRescanDrives")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			driveSelectRefresh();
			action = "Rescan local device mounts";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnReloadLogs")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			logFileRefresh();
			action = "Reload log files";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnAppLogs")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			appLogRefresh();
			action = "Reload application log file";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnWebLogs")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			webLogRefresh();
			action = "Reload webserver log file";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnExceptLogs")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			exceptLogRefresh();
			action = "Reload exception log file";
			ok = true;
		}
	}
	if (!ok) {
		button = $("#btnDownloadLicense")
		if (button.prop('disabled')) {
			button.prop('disabled', false);
			// reloadCurrentPage();
			moduleLicenseRefresh();
			action = "Download license from internet";
			ok = true;
		}
	}
	if (ok) {
		console.log('[system.js] Async click on button, executed action <' + action + '>');
	} else {
		console.log('[system.js] Async click on button, no valid action found!');
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

function onFileChosen(event) {
	var files,
	    file,
	    name,
	    names = '',
	    extension,
	    display = document.getElementById("edLicenseSelected");
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

function setSelectEvents() {
	$('.combobox').combobox({
		beforeShow: function() { $('select').blur(); }
	}).on("change", onSelectChange);
};

function onErroneousClick(event) {
	window.location.href = "/app/system/erroneous.html";
};

function onSessionsClick(event) {
	window.location.href = "/app/system/sessions.html?prepare=yes";
};

function onRequestsClick(event) {
	window.location.href = "/app/system/requests.html?prepare=yes";
};

function onCredentialsClick(event) {
	window.location.href = "/app/system/credentials.html?prepare=yes";
};

function setFrameworkVersion() {
	var version = "jQuery " + getJQueryVersion() + " / Bootstrap " + getBootstrapVersion() + " / Bootstrap-Table " + getBootstrapTableVersion();
	console.log('[system.js] Framework versions of ' + version);
	$("#frame-version-text").text(version);
};

