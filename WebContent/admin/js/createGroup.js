var util  = window._util; 
$(function(){
        $('#create').click(function(){
            var group_name=$('#group_name').val();
            var desc=$('#desc').val();
            if(group_name==''){
                alert('请输入群组名称!');
                return false;
            }
            if(desc==''){
                alert('请输入群组描述!');
                return false;
            }
            var uinfo = util.getItem("us");
            uinfo = eval(uinfo);
            $.ajax({
                type : "post",
                dataType : "json",
                data : {
                    groupName : group_name,
                    userId : uinfo.userid,
                    desc : desc
                },
                url : util.getServerUrl+"groups/createGroup",
                success : function(data){
                    if(data.code == '0'){
                        alert("创建成功");
                        window.location.href = "groupList.html";
                    }else{
                        alert(data.errorMSG);
                    }
                }
            });
        });
    });