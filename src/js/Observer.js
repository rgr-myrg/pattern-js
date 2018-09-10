declare('Observer').class(function(object) {
    var observer = _getObjectIfDefined(object);

    observer.onUpdate = function(eventName, eventData) {
        if (_isFunction(observer[eventName])) {
            _functionApply(observer[eventName], observer, eventData);
        }

        return eventName;

    };

    _execInitMethod(observer);

    return observer;
});
