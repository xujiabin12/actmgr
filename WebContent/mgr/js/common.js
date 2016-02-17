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
	
//	var getServerUrl = "http://127.0.0.1:8080/act/";
	
	var getServerUrl = "http://101.201.209.109/act/";
	
	
	
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
	
	var checkLogin = function(){
		var url = location.href;
		if(url.indexOf("index") == -1){
			if(!getItem("us")){
				window.location.href = "../index.html";
			}
		}
		
	};
	
	window._util = _util;
	
	checkLogin();
	
})();