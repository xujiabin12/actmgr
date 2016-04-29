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
	$("#xcurlcreate").click(function(){
		var url = $("#xcurl").val();
		
		if(url){
			$.ajax({
                type : "post",
                dataType : "json",
                data : {
                	url : url
                },
                url : util.getServerUrl+"groups/createCampaignUrl",
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
});