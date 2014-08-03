/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.EventSignal = function(obj){
		var listeners = [];
		return {
			addListener : function(listener){
				if(typeof listener === 'function'){
					listeners.push(listener);
				}
			},
			removeListener : function(listener){
				var size = listeners.length;
				for(var x = 0; x < size; x++){
					if(listeners[x] === listener){
						//listeners.splice(x, 1);
						//Setting to null instead as splice changes the array dynamically
						listeners[x] = null;
					}
				}
			},
			dispatch : function(){
				var temp = [];
				var size = listeners.length;
				for(var x = 0; x < size; x++){
					var listener = listeners[x];
					if(typeof listener === 'function'){
						listeners[x].apply(this, arguments);
					}else{
						temp.push(x);
					}
				}
				size = temp.length;
				for(x = 0; x < size; x++){
					listeners.splice(x, 1);
				}
			}
		};
	};
})(DevShop);
