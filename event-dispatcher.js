define(function(require, exports, module) {
    'use strict';
    var registry = {};

    var eventDispatcher = {

        subscribe: function(eventName, callback, parameters) {
            var subscribers = registry[eventName];
            var handler = {
                method: callback,
                params: (parameters instanceof Array) ? parameters : [parameters]
            };

            if (typeof subscribers === 'undefined') {
                subscribers = registry[eventName] = [];
            }

            subscribers.push(handler);

            return this;
        },

        trigger: function(eventName, data, context) {

            var subscribers = registry[eventName];

            if (typeof subscribers === 'undefined') {
                return this;
            }

            context = context || this;

            for (var i = 0, iMax = subscribers.length; i < iMax; i += 1) {
                var handler = subscribers[i];
                data = (data instanceof Array) ? data : typeof data === 'undefined' ? handler.params : [data];
                handler.method.apply(context, data);
            }

            return this;
        },

        unsubscribe: function(eventName, callback) {
            var
                subscribers = registry[eventName],
                callbackIndex;

            if (typeof subscribers === 'undefined') {
                return this;
            }

            callbackIndex = subscribers.indexOf(callback);

            if (callbackIndex === -1) {
                return this;
            }

            subscribers.splice(callbackIndex, 1);

            return this;
        }
    };


    module.exports = eventDispatcher;
});