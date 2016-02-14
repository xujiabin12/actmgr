var util  = window._util;
$(function(){
	selectList();
});

function selectList(){
	$.ajax({
        type : "post",
        dataType : "json",
        url : util.getServerUrl+"groups/groupList",
        success : function(data){
            if(data.code == '0'){
            	var dt = data.list;
            	if(dt.length < 1){
            		return;
            	}
            	for(var i=0;i<dt.length;i++){
            		var obj = dt[i];
            		var html = "";
            		html += "<tr>";
            		html += "<td>"+obj.groupid+"</td>";
            		html += "<td>"+obj.groupname+"</td>";
            		html += "<td>"+obj.groupdesc+"</td>";
            		html += "<td class='tdcenter'>";
            				html += "<a href='javascript:void(0)' onclick='deleteGroup("+obj.groupid+")'>删除</a>";
            				html += "<a href='javascript:void(0)' onclick='look("+obj.groupid+","+obj.groupname+")'>查看群成员</a>";
            		html +="</td>";
            		html +="</tr>";
            		$("#group").append(html);
            	}
            }else{
                //提示错误信息   data.errorMSG
            	alert(data.errorMSG);
            }
        }
    });
}


    function deleteGroup(obj){
        if(confirm('确定要删除?')) {
            $.ajax({
                type: "post",
                dataType: "json",
                data: {
                    groupid: obj
                },
                url: util.getServerUrl+"groups/removeGroup",
                success: function (data) {
                    if (data.code == '0') {
                    	alert("删除成功！");
                    	window.location.reload();
                    } else {
                    	alert(data.errorMSG);
                    }
                }
            });
        }
    }
    
   function look(groupid,groupname){
	   window.location.href = "groupMembers.html?groupid="+groupid+"&groupname="+groupname;
   }
    
    