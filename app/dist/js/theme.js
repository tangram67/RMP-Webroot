
function gpioButtonRefresh() {
	$("#gpio-1").load("gpio-1.html");
	$("#gpio-2").load("gpio-2.html");
};

function statusGroupRefresh() {
	$("#statusgroup").load("statusgroup.html");
};

function clearPersonalEventResult () {
	$('#personal-event-result').text('Event: ---, data: ...');
};


function onButtonClick(event) {
	var id = event.target.id || "*";
	var value = event.target.value || "*";
	$('#personal-event-result').text('Button clicked: ' + id + ', value = ' + value);
	if (event.cancelable) {
		event.preventDefault();
	}
	var event = "OnGpioButtonClick";
	if (value === "PLAYSTREAM" || value === "PAUSESTREAM" || value === "STOPSTREAM") {
		event = "OnRadioButtonClick";
	}
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: event + "=" + value,
		success: function() {
			gpioButtonRefresh();
		},
		error: function() {
			alert('Error: onButtonClick() failed.');
		}
	});
	return false;
}

function onRowClick(event, row, $element) {
	$.ajax({
		type: "POST",
		url: "/ajax/response.html",
		data: "OnPersonalClick=" + JSON.stringify(row),
		error: function() {
			alert('Error: onRowClick() failed.');
		}
	});
	onRowClicked(row);
}

function onRowClicked(row) {
	console.log('Click on row: ' + row.PersID + ', Name: ' + row.NachName);
};


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

function onTableLoaded() {
};

function setTableEvents() {
    var $result = $('#personal-event-result');
    $('#personal-table').bootstrapTable()
		.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
		// .on('click-row.bs.table', function (e, row, $element)     { $result.text('Event: click-row.bs.table, data: ' + JSON.stringify(row)); })
		.on('click-row.bs.table', onRowClick)
		.on('dbl-click-row.bs.table', function (e, row, $element) { $result.text('Event: dbl-click-row.bs.table, data: ' + JSON.stringify(row)); })
		.on('sort.bs.table', function (e, name, order)  { $result.text('Event: sort.bs.table, data: ' + name + ', ' + order); })
		.on('check.bs.table', function (e, row)         { $result.text('Event: check.bs.table, data: ' + JSON.stringify(row)); })
		.on('uncheck.bs.table', function (e, row)       { $result.text('Event: uncheck.bs.table, data: ' + JSON.stringify(row)); })
		.on('check-all.bs.table', function (e)          { $result.text('Event: check-all.bs.table'); })
		.on('uncheck-all.bs.table', function (e)        { $result.text('Event: uncheck-all.bs.table'); })
		.on('load-error.bs.table', function (e, status) { $result.text('Event: load-error.bs.table, data: ' + status); })
		.on('search.bs.table', function (e, text)       { $result.text('Event: search.bs.table, data: ' + text); })
		.on('page-change.bs.table', function (e, size, number) { $result.text('Event: page-change.bs.table, data: ' + number + ', ' + size); })
		.on('post-body.bs.table', onTableLoaded)
		.on('column-switch.bs.table', function (e, field, checked) { $result.text('Event: column-switch.bs.table, data: ' + field + ', ' + checked); });
};

function onFileChosen(event) {
    var files, 
        file, 
        extension,
        output = document.getElementById("filesOutput");
		console.log(event);
		console.log(event.target);
    files = event.target.files;
    output.innerHTML = "";
    for (var i = 0, len = files.length; i < len; i++) {
        file = files[i];
        extension = file.name.split(".").pop();
        output.innerHTML += "<li class='type-" + extension + "'>" + file.webkitRelativePath + "</li>";
    }
}    

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

