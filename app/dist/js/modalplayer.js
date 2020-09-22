function getModalPlayerPlaylist() {
	// Return synchronous AJAX request data	
	return $.ajax({
		type: "GET",
		url: "/rest/modalplaylist.json",
		data: "OnModalPlaylist=null&prepare=no&title=modalplayer",
		async: false,
		error: function() {
			console.log('Error: AJAX getModalPlayerPlaylist() failed.');
		}
	}).responseText;
};


// function showMessageDialog(header, content, size = 'modal-sm', logo = '/images/logo.gif') {
function showModalPlayer(header, path, file, name, cover, size, logo) {

	var html;
	html  = '<div class="modal fade" id="modalMediaPlayerDialog5" role="dialog">';
	html += '	<div class="modal-dialog ' + size + '" style="width: 400px; margin-left: auto;">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header modal-header-custom">';
	html += '				<img style="float:left" src="' + logo + '" alt="&copy; db Application" height="32" width="32"/>';
	html += '				<button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
	html += '				<h3 class="modal-title">&nbsp;&nbsp;<strong>' + header + '</strong></h3>';
	html += '			</div>';
	html += '			<div style="margin-left: 20px; margin-right: 20px;" class="modal-body">';

	html += '				<div class="thumbnail clearfix">';
	html += '					<img style="width: 200px; height: 200px;" class="img-thumbnail" src="' + cover + '" alt="No cover art found...">';
	html += '				</div>';

	html += '				<div class="panel panel-default">';
	html += '					<div class="panel-heading text-center">';
	html += '						<strong>' + name + '</strong>';
	html += '					</div>';
	html += '					<div class="panel-body">';

	html += '						<div class="text-center">';
	html += '							<h5>';
	html += '								<span class="label label-default pull-left">0:00</span>';
	html += '								<span class="label label-default">Stop</span>';
	html += '								<span class="label label-default pull-right">5:00</span>';
	html += '							</h5>';
	html += '						</div>';

	html += '						<div onclick="onProgressClick(event)" class="progress">';
	html += '							<div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:33%;">1:00</div>';
	html += '						</div>';

	html += '						<div class="text-center">';
	html += '							<button id="btnFastReverse5" name="FR" value="FR" addClick="true" class="btn btn-md btn-default pull-left">';
	html += '								<span class="glyphicon glyphicon-fast-backward" style="pointer-events:none;" aria-hidden="true"></span>';
	html += '							</button>';
	html += '							<button id="btnPlay5" name="Play" value="PLAY" addClick="true" class="btn btn-md btn-default">';
	html += '								<span class="glyphicon glyphicon-play" style="pointer-events:none;" aria-hidden="true"></span>';
	html += '							</button>';
	html += '							<button id="btnPause5" name="Pause" value="PAUSE" addClick="true" class="btn btn-md btn-default">';
	html += '								<span class="glyphicon glyphicon-pause" style="pointer-events:none;" aria-hidden="true"></span>'; 
	html += '							</button>';
	html += '							<button id="btnStop5" name="Stop" value="STOP" addClick="true" class="btn btn-md btn-default">';
	html += '								<span class="glyphicon glyphicon-stop" style="pointer-events:none;" aria-hidden="true"></span>';
	html += '							</button>';
	html += '							<button id="btnFastForward5" name="FF" value="FF" addClick="true" class="btn btn-md btn-default pull-right">';
	html += '								<span class="glyphicon glyphicon-fast-forward" style="pointer-events:none;" aria-hidden="true"></span>';
	html += '							</button>';
	html += '						</div>';

	html += '					</div>';
	html += '				</div>';

	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';

	// Bind modal window to maincontainer:	
	// <div class="container theme-showcase" role="main" id="main-container">    
	$("#main-container").append(html);

	$dialog = $("#modalMediaPlayerDialog5");
	$dialog.modal();
	$dialog.on('hidden.bs.modal', function (e) {
		console.log('[modalplayer.js] onHidden() called.');
		//$("#modalMediaPlayerEx").jPlayer('close');
        $(this).remove();
    });
	$dialog.on('show.bs.modal', function() {
		console.log('[modalplayer.js] onShow() called.');
	});
	$dialog.on('shown.bs.modal', function() {
		console.log('[modalplayer.js] onShown() called.');
	});
	$dialog.modal('show');

}

function closeModalPlayer() {
    // Using a very general selector - this is because $('#msgDialog').hide
    // will remove the modal window but not the mask
	//$("#jquery_jplayer_1").jPlayer('close');
    $('.modal.in').modal('hide');
	console.log('[modalplayer.js] closeModalPlayer() called.');
}


function mediaPlayerTestClick5(path) {
	// header, path, file, name, cover, size, logo
	showModalPlayer(
		'Webplayer',
		'/fs0' + path,
		'/fs0/mnt/DBHOMESRV/nfs/Musik/files/Tangerine Dream/Exit/04 - Exit.flac',
		'04 - Exit.flac',
		'/fs1' + path + 'folder.jpg',
		'modal-md',
		'/images/logo.gif'
	);
}


