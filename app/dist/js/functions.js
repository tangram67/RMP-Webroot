
// For some browsers 'attr' is undefined
$.fn.hasAttr = function(name) {  
   return this.attr(name) !== undefined;
};

function urlEncode(str) {
	if (!!str) {
		if (str.length > 0) {
			return encodeURIComponent(str).replace(/[!'( )*]/g, function(c) {
				return '%' + c.charCodeAt(0).toString(16);
			});
		}
	}
	return "";
};

function urlDecode(str) {
	if (!!str) {
		if (str.length > 0) {
			return decodeURIComponent(str);
		}
	}
	return "";
};

function urlEncodeRFC5987(str) {
	if (!!str) {
		return encodeURIComponent(str).
			// Beachte, dass obwohl RFC3986 "!" reserviert, es nicht kodiert
			// werden muss, weil RFC5987 es nicht reserviert.
			replace(/['()]/g, escape). // i.e., %27 %28 %29
			replace(/\*/g, '%2A').
			// Die folgenden Zeichen müssen nicht nach RFC5987 kodiert werden,
			// daher können wir bessere Lesbarkeit übers Netzwerk sicherstellen:
			// |`^
			replace(/%(?:7C|60|5E)/g, unescape);
	}
	return "";
};

function getUrlParameters() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
};

function getUrlParameter(name, defVal) {
	var param = defVal;
	if(window.location.href.indexOf(name) > -1) {
		param = urlDecode(getUrlParameters()[name]);
	}
	return param;
};

function sanitizeUrl(str) {
	var replacement = '-';
	var illegalRe = /[\/\?<>\\:\*\|"]/g;
	var controlRe = /[\x00-\x1f\x80-\x9f]/g;
	// var reservedRe = /^\.+$/;
	// var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
	var windowsTrailingRe = /[\. ]+$/;
	if (!!str) {
		if (str.length > 0) {
		  var sanitized = str
			.replace(illegalRe, replacement)
			.replace(controlRe, replacement)
			// .replace(reservedRe, replacement)
			// .replace(windowsReservedRe, replacement)
			.replace(windowsTrailingRe, replacement);
		  return sanitized.substring(0, 255);
		}
	}
	return "";
}

function getHostDomain() {
	return location.hostname + (location.port ? (':' + location.port) : '');
};

function getHostUrl() {
	return location.protocol + '//' + getHostDomain();
};

function getSocketUrl() {
	var isSecure = location.protocol.toLowerCase() === 'https:';
	var proto = isSecure ? 'wss:' : 'ws:';
	var socket = proto + '//' + location.hostname;
	if (location.port) {
		socket += ':' + location.port;
	}
	socket += '/';
	return socket;
};

function sanitizeString(value) {
	if (value) {
		if (value.length > 0) {
			return value.replace(/[^A-Za-z0-9 \-+*._äöüÄÖÜßáéíóúñÁÉÍÓÚÑåæøÅÆØ]/g, '');
		}
	}
	return "";
};

function strToStr(str, defVal) {
	defVal = (typeof defVal !== 'undefined') ?  defVal : '';
	if (!!str) {
		if (str.length > 0) {
			return str;
		}
	}
	return defVal;
};

function strToInt(str, defVal) {
	defVal = (typeof defVal !== 'undefined') ?  Number(defVal) : 0;
	if (!!str) {
		var parser = !Number.parseInt ? window.parseInt : Number.parseInt; 
		var isnan = !Number.isNaN ? window.isNaN : Number.isNaN;
		var value = parser(str, 10);
		if (!isnan(value)) {
			return value;
		}
	}
	return defVal;
};

function strToFloat(str, defVal) {
	defVal = (typeof defVal !== 'undefined') ?  Number(defVal) : 0;
	if (!!str) {
		var parser = !Number.parseFloat ? window.parseFloat : Number.parseFloat; 
		var isnan = !Number.isNaN ? window.isNaN : Number.isNaN;
		var value = parser(str);
		if (!isnan(value)) {
			return value;
		}
	}
	return defVal;
};

function urlParseParams(values) {

	function urlParseValues(params, pairs) {
		var pair = pairs[0];
		var parts = pair.split('=');
		var key = decodeURIComponent(parts[0]);
		var value = decodeURIComponent(parts.slice(1).join('='));

		// Handle multiple parameters of the same name
		if (typeof params[key] === "undefined") {
			params[key] = value;
		} else {
			params[key] = [].concat(params[key], value);
		}

		return pairs.length == 1 ? params : urlParseValues(params, pairs.slice(1))
	}

	if (!!values) {
		if (values.length > 0) {
			return urlParseValues({}, values.substr(1).split('&'));
		}
	}

	// Nothing found, return empty object
	return {};
};

// http://stackoverflow.com/a/8809472
function createUUID() {
	var d = new Date().getTime();
	if (window.performance && typeof window.performance.now === "function") {
		d += performance.now(); // Use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x03 | 0x08)).toString(16);
	});
	return uuid.toUpperCase();
};

function isMobilePlatform() {
	var check = false;
	(function(a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
	})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function isMobileAndTabletPlatform() {
	var check = false;
	(function(a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
	})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function isApplePlatform() {
	var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
	if (iOS) {
		return true;
	}
	iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
	if (iOS) {
		return true;
	}
	return false;
};

function isAppleFullscreen() {
	if (window.navigator.standalone) {
		return (("standalone" in window.navigator) && !!window.navigator.standalone);
	}
	return false;
};

function redirectApplicationLinks() {
	var a = document.getElementsByTagName("a");
	for(var i=0; i<a.length; i++) {
		// Be aware to load lightbox before ;-)
		if(!a[i].onclick && a[i].hasAttribute("href") && !a[i].hasAttribute("data-lightbox") && a[i].getAttribute("target") != "_blank") {
			a[i].onclick = function(event) {
				var link = this.getAttribute("href");
				if (link.length > 0 && link != "#" && !link.match(/^http(s?)/g)) {
					event.preventDefault();
					window.location.href = link;
					console.log('[functions.js] redirectApplicationLinks() Reference wrapper called for link "' + link + '"');
					return false;
				}
			}
		}
	}
};

function getCookieByName(name) {
	// var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
	// return !!pair ? pair[1] : null;
	// See https://jsperf.com/simple-get-cookie-by-name
	var pair = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return !!pair ? pair[2] : null;
};

function getSystemLanguage() {
	var language = getCookieByName("system-language");
	if (!!language) {
		if (language.length > 1) {
			console.log('[functions.js] getSystemLanguage() Language "' + language + '"');
			return language;
		}
	}
	// Set default language
	console.log('[functions.js] Error::getSystemLanguage() No language cookie found, using default.');
	return "de-DE";
};

function getUserLevel() {
	// Set default user level to administrative access (level 3)
	var level = getCookieByName("user-level");
	return strToInt(level, 3);
};

function getPasswordStrength(password) {
	var score = 0;
	var length = password.length || 0;
	if (length > 0) {
		if (length > 7) {
			score += 25;
		}      
		if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) {
			score += 25
		}
		if (password.match(/[\!\@\#\$\%\^\&\*\?\_\~\-\(\)]+/)) {
			score += 25;
		}
		if (password.match(/[0-9]/)) {
			score += 25
		}
	}
	return score;
};

function createUniqueUriParam() {
	return "_=" + Math.random().toString(36).substr(2,10);
};


function getJQueryVersion() {
	return $.fn.jquery;
};

function getBootstrapVersion() {
	return $.fn.tooltip.Constructor.VERSION;
};

function getBootstrapTableVersion() {
	if (!!$.fn.bootstrapTable.VERSION) {
		if ($.fn.bootstrapTable.VERSION.length)
			return $.fn.bootstrapTable.VERSION;
	}
	if (!!$.fn.bootstrapTable.version) {
		if ($.fn.bootstrapTable.version.length)
			return $.fn.bootstrapTable.version;
	}
	return "0.0.0";
};

