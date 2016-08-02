//multiselect collection
window.multiselects = [];

if (typeof ($) != 'undefined') {
	//jQuery extension for multiselect
	$.fn.multiselect = function () {
		//if no elements passed - it is not an error
		if (this.length != 0) {
			$(this).each(function (i, e) {
				window.multiselects.push(new Multiselect($(e)));
			});
		}
	};
	
	$(document).click(function (event) {
		hideMultiselects(event);
	});
} else {
	document.multiselect = function(selector) {
		m_helper.each(document.querySelectorAll(selector), function(e) {
			window.multiselects.push(new Multiselect(e));
		});
	}
	
	window.onclick = function(event) {
		hideMultiselects(event);
	};
}

function hideMultiselects(event) {
	m_helper.each(window.multiselects, function(e) {
		if (document.getElementById(e._getItemListIdentifier()).offsetParent &&
				!m_helper.parent(event.target, e._getIdentifier())) {
			e._hideList(e, event);
		}
	});
}