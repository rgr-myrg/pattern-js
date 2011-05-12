/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){window.DevShop=typeof window.DevShop==="object"?window.DevShop:{};window.DevShop.Me=function(c){for(var a in c)c.hasOwnProperty(a)&&(window.DevShop[a]=c[a])}})();(function(){DevShop.Me({SingletonFactory:function(c){var a=function(a){if(typeof a==="function")try{return new a}catch(b){}else if(typeof a==="object")return a},d=a(c.implement),e=a(c.extend),a=a(c.instance),b;for(b in e)e.hasOwnProperty(b)&&(a[b]||(a[b]=e[b]));for(b in d)if(d.hasOwnProperty(b)&&!a[b])throw c.instance+" must implement '"+b+"' "+typeof d[b];if(typeof a.initialize==="function")try{a.initialize()}catch(f){}return a}})})();
