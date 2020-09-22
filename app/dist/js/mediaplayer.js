/*!
 * Mediplayer5
 * by Dirk Brinmeier
 * 10/31/2017
 *
 * More info:
 * http://www.dbrinkmeier.de/download/mediaplayer
 *
 * Copyright 2017, 2018 Dirk Brinkmeier
 * Released in the public domain
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
	
	if (typeof define === 'function' && define.amd) {
		// AMD: Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// NodeJS: Does not work with strict CommonJS, 
		// but only CommonJS-like environments that support module.exports
		module.exports = factory(require('jquery'));
	} else {
		// jQuery: Browser global (root is bound to window)
		root.mediaplayer5 = factory(root.jQuery);
	}
	
} (this, function ($) {

    // BOOTSTRAP MEDIAPLAYER5 HELPER DEFINITIONS
    // =========================================
	var nil = void(0);

	var EPS_IDLE = 0;
	var EPS_BUFFERING = 1;
	var EPS_PREPARE = 2;
	var EPS_PLAYING = 3;
	var EPS_PAUSED = 4;
	var EPS_RESUME = 5;
	var EPS_ERROR = 6;

	function formatDateTime(time) {   
		var value = Math.floor(time);
		
		// Calculate hour, minute and second parts
		var hours = ~~(value / 3600);
		var minutes = ~~((value % 3600) / 60);
		var seconds = value % 60;

		// Generate output like "1:01" or "4:03:59" or "123:03:59"
		var retVal = "";
		if (hours > 0) {
			retVal += hours + ":" + (minutes < 10 ? "0" : "");
		}
		retVal += minutes + ":" + (seconds < 10 ? "0" : "");
		retVal += seconds;
		
		return retVal;
	}

	function getFileExt(fileName) {
		var a = fileName.split(".");
		if (a.length === 1 || (a[0] === "" && a.length === 2)) {
			return "";
		}
		return a.pop().toLowerCase();
	}

	function getFolderName(fileName) {
		var a = fileName.split("/");
		if (a.length > 1) {
			return a[a.length - 2];
		}
		return "";
	}

	function isChrome() {
		var isChromium = window.chrome,
		winNav = window.navigator,
		vendorName = winNav.vendor,
		isOpera = winNav.userAgent.indexOf("OPR") > -1,
		isIEedge = winNav.userAgent.indexOf("Edge") > -1,
		isIOSChrome = winNav.userAgent.match("CriOS");

		if (isIOSChrome) {
			return true;
		} else if (
			isChromium !== null &&
			typeof isChromium !== "undefined" &&
			vendorName === "Google Inc." &&
			isOpera === false &&
			isIEedge === false
		) {
			return true;
		} else { 
			return false;
		}
	}

	var assignHTML = function (size, logo, header) {
		var html;

		// Modal dialog header
		html  = '<div class="modal fade" id="modalMediaPlayerDialog5" role="dialog">';
		html += '	<div class="modal-dialog ' + size + '" style="width: 400px; margin-left: auto;">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header modal-header-custom">';
		html += '				<div style="float:left; height: 36px; width: 36px;">';
		html += '					<img style="max-height: 100%; max-width: 100%" src="' + logo + '" alt="&copy; db Application"/>';
		html += '				</div>';
		html += '				<button type="button" class="close" data-dismiss="modal"><span class="glyphicon glyphicon glyphicon-remove" style="pointer-events:none" aria-hidden="true"></span></button>';
		html += '				<h3 class="modal-title">&nbsp;&nbsp;<strong id="modalMediaPlayerHeader5">' + header + '</strong></h3>';
		html += '			</div>';
		html += '			<div style="margin-left: 20px; margin-right: 20px;" class="modal-body">';

		// Coverart thumbnail view
		html += '				<div class="thumbnail clearfix">';
		html += '					<img id="modalMediaPlayerCover5" style="width: 200px; height: 200px;" class="img-thumbnail" alt="No cover art found...">';
		html += '				</div>';

		// Title text
		html += '				<div class="panel panel-default">';
		html += '					<div class="panel-heading text-center">';
		html += '						<strong id="modalMediaPlayerTitle5">---</strong>';
		html += '					</div>';
		html += '					<div class="panel-body">';

		// Progress time display
		html += '						<div class="text-center">';
		html += '							<h5>';
		html += '								<span class="label label-default pull-left">0:00</span>';
		html += '								<span id="modalMediaPlayerStatus5" class="label label-default">Unknown</span>';
		html += '								<span id="modalMediaPlayerDuration5" class="label label-default pull-right">0:00</span>';
		html += '							</h5>';
		html += '						</div>';

		// Progress bar display
		html += '						<div id="modalMediaPlayerProgressDiv5" class="progress">';
		html += '							<div id="modalMediaPlayerProgressBar5" class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%;">0:00</div>';
		html += '						</div>';

		// Control buttons
		html += '						<div class="text-center">';
		html += '							<div class="btn-group pull-left" role="group">';
		html += '								<button value="PREV" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-step-backward" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '								<button value="FR" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-fast-backward" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '							</div>';
		html += '							<div class="btn-group" role="group">';
		html += '								<button value="PLAY" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-play" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '								<button value="PAUSE" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-pause" style="pointer-events:none;" aria-hidden="true"></span>'; 
		html += '								</button>';
		html += '								<button value="STOP" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-stop" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '							</div>';
		html += '							<div class="btn-group pull-right" role="group">';
		html += '								<button value="FF" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-fast-forward" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '								<button value="NEXT" addPlayerClick5="true" class="btn btn-md btn-default">';
		html += '									<span class="glyphicon glyphicon-step-forward" style="pointer-events:none;" aria-hidden="true"></span>';
		html += '								</button>';
		html += '							</div>';
		html += '						</div>';

		// Close body
		html += '					</div>';
		html += '				</div>';

		// Close modal
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';

		return html;
	}

    // BOOTSTRAP MEDIAPLAYER5 CLASS DEFINITION
    // =======================================
	var Mediaplayer5 = function(options) {
		// Global variables
		this.events = {};
		this.album = [];
		this.uid = 1000000;
		this.prepare = false;
		this.transaction = false;
		this.currentSongIndex = -1;
		this.pausedSongIndex = -1;
		this.startSongIndex = -1;
		this.lastSongIndex = -1;
		this.currentSongDuration = -1;
		this.state = EPS_IDLE;
		this.chromium = isChrome();

		// Array for supported audio codecs		
		this.codecs = {
			mp3:  'audio/mpeg',
			m4a:  'audio/mp4; codecs="mp4a.40.2"',
			aac:  'audio/mp4; codecs="mp4a.40.2"',
			ogg:  'audio/ogg; codecs="vorbis, opus"',
			flac: 'audio/x-flac',
			wav:  'audio/wav; codecs="1"',
			webm: 'audio/webm; codecs="vorbis"'
		};

		// Set global Mediaplayer5 options before intitialization called
		this.options = $.extend({}, this.constructor.defaults);
		this.option(options);

		// Initialize player
	    this.init();
	}

	// Set default options
	Mediaplayer5.defaults = {
		header: "Mediaplayer",
		logo: "/images/logo.gif",
		nocover: "/images/nocover200.jpg",
		size: "modal-md",
		debug: false,
		delay: 260
	};

	Mediaplayer5.prototype.option = function(options) {
		$.extend(this.options, options);
	};

	Mediaplayer5.prototype.init = function() {
		var self = this;
		$(document).ready(function() {
			self.create();
		});
	};

	// Return unique query part for URI
	Mediaplayer5.prototype.nextImageQuery = function(url) {
		this.uid++;
		return url + "?_=" + this.uid.toString();
	}

	// Build dynamic HTML for the Mediaplayer5
	// and attach event handlers to the newly created DOM elements
	Mediaplayer5.prototype.create = function() {
		var self = this;

		// Create dynamic HTML content
		var html = assignHTML(this.options.size, this.options.logo, this.options.header);
		$(html).appendTo($('body'));

		// Cache jQuery objects
		this.$dialog   = $('#modalMediaPlayerDialog5');
		this.$image    = $('#modalMediaPlayerCover5');
		this.$title    = $('#modalMediaPlayerTitle5');
		this.$header   = $('#modalMediaPlayerHeader5');
		this.$status   = $('#modalMediaPlayerStatus5'); 
		this.$duration = $('#modalMediaPlayerDuration5'); 
		this.$progress = $('#modalMediaPlayerProgressBar5'); 
		this.$seeker   = $('#modalMediaPlayerProgressDiv5'); 

		// Activates content as a modal
		this.$dialog.modal({
			keyboard: false,
			focus: true,
			show: false
		})

		// Set default image
		this.$image.attr('src', this.nextImageQuery(this.options.nocover));

		// Assign event methods to modal window
		this.$dialog.on('hidden.bs.modal', function (e) {
			if (self.options.debug) console.log('[mediaplayer.js] onHidden() called.');
			self.close();
		});
		this.$dialog.on('show.bs.modal', function() {
			if (self.options.debug) console.log('[mediaplayer.js] onShow() called.');
		});
		this.$dialog.on('shown.bs.modal', function() {
			// Play start index
			if (self.options.debug) console.log('[mediaplayer.js] onShown() called for song index = ' + self.startSongIndex.toString());
			if (self.startSongIndex >= 0) {
				self.play(self.startSongIndex);
				self.startSongIndex = -1;
			}
		});

		// Bind local event handler
		this.$seeker.on('click', function(event) {
			self.onProgressClick(event);
		});
		this.$image.on('error', function(event) {
			self.onImageError(event);
		});

		// Assing button click events
		this.setButtonEvents();
	};

	Mediaplayer5.prototype.addEventListener = function(name, handler) {
		if (this.events.hasOwnProperty(name))
			this.events[name].push(handler);
		else
			this.events[name] = [handler];
	};

    Mediaplayer5.prototype.removeEventListener = function(name, handler) {
        /* This is a bit tricky, because how would you identify functions?
           This simple solution should work if you pass THE SAME handler. */
        if (!this.events.hasOwnProperty(name))
            return;

        var idx = this.events[name].indexOf(handler);
        if (idx != -1)
            this.events[name].splice(idx, 1);

    };

    Mediaplayer5.prototype.dispatchEvent = function(name, args) {
        if (!this.events.hasOwnProperty(name))
            return;

        if (!args || !args.length)
            args = [];

        var event = this.events[name];
        for (var i = 0; i < event.length; i++) {
			try {
	            event[i].apply(this, args);
			} catch(e) {
				alert('Mediaplayer5: Exception "' + e.message + '"');
			}
        }
    };

	// Open new media file link:
	// <audio
	//   id="EE01F44DDB0676128650777F50DD1742"
	//   data-media5="EE01F44DDB0676128650777F50DD1742" or data-media5="<placeholder for collection name>" 
	//   title-media5="11 - Wallies"
	//   cover-media5="/fs1/musik/Anne Clark/The Best of Anne Clark/folder.jpg"
	//   src="/fs0/musik/Anne Clark/The Best of Anne Clark/11 - Wallies.flac" 
	//   preload="none">
	// </audio>
	Mediaplayer5.prototype.open = function($song) {
		if (this.options.debug) console.log('[mediaplayer.js] open() called.');
		var self = this;

		this.album = [];
		var index = -1;

		function addSong($song) {
			var file = $song.attr('src'); 
			if (self.options.debug) console.log('[mediaplayer.js] addSong() called for file "' + file + '"');
			self.album.push({
				id: $song.attr('id'),
				title: $song.attr('title-media5'),
				cover: $song.attr('cover-media5'),
				src: file,
			});
		}

		// Build playlist from audio elemnts
		var $songs;
		var tag = $song.attr('data-media5');
		if (tag) {
			$songs = $($song.prop('tagName') + '[data-media5="' + tag + '"]');
			for (var i = 0; i < $songs.length; i = ++i) {
				addSong($($songs[i]));
				if ($songs[i] === $song[0]) {
					index = i;
				}
			}
		} else {
			// Audio element is not part of a set
			addSong($song);
			index = 0;
		}

		// Set given song index from playlist as start song
		if (index >= 0) {
			this.startSongIndex = index;
		}

		// Show modal window
		this.$dialog.modal('show');
	};
	
	// Set player control button events
	Mediaplayer5.prototype.setButtonEvents = function() {
		var self = this;
		var buttons = document.getElementsByTagName('button');
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			if (button.hasAttribute("addPlayerClick5")) {
				var value = button.getAttribute("addPlayerClick5");
				if (value.toLowerCase() == "true") {
					var element = $(button);
					element.on('click', function(event) {
						self.onButtonClick(event);
					});
				}
			}
		}
	}

	Mediaplayer5.prototype.onButtonClick = function(event) {
		var target = event.target || event.srcElement || event.originalTarget;
		if (target !== nil) {
			if (event.cancelable) {
				event.preventDefault();
			}
			this.onButtonClicked(target);
		} else {
			alert('Error: onButtonClick() undefined.');
		}
	}

	// Execute action on button clicked by user
	Mediaplayer5.prototype.onButtonClicked = function(target) {
		var action = target.value;
		var found = false;
		if (action !== nil) {
			if (!found && action === "PREV") {
				this.prev();
				found = true;
			}
			if (!found && action === "FR") {
				this.reverse();
				found = true;
			}
			if (!found && action === "PLAY") {
				this.play(this.currentSongIndex);
				found = true;
			}
			if (!found && action === "PAUSE") {
				this.pause();
				found = true;
			}
			if (!found && action === "STOP") {
				this.stop();
				found = true;
			}
			if (!found && action === "FF") {
				this.forward();
				found = true;
			}
			if (!found && action === "NEXT") {
				this.next();
				found = true;
			}
		}
		if (this.options.debug) console.log('[mediaplayer.js] Click for button id: ' + target.id + ', name: ' + target.name + ', action: ' + action);
	};

	// Load default image on error
	Mediaplayer5.prototype.onImageError = function(event) {
		var target = event.target || event.srcElement || event.originalTarget;
		if (target !== nil) {
			target.src = this.nextImageQuery(this.options.nocover);
		}
	}

	// Catch click on progress bar
	Mediaplayer5.prototype.onProgressClick = function(event) {
		var elem = document.getElementById('modalMediaPlayerProgressDiv5');
		if (this.options.debug) console.log('[mediaplayer.js] Called onProgressClick() PageX = ' + event.pageX + ' OffsetX = ' + event.offsetX + ' Left = ' + elem.offsetLeft + ' Width = ' + elem.offsetWidth);
		var progress = event.offsetX * 100 / elem.offsetWidth;
		if (this.options.debug) console.log('[mediaplayer.js] Called onProgressClick() Progress = ' + progress + ' %');
		this.setRelativePosition(progress)
	};
	

	// Seek to relative stream position
	Mediaplayer5.prototype.setRelativePosition = function(percent) {
		if (this.isPlaying()) {
			value = percent;
			if (percent < 0)
				value = 0;
			if (percent > 100)
				value = 100;
			var time = this.currentSongDuration * value / 100;
			this.seek(time);
		}
	}	
	
	// Check if current song is playing
	Mediaplayer5.prototype.isPlaying = function() {
		if ((this.currentSongIndex >= 0 && this.currentSongIndex < this.album.length) || this.prepare || this.transaction) {
			return true;
		}
		return false;
	}
	
	// Start to play given index in list
	Mediaplayer5.prototype.play = function(index) {
		var self = this;

		// Check if playback was stopped before
		// --> Restart playback of last song
		if (index < 0) {
			if (this.lastSongIndex >= 0) {
				index = this.lastSongIndex;
			}
		}

		// Check if playback was paused or
		// start playing when no song is playing so far...
		var wasPaused = this.pausedSongIndex >= 0;
		if ((this.currentSongIndex < 0 && index >= 0 && index < this.album.length) || wasPaused) {
			
			// Song no longer paused
			this.pausedSongIndex = -1;

			// Set new song properties
			var hasChanged = false;
			if (this.currentSongIndex !== index) {
				var title = this.album[index].title;
				this.$title.text(title);
				this.$image.attr('src', this.nextImageQuery(this.album[index].cover));
				this.dispatchEvent('change', [title]); 
				hasChanged = true;
			}

			// Start native HTML5 mediaplayer
			var ok = false;
			var ident = this.album[index].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {

				// Get soure file
				var file = stream.getAttribute('src');

				// Set properties for current audio element				
				if (hasChanged) {

					// Set current song index
					this.currentSongIndex = index;
					this.lastSongIndex = index;
				
					// Set events for current audio element
					stream.onplay = function() {
						if (self.transaction || self.currentSongIndex >= 0) {
							self.transaction = false;
							self.setStatusLabel(EPS_PLAYING);
						}
						if (self.options.debug) console.log('[mediaplayer.js] onplay() called for song index = ' + self.currentSongIndex.toString());
					};
					stream.oncanplay = function() {
						if (self.prepare) {
							self.prepare = false;
							if (self.currentSongIndex >= 0) {
								self.setStatusLabel(EPS_PREPARE);
								//stream.play();
								window.setTimeout(function() {
									self.retry();
								}, self.options.delay);
							}
						}
						if (self.options.debug) console.log('[mediaplayer.js] oncanplay() called for song index = ' + self.currentSongIndex.toString());
					};
					stream.oncanplaythrough = function() {
						if (self.options.debug) console.log('[mediaplayer.js] oncanplaythrough() called for song index = ' + self.currentSongIndex.toString());
					};
					stream.ondurationchange = function() {
						var duration = stream.duration;
						self.setDurationLabel(duration);
						if (self.options.debug) console.log('[mediaplayer.js] ondurationchange() called for song index = ' + self.currentSongIndex.toString() + ' duration = ' + Math.floor(duration).toString() + ' sec' );
					};
					stream.ontimeupdate = function() {
						if (self.isPlaying()) {
							var time = stream.currentTime;
							self.setProgressBar(time);
							// console.log('[mediaplayer.js] ontimeupdate() called for song index = ' + self.currentSongIndex.toString() + ' time = ' + Math.floor(time).toString() + ' sec' );
						}	
					};
					stream.onemptied = function() {
						if (self.options.debug) console.log('[mediaplayer.js] onemptied() called for song index = ' + self.currentSongIndex.toString());
					};
					stream.onended = function() {
						if (self.options.debug) console.log('[mediaplayer.js] onended() called for song index = ' + self.currentSongIndex.toString());
						if (!self.transaction) {
							if ((self.album.length > 1) && (self.currentSongIndex < (self.album.length - 1))) {
								self.next();
							} else {
								self.finalize();
							}
						}
					};
					stream.onerror = function() {
						if (self.options.debug) console.log('[mediaplayer.js] onerror() called for song index = ' + self.currentSongIndex.toString());
						self.prepare = false;
						self.transaction = false;
						self.error();
					};
				}
				
				// Load or resume current stream
				if (wasPaused) {
					// Continue playing stream after pause mode
					if (hasChanged || wasPaused) {
						this.setStatusLabel(EPS_RESUME);
					}
					this.transaction = true;
					stream.play();
				} else {
					// Load file for first playback
					if (hasChanged || wasPaused) {
						this.setStatusLabel(EPS_BUFFERING);
					}
					
					// Set codec information if available					
					if (!stream.hasAttribute('type')) {
						var ext = getFileExt(file);
						if (ext !== "") {
							var codec = this.codecs[ext];
							if (codec !== nil) {
								if (self.options.debug) console.log('[mediaplayer.js] play() Add codec <' + codec + '> for file "' + file + '"');
								stream.setAttribute('type', codec);
							}
						}
					}

					// Set load property to start preload/load
					// and set stream to autoplay to start streaming
					var load = true;
					if (stream.hasAttribute('preload')) {
						load = false;
						var attr = stream.getAttribute('preload');
						if (attr !== "auto")
							load = true;
					}
					if (load) {
						this.prepare = true;
						this.transaction = true;
						stream.setAttribute('preload', "auto");
						if (!stream.hasAttribute('autoplay')) {
							stream.setAttribute('autoplay', "");
						}
					} else {
						this.transaction = true;
						stream.play();
					}
				}
				
				// Try to set duration as early as possible...
				this.setDurationLabel(stream.duration);
				this.setHeaderText(file);
				ok = true;
				
			} else {
				alert('Error: play() failed for file \"' + this.album[index].src + '\", ID \"' + ident + '\" not found.');
			}
			if (ok) {
				if (this.options.debug) console.log('[mediaplayer.js] play() called for song index = ' + this.currentSongIndex.toString());
			}
		}
	};
	
	// Display progress
	Mediaplayer5.prototype.setProgressBar = function(time) {
		if (time > 0.0) {
			if (this.currentSongDuration > 0.0) {
				var percent = time * 100.0 / this.currentSongDuration;
				if (percent > 100.0)
					percent = 100.0;
				this.$progress.attr('style', "width:" + Math.floor(percent).toString() + "%;");
				this.$progress.text(formatDateTime(time));
			} else {
				this.$progress.attr('style', "width:100%;");
				this.$progress.text(formatDateTime(time));
			}
		} else {
			this.$progress.attr('style', "width:0%;");
			this.$progress.text("0:00");
		}
	}

	Mediaplayer5.prototype.setDurationLabel = function(duration) {
		if (this.currentSongDuration <= 0) {
			if (!isNaN(duration) && isFinite(duration)) {
				if (duration > 0) {
					this.currentSongDuration = duration;
					this.$duration.text(formatDateTime(duration));
				} else {
					this.$duration.text("0:00");
				}
			}
		}
	}	
	
	Mediaplayer5.prototype.setHeaderText = function(file) {
		var path = getFolderName(file);
		if (path !== "") {
			if (path.length > 12)
				path = path.substring(0,12) + '...';
			this.$header.text('Album "' + path + '"');
		} else {
			this.$header.text(this.options.header);
		}
	}	
	
	Mediaplayer5.prototype.setStatusLabel = function(action, text) {
		var found = false;
		
		if (!found && this.state === EPS_IDLE && this.$status.hasClass("label-default")) {
			this.$status.removeClass("label-default");
			found = true;
		}
		if (!found && this.state === EPS_PAUSED && this.$status.hasClass("label-primary")) {
			this.$status.removeClass("label-primary");
			found = true;
		}
		if (!found && this.state === EPS_ERROR && this.$status.hasClass("label-danger")) {
			this.$status.removeClass("label-danger");
			found = true;
		}
		if (!found && this.state === EPS_PREPARE && this.$status.hasClass("label-warning")) {
			this.$status.removeClass("label-warning");
			found = true;
		}
		if (!found && this.state === EPS_RESUME && this.$status.hasClass("label-warning")) {
			this.$status.removeClass("label-warning");
			found = true;
		}
		if (!found && this.state === EPS_PLAYING && this.$status.hasClass("label-success")) {
			this.$status.removeClass("label-success");
			found = true;
		}
		if (!found && this.state === EPS_BUFFERING && this.$status.hasClass("label-warning")) {
			this.$status.removeClass("label-warning");
			found = true;
		}
		
		this.state = action;
		found = false;

		if (!found && this.state === EPS_IDLE) {
			if (!this.$status.hasClass("label-default"))
				this.$status.addClass("label-default");
			this.$status.text("Stopped");
			found = true;
		}
		if (!found && this.state === EPS_PAUSED) {
			if (!this.$status.hasClass("label-primary"))
				this.$status.addClass("label-primary");
			this.$status.text("Paused");
			found = true;
		}
		if (!found && this.state === EPS_ERROR) {
			if (!this.$status.hasClass("label-danger"))
				this.$status.addClass("label-danger");
			this.$status.text(text);
			found = true;
		}
		if (!found && this.state === EPS_PREPARE) {
			if (!this.$status.hasClass("label-warning"))
				this.$status.addClass("label-warning");
			this.$status.text("Prepare");
			found = true;
		}
		if (!found && this.state === EPS_RESUME) {
			if (!this.$status.hasClass("label-warning"))
				this.$status.addClass("label-warning");
			this.$status.text("Resume");
			found = true;
		}
		if (!found && this.state === EPS_PLAYING) {
			if (!this.$status.hasClass("label-success"))
				this.$status.addClass("label-success");
			this.$status.text("Playing");
			found = true;
		}
		if (!found && this.state === EPS_BUFFERING) {
			if (!this.$status.hasClass("label-warning"))
				this.$status.addClass("label-warning");
			this.$status.text("Buffering");
			found = true;
		}

	}	
	
	Mediaplayer5.prototype.resetStreamEvents = function(element) {
		if (element !== nil) {
			element.onplay = nil;
			element.oncanplay = nil;
			element.ondurationchange = nil;
			element.ontimeupdate = nil;
			element.onemptied = nil;
			element.onended = nil;
			element.onerror = nil;
		}	
	}
	
	Mediaplayer5.prototype.resetMediaDisplay = function() {
		this.$duration.text("0:00");
		this.$title.text("---");
		this.$image.attr('src', this.nextImageQuery(this.options.nocover));
		this.dispatchEvent('change', ['']); 
	}
	
	// Seek forward in stream
	Mediaplayer5.prototype.forward = function() {
		this.jump(1);
	}
	
	// Seek reverse in stream
	Mediaplayer5.prototype.reverse = function() {
		this.jump(-1);
	}
	
	// Seek steps in stream
	Mediaplayer5.prototype.jump = function(direction) {
		if (this.isPlaying() && !this.transaction && (this.pausedSongIndex < 0) && (this.currentSongDuration > 20)) {
			var max = this.currentSongDuration - 5;
			var step = this.currentSongDuration / 16;
			if (step < 1)
				step = 1;
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				var current = stream.currentTime;
				var min = step + 5;
				if ((current > min || direction > 0)  && (current < max || direction < 0)) {
					var time;
					if (direction > 0) {
						time = current + step;
					} else {
						time = current - step;
					}
					this.seek(time);
				}
			}
		}
	}
	
	// Seek to timestamp in stream
	Mediaplayer5.prototype.seek = function(time) {
		if (this.isPlaying() && (this.pausedSongIndex < 0) && (this.currentSongDuration > 20)) {

			// Seek to given position (in seconds)
			var ok = false;
			var value = time;
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				var max = this.currentSongDuration - 15;
				var start = 0;
				var end = max;
				if (stream.seekable.length > 0) {
					start = stream.seekable.start(0); // Returns the starting time (in seconds)
					end = stream.seekable.end(0);     // Returns the ending time (in seconds)
					if (this.options.debug) console.log('[mediaplayer.js] seek() called for song index = ' + this.currentSongIndex.toString() + ' seeking range (' + start.toString() + ',' + end.toString() + ')');
				}
				if (end > max)
					end = max;
				if (start >= 0 && end > 0) {
					if (time > end)
						value = end;
					if (time < start)
						value = start;
					stream.currentTime = value;
					ok = true;
				}
			} else {
				alert('Error: seek() failed for file \"' + this.album[this.currentSongIndex].src + '\", ID \"' + ident + '\" not found.');
			}
			if (ok) {
				if (this.options.debug) console.log('[mediaplayer.js] seek() called for song index = ' + this.currentSongIndex.toString() + ' to position (' + value.toString() + ',' + time.toString() + ')');
			}
			
		}
	}

	// Play pevious song
	Mediaplayer5.prototype.prev = function() {
		if (this.isPlaying() && this.album.length > 1) {
			var idx = this.currentSongIndex - 1;
			if (idx < 0)
				idx = this.album.length - 1;
			if (idx >= 0 && idx < this.album.length) {
				this.stop();
				this.play(idx);
			}
		}
	}

	// Play next song
	Mediaplayer5.prototype.next = function() {
		if (this.isPlaying() && this.album.length > 1) {
			var idx = this.currentSongIndex + 1;
			if (idx >= this.album.length)
				idx = 0;
			if (idx >= 0 && idx < this.album.length) {
				this.stop();
				this.play(idx);
			}
		}
	}

	// Stop playback
	Mediaplayer5.prototype.stop = function() {
		if (this.isPlaying()) {
			
			// Stop native HTML5 mediaplayer
			var ok = false;
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				this.prepare = false;
				this.transaction = false;
				stream.pause();
				stream.currentTime = 0;
				this.resetStreamEvents(stream);
				this.currentSongDuration = -1;
				this.resetMediaDisplay();
				this.setProgressBar(0.0);
				this.setStatusLabel(EPS_IDLE);
				ok = true;
			} else {
				alert('Error: stop() failed for file \"' + this.album[this.currentSongIndex].src + '\", ID \"' + ident + '\" not found.');
			}
			if (ok) {
				if (this.options.debug) console.log('[mediaplayer.js] stop() called for song index = ' + this.currentSongIndex.toString());
				this.currentSongIndex = -1;
				this.pausedSongIndex = -1;
			}
			
		}
	};

	// Display error state
	Mediaplayer5.prototype.error = function() {
		var ident = this.album[this.currentSongIndex].id;
		var stream = document.getElementById(ident);
		var text = this.getErrorMessage(stream);
		this.resetStreamEvents(stream);
		this.currentSongDuration = -1;
		this.currentSongIndex = -1;
		this.pausedSongIndex = -1;
		this.setProgressBar(0.0);
		this.setStatusLabel(EPS_ERROR, text);

	};
	
	Mediaplayer5.prototype.getErrorMessage = function(stream) {
		switch (stream.error.code) {
			case 1:
				return "Aborted";

			case 2:
				return "Network error";

			case 3:
				return "Decoder error";

			case 4:
				return "Invalid source";

			default:
				return "Unknown error";
		}
	};

	// Finalize playback by end of song
	Mediaplayer5.prototype.finalize = function() {
		if (this.isPlaying()) {
			
			// Stop native HTML5 mediaplayer
			var ok = false;
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				this.currentSongDuration = -1;
				this.resetStreamEvents(stream);
				this.setProgressBar(0.0);
				this.setStatusLabel(EPS_IDLE);
				ok = true;
			} else {
				alert('Error: finalize() failed for file \"' + this.album[this.currentSongIndex].src + '\", ID \"' + ident + '\" not found.');
			}
			if (ok) {
				if (this.options.debug) console.log('[mediaplayer.js] finalize() called for song index = ' + this.currentSongIndex.toString());
				this.currentSongIndex = -1;
				this.pausedSongIndex = -1;
			}
			
		}
	};

	// Exit mediaplayer
	Mediaplayer5.prototype.exit = function() {
		// Stop native HTML5 mediaplayer
		if (this.isPlaying()) {
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				this.prepare = false;
				this.transaction = false;
				stream.pause();
				stream.currentTime = 0;
				this.resetStreamEvents(stream);
			}
		}	
		this.currentSongDuration = -1;
		this.currentSongIndex = -1;
		this.pausedSongIndex = -1;
		this.startSongIndex = -1;
		this.lastSongIndex = -1;
		this.resetMediaDisplay();
		this.setProgressBar(0.0);
		this.setStatusLabel(EPS_IDLE);
	};

	// Pause playback
	Mediaplayer5.prototype.pause = function() {
		if (this.isPlaying() && (this.pausedSongIndex < 0)) {

			// Pause native HTML5 mediaplayer
			var ok = false;
			var ident = this.album[this.currentSongIndex].id;
			var stream = document.getElementById(ident);
			if (stream !== nil) {
				stream.pause();
				this.setStatusLabel(EPS_PAUSED);
				ok = true;
			} else {
				alert('Error: pause() failed for file \"' + this.album[this.currentSongIndex].src + '\", ID \"' + ident + '\" not found.');
			}
			if (ok) {
				if (this.options.debug) console.log('[mediaplayer.js] pause() called for song index = ' + this.currentSongIndex.toString());
				this.pausedSongIndex = this.currentSongIndex;
			}
			
		}
	};

	// Retry start playback
	Mediaplayer5.prototype.retry = function() {
		var self = this;
		if (this.transaction && this.isPlaying()) {
			var fallback = true;
			if (this.pausedSongIndex >= 0) {
				fallback = false;
				this.play(this.currentSongIndex);
				if (this.options.debug) console.log('[mediaplayer.js] retry() Force playback for song index = ' + this.currentSongIndex.toString());
			} else {
				this.pause();
				if (this.options.debug) console.log('[mediaplayer.js] retry() Retry playback for song index = ' + this.currentSongIndex.toString());
			}
			if (fallback) {
				if (this.options.debug) console.log('[mediaplayer.js] retry() Retry timer for song index = ' + this.currentSongIndex.toString());
				window.setTimeout(function() {
					self.retry();
				}, this.options.delay);
			}
		}
		if (this.options.debug) console.log('[mediaplayer.js] retry() called for song index = ' + this.currentSongIndex.toString());
	}

	// Close modal window
	Mediaplayer5.prototype.close = function() {
		this.exit();
		this.album = [];
	};

	return new Mediaplayer5();
}));

