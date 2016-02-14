var util  = window._util;
$(function(){
        //登陆
        $('#login').click(login);
 });
//登录
function login(){
	var username= $('#name').val();
    var pwd= $('#pwd').val();
    if(username==''){
        alert('请输入账号!');
        return false;
    }
    if(pwd==''){
        alert('请输入密码!');
        return false;
    }
    $.ajax({
        type : "post",
        dataType : "json",
        data : {
            username : username,
            pwd : pwd
        },
        url : util.getServerUrl+"users/loginForMgr",
        success : function(data){
            if(data.code == '0'){
                //返回用户信息
            	util.setItem("us",JSON.stringify(data));
            	location.href = "groupList.html";
            }else{
                //提示错误信息   data.errorMSG
            	alert(data.errorMSG);
            }
        }
    });
}