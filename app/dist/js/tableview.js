function onNavigationClick(event) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		var value = target.getAttribute('value');
		var $table = $('#data-table');
		console.log('Click for navigation id: ' + target.id + ', value: ' + value);
		var ok = false;
		if (!ok && value === 'NEXT') {
			$table.bootstrapTable('nextPage');
			ok = true;
		}
		if (!ok && value === 'PREV') {
			$table.bootstrapTable('prevPage');
			ok = true;
		}
		if (!ok && value === 'FIRST') {
			var options = $table.bootstrapTable('getOptions');
			if (options.pageNumber !== 1) {
				$table.bootstrapTable('selectPage', 1);
			}
			ok = true;
		}
		if (!ok && value === 'LAST') {
			var options = $table.bootstrapTable('getOptions');
			if (options.pageNumber !== options.totalPages) {
				$table.bootstrapTable('selectPage', options.totalPages);
			}
			ok = true;
		}
	} else {
        alert('Error: onNavigationClick() undefined.');
	}
}

function disableButton(name, disabled) {
	var $button	= $('#' + name);
	if (disabled) {
		$button.prop('disabled', true);
		$button.addClass('btn-disabled');
		$button.attr('disabled','disabled');
	} else {
		$button.prop('disabled', false);
		$button.removeClass('btn-disabled');
		$button.removeAttr('disabled');
	}
}

function setPageChange(pageNumber) {
	var options = $('#data-table').bootstrapTable('getOptions');
	if (pageNumber == 1) {
		disableButton('btnTableFirst', true);
		disableButton('btnTablePrev', true);
	} else {
		if (pageNumber > 2) {
			disableButton('btnTableFirst', false);
			disableButton('btnTablePrev', false);
		} else {
			disableButton('btnTableFirst', true);
			disableButton('btnTablePrev', false);
		}
	}
	if (options.totalPages > pageNumber) {
		if ((options.totalPages - 1) > pageNumber) {
			disableButton('btnTableNext', false);
			disableButton('btnTableLast', false);
		} else {
			disableButton('btnTableNext', false);
			disableButton('btnTableLast', true);
		}
	} else {
		disableButton('btnTableNext', true);
		disableButton('btnTableLast', true);
	}
}

function onPageChange(event, pageNumber, pageSize) {
	var nil = void(0);
	var target = event.target || event.srcElement || event.originalTarget;
	if (target !== nil) {
		setPageChange(pageNumber);
		console.log('Page change id: ' + target.id + ', page = ' + pageNumber + ', size = ' + pageSize);
	}
}

function onRemoteDataLoaded(data) {
	if (!window.bootstrapTableLoaded) {
		window.bootstrapTableLoaded = true;
		setPageChange(1);
	}
}

function setNavigationEvents() {
	window.bootstrapTableLoaded = false;

	$('#btnTableFirst').on('click', function (event) {
		onNavigationClick(event);
	});
	$('#btnTableNext').on('click', function (event) {
		onNavigationClick(event);
	});
	$('#btnTablePrev').on('click', function (event) {
		onNavigationClick(event);
	});
	$('#btnTableLast').on('click', function (event) {
		onNavigationClick(event);
	});
	$('#data-table').bootstrapTable()
		.on('page-change.bs.table', onPageChange)
		.on('load-success.bs.table', onRemoteDataLoaded);
	//window.setTimeout(function() {
	//	setPageChange(1);
	//}, 350);		
};

function onSwipeLeft() {
	$('#data-table').bootstrapTable('prevPage');
};

function onSwipeRight() {
	$('#data-table').bootstrapTable('nextPage');
};

function onSwipeUp() {
};

function onSwipeDown() {
};

function setSwipeEvents() {
	$('#main-container').on('swipeleft',  onSwipeLeft)
		                .on('swiperight', onSwipeRight)
		                .on('swipeup',    onSwipeUp)
		                .on('swipedown',  onSwipeDown);
	$.detectSwipe.threshold = 128;
	$.detectSwipe.preventDefault = false;
};

