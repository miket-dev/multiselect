function Multiselect(item) {
	//if item is not a select - it is an error
	if (typeof($) != 'undefined' && !$(item).is('select')) {
		throw "Multiselect: passed object must be a select";
	}

	if (typeof($) == 'undefined' && item.tagName != 'SELECT') {
		throw "Multiselect: passed object must be a select";
	}

	if (typeof ($) != 'undefined') {
		this._item = item[0];
	} else {
		this._item = item;
	}

	this._createUI();

	this._appendEvents();

	this._initSelectedFields();
}

Multiselect.prototype = {
	//creates representation
	_createUI: function () {
		var el = document.getElementById(this._getIdentifier());
		if (el) {
			el.parentNode.removeChild(el);
		}

		var wrapper = this._createWrapper();
		
		var parent = this._item.parentNode;
		if (this._item.nextElementSibling) {
			parent.insertBefore(wrapper, this._item.nextElementSibling);
		} else {
			parent.appendChild(wrapper);
		}

		wrapper.appendChild(this._createInputField());
		wrapper.appendChild(this._createItemList());

		this._item.style.display = 'none';
	},

	//creates base wrapper for control
	_createWrapper: function () {
		var result = document.createElement('div');
		result.className = 'multiselect-wrapper';
		result.id = this._getIdentifier();
		return result;
	},

	//creates input field
	_createInputField: function () {
		var input = document.createElement('input');
		input.className = 'multiselect-input';
		input.setAttribute('type', 'text');
		input.id = this._getInputFieldIdentifier();
		
		var label = document.createElement('label');
		label.className = 'multiselect-count';
		label.setAttribute('for', this._getInputFieldIdentifier());
		label.id = this._getInputBadgeIdentifier();
		label.style.visibility = 'hidden';
		label.innerHTML = 0;

		var dropDownArrow = document.createElement('label');
		dropDownArrow.setAttribute('for', this._getInputFieldIdentifier());
		dropDownArrow.className = 'multiselect-dropdown-arrow';

		var result = document.createElement('div');
		result.className = 'multiselect-input-div';
		
		result.appendChild(input);
		result.appendChild(label);
		result.appendChild(dropDownArrow);

		return result;
	},

	//creates element list
	_createItemList: function () {
		var items = this._getItems(this._item);

		var list = document.createElement('ul');

		for (var i = 0; i < items.length; i++) {
			var insertItem = this._createItem('li', items[i].id, items[i].text, items[i].selected);
			list.appendChild(insertItem);

			var checkBox = insertItem.querySelector('input[type=checkbox]');
			items[i].multiselectElement = checkBox;
			checkBox.dataset.multiselectElement = JSON.stringify(items[i]);
		}

		var selectAll = this._createItem('span', -1, 'Select all');
		var result = document.createElement('div');
		result.id = this._getItemListIdentifier();
		result.className = 'multiselect-list';
		result.appendChild(selectAll);
		result.appendChild(document.createElement('hr'));
		result.appendChild(list);

		return result;
	},

	//creates single list element
	_createItem: function (wrapper, value, text, selected) {
		var checkBox = document.createElement('input');
		checkBox.className = 'multiselect-checkbox';
		checkBox.setAttribute('type', 'checkbox');
		checkBox.dataset.val = value;

		var textBox = document.createElement('span');
		textBox.className = 'multiselect-text';
		textBox.innerHTML = text;

		var result = document.createElement(wrapper);
		
		var label = document.createElement('label');
		label.appendChild(checkBox);
		label.appendChild(textBox);
		
		result.appendChild(label);
		return result;
	},

	_initSelectedFields: function () {
		var items = this._getItems();
		var itemResult = items.filter(function (obj) {
			return obj.selected;
		});

		if (itemResult.length != 0) {
			for (var i = 0; i < itemResult.length; i++) {
				this.select(itemResult[i].id);
			}
		} else {
			this.selectAll();
		}
	},

	select: function (val) {
		var self = this;
		if (val) {
			var checkBoxes = document.getElementById(this._getIdentifier()).querySelectorAll('.multiselect-checkbox');
			for	(var i = 0; i < checkBoxes.length; i++) {
				var data = checkBoxes[i].dataset;
				if (data.val == val) {
					self._onCheckBoxChange(checkBoxes[i], self);
				}
			}
		}
	},

	selectAll: function (val) {
		var selectAllChkBox = document.querySelector('#' + this._getIdentifier() + ' .multiselect-checkbox');
		selectAllChkBox.checked = true;
		this._onCheckBoxChange(selectAllChkBox, this);

		this._hideList(this);
	},

	//append required events
	_appendEvents: function () {
		var self = this;
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('focus', function (event) {
			self._showList(self);
			document.getElementById(self._getInputFieldIdentifier()).value = '';

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
					
					e._hideList(e);
				}
			}
		});

		document.getElementById(self._getInputFieldIdentifier()).addEventListener('click', function () {
			self._showList(self);
			document.getElementById(self._getInputFieldIdentifier()).value = '';
		});

		document.getElementById(self._getIdentifier()).addEventListener('click', function (event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			var parent = event.target.parentElement;
			while (parent && parent.tagName != 'BODY') {
				if (parent.id == self._getIdentifier()) {
					return;
				}

				parent = parent.parentElement;
			}
	
			event.stopPropagation();
		});

		document.getElementById(self._getItemListIdentifier()).addEventListener('mouseover', function () {
			self._showList(self);
		});
		
		var chkboxes = document.querySelectorAll('#' + self._getIdentifier() + ' .multiselect-checkbox');
		for(var i = 0; i< chkboxes.length; i++) {
			chkboxes[i].addEventListener('change', function(event) {
				self._onCheckBoxChange(this, self, event);
			});
		}

		var onInput = function () {
			var text = this.value.toLowerCase();
			if (!text || text == '') {
				document.querySelector('#' + self._getItemListIdentifier() + ' > span').style.display = 'block';
				document.querySelector('#' + self._getItemListIdentifier() + ' > hr').style.display = 'block';
				var innerItems = document.querySelectorAll('#' + self._getItemListIdentifier() + ' li');
				for	(var i = 0; i < innerItems.length; i++) {
					innerItems[i].style.display = 'block';
				}
			} else {
				document.querySelector('#' + self._getItemListIdentifier() + ' > span').style.display = 'none';
				document.querySelector('#' + self._getItemListIdentifier() + ' > hr').style.display = 'none';

				var array = document.querySelectorAll('#' + self._getItemListIdentifier() + ' li span');

				array = Array.prototype.filter.call(array, function (obj) {
					return obj.innerHTML.toLowerCase().indexOf(text) > -1;
				});

				var lis = document.querySelectorAll('#' + self._getItemListIdentifier() + ' li');

				for (var i = 0; i < lis.length; i++) {
					var el = lis[i];
					el.style.display = 'none';
				}

				for (var i = 0; i < array.length; i++) {
					var el = array[i];
					el.parentElement.parentElement.style.display = 'block';
				}
			}
		}
		
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('propertychange', onInput);
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('input', onInput);
	},

	_onCheckBoxChange: function (checkbox, self, event) {
		var checkboxData = checkbox.dataset;
		var checked = checkbox.checked;
		if (!checkboxData.multiselectElement) {
			var items = self._getItems();

			if (checked) {
				self._itemCounter = items.length;
				for (var i = 0; i < items.length; i++) {
					items[i].multiselectElement.parentElement.parentElement.classList.add('active');
					this._item.options[items[i].index].setAttribute('selected', 'selected');
					items[i].multiselectElement.checked = true;
				}
			}
			else {
				self._itemCounter = 0;
				for (var i = 0; i < items.length; i++) {
					items[i].multiselectElement.parentElement.parentElement.classList.remove('active');
					this._item.options[items[i].index].removeAttribute('selected');
					items[i].multiselectElement.checked = false;
				}
			}
		}
		else {
			var item = JSON.parse(checkbox.dataset.multiselectElement);
			if (checked) {
				self._itemCounter++;
				this._item.options[item.index].setAttribute('selected', 'selected');
				checkbox.parentElement.parentElement.classList.add('active');
			}
			else {
				self._itemCounter--;
				this._item.options[item.index].removeAttribute('selected');
				checkbox.parentElement.parentElement.classList.remove('active');
			}

			var allChkBox = document.getElementById(self._getItemListIdentifier()).querySelector('input[type=checkbox]');
			if (self._itemCounter == self._getItems().length) {
				allChkBox.checked = true;
			}
			else if (allChkBox.checked) {
				allChkBox.checked = false;
			}
		}

		self._forceUpdate();
	},

	_hideList: function (context, event) {
		document.getElementById(context._getItemListIdentifier()).classList.remove('active');

		document.getElementById(context._getItemListIdentifier()).querySelector('span').style.display = 'block';
		document.getElementById(context._getItemListIdentifier()).querySelector('hr').style.display = 'block';
		var lis = document.getElementById(context._getItemListIdentifier()).querySelectorAll('li');
		if (lis.length != 0) {
			for (var i = 0; i < lis.length; i++) {
				lis[i].style.display = 'block';
			}
		}

		var activeItems = document.getElementById(context._getItemListIdentifier()).querySelectorAll('ul .active');
		if (activeItems.length > 0) {
			var val = '';
			for (var i = 0; i < (activeItems.length < 5 ? activeItems.length : 5) ; i++) {
				val += activeItems[i].innerText + ", ";
			}

			val = val.substr(0, val.length - 2);

			if (val.length > 20) {
				val = val.substr(0, 17) + '...';
			}

			if (activeItems.length == document.getElementById(context._getItemListIdentifier()).querySelectorAll('ul li').length) {
				val = 'All selected';
			}
			document.getElementById(context._getInputFieldIdentifier()).value = val;
		}

		if (event)
			event.stopPropagation();
	},

	_showList: function (context) {
		document.getElementById(context._getItemListIdentifier()).classList.add('active');
	},

	//updates counter
	_forceUpdate: function () {
		var badge = document.getElementById(this._getInputBadgeIdentifier());
		badge.style.visibility = 'hidden';

		if (this._itemCounter != 0) {
			badge.innerHTML = this._itemCounter;
			badge.style.visibility = 'visible';
			
			var ddArrow = badge.nextElementSibling;
			
			if (this._itemCounter < 10) {
				badge.style.left = '-45px';
				ddArrow.style.marginLeft = '-42px';
			}
			else if (this._itemCounter < 100) {
				badge.style.left = '-50px';
				ddArrow.style.marginLeft = '-47px';
			}
			else if (this._itemCounter < 1000) {
				badge.style.left = '-55px';
				ddArrow.style.marginLeft = '-52px';
			}
			else if (this._itemCounter < 10000) {
				badge.style.left = '-60px';
				ddArrow.style.marginLeft = '-57px';
			}
		}
	},

	//internal representation of combo box items
	_items: undefined,

	//selected items counter
	_itemCounter: 0,

	//returns all items as js objects
	_getItems: function () {
		if (this._items == undefined) {
			var result = [];
			var opts = this._item.querySelectorAll('option');
			for	(var i = 0; i < opts.length; i++) {
				var insertItem = {
					id: opts[i].value,
					index : i,
					text: opts[i].innerHTML,
					selected: !!opts[i].selected,
					selectElement: opts[i]
				};

				result.push(insertItem);
			}

			this._items = result;
		}

		return this._items;
	},

	//returns unique initial control identifier
	_getItemUniqueIdentifier: function () {
		var id = this._item.getAttribute('id'),
			name = this._item.getAttribute('name');

		if (!(id || name)) {
			throw "Multiselect: object does not contain any identifier (id or name)";
		}

		return id ? id : name;
	},

	//returns unique wrapper identifier
	_getIdentifier: function () {
		return this._getItemUniqueIdentifier() + '_multiSelect';
	},

	//returns unique input field identifier
	_getInputFieldIdentifier: function () {
		return this._getItemUniqueIdentifier() + '_input';
	},

	//returns unique item list identifier
	_getItemListIdentifier: function () {
		return this._getItemUniqueIdentifier() + '_itemList';
	},

	//returns unique counter (badge) identifier
	_getInputBadgeIdentifier: function () {
		return this._getItemUniqueIdentifier() + '_inputCount';
	}
}