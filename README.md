# Javascript implementation of multiselect control
This project presents css + pure js implementation for multiselect html control.

Repository contains source code and simple demo.
## Capabilities
* Displaying count of already selected items
* Substring search through the list
* Efficient performance on large data (via pure javascript, without any frameworks)
* Select/Deselect all
* Posting to server without any extensions

## Sample Usage
In this section there are examples of code for usage of basic features
### Initialization
```
$(selector).multiselect(); // with jQuery
document.multiselect(selector); // without jQuery
```
### Methods
Any changes to selected set are populated into original `select[multiple]`. So, to retrieve the changes you can call the following:
```
$(selector).val(); // with jQuery
document.querySelector(selector).value; // without jQuery
```
It provides the following methods:
| Method  | Description |
| ------------- | ------------- |
| `selectAll()`  | Programmatically selects all elements  |
| `deselectAll()` | Programmatically deselects all elements  |
| `select(value)`  | Programmatically selects the element for option with passed value  |
| `deselect(value)` | Programmatically deselects the element for option with passed value  |
| `setIsEnabled(value)` | Accepts the boolean value indicating whether multiselect is enabled or not |
| `setCheckBoxClick(value, handler)` | Sets the click listener for checkbox with particular value, where `value=='checkboxAll'` stands for 'Select All' checkbox. Handler accepts two arguments - target and args. See examples below |
| `destroy()` | Removes the element and returns to original `select[multiple]`. Allows to recreate item again. |
#### Examples
Programmatically selecting and deselecting items:
```
// with jQuery
$(selector).multiselect().selectAll();
$(selector).multiselect().deselectAll();
$(selector).multiselect().select(1); // select element with value == 1
$(selector).multiselect().deselect(1); // deselect element with value == 1
$(selector).multiselect().setIsEnabled(false); // disables the select
$(selector).multiselect().setIsEnabled(true); // enables the select
$(selector).multiselect().setCheckBoxClick("checkboxAll", function(target, args) {
    console.log("Checkbox 'Select All' was clicked and got value ", args.checked);
});
$(selector).multiselect().setCheckBoxClick("1", function(target, args) {
    console.log("Checkbox for item with value '1' was clicked and got value ", args.checked);
});
$(selector).multiselect().destroy();
// without jQuery
document.multiselect(selector).selectAll();
document.multiselect(selector).deselectAll();
document.multiselect(selector).select(1);
document.multiselect(selector).deselect(1);
document.multiselect(selector).setIsEnabled(false);
document.multiselect(selector).setIsEnabled(true);
document.multiselect(selector).setCheckBoxClick("checkboxAll", function(target, args) {
    console.log("Checkbox 'Select All' was clicked and got value ", args.checked);
});
document.multiselect(selector).setCheckBoxClick("1", function(target, args) {
    console.log("Checkbox for item with value '1' was clicked and got value ", args.checked);
});
document.multiselect(selector).destroy();
```
### Information on basic capabilities
**Displaying count of already selected items**

Exactly displaying spends O(1) time for update counter.
The object contains variable `_counter`  which updates with every interaction (selecting, deselecting item, or selecting, deselecting all items).
So, for displaying it calls only a single method for convert `_counter` into string representation.

**Substring search through the list**

Substring search does not use jquery and performs comparisons via pure js.
You can check https://jsfiddle.net/gd36tzhg/3/ for comparison between jquery and native javascript implementation.

**Efficient performance on large data**

Refering to previous paragraph, you can check comparison between jquery and native javascript performance on large data.

**Select/Deselect all**

Multiselect object provides public method for selecting/deselecting all data. So you can simply call it via code, or click on `Select All` checkbox via browser.

**Posting to server without any extensions**

Multiselect is just a wrapper for built-in selects. So, you should pass `select[multiple]` and every interaction with dropdown list of multiselect will reflect in options of passed `select`. When you perform `POST` request, the original `select[multiple]` will be posted instead of generation of fake input fields.
