
function showAlertMessage(header, text, size, logo, position) {
	var top = position || 50;
	var html;

	html =  '<div class="modal fade" id="alertDialog" role="dialog">';
	html += ' <div class="modal-dialog ' + size + '" style="top: ' + top.toString() + 'px;">';
	html += '  <div class="modal-content">';
	html += '   <div class="modal-header modal-header-custom">';
	html += '    <div style="float:left; height: 36px; width: 36px;">';
	html += '     <img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
	html += '    </div>';
	html += '    <button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '    <h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '   </div>';
	html += '   <h4 style="margin-left: 20px; margin-right: 20px;" class="modal-body">' + text + '</h4>';
	html += '   <div class="modal-footer">';
	html += '    <button type="button" class="btn btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-ok" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '   </div>';
	html += '  </div>';
	html += ' </div>';
	html += '</div>';

	// Bind modal window to main bootstrap main container
	$('#main-container').append(html);

	// Show modal dialog	
	$('#alertDialog').on('hidden.bs.modal', function (e) {
        	$(this).remove();
	}).modal().modal('show');
}

function closeModalDialog() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}

function showAlertInfoMessage(text) {
	var icon = '/images/glyphicons/info-square.png';
	showAlertMessage("Information", text, "modal-sm", icon, 60);
};

function showAlertWarningMessage(text) {
	var icon = '/images/glyphicons/warning-triangle.png';
	showAlertMessage("Warning", text, "modal-sm", icon, 65);
};

function showAlertErrorMessage(text) {
	var icon = '/images/glyphicons/error-square.png';
	showAlertMessage("Error", text, "modal-sm", icon, 70);
};

