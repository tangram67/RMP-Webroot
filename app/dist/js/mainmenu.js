function mainMenuRefresh() {
	$("#main-menu-container").load("/app/system/main-menu-loader.html" + "?_=" + Math.random().toString(36).substr(2,10));
	window.setTimeout(function() {
		var item = $("#main-menu-container").attr("main-menu-active") || "";
		if (item.length > 0) {
			$(item).addClass("active");
		}
	}, 600);
};

function setActiveMenuItem(item) {

	// Get user level from cookie value
	var userlevel = getUserLevel();
	console.log('[mainmenu.js] setActiveMenuItem() User authentication level = ' + userlevel.toString());

	// Disable main menu items for unprivileged users
	$('.nav li').each(function() {
		$(this).removeClass("active");
		var id = $(this).attr('id') || "";
		if (id.length > 0) {		
			var menulevel = $(this).attr('userlevel') || 0;
			if (userlevel < menulevel) {
				$(this).addClass('disabled');
				$(this).attr("href", "#");
				$('a', this).attr("href", "#");
				$(this).click(function() {
					return false;
				})
				console.log('[mainmenu.js] setActiveMenuItem() Locked item <' + id + '> with access level (' + userlevel.toString() + ':' + menulevel.toString() + ')');
			} else {
				console.log('[mainmenu.js] setActiveMenuItem() Found item <' + id + '> with access level (' + userlevel.toString() + ':' + menulevel.toString() + ')');
			}
		}
	});

	// Disable context menu items for unprivileged users
	$('.dropdown-menu li').each(function() {
		var action = $(this).attr('data-item') || "";
		if (action.length > 0) {		
			var menulevel = $(this).attr('userlevel') || 0;
			if (userlevel < menulevel) {
				$(this).addClass('disabled');
				$(this).attr("href", "#");
				$('a', this).attr("href", "#");
				$(this).click(function() {
					return false;
				})
				console.log('[mainmenu.js] setActiveMenuItem() Locked action <' + action + '> with access level (' + userlevel.toString() + ':' + menulevel.toString() + ')');
			} else {
				console.log('[mainmenu.js] setActiveMenuItem() Found action <' + action + '> with access level (' + userlevel.toString() + ':' + menulevel.toString() + ')');
			}
		}
	});

	// Set single active menu item	
	$(item).addClass("active");
	$("#main-menu-container").attr("main-menu-active", item);

	// Set submenu open clicks
	// See: https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_ref_js_dropdown_multilevel_css&stacked=h
	// <li class="dropdown-submenu">
	//   <a class="dropdown-submenu-anchor" href="#">Another dropdown <span class="caret"></span></a>
	//   <ul class="dropdown-menu">
	//     <li><a href="#">2nd level dropdown</a></li>
	//     <li><a href="#">2nd level dropdown</a></li>
	//   </ul>
	// </li>
	$('.dropdown-submenu a.dropdown-submenu-anchor').on("click", function(e){
		$(this).next('ul').toggle();
		e.stopPropagation();
		e.preventDefault();
	});

};

function onMainLogoClick() {
	window.location = '/app/playlist/nowplaying.html';
};

function onAboutClick() {
		var width = "45px";
		var html = '<h3><strong><i>db::applications</i></strong></h3> \
					<h4>Dirk Brinkmeier<br>Meierfeld 17<br>D-32049 Herford<br><br> \
					<table cellspacing="0" cellpadding="0"><tbody><tr><td align="left" width="' + width + '">Fon:&nbsp;</td><td align="left">+49 5221 282732</td></tr><tr><td align="left" width="' + width + '">Mob:&nbsp;</td><td align="left">+49 171 7129981<br></td></tr> \
					<tr><td align="left" width="' + width + '">Mail:&nbsp;</td><td align="left"><a href="mailto:support@dbrinkmeier.de">support&commat;dbrinkmeier.de</a><br></td></tr><tr><td align="left" width="' + width + '">Web:&nbsp;</td><td align="left"><a href="https://www.dbrinkmeier.de" target="_blank">www.dbrinkmeier.de</a><br></td></tr></tbody></table>';
	showMessageDialog('Information', html, 'modal-sm', '/images/logo36.png');
}

function onCreditsClick() {
	showMessageDialog(
		'Credits',
		'/credits.html',
		'modal-md',
		'/images/logo36.png'
	);
}

function onSystemClick() {
	showMessageDialog(
		'Systeminfo',
		'/systeminfo.html',
		'modal-md',
		'/images/logo36.png'
	);
}

function onHelpClick() {
	showMessageDialog(
		'Main help screen',
		'/mainhelp.html',
		'modal-md',
		'/images/logo36.png'
	);
}

function onMainMenuSwipeLeft() {
	window.history.back();
};

function onMainMenuSwipeRight() {
	window.history.forward();
};

function onMainMenuSwipeUp() {
};

function onMainMenuSwipeDown() {
};

function setMainMenuSwipeEvents() {
	$('#navbar-menu-container')
		.on('swipeleft',  onMainMenuSwipeLeft)
		.on('swiperight', onMainMenuSwipeRight)
		.on('swipeup',    onMainMenuSwipeUp)
		.on('swipedown',  onMainMenuSwipeDown);
	$.detectSwipe.threshold = 128;
	$.detectSwipe.preventDefault = false;
};

