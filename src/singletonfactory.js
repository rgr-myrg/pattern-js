/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		SingletonFactory:function(obj){
			var b={};
			var s={};
			if(typeof obj.extend==="function")
				try{b=new obj.extend;}catch(e){}
			else if(typeof obj.extend==="object")
				b=obj.extend;
			if(typeof obj.instance==="function")
				try{s=new obj.instance;}catch(e){}
			else if(typeof obj.instance==="object")
				s=obj.instance;
			for(var i in b)
				if(b.hasOwnProperty(i))
					if(!s[i])s[i]=b[i];
			if(typeof s.initialize==="function")
				try{s.initialize();}catch(e){}
			return s;
		}
	});
})();
