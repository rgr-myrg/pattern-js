/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(a){a.DevShop=typeof a.DevShop==="object"?a.DevShop:{}})(window);(function(a){a.EventSignal=function(){var b=[];return{addListener:function(d){typeof d==="function"&&b.push(d)},removeListener:function(d){for(var c=b.length,a=0;a<c;a++)b[a]===d&&(b[a]=null)},dispatch:function(){for(var a=b.length,c=0;c<a;c++)typeof b[c]==="function"&&b[c].apply(this,arguments)}}}})(DevShop);
