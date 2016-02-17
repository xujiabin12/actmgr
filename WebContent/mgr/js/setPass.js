var util  = window._util;
$(function(){
	var userid = util.getUrlParam("u");
	var name = decodeURI(util.getUrlParam("n"));
	$("#nickName").html(name);
	$("#update").click(function(){
		if(userid){
			var pass = $("#pass").val();
			$.ajax({
				type : "post",
                dataType : "json",
                data : {
                	userid : userid,
                	pass : pass
                },
                url : util.getServerUrl+"users/setMgrPass",
                success : function(data){
                    if(data.code == '0'){
                       alert("设置成功");
                       location.href = "allUser.html";
                    }else{
                        alert(data.errorMSG);
                    }
                }
			});
		}
	});
});