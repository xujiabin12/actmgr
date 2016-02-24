var util  = window._util;
$(function(){
	$("#create").click(function(){
		var groupId = $("#groupId").val();
		
		if(groupId){
			$.ajax({
                type : "post",
                dataType : "json",
                data : {
                	groupId : groupId
                },
                url : util.getServerUrl+"groups/createUrl",
                success : function(data){
                    if(data.code == '0'){
                       $("#result").text(data.url);
                    }else{
                        alert(data.errorMSG);
                    }
                }
            });
		}
	});
	
	
	$("#save").click(function(){
		var url = document.getElementById("result").value;
		if(url){
			$.ajax({
                type : "post",
                dataType : "json",
                data : {
                	url : url
                },
                url : util.getServerUrl+"groups/setJoinGroupUrl",
                success : function(data){
                    if(data.code == '0'){
                       alert("保存成功!");
                    }else{
                        alert(data.errorMSG);
                    }
                }
            });
		}
	});
});