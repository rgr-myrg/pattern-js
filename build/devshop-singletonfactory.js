/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(a){a.DevShop=typeof a.DevShop==="object"?a.DevShop:{}})(window);(function(a){a.SingletonFactory=function(a){var b=function(a){if(typeof a==="function")try{return new a}catch(b){}else if(typeof a==="object")return a},d=b(a.__implement),e=b(a.__extend),b=b(a.__construct),c;for(c in e)e.hasOwnProperty(c)&&(b[c]||(b[c]=e[c]));for(c in d)if(d.hasOwnProperty(c)&&!b[c])throw a.instance+" must implement '"+c+"' "+typeof d[c];if(typeof b.initialize==="function")try{b.initialize()}catch(f){}return b}})(DevShop);
