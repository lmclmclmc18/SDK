//获取房间id
var templateId = $("body").attr("id"),
	templateClass = $("body").attr("class");
var roomId = GetQueryString('roomId');
var isAdEnd = false;

var nameSpaceData = {
	oldVisit: 0,
	oldSayGood: 0,
	chatItems:[]
}
//初始化获取房间详情
$.get("/api/page-api/api?method=getPageLiveRoomView&room_id=" + roomId, function (data) {
	var data = JSON.parse(data);
	if (data.code === 10000) {
		data = data.params.room_view_data;
		var roomName = data.room_name;
		var roomPic = data.room_pic;
		var pageUrl = data.page_url;
		var shareUrl = data.share_url;
		var adUrl = data.ad_url;
		var pageType = document.getElementsByTagName("body")[0].className; 
		var countDownDom;
		var filler = {};
		if (data.room_status === 1) {
			var duringTime = (new Date().getTime()) - data.live_start_time * 1000;
			console.log(duringTime);
			var filler = {
				time: duringTime,
				isCountDown: false
			}
			if(data.live_start_time === 0){
				$("#time-watch-wrapper").prepend("<span style='font-size:.2rem;position:absolute;top:.15rem;left:.15rem;'>直播即将开始</span>");			
			}else{
				$("#time-watch-wrapper").removeClass("line-height_3");
				countDownDom = initDom("countTime", filler);
			}
			 
		} else {
			var startTime = data.plan_start_time * 1000 - (new Date().getTime());
			var filler = {
				time: startTime,
				isCountDown: true
			}
			if(data.plan_start_time === 0){
				$("#time-watch-wrapper").prepend("<span style='font-size:.2rem;position:absolute;top:.15rem;left:.15rem;'>直播即将开始</span>");;
			}else{
				$("#time-watch-wrapper").removeClass("line-height_3");
				countDownDom = initDom("countTime", filler);
			}
		}
		window.videoStatus = data.room_status;
		nameSpaceData.oldVisit = data.old_visit;
		nameSpaceData.oldSayGood = data.old_saygood;
		$("title").html(roomName);
		$("#live-title").html(roomName);
		$(".room-user>span:eq(0)").html(roomName);
		$(".room-user>img").attr("src", roomPic);
		autoplay();
		if (adUrl) {
			$("#live-video").attr("src", adUrl);
			//video播放完成事件
			document.getElementById("live-video").addEventListener("ended", function () {
				adVideoEnded(data)
			})
		} else {
			isAdEnd = true;
			data.room_status && data.live_url && $("#live-video").attr("src", data.live_url);
			!data.room_status && data.demand_url && $("#live-video").attr("src", data.demand_url[0]);
		}
		//若为多机位模板初始化多机位
		if(pageType === "multi-camera"){
			filler = {
				data:data.channel_info,
				roomId:roomId
			}
			initDom("multiCamera",filler);
		}
		visitor(data.click_poll_time, data.pv_poll_time);
		//循环查询直播状态
		checkStatus(data.status_poll_time, countDownDom);
		console.log(roomPic);
		weixinShare(shareUrl, roomPic, roomName);
		if (!getCookie("openid") || !getCookie("userName")) {
			setCookie();
		}
		if (is_weixin()) {
			var openid = GetQueryString("openid") || getCookie("openid");
			var userName = GetQueryString("nickname") || getCookie("userName");
			var userPic = GetQueryString("userpic") || "/public/images/default.png";
		} else {
			var openid = getCookie("openid");
			var userName = getCookie("userName");
			var userPic = "/public/images/default.png";
		}
		//获取融云token
		$.post("/api/interface/api?method=getRongCloudToken&time=1481186903&token=3e0dae665a674724365a03ca2239b475", {
			'params': '{"user_id":' + JSON.stringify(openid) + ',"user_name":' + JSON.stringify(userName) + ',"user_pic":' + JSON.stringify(userPic) + '}'
		}, function (tokendata) {
			var tokenData = JSON.parse(tokendata);
			if(tokenData.params.code === 99999){
				var closeDialog = new Dialog('注册用户数超限');
				closeDialog.init();
			}
			var token = tokenData.params.token;
			initRongYun(data.appkey, token, userName, userPic);
		})
	} else if (data.code === 10029) {
		if(roomId){
			var closeDialog = new Dialog('该房间已经被删除');
			closeDialog.init();
		}
	} else {
		console.log("错误");
	}
});
//初始化写入房间观看人数
$.get("/api/page-api/api?method=setPageOnlinePv&room_id=" + roomId, function (data) {
	var data = JSON.parse(data);
	if (data.code === 10000) {
		console.log("成功写入初始化人数");
	}
});
//设置cookie
function setCookie() {
	var Days = 30;
	var exp = new Date();
	var openid = parseInt(new Date().getTime() / 100000) + randomString(4);
	var userName = "网友" + randomString(4, "number");
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = "openid=" + openid + " ;expires=" + exp.toGMTString();
	document.cookie = "userName=" + encodeURI(userName) + " ;expires=" + exp.toGMTString();
}
//读取cookie
function getCookie(name) {
	var cookieArray = document.cookie.split(';');
	for (var i = 0, len = cookieArray.length; i < len; i++) {
		if (name === "openid" && cookieArray[i].indexOf("openid") !== -1) {
			return cookieArray[i].substr(8);
		} else if (name === "userName" && cookieArray[i].indexOf("userName") !== -1) {
			return decodeURIComponent(cookieArray[i]).substr(10);
		}
	}
	return null;
}
//初始化链接融云聊天
function initRongYun(appkey, token, userName, userPic) {
	var token = token;
	RongIMClient.init(appkey);
	RongIMLib.RongIMEmoji.init();
	var emoji = RongIMLib.RongIMEmoji.emojis;
	// 设置连接监听状态 （ status 标识当前连接状态）
	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			switch (status) {
				//链接成功
			case RongIMLib.ConnectionStatus.CONNECTED:
				console.log('链接成功');
				break;
				//正在链接
			case RongIMLib.ConnectionStatus.CONNECTING:
				console.log('正在链接');
				break;
				//重新链接
			case RongIMLib.ConnectionStatus.DISCONNECTED:
				console.log('断开连接');
				break;
				//其他设备登录
			case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
				console.log('其他设备登录');
				break;
				//网络不可用
			case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
				console.log('网络不可用');
				break;
			}
		}
	});
	// 消息监听器
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
			// 判断消息类型
			switch (message.messageType) {
			case RongIMClient.MessageType.TextMessage:
				// 发送的消息内容将会被打印
				console.log('dddddd');
				console.log(message.content.content);
				chatBoxShowMessage(message);
				break;
			case RongIMClient.MessageType.VoiceMessage:
				// 对声音进行预加载
				// message.content.content 格式为 AMR 格式的 base64 码
				console.log('sdf');
				RongIMLib.RongIMVoice.preLoaded(message.content.content);
				break;
			case RongIMClient.MessageType.ImageMessage:
				// do something...
				console.log('ww');
				break;
			case RongIMClient.MessageType.DiscussionNotificationMessage:
				// do something...
				console.log('qq');
				break;
			case RongIMClient.MessageType.LocationMessage:
				// do something...
				console.log('q');
				break;
			case RongIMClient.MessageType.RichContentMessage:
				// do something...
				console.log('w');
				break;
			case RongIMClient.MessageType.DiscussionNotificationMessage:
				// do something...
				console.log('e');
				break;
			case RongIMClient.MessageType.InformationNotificationMessage:
				// do something...
				console.log('r');
				break;
			case RongIMClient.MessageType.ContactNotificationMessage:
				// do something...
				console.log('t');
				break;
			case RongIMClient.MessageType.ProfileNotificationMessage:
				// do something...
				console.log('y');
				break;
			case RongIMClient.MessageType.CommandNotificationMessage:
				// do something...
				console.log('u');
				break;
			case RongIMClient.MessageType.CommandMessage:
				// do something...
				console.log('i');
				break;
			case RongIMClient.MessageType.UnknownMessage:
				// do something...
				console.log('o');
				break;
			case RongIMClient.MessageType.PersonMessage:
				//实例化新用户捧场信息
				var message = message.content;
				var filler = {
					userName: message.name,
					userPic: message.userpic
				}
				initDom("newUser", filler);
				break;
			default:
				console.log('sdfsfdsfd');
				// 自定义消息
				// do something...
			}
		}
	});
	// 连接融云服务器。
	RongIMClient.connect(token, {
		onSuccess: function (userId) {
			console.log("Login successfully." + userId);
			addRoom(10, userName, userPic);
		},
		onTokenIncorrect: function () {
			console.log('token无效');
		},
		onError: function (errorCode) {
			var info = '';
			switch (errorCode) {
			case RongIMLib.ErrorCode.TIMEOUT:
				info = '超时';
				break;
			case RongIMLib.ErrorCode.UNKNOWN_ERROR:
				info = '未知错误';
				break;
			case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
				info = '不可接受的协议版本';
				break;
			case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
				info = 'appkey不正确';
				break;
			case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
				info = '服务器不可用';
				break;
			}
			console.log(errorCode);
		}
	});
	initChatRoom(emoji);
}
//自定义用户消息并发送出去
function customMessage(userName, userPic) {
	var messageName = "PersonMessage"; // 消息名称。
	var objectName = "s:person"; // 消息内置名称，请按照此格式命名。
	var mesasgeTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
	var propertys = ["name", "userpic"]; // 消息类中的属性名。
	RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys);
	//var conversationType = RongIMLib.ConversationType.PRIVATE; //私聊,其他会话选择相应的消息类型即可。
	var targetId = roomId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
	var msg = new RongIMClient.RegisterMessage.PersonMessage({
			name: userName,
			userpic: userPic
		});
	var conversationtype = RongIMLib.ConversationType.CHATROOM; // 私聊
	RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
		onSuccess: function (message) {
			/* var message = message.content;
			var filler = {
				userName: message.name,
				userPic: message.userpic
			}
			initDom("newUser", filler); */
			console.log('自定义消息发送成功');
			templateClass === "interaction" && ($("#wrapper").scrollTop($("#wrapper")[0].scrollHeight));
			templateClass === "basis" && ($("#chat-content").scrollLeft($("#chat-content")[0].scrollWidth))
		},
		onError: function (errorCode) {
			alert(errorCode);
		}
	});
}

//初始化聊天室
function initChatRoom(emoji) {
	var emojiBox = $("#rong-emoji");
	for (var i = 0, len = emoji.length; i < len; i++) {
		emojiBox.append(emoji[i]);
	}
	$("#rong-emoji>span").css({
		"display": "inline-block",
		"width": ".7rem",
		"height": ".7rem",
		"textAlign": "center",
		"cursor": "pointer"
	});
}
//加入聊天室
function addRoom(count, userName, userPic) {
	RongIMClient.getInstance().joinChatRoom(roomId, count, {
		onSuccess: function () {
			// 加入聊天室成功。
			console.log("加入聊天室成功" + roomId);
			// 获取聊天室人数 （范围 0-20 ）
			// 排序方式。
			const order = RongIMLib.GetChatRoomType.REVERSE;
			customMessage(userName, userPic);
			RongIMClient.getInstance().getChatRoomInfo(roomId, count, order, {
				onSuccess: function (chatRoom) {
					// chatRoom => 聊天室信息。
					// chatRoom.userInfos => 返回聊天室成员。
					// chatRoom.userTotalNums => 当前聊天室总人数。
					console.log(chatRoom.userTotalNums);
				},
				onError: function (error) {
					// 获取聊天室信息失败。
					console.log(error);
				}
			});
		},
		onError: function (error) {
			// 加入聊天室失败
			console.log(error);
		}
	});
}
//发送信息
function sendMessage(msg) {
	// 定义消息类型,文字消息使用 RongIMLib.TextMessage   
	var msg = new RongIMLib.TextMessage({
			content: msg,
			extra: is_weixin() ? (GetQueryString("nickname") || getCookie("userName")) : getCookie("userName")
		});
	//或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
	//var msg = RongIMLib.TextMessage.obtain("hello");
	var conversationtype = RongIMLib.ConversationType.CHATROOM; // 私聊
	RongIMClient.getInstance().sendMessage(conversationtype, roomId, msg, {
		// 发送消息成功
		onSuccess: function (message) {
			//message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
			console.log(message);
			chatBoxShowMessage(message);
		},
		onError: function (errorCode, message) {
			var info = '';
			switch (errorCode) {
			case RongIMLib.ErrorCode.TIMEOUT:
				info = '超时';
				break;
			case RongIMLib.ErrorCode.UNKNOWN_ERROR:
				info = '未知错误';
				break;
			case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
				info = '在黑名单中，无法向对方发送消息';
				break;
			case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
				info = '不在讨论组中';
				break;
			case RongIMLib.ErrorCode.NOT_IN_GROUP:
				info = '不在群组中';
				break;
			case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
				info = '不在聊天室中';
				break;
			default:
				info = x;
				break;
			}
			console.log('发送失败:' + info);
		}
	});
}
function chatBoxShowMessage(message) {
	var name = message.content.extra,
	content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content[0]),
	userpic = is_weixin() ? message.content.content[1] : "/public/images/default.png";
	$("#rong-emoji").hide();
	$(".chat-content").append("<p class='message-wrapper'><span><img src=" + userpic + ">&nbsp;&nbsp;<span class='user-name'>" + name + "</span>&nbsp;:&nbsp;" + content + "</span></p>");
	templateClass === "interaction" && ($("#wrapper").scrollTop($("#wrapper")[0].scrollHeight));
	templateClass === "basis" && ($("#chat-content").scrollLeft($("#chat-content")[0].scrollWidth));
}
//获取链接中参数的方法
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
function play(countDownDom) {
	//var video =  document.getElementsByClassName("live_video")[0];
	$.get("/api/page-api/api?method=getPageLiveRoomView&room_id=" + roomId, function (data) {
		var data = JSON.parse(data);
		if (data.code === 10000) {
			data = data.params.room_view_data;
			data.room_status && data.play_url && $("#live-video").attr("src", data.live_url);
			!data.room_status && data.demand_url && $("#live-video").attr("src", data.demand_url[0]);
			if (data.room_status === 1) {
				countDownDom && (countDownDom.isCountDown = false);
				countDownDom && (countDownDom.time = (new Date().getTime()) - data.live_start_time * 1000);
			} else {
				countDownDom && (countDownDom.isCountDown = true);
				countDownDom && (countDownDom.time = data.play_start_time * 1000 - (new Date().getTime()));
			}
		}
	});
}
//广告播放完后执行
function adVideoEnded(data) {
	isAdEnd = true;
	data.room_status && data.live_url && $("#live-video").attr("src", data.live_url);
	!data.room_status && data.demand_url && $("#live-video").attr("src", data.demand_url[0]);
}

//初始化查询访问人数跟点赞
function visitor(clickTime, pvTime) {
	visitor_watchNum(true);
	visitor_dianzanNum(true);
	if (pvTime !== 0) {
		setTimeout(function () {
			visitor_watchNum(false)
		}, 1000 * pvTime);
	}

	if (clickTime !== 0) {
		setTimeout(function () {
			visitor_dianzanNum(false)
		}, 1000 * clickTime);
	}
}
//每隔一段时间查询访问人数
function visitor_watchNum(isFirst) {
	//获取在线人数的接口
	$.get("/api/page-api/api?method=getPageOnlinePv&room_id=" + roomId, function (data) {
		var data = JSON.parse(data);
		if (data.code === 10000) {
			var visitNum = data.params.new_visit + nameSpaceData.oldVisit;
			var filler = {
				num: visitNum
			};
			var watchDom = initDom("watch", filler);
			if (isFirst) {
				if (templateId === "root") {
					$(".room-user>span:eq(1)").html(visitNum);
				}
				return;
			}
			if (data.params.pv_poll_time !== 0) {
				setTimeout(function () {
					visitor_watchNum(false)
				}, 1000 * data.params.pv_poll_time);
			}

			if (templateId === "root") {
				$(".room-user>span:eq(1)").html(visitNum);
			} else {
				watchDom && watchDom.refreshData(visitNum,data.params.pv_poll_time);
			}
		}
	});
}
//每隔一段时间查询点赞数量
function visitor_dianzanNum(isFirst) {
	//获取最新的点赞数量
	$.get("/api/page-api/api?method=getPageClick&room_id=" + roomId, function (data) {
		var data = JSON.parse(data);
		if (data.code === 10000) {
			var saygoodNum = data.params.new_saygood + nameSpaceData.oldSayGood;
			var filler = {
				num: saygoodNum
			};
			var dianzanDom = initDom("dianzan", filler);
			if (isFirst) {
				setDianzan(dianzanDom);
				if (templateId === "root") {
					$(".room-praise>span:eq(0)").html(saygoodNum);
				}
				return;
			}
			if (data.params.click_poll_time !== 0) {
				setTimeout(function () {
					visitor_dianzanNum(false)
				}, 1000 * data.params.click_poll_time);
			}
			if (templateId === "root") {
				$(".room-praise>span:eq(0)").html(saygoodNum);
			} else {
				dianzanDom && dianzanDom.refreshData(saygoodNum,data.params.click_poll_time);
			}
		}
	});

}
//每隔10秒查询直播状态
function checkStatus(time, countDownDom) {
	time = time || 10;
	if (!isAdEnd) {
		setTimeout(function () {
			checkStatus(time)
		}, 1000 * time);
		return;
	}
	//获取房间roomstatus
	$.get("/api/page-api/api?method=getPageLiveRoomStatus&room_id=" + roomId, function (data) {
		var data = JSON.parse(data);
		if (data.code === 10000) {
			data = data.params;
			if (data.status_poll_time !== 0) {
				setTimeout(function () {
					checkStatus();
				}, 1000 * data.status_poll_time);
			}

			if (data.room_status !== videoStatus) {
				videoStatus = data.room_status;
				play(countDownDom);
			}
		} else {
			console.log("错误");
		}
	})
}
//判断是否微信内置浏览器
function is_weixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}

//ios下自动播放 安卓不播放
function autoplay() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if (isiOS) {
		document.getElementsByTagName("video")[0].autoplay = "autoplay";
	}
}
//点击发送信息按钮
$("#send-img").click(function () {
	var inputValue = $("#message-content"),
	userpic = GetQueryString("userpic") || "/public/images/default.png",
	message = inputValue.val();
	if (message === '') {
		return;
	}
	inputValue.val('');
	message = [message, userpic];
	sendMessage(message);
	$(".wap-input:eq(0)").show();
	$("#dianzanDom").show();
	$("#input-box").hide();
});
//点击发送表情按钮
$("#emoji-img").click(function () {
	$("#rong-emoji").toggle();
});
//选择表情符号
$(document).on("click", "#rong-emoji>span", function (e) {
	e.preventDefault();
	var name = $(this).children("span").attr("name");
	var str = RongIMLib.RongIMEmoji.symbolToEmoji(name);
	var input = $("#message-content");
	var value = input.val();
	input.val(value + str);
});
//点击video暂停
$("#live-video").click(function () {
	if ($(this)[0].paused) {
		$(this)[0].play();
	} else {
		$(this)[0].pause();
	}
});
//点赞
function setDianzan(dianzanDom) {
	$('body').on("click", "#dianzanDom", function (e) {
		var newSayGood = parseInt($("#dianzanDom>span").html()) + 1;
		if (templateId === "root") {
			$(".room-praise>span:eq(0)").html(newSayGood);
		} else {
			if (!dianzanDom.isVisited) {
				dianzanDom.visited();
			}
			$("#dianzanDom>span").html(newSayGood);
		}
		$.get("/api/page-api/api?method=setPageClick&room_id=" + roomId, function (data) {
			var data = JSON.parse(data);
			if (data.code === 10000) {
				console.log('点赞成功');
			} else {
				console.log('点赞失败');
			}
		});
	});
}
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {  
   var content = $("#content"); 
	if (window.orientation === 180 || window.orientation === 0) {   
	   //alert('竖屏状态！');  
		content.height(window.innerHeight);
	}   
	if (window.orientation === 90 || window.orientation === -90 ){ 	
		content.height(2.5*window.innerHeight);
	}    
}, false);   
		
