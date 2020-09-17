﻿//multiselect collection
window.multiselects = [];

if (typeof ($) != 'undefined') {
	//jQuery extension for multiselect
	$.fn.multiselect = function () {
		//if no elements passed - it is not an error
		var res = [];
		if (!window.multiselects._items) {
			window.multiselects._items = [];
		}

		if (this.length != 0) {
			$(this).each(function (i, e) {
				var index = window.multiselects._items.indexOf(e);
				if (index == -1) {
					var inputItem = new Multiselect(e);
					window.multiselects.push(inputItem);
					window.multiselects._items.push(e);

					res.push(inputItem)
				} else {
					res.push(window.multiselects[index]);
				}
			});
		}

		return res.length == 1 ? res[0] : $(res);
	};
} else {
	document.multiselect = function(selector) {
		var res = [];
		if (!window.multiselects._items) {
			window.multiselects._items = [];
		}
		
		m_helper.each(document.querySelectorAll(selector), function(e) {
			var index = window.multiselects._items.indexOf(e);
			if (index == -1) {
				var inputItem = new Multiselect(e);
				window.multiselects.push(inputItem);
				window.multiselects._items.push(e);

				res.push(inputItem)
			} else {
				res.push(window.multiselects[index]);
			}
		});
		
		return res.length == 1 ? res[0] : res;
	}
}
