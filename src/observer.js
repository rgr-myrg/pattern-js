/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/JavaScript-Observer-Plus/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		Observer:function(sub){
			var construct=function(){
				this.onRegister=function(){};
				this.notify=function(eventName,observable){
					this.observable=observable;
					if(typeof this[eventName]==="function")
						try{this[eventName]();}catch(e){}
				};
			};
			return DevShop.SingletonFactory(construct,sub);
		}
	});
})();
