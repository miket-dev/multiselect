if (!m_helper)
{
	var m_helper = {
		removeNode : function(id) {
			var el = document.getElementById(id);
			if (el) {
				el.parentNode.removeChild(el);
			}
		},
		
		insertAfter : function(item, target) {
			var parent = target.parentNode;
			if (target.nextElementSibling) {
				parent.insertBefore(item, target.nextElementSibling);
			} else {
				parent.appendChild(item);
			}
		},
		
		hide : function(element) {
			element.style.display = 'none';
		},
		
		hideAll : function(array) {
			for(var i = 0; i< array.length; i++) {
				this.hide(array[i]);
			}
		},		
		
		show : function(element) {
			element.style.display = 'block';
		},
		
		showAll : function(array) {
			for(var i = 0; i< array.length; i++) {
				this.show(array[i]);
			}
		},
		
		parent : function(element, id) {
			var parent = element.parentElement;
			while (parent && parent.tagName != 'BODY') {
				if (parent.id == id) {
					return parent;
				}

				parent = parent.parentElement;
			}
			
			return null;
		},
		
		//data : { tag, id, class, attributes : { key : value }, data : { key : value } }
		create : function(data) {
			var result = document.createElement(data.tag);
			if (data.id) {
				result.id = data.id;				
			}
			
			if (data.class) {
				result.className = data.class;
			}
			
			if (data.attributes) {
				for(var prop in data.attributes) {
					result.setAttribute(prop, data.attributes[prop]);
				}
			}
			
			if (data.data) {
				for(var prop in data.data) {
					result.dataset[prop] = data.data[prop];
				}
			}
			
			return result;
		},
		
		div : function(data) {
			if (!data) {
				data = new Object();
			}
			
			data.tag = 'div';
			return this.create(data);
		},
		
		label : function(data) {
			if (!data) {
				data = new Object();
			}
			
			data.tag = 'label';
			return this.create(data);
		},
		
		textField : function(data) {
			if (!data) {
				data = new Object();
			}
			
			data.tag = 'input';
			if (!data.attributes)
				data.attributes = new Object();
			
			data.attributes.type = 'text';
			
			return this.create(data);
		},
		
		checkbox : function(data) {
			if (!data) {
				data = new Object();
			}
			
			data.tag = 'input';
			if (!data.attributes)
				data.attributes = new Object();
			
			data.attributes.type = 'checkbox';
			
			return this.create(data);
		},
		
		each : function(array, handler) {
			for(var i = 0; i< array.length; i++) {
				handler(array[i]);
			}
		},
		
		setActive : function(element) {
			element.classList.add('active');
		},
		
		setUnactive : function(element) {
			element.classList.remove('active');
		},
		
		select :function (element) {
			element.selected = true;
			element.setAttribute('selected', 'selected');
		},
		
		deselect : function (element) {
			element.selected = false;
			element.removeAttribute('selected');
		},
		
		check : function(element) {
			element.checked = true;
		},
		
		uncheck : function(element) {
			element.checked = false;
		},
		
		click : function(element) {
			if (element.fireEvent) {
				el.fireEvent('onclick');
			} else {
				var evObj = document.createEvent('Events');
				evObj.initEvent('click', true, false);
				element.dispatchEvent(evObj);
			}
		},
		setDisabled: function(element, value) {
			element.disabled = value;
		},
	};
}
