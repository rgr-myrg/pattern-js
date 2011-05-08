/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		SingletonFactory:function(obj){
			var getInstance=function(c){
				if(typeof c==="function")
					try{return new c;}catch(e){}
				else if(typeof c==="object")
					return c;
			};
			var interfase=getInstance(obj.implement);
			var baseclass=getInstance(obj.extend);
			var singleton=getInstance(obj.instance);
			for(var i in baseclass)
				if(baseclass.hasOwnProperty(i))
					if(!singleton[i])
						singleton[i]=baseclass[i];
			for(var i in interfase)
				if(interfase.hasOwnProperty(i))
					if(!singleton[i])
						throw(obj.instance + " must implement '"+i+"' "+typeof interfase[i]);
			if(typeof singleton.initialize==="function")
				try{singleton.initialize();}catch(e){}
			return singleton;
		}
	});
})();
