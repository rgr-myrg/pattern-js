/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		Observable:function(sub){
			var construct=function(){
				this.observers=[];
				this.addObserver=function(o){
					if(typeof o==="function"||typeof o==="object"){
						if(typeof o.notify==="function"){
							this.observers.push(o);
							if(typeof o.onRegister==="function")
								try{o.onRegister();}catch(e){}
						}
					}
				};
				this.notifyObservers=function(eventName){
					var size=this.observers.length;
					for(var x=0;x<size;x++){
						try{
							this.observers[x].notify(eventName,this);
						}catch(e){}
					}
				};
			};
			return DevShop.SingletonFactory(construct,sub);
		}
	});
})();
