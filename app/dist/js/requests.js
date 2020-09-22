
function setStatusCollapseEvents() {
	var horizontal = $('#horizontal-report-items');
	var vertical = $('#vertical-report-items');
	var line = $('#line-report-items');
	var doughnut1 = $('#doughnut-report-items-1');
	var doughnut2 = $('#doughnut-report-items-2');
	var doughnut3 = $('#doughnut-report-items-3');

	// Add collapse events
	horizontal.on('shown.bs.collapse', onCollapseShownHorizontal);
	horizontal.on('hidden.bs.collapse', onCollapseHiddenHorizontal);
	vertical.on('shown.bs.collapse', onCollapseShownVertical);
	vertical.on('hidden.bs.collapse', onCollapseHiddenVertical);
	line.on('shown.bs.collapse', onCollapseShownLine);
	line.on('hidden.bs.collapse', onCollapseHiddenLine);
	doughnut1.on('shown.bs.collapse', onCollapseShownDoughnut1);
	doughnut1.on('hidden.bs.collapse', onCollapseHiddenDoughnut1);
	doughnut2.on('shown.bs.collapse', onCollapseShownDoughnut2);
	doughnut2.on('hidden.bs.collapse', onCollapseHiddenDoughnut2);
	doughnut3.on('shown.bs.collapse', onCollapseShownDoughnut3);
	doughnut3.on('hidden.bs.collapse', onCollapseHiddenDoughnut3);

	// Unroll list items (use class "in" instead, but here you have a nice effect on page load)
	horizontal.collapse('show');
	vertical.collapse('show');
	line.collapse('show');
	doughnut1.collapse('show');
	doughnut2.collapse('show');
	doughnut3.collapse('show');
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
			if (!ok && ident === "horizontal-report-group") {
				items = $("#horizontal-report-items");
				span = $("#horizontal-report-span");
				ok = true;
			}
			if (!ok && ident === "vertical-report-group") {
				items = $("#vertical-report-items");
				span = $("#vertical-report-span");
				ok = true;
			}
			if (!ok && ident === "line-report-group") {
				items = $("#line-report-items");
				span = $("#line-report-span");
				ok = true;
			}
			if (!ok && ident === "doughnut-report-group-1") {
				items = $("#doughnut-report-items-1");
				span = $("#doughnut-report-span-1");
				ok = true;
			}
			if (!ok && ident === "doughnut-report-group-2") {
				items = $("#doughnut-report-items-2");
				span = $("#doughnut-report-span-2");
				ok = true;
			}
			if (!ok && ident === "doughnut-report-group-3") {
				items = $("#doughnut-report-items-3");
				span = $("#doughnut-report-span-3");
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

function onCollapseShownHorizontal() {
	onCollapseAction("horizontal-report-group", true, "onCollapseShownHorizontal()");
};
function onCollapseHiddenHorizontal() {
	onCollapseAction("horizontal-report-group", false, "onCollapseHiddenHorizontal()");
};

function onCollapseShownVertical() {
	onCollapseAction("vertical-report-group", true, "onCollapseShownVertical()");
};
function onCollapseHiddenVertical() {
	onCollapseAction("vertical-report-group", false, "onCollapseHiddenVertical()");
};

function onCollapseShownLine() {
	onCollapseAction("line-report-group", true, "onCollapseShownLine()");
};
function onCollapseHiddenLine() {
	onCollapseAction("line-report-group", false, "onCollapseHiddenLine()");
};

function onCollapseShownDoughnut1() {
	onCollapseAction("doughnut-report-group-1", true, "onCollapseShownDoughnut1()");
};
function onCollapseHiddenDoughnut1() {
	onCollapseAction("doughnut-report-group-1", false, "onCollapseHiddenDoughnut1()");
};
function onCollapseShownDoughnut2() {
	onCollapseAction("doughnut-report-group-2", true, "onCollapseShownDoughnut2()");
};
function onCollapseHiddenDoughnut2() {
	onCollapseAction("doughnut-report-group-2", false, "onCollapseHiddenDoughnut2()");
};
function onCollapseShownDoughnut3() {
	onCollapseAction("doughnut-report-group-3", true, "onCollapseShownDoughnut3()");
};
function onCollapseHiddenDoughnut3() {
	onCollapseAction("doughnut-report-group-3", false, "onCollapseHiddenDoughnut3()");
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
		if (!ok && ident === "horizontal-report-group") {
			span = $("#horizontal-report-span");
			header = $("#horizontal-report-header");
			ok = true;
		}
		if (!ok && ident === "vertical-report-group") {
			span = $("#vertical-report-span");
			header = $("#vertical-report-header");
			ok = true;
		}
		if (!ok && ident === "line-report-group") {
			span = $("#line-report-span");
			header = $("#line-report-header");
			ok = true;
		}
		if (!ok && ident === "doughnut-report-group-1") {
			span = $("#doughnut-report-span-1");
			header = $("#doughnut-report-header-1");
			ok = true;
		}
		if (!ok && ident === "doughnut-report-group-2") {
			span = $("#doughnut-report-span-2");
			header = $("#doughnut-report-header-2");
			ok = true;
		}
		if (!ok && ident === "doughnut-report-group-3") {
			span = $("#doughnut-report-span-3");
			header = $("#doughnut-report-header-3");
			ok = true;
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


function drawHorizontalRequestsReport() {

	// Default column colors as used by bootstrap 3
	var colorIndex = 0;
	var bootstrapColors = [
		"rgb(108, 117, 125)", // bg-secondary
		"rgb(51, 122, 183)",  // bg-primary
		"rgb(92, 184, 92)",   // bg-success
		"rgb(240, 173, 78)",  // bg-warning
		"rgb(91, 192, 222)",  // bg-info
		"rgb(217, 83, 79)"    // bg-danger
	];

	// Add a helper to format timestamp data
	Date.prototype.formatMMDDYYYY = function() {
		return (this.getMonth() + 1) +
			"/" +  this.getDate() +
			"/" +  this.getFullYear();
	}

	function getNextRowColor() {
		if (colorIndex >= bootstrapColors.length)
			colorIndex = 0;
		return bootstrapColors[colorIndex++];
	}

	$.ajax({
		url: '/rest/requests-chart.json',
		dataType: 'json',
	}).done(function (results) {

		// Split timestamp and data into separate arrays
		var labels = [], data=[], colors=[]; //, timestamps[];
		results["rows"].forEach(function(row) {
			labels.push(row.URL);
			data.push(parseInt(row.Requested));
			colors.push(getNextRowColor());
			//timestamps.push(new Date(packet.Datetime).formatMMDDYYYY());
		});

		// Create the chart.js data structure using 'labels' and 'data'
		var dataset = {
			labels : labels,
			datasets : [{
				backgroundColor      : colors,
				data                 : data
			}],
		};

		// Get the context of the canvas element we want to select
		var ctx = document.getElementById("horizontal-report").getContext("2d");

		// Instantiate a new chart
        Chart.defaults.global.defaultFontColor = 'black';
		var report = new Chart(ctx, {
			type: 'horizontalBar',
			showTooltips: false,
			data: dataset,
			options: {
				responsive: true,
				events: false,
				showTooltips: false,
				legend: {
					display: false,
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Overall requests",
							fontStyle: "bold",
							fontColor: "black"
						}
					}]
				},
				animation: {
					onComplete: function () {
						var ctx = this.chart.ctx;
						ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
						ctx.fillStyle = "black";
						ctx.textAlign = "left";
						ctx.textBaseline = "bottom";
						this.data.datasets.forEach(function (dataset) {
							for (var i = 0; i < dataset.data.length; i++) {
								var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
								var right = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale.right;
								var left = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale.left;

								var xScale = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale.maxHeight;
								var xPos = model.x + 8;

								var value = dataset.data[i];
								if (value > 0) {
									var label = value.toString();
									var caption = label + (value > 1 ? " Requests" : " Request")
									var metrics = ctx.measureText(caption);
									var textWidth = metrics.width;

									ctx.fillStyle = "black";
									if ((xPos + textWidth) > right) {
										xPos = model.x - textWidth - 8;
										ctx.fillStyle = "white";
									}

									// Fixed at left side: ctx.fillText(caption, left + 10, model.y + 7);
									ctx.fillText(caption, xPos, model.y + 7);
								}
							}
						});
					}
				}
			}
		});
	});
}

function drawVerticalRequestsReport() {

	// Default column colors as used by bootstrap 3
	var colorIndex = 0;
	var bootstrapColors = [
		"rgb(108, 117, 125)", // bg-secondary
		"rgb(51, 122, 183)",  // bg-primary
		"rgb(92, 184, 92)",   // bg-success
		"rgb(240, 173, 78)",  // bg-warning
		"rgb(91, 192, 222)",  // bg-info
		"rgb(217, 83, 79)"    // bg-danger
	];

	function getNextRowColor() {
		if (colorIndex >= bootstrapColors.length)
			colorIndex = 0;
		return bootstrapColors[colorIndex++];
	}

	$.ajax({
		url: '/rest/requests-chart.json?limit=12',
		dataType: 'json',
	}).done(function (results) {

		// Split timestamp and data into separate arrays
		var labels = [], data=[], colors=[];
		results["rows"].forEach(function(row) {
			labels.push(row.URL);
			data.push(parseInt(row.Requested));
			colors.push(getNextRowColor());
		});

		// Create the chart.js data structure using 'labels' and 'data'
		var dataset = {
			labels : labels,
			datasets : [{
				backgroundColor: colors,
				data: data
			}],
		};

		// Get the context of the canvas element we want to select
		var ctx = document.getElementById("vertical-report").getContext("2d");

		// Instantiate a new chart
        Chart.defaults.global.defaultFontColor = 'black';
		var report = new Chart(ctx, {
			type: 'bar',
			showTooltips: false,
			data: dataset,
			options: {
				responsive: true,
				events: false,
				showTooltips: false,
				legend: {
					display: false,
				},
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Overall requests",
							fontStyle: "bold",
							fontColor: "black"
						}
					}]
				},
				animation: {
					onComplete: function () {
						var ctx = this.chart.ctx;
						ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
						ctx.fillStyle = "black";
						ctx.textAlign = "center";
						ctx.textBaseline = "bottom";
						this.data.datasets.forEach(function (dataset) {
							for (var i = 0; i < dataset.data.length; i++) {
								var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
								var yScale = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
								var yPos = model.y - 5;

								var value = dataset.data[i];
								if (value > 0) {
									var label = value.toString();
									var caption = label; // + (value > 1 ? " Requests" : " Request")
									var textHeight = parseInt(ctx.font.match(/\d+/), 10);

									ctx.fillStyle = "black";
									if ((yScale - model.y) / yScale >= 0.95) {
										yPos = model.y + textHeight + 10;
										ctx.fillStyle = "white";
									}

									ctx.fillText(caption, model.x, yPos);
								}
							}
						});
					}
				}
			}
		});
	});
}

function drawLineRequestsReport() {

	// Default column colors as used by bootstrap 3
	var bootstrapColors = [
		"rgb(108, 117, 125)", // bg-secondary
		"rgb(51, 122, 183)",  // bg-primary
		"rgb(92, 184, 92)",   // bg-success
		"rgb(240, 173, 78)",  // bg-warning
		"rgb(91, 192, 222)",  // bg-info
		"rgb(217, 83, 79)"    // bg-danger
	];

	function getRowColor(index) {
		if (index >= 0 && index < bootstrapColors.length)
			return bootstrapColors[index];
		return bootstrapColors[0];
	}

	$.ajax({
		url: '/rest/requests-chart.json?limit=8',
		dataType: 'json',
	}).done(function (results) {
		var color = getRowColor(1);
		var firstRow = true;

		// Split timestamp and data into separate arrays
		var labels = [], data=[];
		results["rows"].forEach(function(row) {
			labels.push(row.URL);
			data.push(parseInt(row.Requested));
		});

		// Create the chart.js data structure using 'labels' and 'data'
		var dataset = {
			labels : labels,
			datasets : [{
				fill: false,
				borderColor: color,
				// borderDash: [5, 5],
				backgroundColor: color,
				pointBackgroundColor: color,
				pointBorderColor: color,
				pointHoverBackgroundColor: color,
				pointHoverBorderColor: color,
				data: data
			}],
		};

		// Get the context of the canvas element we want to select
		var ctx = document.getElementById("line-report").getContext("2d");

		// Instantiate a new chart
        Chart.defaults.global.defaultFontColor = 'black';
		var report = new Chart(ctx, {
			type: 'line',
			showTooltips: false,
			data: dataset,
			options: {
				responsive: true,
				events: false,
				showTooltips: false,
				legend: {
					display: false,
				},
				elements: {
					line: {
						tension: 0 // Disable bezier curves
					}
				},
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Overall requests",
							fontStyle: "bold",
							fontColor: "black"
						}
					}]
				},
				animation: {
					onComplete: function () {
						var ctx = this.chart.ctx;
						ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
						ctx.fillStyle = "black";
						ctx.textBaseline = "bottom";
						this.data.datasets.forEach(function (dataset) {
							for (var i = 0; i < dataset.data.length; i++) {
								var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
								var yScale = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
								var yPos = model.y - 5;
								var offset = 0;

								var value = dataset.data[i];
								if (value > 0) {
									var caption = value.toString();
									var textHeight = parseInt(ctx.font.match(/\d+/), 10);

									if ((yScale - model.y) / yScale >= 0.95) {
										yPos = model.y + textHeight + 10;
									}

									if (firstRow) {
										offset = 5;
									}

									ctx.textAlign = firstRow ? "left" : "center";
									ctx.fillText(caption, model.x + offset, yPos);
								}

								firstRow = false;
							}
						});
					}
				}
			}
		});
	});
}

function drawDoughnutRequestsReport(element, limit) {

	// Default column colors as used by bootstrap 3
	var colorIndex = 0;
	var bootstrapColors = [
		"rgb(108, 117, 125)", // bg-secondary
		"rgb(51, 122, 183)",  // bg-primary
		"rgb(92, 184, 92)",   // bg-success
		"rgb(240, 173, 78)",  // bg-warning
		"rgb(91, 192, 222)",  // bg-info
		"rgb(217, 83, 79)"    // bg-danger
	];

	function getNextRowColor() {
		if (colorIndex >= bootstrapColors.length)
			colorIndex = 0;
		return bootstrapColors[colorIndex++];
	}

	function getReportColor(index) {
		if (index >= 0 && index < bootstrapColors.length)
			return bootstrapColors[index];
		return bootstrapColors[0];
	}

	$.ajax({
		url: '/rest/requests-chart.json?limit=' + limit.toString(),
		dataType: 'json',
	}).done(function (results) {

		// Split timestamp and data into separate arrays
		var labels = [], data=[], colors=[];
		results["rows"].forEach(function(row) {
			labels.push(row.URL);
			data.push(parseInt(row.Requested));
			colors.push(getNextRowColor());
		});

		// Create the chart.js data structure using 'labels' and 'data'
		var dataset = {
			labels : labels,
			datasets : [{
				backgroundColor: colors,
				data: data
			}],
		};

		// Get the context of the canvas element we want to select
		var canvas = document.getElementById(element)
		var ctx = canvas.getContext("2d");

		// Instantiate a new chart
        Chart.defaults.global.defaultFontColor = 'black';
		Chart.pluginService.register({
			beforeDraw: function (chart) {
				if (chart.config.options.elements.center) {
					//Get ctx from string
					var ctx = chart.chart.ctx;

					//Get options from the center object in options
					var centerConfig = chart.config.options.elements.center;
					var fontStyle = centerConfig.fontStyle || 'Arial';
					var txt = centerConfig.text;
					var color = centerConfig.color || '#000';
					var sidePadding = centerConfig.sidePadding || 20;
					var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
					//Start with a base font of 30px
					ctx.font = "30px " + fontStyle;

					//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
					var stringWidth = ctx.measureText(txt).width;
					var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

					// Find out how much the font can grow in width.
					var widthRatio = elementWidth / stringWidth;
					var newFontSize = Math.floor(30 * widthRatio);
					var elementHeight = (chart.innerRadius * 2);

					// Pick a new font size so it will not be larger than the height of label.
					var fontSizeToUse = Math.min(newFontSize, elementHeight);

					//Set font settings to draw it correctly.
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
					var centerY = 3 + ((chart.chartArea.top + chart.chartArea.bottom) / 2);
					ctx.font = 'bold ' + fontSizeToUse+"px " + fontStyle;
					ctx.fillStyle = color;

					//Draw text in center
					ctx.fillText(txt, centerX, centerY);
				}
			}
		});
		var report = new Chart(ctx, {
			type: 'doughnut',
			showTooltips: false,
			data: dataset,
			options: {
				responsive: false,
				aspectRatio: 1.0,
				cutoutPercentage: 60,
				legend: {
					display: true,
					position: 'bottom'
				},
				elements: {
					center: {
						text: '90%',
						color: '#333333',
						fontStyle: Chart.defaults.global.defaultFontFamily,
						sidePadding: 20
					}
				}
			}
		});
	});
}


function onTableLoaded() {
};

function onRowClick(event, row, $element) {
	var sid = row.SID || "";
	console.log('Click for Session "' + sid + '"');
	showMessageDialog(
		'Session information',
		'/sessiondata.html?SID=' + sid,
		'modal-md',
		'/images/logo36.png'
	);
}

function setTableEvents() {
    $('#data-table').bootstrapTable()
		.on('all.bs.table', function (e, name, args) { console.log('Event:', name, ', data:', args); })
		.on('click-row.bs.table', onRowClick)
		.on('post-body.bs.table', onTableLoaded);
};

