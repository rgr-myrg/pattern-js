/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(a){a.DevShop=typeof a.DevShop==="object"?a.DevShop:{}})(window);(function(a){a.EventSignal=function(){var b=[];this.addListener=function(d){typeof d==="function"&&b.push(d)};this.removeListener=function(d){for(var a=b.length,c=0;c<a;c++)b[c]===d&&b.splice(c)};this.dispatch=function(){for(var a=b.length,e=0;e<a;e++)try{b[e].apply(this,arguments)}catch(c){}}}})(DevShop);
