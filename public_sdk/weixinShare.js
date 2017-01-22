function weixinShare(shareUrl, roomPic, roomName) {
	var url = location.href.split('#')[0];
	var nonceStrValue = randomString(10);
	var timeStamp = Date.parse(new Date()).toString().substr(0, 10);
	console.log(roomPic);
	$.post("/weixin/index.php?r=index/get_signature", {
		'url': url,
		'noncestr': nonceStrValue,
		'timestamp': timeStamp
	}, function (data) {
		var data = JSON.parse(data);
		if (data.code === 10000) {
			data = data.params;
			console.log(data);
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid, // 必填，公众号的唯一标识
				timestamp: timeStamp, // 必填，生成签名的时间戳
				nonceStr: nonceStrValue, // 必填，生成签名的随机串
				signature: data.jsapi_signature, // 必填，签名，见附录1
				jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			console.log(roomPic);
			wx.ready(function () {
				wx.onMenuShareTimeline({
					title: roomName, // 分享标题
					link: shareUrl, // 分享链接
					imgUrl: roomPic, // 分享图标
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				wx.onMenuShareAppMessage({
					title: roomName, // 分享标题
					link: shareUrl, // 分享链接
					imgUrl: roomPic, // 分享图标
					desc:'精彩直播即将开始，快来捧场吧！',
					success: function () {
						
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				})
			});
			wx.error(function (res) {
				console.log(res);
			});
		}
	});
}
//生成随机字符串
function randomString(len,type) {
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
	　　var pwd = '';
		if(type === "number"){
			$chars = '0123456789';
			maxPos = $chars.length;
		}
	var i;
	　　for(i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));		　　
		}
	　　return pwd;
}
