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
### jQuery
```
$(selector).multiselect();
```
Programmatically selecting and deselecting all items:
```
$(selector).multiselect().selectAll();
$(selector).multiselect().deselectAll();
```
Select and deselect particular element with value == 1
```
$(selector).multiselect().select(1);
$(selector).multiselect().deselect(1);
```
### Without jQuery
```
document.multiselect(selector);
```
Selecting and deselecting all items:
```
document.multiselect(selector).selectAll();
document.multiselect(selector).deselectAll();
```
Select and deselect particular element with value == 1
```
document.multiselect(selector).select(1);
document.multiselect(selector).deselect(1);
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
