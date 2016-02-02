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
	
	_util = {
			getServerUrl : getServerUrl	
	};
	
	
	window._util = _util;
	
})();