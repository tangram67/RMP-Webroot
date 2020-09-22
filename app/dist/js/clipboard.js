function copyToClipboard(element) {
	// Create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var origSelectionStart, origSelectionEnd;

	var isInput = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
	if (isInput) {
		// Just use the original source element for selection and copy
		target = element;
		origSelectionStart = element.selectionStart;
		origSelectionEnd = element.selectionEnd;
	} else {
		// Use a temporary form element for selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = "0";
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = element.textContent;
	}

	// Set focus to given element and select text
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// Copy selected text
	var succeed = false;
	try {
		succeed = document.execCommand("copy");
	} catch(e) {
		console.log('[clipboard.js] Exception in copyToClipboard() <' + e + '>');
		succeed = false;
	}

	if (isInput) {
		// Restore saved selection of element
		element.setSelectionRange(origSelectionStart, origSelectionEnd);
	} else {
		// Clear temporary content
		element.textContent = "";
	}

	return succeed;
};

$.fn.copyToClipboard = function() {
	var nil = void(0);
	var that = this;
	
	// Get DOM element
	var id = $(that).attr('id');
	var $element = document.getElementById(id);
	if ($element !== nil) {
		// Call copy funtion...		
		return copyToClipboard($element);
	} else {
        alert('Error: Plugin copyToClipboard() element undefined.');
	}
};


