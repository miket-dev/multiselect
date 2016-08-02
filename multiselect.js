//multiselect collection
window.multiselects = [];
//jQuery extension for multiselect
if (typeof ($) != 'undefined') {
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
	document.multiselect = function(e) {
		window.multiselects.push(new Multiselect(e));
	}
	
	window.onclick = function(event) {
		hideMultiselects(event);
	};
}

function hideMultiselects(event) {
	for (var i = 0; i < window.multiselects.length; i++) {
		var e = window.multiselects[i];
		if (document.getElementById(e._getItemListIdentifier()).offsetParent) {
			var parent = event.target.parentElement;
			while (parent && parent.tagName != 'BODY') {
				if (parent.id == e._getIdentifier()) {
					return;
				}
				
				parent = parent.parentElement;
			}			

			e._hideList(e, event);
		}
	}
}