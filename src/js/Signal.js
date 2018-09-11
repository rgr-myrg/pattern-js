declare('Signal').as(function() {
    var slots = [];

    return {
        addSlot: function(slot) {
            if (_isFunction(slot)) {
                slots.push(slot);
            }
        },

        add: function(slots) {
            if (_isArray(slots)) {
                _forEach(slots, this.addSlot.bind(this));
            } else {
                this.addSlot(slots);
            }

            return this;
        },

        remove: function(slot) {
            slots = _removeArrayItem(slots, slot);

            return this;
        },

        dispatch: function() {
            var _args = arguments;

            _forEach(slots, (function(slot) {
                slot.apply(this, _args);
            }).bind(this));
        }
    };
});
