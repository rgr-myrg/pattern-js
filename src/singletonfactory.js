/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		SingletonFactory:function(base,sub){
			var b={};
			var s={};
			if(typeof base==="function")
				try{b=new base;}catch(e){}
			else if(typeof base==="object")
				b=base;
			if(typeof sub==="function")
				try{s=new sub;}catch(e){}
			else if(typeof sub==="object")
				s=sub;
			for(var i in b)
				if(b.hasOwnProperty(i))
					if(!s[i])s[i]=b[i];
			if(typeof s.initialize==="function")
				try{s.initialize();}catch(e){}
			return s;
		}
	});
})();
