/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(DevShop){
	DevShop.Observer=function(obj){
		var observer=function(){
			this.onRegister=function(){};
			this.notify=function(eventName,observable){
				this.observable=observable;
				if(typeof this[eventName]==="function"){
					try{
						this[eventName]();
					}catch(e){
					}
				}
			};
		};
		return DevShop.SingletonFactory({extend:observer,instance:obj});
	};
})(DevShop);
