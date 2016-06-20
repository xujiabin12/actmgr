var util = window.mobileUtil;
var groupId = "";
var conn = null;
var curUserId = "";
var curNickName = "";
var curRole = "";
var actUsrId = "";
var headImg = "";
var curChatUserId = null;
var groupFlagMark = "group--";
var msgCardDivId = "chat01";
var talkInputId = "talkInputId";
var curRoomId = null;
var onlyTeacher = "1";
$(function(){
	$('.content').css('height',$(window).height()-172);
    $(window).resize(function(){$('.content').css('height',$(window).height()-172);});
    $('#talkInputId').focus(function(){
        $('.content').css('height',$(window).height()-172);}
    ).blur(function(){
            $('.content').css('height',$(window).height()-172);
        });
    $("#loadmore").click(getHistory);
    $("#talkto2").click(function(){
    	$("#histontent").html("");
        getHistory();
        $("#onlyTeacher,#chat01").hide();
        $("#talktoclose,#historybox").show();
    });
    $("#talktoclose").click(function(){
    	pageNo = 0;
        $("#historybox,#talktoclose").hide();
        $("#onlyTeacher,#chat01").show();
    });
    //语音切换
    $('.eachjp_yuyin').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $('.chat02_content').hide();
            $('.yuyinviewbox').show();
        }else{
            $(this).addClass('on');
            $('.chat02_content').show();
            $('.yuyinviewbox').hide();
        }
    });
    $("#onlyTeacher").click(onlyTeacher);
    //环信
	conn = new Easemob.im.Connection();
    //初始化连接
	conn.init({
        wait : '1800',
        //当连接成功时的回调方法
		onOpened : function(){
            handleOpen(conn);
		},
        //当连接关闭时的回调方法
        onClosed : function() {
            handleClosed();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            handleTextMessage(message);
        },
        //异常时的回调方法
        onError : function(message) {
            handleError(message);
        }
	});
    //回车发送
	document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){
            sendText();
            e.stopPropagation();
        }
    };
    
    //查看大图
    $(".actimg").live('click',function(){
	    	var src=$(this).attr('o');
	    	var wid=$(this).width();
            var hei=$(this).height();
            if(wid<hei){
                $('.openbox').show().find('img').attr('src',src);
                $('.openbox img').css({'height':$(window).height()*0.8,'top':'10%','margin-left':0-($(window).height()*wid/hei*0.8)/2});
            }else{
                $('.openbox').show().find('img').attr('src',src);
                $('.openbox img').css({'width':'50%','left':'25%','margin-top':0-($(window).width()*hei/wid *0.5)/2});
            }
    });
    $('.openbox,.openboxbg,.openbox img').click(function(){
    	$('.openbox img').attr('src','');
        $('.openbox').hide();
    });
    joinGroup();
});

//登录成功回调
var handleOpen = function(conn) {
    //从连接中获取到当前的登录人注册帐号名
    curUserId = conn.context.userId;
    conn.getRoster({
        success : function(roster) {
            //获取当前登录人的群组列表
            conn.listRooms({
                success : function(rooms) {
                    if (rooms && rooms.length > 0) {
                        for(var i=0;i<rooms.length;i++){
                            if(rooms[i].roomId == groupId){
                                var room = rooms[i];
                                curRoomId = room.roomId;
                                $("#talkto").html("与"+room.name+"聊天中");
                                setCurrentContact(groupFlagMark + room.roomId);
                            }
                        }
                    }
                    conn.setPresence();//设置用户上线状态，必须调用
                },
                error : function(e) {
                }
            });
        }
    });
    //启动心跳
    if (conn.isOpened()) {
        conn.heartBeat(conn);
    }
};

//连接中断时的处理，主要是对页面进行处理
var handleClosed = function() {
    login();
};
//收到文本消息回调
var handleTextMessage = function(message) {
    var from = message.from;//消息的发送者
    var fromNickName = message.ext.nickName;
    var cheadImg = message.ext.headImg;
    var role = message.ext.role;
    
    //var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    var messageContent = message.data;//文本消息体
    //TODO  根据消息体的to值去定位那个群组的聊天记录
    var fromNickname = fromNickName?fromNickName:message.from;
    var fname = fromNickname + getRoleName(role);

    appendMsg(from, message.to, messageContent, null,fname,cheadImg,role);
};

//异常情况下的处理方法
var handleError = function(e) {
    if (curUserId == null) {
        alert("连接超时，请退出重新进入...");
    } else {
        var msg = e.msg;
        if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
            login();
        } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
            if (msg.toLowerCase().indexOf("user removed") != -1) {
                alert("用户已经在管理后台删除");
            }
        } else {
            login();
        }
    }
    //conn.stopHeartBeat(conn);
};

//发送消息
var sendText = function(serverId,imgData) {
    if(!isStopSpeak()){
    	alert("你已被禁言10分钟");
        return;
    }
    var msgInput = document.getElementById(talkInputId);
    var msg = msgInput.value;
    if(serverId){
        msg = "speak:"+serverId;
    }
    if(imgData){
    	msg = "actimg:<img class='actimg'  o='"+imgData.url+"' src='"+imgData.smallUrl+"' />";;
    }

    if (msg == null || msg.length == 0) {
        return;
    }
    var to = curRoomId;
    if (to == null) {
        return;
    }
    var options = {
        to : to,
        msg : msg,
        type : "groupchat",
        ext : {"nickName":curNickName,"headImg":headImg,"role":curRole}
    };
    //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
    conn.sendTextMessage(options);

    //当前登录人发送的信息在聊天窗口中原样显示
    var msgtext = msg.replace(/\n/g, '<br>');
    var nickName = curNickName?curNickName + getRoleName(curRole):curUserId;
    appendMsg(curUserId, to, msgtext,null,nickName,headImg,curRole);
    //turnoffFaces_box();
    msgInput.value = "";
    msgInput.focus();
    saveMsg(msg);
};

//设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人
var setCurrentContact = function(defaultUserId) {
    showContactChatDiv(defaultUserId);
    curChatUserId = defaultUserId;
};

//显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
var showContactChatDiv = function(chatUserId) {
    var contentDiv = getContactChatDiv(chatUserId);
    if (contentDiv == null) {
        contentDiv = createContactChatDiv(chatUserId);
        document.getElementById(msgCardDivId).appendChild(contentDiv);
    }
    contentDiv.style.display = "block";
};

//构造当前聊天记录的窗口div
var getContactChatDiv = function(chatUserId) {
    return document.getElementById(curUserId + "-" + chatUserId);
};
//如果当前没有某一个联系人的聊天窗口div就新建一个
var createContactChatDiv = function(chatUserId) {
    var msgContentDivId = curUserId + "-" + chatUserId;
    var newContent = document.createElement("div");
    $(newContent).attr({
        "id" : msgContentDivId,
        "class" : "content",
        "className" : "content"
    });
    return newContent;
};

//显示聊天记录的统一处理方法
/**
 * @param who  消息发送者
 * @param contact  消息接受者
 * @param message 内容
 * @param chattype 消息类型
 * @param nickName 昵称
 * @param headImages 头像
 * @returns {Element}
 */
var appendMsg = function(who, contact, message, chattype,nickName,headImages,role) {
    var contactDivId =  groupFlagMark + contact;

    //如果没有头像，则默认是当前登陆人的头像
    headImages = headImages?headImages:headImg;

    //owner,headimg,nickname,msg
    createMsg(who==curUserId,headImages,nickName,message,contactDivId,role);

    if (curChatUserId == null) {
        setCurrentContact(contactDivId);
    }

    var msgContentDiv = getContactChatDiv(contactDivId);
    msgContentDiv.scrollTop = msgContentDiv.scrollHeight;

};

var createMsg = function(owner,headimg,nickname,content,contactDivId,role){
	var state = "";
        if(role && role == 2){
            state = "student";
            if(onlyTeacher == '0'){//只看老师
                state += "  hide";
             }
        }
    var cn = owner?"rightContent":"leftContent";

    //构建语音
    if(content.indexOf("speak:") != -1){
        var speakId = content.split(":")[1];
        var toimg = owner?"img/right.png":"img/left.png";
        content = "<img src='"+toimg+"' style='width:33px;height:24px;' onclick='playVoice(\""+speakId+"\")' />";
    }
    //构建图片
    if(content.indexOf("actimg:") != -1){
    	content = content.split("actimg:")[1];
    }
    //构建消息
    var msg = "<div class='"+cn+" "+state+"'>";
            msg +="<div class='sanjiaobox'>";
                msg += "<img src='img/sj.png'>";
            msg +="</div>";
            msg +="<div onclick='toPeople(\""+nickname+"\")' class='userheadpic'>";
                msg +="<img src='"+headimg+"'>";
            msg +="</div>";
            if(role == '2'){
            	msg +="<p1>"+nickname+"</p1>";
            }else{
            	msg +="<p1 style='color: #f00'>"+nickname+"</p1>";
            }
            msg +="<p3 class='chat-content-p3' classname='chat-content-p3'>"+content+"</p3>";
        msg +="</div>";
    $("#"+curUserId + "-" + contactDivId).append(msg);
};

//@功能
var toPeople = function(nickname){
	document.getElementById("talkInputId").value = "@"+nickname+" ";
};

var login = function(){
    //curUserId = "ue6c497645";
    var pass = '123456';
    //根据用户名密码登录系统
    conn.open({
        apiUrl : Easemob.im.config.apiURL,
        user : curUserId,
        pwd : pass,
        //连接时提供appkey
        appKey : Easemob.im.config.appkey
    });
};
//加入群组
var joinGroup = function(){
//	groupId = "183745004865323444";
//	curUserId = "ue6df6c3d5";
//    curNickName = "王健";
//    curRole = "2";
//    actUsrId = "cc30f395e3e24b0b9d3d0f68b2e7dd81";
//    headImg = "http://wx.qlogo.cn/mmopen/PiajxSqBRaEL1yX3hCgEaonHHakZbUmL7SLRs574mxaH9wvibQDsjUUjn3ZpmGSMrxmccmiasrHPUawwHXLHeJxmg/0";
//    login();
    
    
	
    groupId = util.getUrlParam("groupid");
    var uinfo = sessionStorage.getItem("us");
    uinfo =  $.parseJSON(uinfo);
   if(uinfo.openid){
       $.ajax({
           type : "post",
           dataType : "json",
           data : {
               groupId : groupId,
               openId:uinfo.openid
           },
           url : util.getServerUrl()+"groups/joinGroup",
           success : function(data){
               //返回用户信息，调用环信的js登录，进入聊天群组界面
               if(data.code == '0'){
                   curUserId = data.username;
                   curNickName = data.nickname;
                   curRole = data.role;
                   actUsrId = data.userid;
                   headImg = data.headimg;
                   login();
               }else{
                   alert(data.errorMSG);
               }
           }
       });
   }else{
       alert("登录超时，请重新登录！");
   }

};

//保存发送消息
var saveMsg = function(message){
    $.ajax({
        type : "post",
        dataType : "json",
        data : {
        	groupId : groupId,
        	nickName:curNickName,
        	userName:curUserId,
        	headimg:headImg,
        	message:message,
        	role:curRole
        },
        url : util.getServerUrl()+"groups/sendMsg",
        success : function(data){
            
        }
    });
};

//是否禁言
var isStopSpeak = function(){
	var flag = true;
    $.ajax({
        type : "post",
        dataType : "json",
        async : false,
        data : {
            userId : actUsrId+""
        },
        url : util.getServerUrl()+"users/isStopSpeak",
        success : function(data){
            if(data.isStopSpeak == '0'){
            	flag = false;
            }
        }
    });
    return flag;
};

var getRoleName = function(role){
    if(!role){
        return "";
    }
    switch (role){
        case '0':return "(管理员)";
        case '1':return "(老师)";
        default : return "";
    }
};
// 1 看全部
var onlyTeacher = function(){
  if(onlyTeacher == '0'){
      onlyTeacher = "1";
      $("#onlyTeacher").html("只看导师");
      $(".student").show();
  }else{
      onlyTeacher = "0";
      $("#onlyTeacher").html("看全部");
      $(".student").hiden();
  }
};
var pageNo = 0;
var getHistory = function(){
    pageNo = pageNo + 1;
    $.ajax({
        type : "post",
        dataType : "json",
        data : {
            groupId : groupId,
            pageNo:pageNo
        },
        url : util.getServerUrl()+"groups/queryHistory",
        success : function(data){
            if(data.code == '0'){
                var list = data.list;
                if(list && list.length > 0){
                    var ln = list.length;
                    var js = null;
                    for(var i=0;i<ln;i++){
                        js = list[i];
                        createHistoryMsg(js.username,js.headimg,js.role,js.nickname,js.message,js.createdtStr);
                    }
                }else{
                    alert("无更多聊天记录");
                }
            }else{
                alert("加载聊天记录失败！");
            }
        }
    });
};

var createHistoryMsg = function(uname,hdimg,role,nickname,content,time){
    var cn = (uname == curUserId)?"rightContent":"leftContent";
  //构建语音
    if(content.indexOf("speak:") != -1){
        var speakId = content.split(":")[1];
        var toimg = (uname == curUserId)?"img/right.png":"img/left.png";
        content = "<img src='"+toimg+"' style='width:33px;height:24px;' onclick='playVoice(\""+speakId+"\")' />";
    }
    //构建图片
    if(content.indexOf("actimg:") != -1){
    	content = content.split("actimg:")[1];
    }
    //构建消息
    var msg = "<div class='"+cn+"'>";
        msg +="<div class='sanjiaobox'>";
        msg += "<img src='img/sj.png'>";
        msg +="</div>";
        msg +="<div class='userheadpic'>";
        msg +="<img src='"+hdimg+"'>";
        msg +="</div>";
        if(role != '2'){
            msg +="<p1>"+nickname+"<em>"+time+"</em></p1>";
        }else{
            msg +="<p1 style='color: #f00'><em>"+time+"</em>"+nickname+"</p1>";
        }
        msg +="<p3 class='chat-content-p3' classname='chat-content-p3'>"+content+"</p3>";
        msg +="</div>";
    $("#histontent").prepend(msg);
};
//播放语音接口
var playVoice = function(serverId){
	$.ajax({
        type : "post",
        dataType : "json",
        data : {
       	 voiceId : serverId
        },
        url : util.getServerUrl()+"wx/placeVoice",
        success : function(data){
	       	if(data.code == '0'){
	       		toAudio(data.url);
	       	}else{
	       		alert("下载语音失败");
	       	}
        }
    });
};
var toAudio = function(url){
	 var audio = document.getElementById("actAudio");
        audio.src = url;
        audio.volume = 0.9;
        audio.play();
};

function ajaxFileUpload(){
	$("#fileform").ajaxSubmit({
		url : util.getServerUrl()+"upload/fileUpload",
		type : "post",
		dataType : "json",
		clearForm : true,
		resetForm : true,
		success : function(data){
			if(data.code == '0'){
				sendText("",data);
			}else{
				alert("发送图片失败");
			}
		}
	});
}