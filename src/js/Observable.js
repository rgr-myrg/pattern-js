declare('Observable').class(function() {
    var observers = [];

    return {
        addObserver: function(observer) {
            if (!_isObject(observer) || !_isFunction(observer.onUpdate)) {
                return observer;
            }

            observer._observable = this;
            observers.push(observer);

            if (_isFunction(observer.onRegister)) {
                observer.onRegister();
            }

            return this;
        },

        addObservers: function(observerList) {
            _forEach(observerList, this.addObserver.bind(this));

            return this;
        },

        removeObserver: function(observer) {
            observers = _removeArrayItem(observers, observer);

            return this;
        },

        notifyWith: function(obj) {
            _forIn(obj, (function(i) {
                this[i] = obj[i];
            }).bind(this));

            return this;
        },

        notifyObservers: function(eventName, eventData) {
            _forEach(observers, (function(observer) {
                observer.onUpdate(eventName, eventData);
            }).bind(this));
        }
    };
});
