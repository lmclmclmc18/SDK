
   //聊天按钮点击显示以及消失效果

	$("#wap-input").click(function(){
		$(this).hide();
		$("#dianzan-dom").hide();
		$("#rong-emoji").show();
		$("#txt-input").show();
		$("#send-button").show();
		document.getElementById("txt-input").focus();
	});
	$("#message-wrapper").click(function(){
		document.getElementById("txt-input").blur();
		$("#rong-emoji").hide();
		$("#txt-input").hide();
		$("#send-button").hide();
		$("#dianzan-dom").show();
		$("#wap-input").show();
	})
	$("#txt-input").focus(function(){
		var interval = setTimeout(function() {
			document.body.scrollTop = document.body.scrollHeight
		}, 500);
	});
	