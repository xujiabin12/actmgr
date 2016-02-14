(function($){
	/**
	 * 根据value删除数组元素
	 */
	Array.prototype.removeByValue = function(s) {     
	    for (var i = 0; i < this.length; i++) {     
	        if (s == this[i])     
	            this.splice(i, 1);     
	    }     
	};

	/**
	 * 替换所有字符串
	 */
	String.prototype.replaceAll = function(s1,s2) { 
		return this.replace(new RegExp(s1,"gm"),s2);
	};
	var _util = {};
	
	var serverUrl = "http://124.192.206.155:8080/act/";
	
	
	var getServerUrl = function(){
		return serverUrl;
	};
	
	var setItem = function(k,v){
		sessionStorage.removeItem(k);
		sessionStorage.setItem(k, v);
	};
	
	var getItem = function(k){
		return sessionStorage.getItem(k);
	};
	
	 var getUrlParam = function (name){
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) return unescape(r[2]); return null;
	    };
	    
	_util = {
			getServerUrl : getServerUrl,
			setItem:setItem,
			getItem:getItem,
			getUrlParam:getUrlParam
	};
	
	
	window._util = _util;
	
})();