var IS_FUNCTION = function(fn) {
	return typeof fn === "function";
};

var IS_OBJECT = function(obj) {
	return typeof obj === "object";
};

var GET_OBJECT_IF_DEFINED = function(obj) {
	return IS_OBJECT(obj) ? obj : {};
};

var EXEC_INIT_METHOD = function(obj) {
	if (IS_FUNCTION(obj.init)) {
		obj.init();
	}
};

var FUNCTION_APPLY = function(func, parent, args) {
	(function() {
		func.apply(parent, arguments);
	})(args);
};

var REMOVE_ARRAY_ITEM = function(array, item) {
	for (var x = 0, size = array.length; x < size; x++) {
		if (array[ x ] === item) {
			array.splice(x, 1);

			if (IS_FUNCTION(item.onRemove)) {
				item.onRemove();
			}

			break;
		}
	}

	return array;
};
