/**
 * @file Classic Observer Pattern
 * @exports observer/Observer
 * @extends {Pattern}  
 */

Pattern.Observer = function(object) {
	var observer = GET_OBJECT_IF_DEFINED(object);

	/**
	* Method triggered by Observable.notify	
	* @param {object[]} arguments - Array of arguments.
	* @returns {object} notification - First object in arguments array.
	* @since 1.0
	*/

	observer.onUpdate = function(eventName, eventData) {
		if (IS_FUNCTION(observer[eventName])) {
			FUNCTION_APPLY(observer[eventName], observer, eventData);
		}

		return eventName;

	};

	EXEC_INIT_METHOD(observer);

	return observer;
};
