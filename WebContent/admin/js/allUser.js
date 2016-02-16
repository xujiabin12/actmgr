var util  = window._util;
$(function(){
        $('.ui-button').click(initData);
        
        initData();
});


function initData(){
	var username= $.trim($('.username').val());
    var usernickname= $.trim($('.usernickname').val());
    $.ajax({
        type : "post",
        dataType : "json",
        data : {
            nickname : usernickname, //用户名和昵称模糊查询
            username : username
        },
        url : util.getServerUrl+"users/userList",
        success : function(data){
            if(data.code == '0'){
                //返回用户列表
            	var users = data.list;
            	for(var i=0;i<users.length;i++){
            		var obj = data[i];
            		var html = "<tr>";
            			html += "<td>"+(i+1)+"</td>";
            			html += "<td>"+obj.username+"</td>";
            			html += "<td>"+obj.nickname+"</td>";
            			html += "<td>"+getRoleName(obj.role)+"</td>";
            			html += "<td class='tdcenter'>";
            		        html += "<a href='javascript:void(0)' onclick='setTeacher("+obj.userid+")'>设为老师</a>";
//            		        html += "<a href='javascript:void(0)' onclick='outGroup("+obj.userid+")'>T出群组</a>";
            		    html += "</td>";
            		    html += "</tr>";
            		  $("#users").html(html);
            	}
            }else{
                //提示错误信息   
            	alert(data.errorMSG);
            }
        }
    });
}

function setTeacher(userid){
	 $.ajax({
	        type : "post",
	        dataType : "json",
	        data : {
	        	userid : userid
	        },
	        url : util.getServerUrl+"users/setTeacher",
	        success : function(data){
	            if(data.code == '0'){
	                alert("设置成功");
	                window.location.reload();
	            }else{
	                //提示错误信息   data.errorMSG
	            	alert(data.errorMSG);
	            }
	        }
	    });
}