﻿function Multiselect(item, opts) {
	//if item is not a select - it is an error
	if ((typeof($) != 'undefined' && !$(item).is('select')) ||
		(typeof($) == 'undefined' && item.tagName != 'SELECT')) {
		throw "Multiselect: passed object must be a select";
	}
	
	if ((typeof($) != 'undefined' && !$(item).attr('multiple')) ||
		(typeof($) == 'undefined' && !item.hasAttribute('multiple'))) {
		throw "Multiselect: passed object should contain 'multiple' attribute";	
	}

	this._item = item;

	this._createUI();

	this._appendEvents();

	this._initSelectedFields();

	this._initIsEnabled();
}

Multiselect.prototype = {
	//creates representation
	_createUI: function () {
		m_helper.removeNode(this._getIdentifier());

		var wrapper = this._createWrapper();
		
		m_helper.insertAfter(wrapper, this._item);

		wrapper.appendChild(this._createInputField());
		wrapper.appendChild(this._createItemList());
		
		m_helper.hide(this._item);
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
		var input = m_helper.textField({
			id : this._getInputFieldIdentifier(),
			class : 'multiselect-input',
			attributes : {
				autocomplete: 'off'
			}
		}),
		label = m_helper.label({
			id : this._getInputBadgeIdentifier(),
			class : 'multiselect-count',
			attributes : {
				for : this._getInputFieldIdentifier()
			}
		}),
		dropDownArrow = m_helper.label({
			class : 'multiselect-dropdown-arrow',
			attributes : {
				for : this._getInputFieldIdentifier()
			}
		}),
		result = m_helper.div({
			class : 'multiselect-input-div'
		});

		label.style.visibility = 'hidden';
		label.innerHTML = 0;
		
		result.appendChild(input);
		result.appendChild(label);
		result.appendChild(dropDownArrow);

		return result;
	},
	//creates element list
	_createItemList: function () {
		var list = m_helper.create({ tag : 'ul'});

		var self = this;
		m_helper.each(this._getItems(this._item), function(e) {
			var insertItem = self._createItem('li', e.id, e.text, e.selected);
			list.appendChild(insertItem);

			var checkBox = insertItem.querySelector('input[type=checkbox]');
			e.multiselectElement = checkBox;
			checkBox.dataset.multiselectElement = JSON.stringify(e);
		});

		var selectAll = this._createItem('span', -1, 'Select all');
		var result = m_helper.div({
			id : this._getItemListIdentifier(),
			class : 'multiselect-list'
		});

		result.appendChild(selectAll);
		result.appendChild(m_helper.create({tag : 'hr' }));
		result.appendChild(list);

		return result;
	},

	//creates single list element
	_createItem: function (wrapper, value, text, selected) {
		var checkBox = m_helper.checkbox({
			class : 'multiselect-checkbox',
			data : {
				val : value
			}
		}),
		textBox = m_helper.create({ tag : 'span', class : 'multiselect-text'}),
		result = m_helper.create({ tag: wrapper }),
		label = m_helper.label();
		
		textBox.className = 'multiselect-text';
		textBox.innerHTML = text;

		label.appendChild(checkBox);
		label.appendChild(textBox);
		label.tabIndex = -1;
		
		result.appendChild(label);
		return result;
	},

	_initSelectedFields: function () {
		var itemResult = this._getItems().filter(function (obj) {
			return obj.selected;
		});

		if (itemResult.length != 0) {
			var self = this;
			m_helper.each(itemResult, function(e) {
				self.select(e.id);
			});
		}
	},

	_initIsEnabled: function() {
		this.setIsEnabled(!this._item.disabled)
	},

	destroy() {
		m_helper.removeNode(this._getIdentifier());
		m_helper.show(this._item);
		
		var index = window.multiselects._items.indexOf(this._item);
		if (index > -1) {
			window.multiselects._items.splice(index, 1);
			window.multiselects.splice(index, 1);
		}
	},

	select: function (val) {
		this._toggle(val, true);
	},
	
	deselect: function(val) {
		this._toggle(val, false);
	},

	setIsEnabled(isEnabled) {
		if (this._isEnabled === isEnabled) return;

		var wrapperItem = document.getElementById(this._getIdentifier());
		if (isEnabled) {
			wrapperItem.classList.remove('disabled');
		} else {
			wrapperItem.classList.add('disabled');
		}
		m_helper.setDisabled(this._item, !isEnabled);
		m_helper.setDisabled(document.getElementById(this._getInputFieldIdentifier()), !isEnabled);

		this._isEnabled = isEnabled;
	},
	
	_toggle: function(val, setCheck) {
		var self = this;
		if (val) {
			m_helper.each(document.getElementById(this._getIdentifier()).querySelectorAll('.multiselect-checkbox'),
				function(e) {
					if (e.dataset.val == val) {
						if (setCheck && !e.checked) {
							m_helper.check(e);
							self._onCheckBoxChange(e, self);
						} else if (!setCheck && e.checked) {
							m_helper.uncheck(e);
							self._onCheckBoxChange(e, self);
						}
					}
				});
				
			self._updateText(self);
		}		
	},

	selectAll: function (val) {
		var selectAllChkBox = document.querySelector('#' + this._getIdentifier() + ' .multiselect-checkbox');
		m_helper.check(selectAllChkBox);
		this._onCheckBoxChange(selectAllChkBox, this);
		
		this._updateText(this);
	},
	
	deselectAll : function() {
		var selectAllChkBox = document.querySelector('#' + this._getIdentifier() + ' .multiselect-checkbox');
		m_helper.uncheck(selectAllChkBox);
		this._onCheckBoxChange(selectAllChkBox, this);
		
		this._updateText(this);
	},

	_checkboxClickEvents: {},
	setCheckBoxClick(id, handler) {
		if (typeof handler === "function") {
			this._checkboxClickEvents[id] = handler;
		} else {
			console.error("Checkbox click handler for checkbox value=" + id + " is not a function");
		}

		return this;
	},

	//append required events
	_appendEvents: function () {
		var self = this;
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('click', function () {
			document.getElementById(self._getInputFieldIdentifier()).value = '';
		});

		document.getElementById(self._getIdentifier()).addEventListener('click', function (event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			if (m_helper.parent(target, self._getIdentifier())) {
				event.stopPropagation();				
			}
		});

		m_helper.each(document.getElementById(self._getIdentifier()).querySelectorAll('.multiselect-checkbox'),
			function(e) {
				e.addEventListener('change', function(event) {
					self._onCheckBoxChange(e, self, event);
				});
			});

		var onInput = function () {
			var text = this.value.toLowerCase();
			if (!text || text == '') {
				m_helper.show(document.querySelector('#' + self._getItemListIdentifier() + ' > span'));
				m_helper.show(document.querySelector('#' + self._getItemListIdentifier() + ' > hr'));
				m_helper.showAll(document.querySelectorAll('#' + self._getItemListIdentifier() + ' li'));
			} else {
				m_helper.hide(document.querySelector('#' + self._getItemListIdentifier() + ' > span'));
				m_helper.hide(document.querySelector('#' + self._getItemListIdentifier() + ' > hr'));

				var array = Array.prototype.filter.call(document.querySelectorAll('#' + self._getItemListIdentifier() + ' li span'), 
				function (obj) {
					return obj.innerHTML.toLowerCase().indexOf(text) > -1;
				});
				
				m_helper.hideAll(document.querySelectorAll('#' + self._getItemListIdentifier() + ' li'));

				m_helper.each(array, function(e) {
					m_helper.show(e.parentElement.parentElement);
				});
			}
		}
		
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('propertychange', onInput);
		document.getElementById(self._getInputFieldIdentifier()).addEventListener('input', onInput);
	},

	_onCheckBoxChange: function (checkbox, self, event) {
		if (!checkbox.dataset.multiselectElement) {
			var checkedState = self._performSelectAll(checkbox, self);

			if (typeof self._checkboxClickEvents["checkboxAll"] === "function") {
				self._checkboxClickEvents["checkboxAll"](checkbox, { checked: checkedState});
			}
		}
		else {
			var checkedState = self._performSelectItem(checkbox, self);
			if (typeof self._checkboxClickEvents[checkedState.id] === "function") {
				self._checkboxClickEvents[checkedState.id](checkbox, checkedState);
			}

			self._updateSelectAll(self);
		}

		self._updateText(self);
		self._forceUpdate();
	},
	
	_performSelectItem : function(checkbox, self) {
		var item = JSON.parse(checkbox.dataset.multiselectElement);
		if (checkbox.checked) {
			self._itemCounter++;
			m_helper.select(this._item.options[item.index]);
			m_helper.setActive(checkbox.parentElement.parentElement);

			return { id: item.id, checked: true };
		}

		self._itemCounter--;
		m_helper.deselect(this._item.options[item.index]);
		m_helper.setUnactive(checkbox.parentElement.parentElement);

		return { id: item.id, checked: false };
	},
	
	_performSelectAll : function(checkbox, self) {
		var items = self._getItems();

		if (checkbox.checked) {
			self._itemCounter = items.length;
			m_helper.each(items, function(e) {
				m_helper.setActive(e.multiselectElement.parentElement.parentElement);
				m_helper.select(self._item.options[e.index]);
				m_helper.check(e.multiselectElement);
			});
			return true;
		}

		self._itemCounter = 0;
		m_helper.each(items, function(e) {
			e.multiselectElement.parentElement.parentElement.classList.remove('active');
			m_helper.deselect(self._item.options[e.index]);
			m_helper.uncheck(e.multiselectElement);
		});
		return false;
	},
	
	_updateSelectAll :function(self) {
		var allChkBox = document.getElementById(self._getItemListIdentifier()).querySelector('input[type=checkbox]');
		if (self._itemCounter == self._getItems().length) {
			allChkBox.checked = true;
		}
		else if (allChkBox.checked) {
			allChkBox.checked = false;
		}
	},
	
	_updateText : function(context) {
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
		}
		
		if (activeItems.length == document.getElementById(context._getItemListIdentifier()).querySelectorAll('ul li').length) {
			val = 'All selected';
		}
		document.getElementById(context._getInputFieldIdentifier()).value = val ? val : '';		
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

	//flag to set enable/disable of multiselect
	_isEnabled: true,

	//returns all items as js objects
	_getItems: function () {
		if (this._items == undefined) {
			var result = [];
			var opts = this._item.options;
			
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
