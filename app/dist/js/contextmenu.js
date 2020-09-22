//
// Generic context menu on HTML element
//
// See http://stackoverflow.com/questions/18666601/use-bootstrap-3-dropdown-menu-as-context-menu
// Demo http://jsfiddle.net/KyleMit/X9tgY/ & http://jsfiddle.net/X9tgY/800/
//
(function ($, window) {

	$.fn.contextMenu = function (settings) {

		return this.each(function () {

		    // Open context menu
		    $(this).on('contextmenu', function (e) {
		        // Return native menu if pressing control
		        // if (e.ctrlKey) return;
		        
		        // Show context menu
		        var $menu = $(settings.contextMenu)
		            .data("element", $(e.target))
		            .css({
		                position: "absolute",
		                left: getMenuPositionAlt(e.clientX, 'width', 'scrollLeft'),
		                top: getMenuPositionAlt(e.clientY, 'height', 'scrollTop')
		            })
		            .show()
		            .off('click.commom.contextmenu')
		            .on('click.commom.contextmenu', 'li', function (e) {
			    //.find('li').off('click.commom.contextmenu').on('click.commom.contextmenu', function (e) {
		                $menu.hide();
		        
		                var $element = $menu.data("element");
		                var $item = $(e.target);
				//console.log($element);
				//console.log(e.target);
		                
		                settings.onContextMenuItem.call(this, $item, $element);
		            });
		        
		        return false;
		    });

		    // Make sure menu closes on any click
		    $('body').click(function () {
		        $(settings.contextMenu).hide();
	    		$(settings.contextMenu).off('click.commom.contextmenu')
	    		//$(settings.contextMenu).find('li').off('click.commom.contextmenu')
		    });

		});
		
		function getMenuPosition(mouse, direction, scrollDir) {
		    var win = $(window)[direction](),
		        scroll = $(window)[scrollDir](),
		        menu = $(settings.contextMenu)[direction](),
		        position = mouse + scroll;
		                
		    // Opening menu would pass the side of the page
		    if (mouse + menu > win && menu < mouse) 
		        position -= menu;
		    
		    return position;
		}

		function getMenuPositionAlt(mouse, direction) {
			var win = $(window)[direction]();
			var page = $(document)[direction]();
			var menu = $(settings.menuSelector)[direction]();

			/*
			console.log("[contextmenu.js] Direction:", direction);            
			console.log("[contextmenu.js] Mouse", mouse);
			console.log("[contextmenu.js] Menu", Math.round(menu));
			console.log("[contextmenu.js] Page", page);
			console.log("[contextmenu.js] Window", win);
			*/

			// opening menu would pass the side of the page
			if (mouse + menu > page && menu < mouse) {
				return mouse - menu;
			} 

			return mouse;
		}    

	};

})(jQuery, window);


function setMultiLevelContextMenu() {
	$('.dropdown-submenu a.dropdown-propagate').on("click", function(e){
		// $(this).next('ul').toggle();
		e.stopPropagation();
		e.preventDefault();
		$(this).next('ul').siblings().removeClass('open');
		$(this).next('ul').toggleClass('open');
		console.log('[contectmenu.js] Open submenu.');
	});
}


