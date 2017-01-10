
  //聊天按钮点击显示以及消失效果
/*   $("#chat-img").click(function(){
		$("#message-content").toggle().parent().next().toggle().next().toggle();
		$("#rong-emoji").hide();
	}); */
	function initDom(type,filler){
		if(type==="countTime"){
			countDom = new CountDown("time-watch-wrapper",filler.time,templateId);
			!countDom.isExist && countDom.init(filler.isCountDown);
			return countDom;
		}
		if(type === "dianzan"){
			var dianzanDom = new DianzanNum("input-content",filler.num,templateId);
			!dianzanDom.isExist && dianzanDom.init();
			return dianzanDom;
		}else if(type === "watch"){
			var watchDom = new WatcherNum("time-watch-wrapper",filler.num,templateId);
			!watchDom.isExist && watchDom.init();
			return watchDom;
		}else if(type === "newUser"){
			var newChatPeople = new NewChatPeople("chat-content",filler.userName,filler.userPic)
			newChatPeople.init();
			return newChatPeople;
		}
	}
	$(".wap-input:eq(0)").click(function(){
		$(this).hide();
		$("#dianzanDom").hide();
		$("#input-box").show();
		document.getElementById("message-content").focus();
	});
	$(".chat-content").click(function(){
		document.getElementById("message-content").blur();
		$("#input-box").hide();
		$("#dianzanDom").show();
		$(".wap-input:eq(0)").show();
	})
	$("#message-content").focus(function(){
		var interval = setTimeout(function() {
			document.body.scrollTop = document.body.scrollHeight
		}, 500);
	});
	