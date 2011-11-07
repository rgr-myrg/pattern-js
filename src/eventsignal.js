/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(DevShop){
	DevShop.EventSignal=function(obj){
		var listeners=[];
		this.addListener=function(listener){
			if(typeof listener==='function'){
				listeners.push(listener);
			}
		};
		this.removeListener=function(listener){
			var size=listeners.length;
			for(var x=0;x<size;x++){
				if(listeners[x]===listener){
					listeners.splice(x,1);
				}
			}
		};
		this.dispatch=function(){
			var size=listeners.length;
			for(var x=0;x<size;x++){
				try{
					listeners[x].apply(this,arguments);
				}catch(e){
				}
			}
		};
	};
})(DevShop);
