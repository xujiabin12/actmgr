var util  = window._util;
$(function(){
	var groupid = util.getUrlParam("groupid");
	var groupname = decodeURI(util.getUrlParam("groupname"));
	$("#groupname").html(groupname);
	$("#groupid").val(groupid);
	members(groupid);
});



function members(groupid){
	$.ajax({
        type: "post",
        dataType: "json",
        data: {
            groupid: groupid
        },
        url: util.getServerUrl+"groups/groupMembers",
        success: function (data) {
            if (data.code == '0') {
            	datas(data.list);
            } else {
            	alert(data.errorMSG);
            }
        }
    });
}


function datas(data){
	$("#users").html("");
	for(var i=0;i<data.length;i++){
		var obj = data[i];
		var html = "<tr>";
			html += "<td>"+(i+1)+"</td>";
			html += "<td>"+obj.username+"</td>";
			html += "<td>"+obj.nickname+"</td>";
			html += "<td>"+getRoleName(obj.role)+"</td>";
			html += "<td class='tdcenter'>";
		        html += "<a href='javascript:void(0)' onclick='stopSpeak(\""+obj.userid+"\")'>禁言</a>";
		        html += "<a href='javascript:void(0)' onclick='outGroup(\""+obj.userid+"\")'>T出群组</a>";
		    html += "</td>";
		    html += "</tr>";
		    $("#users").append(html);
	}
	
}

function outGroup(userid){
	var groupid = $("#groupid").val();
	$.ajax({
        type: "post",
        dataType: "json",
        data: {
        	userid: userid,
        	groupid:groupid
        },
        url: util.getServerUrl+"groups/outGroup",
        success: function (data) {
            if (data.code == '0') {
            	datas("操作成功");
            	window.location.reload();
            } else {
            	alert(data.errorMSG);
            }
        }
    });
}

function stopSpeak(userid){
	$.ajax({
        type: "post",
        dataType: "json",
        data: {
        	userId: userid
        },
        url: util.getServerUrl+"users/stopSpeak",
        success: function (data) {
            if (data.code == '0') {
            	alert("操作成功");
            } else {
            	alert(data.errorMSG);
            }
        }
    });
}

function getRoleName(role){
	if(role == '0'){
		return "管理员";
	}else if(role == '1'){
		return "老师";
	}else if(role == '2'){
		return "学生";
	}
	return "";
}