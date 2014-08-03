/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.Observable = function(obj){
		var observable = function(){
			return {
				observers : [],
				addObserver : function(o){
					if((typeof o === "function" || typeof o === "object") && 
							typeof o.notify === "function"){

						this.observers.push(o);
						if(typeof o.onRegister === "function"){
							o.onRegister();
						}
					}
				},
				notifyObservers : function(eventName){
					var size = this.observers.length;
					for(var x = 0; x < size; x++){
						this.observers[x].notify(eventName,this);
					}
				}
			};
		};
		return $.SingletonFactory(
			{
				__extend : observable,
				__construct : obj
			}
		);
	};
})(DevShop);
