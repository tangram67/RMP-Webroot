
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

