Pattern.Observable = function() {
    var observers = [];

    return {
        addObserver: function(observer) {
            if (!IS_OBJECT(observer) || !IS_FUNCTION(observer.onUpdate)) {
                return observer;
            }

            observer._observable = this;
            observers.push(observer);

            if (IS_FUNCTION(observer.onRegister)) {
                observer.onRegister();
            }

            return observers;
        },

        addObservers: function(observerList) {
            for (var x = 0, size = observerList.length; x < size; x++) {
                this.addObserver(observerList[x]);
            }

            return this;
        },

        removeObserver: function(observer) {
            observers = REMOVE_ARRAY_ITEM(observers, observer);

            return observers;
        },

        notifyWith: function(object) {
            if (IS_OBJECT(object)) {
                for (var i in object) {
                    if (object.hasOwnProperty(i)) {
                        this[i] = object[i];
                    }
                }
            }

            return this;
        },
 
        notifyObservers: function(eventName, eventData) {
            for (var x = 0, size = observers.length; x < size; x++) {
                observers[x].onUpdate(eventName, eventData);
            }
        }
    };
};
