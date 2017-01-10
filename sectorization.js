
//弹出框单例
var Dialog = (function () {
	var dialog;
	//弹出框构造函数
	function Dialog(prompt) {
		if (dialog) {
			dialog.isExist = true;
			return dialog;
		}
		this.isExist = false;
		this.html = prompt;
		return dialog = this;
	}
	Dialog.prototype.init = function () {
		var div = document.createElement("div");
		div.id = "dialog";
		div.innerHTML = this.html;
		document.body.appendChild(div);
	}
	Dialog.prototype.destroy = function () {
		var div = document.getElementById("dialog");
		div.parentNode.removeChild(div);
		dialog = null;
	}
	return Dialog;
})();
//显示点赞数单例
var DianzanNum = (function () {
	var dianzanNum;
	function DianzanNum(targetId, num, templateId) {
		if (dianzanNum || templateId === "root") {
			dianzanNum.isExist = true;
			return dianzanNum;
		}
		this.num = num;
		this.targetId = targetId;
		this.isVisited = false;  //是否点击过
		this.isExist = false;
		this.templateId = document.getElementsByTagName("body")[0].id;
		this.pageType = document.getElementsByTagName("body")[0].className; //页面类型  基础 多视角 互动
		return dianzanNum = this;
	}
	DianzanNum.prototype.init = function () {
		var ele = document.getElementById(this.targetId) || document.getElementsByClassName(this.targetId)[0],
		div = document.createElement("div"),
		img = document.createElement("img"),
		span = document.createElement("span");
		div.id = "dianzanDom";
		img.src = "/public/images/" + templateClass + "/dianzan.png";
		img.id = "good-img";
		if(this.num>10000){
			this.num = (this.num/10000).toFixed(1) + "万";
		}
		span.innerHTML = this.num;
		this.span = span;
		this.img = img;
		div.appendChild(span);
		div.appendChild(img);
		(this.pageType === "interaction" || parseInt(this.templateId.slice(-2)) > 22) && this.addHeart(div);
		ele.appendChild(div);
	}
	DianzanNum.prototype.addHeart = function(div){
		var imgHeart1 = document.createElement("img"),
		imgHeart2 = document.createElement("img"),
		imgHeart3 = document.createElement("img"),
		imgHeart4 = document.createElement("img");
		imgHeart1.src = "/public/images/heart-1.png";
		imgHeart2.src = "/public/images/heart-2.png";
		imgHeart3.src = "/public/images/heart-3.png";
		imgHeart4.src = "/public/images/heart-4.png";
		imgHeart1.className = "heart-img red";
		imgHeart2.className = "heart-img blue";
		imgHeart3.className = "heart-img purple";
		imgHeart4.className = "heart-img yellow";
		div.appendChild(imgHeart1);
		div.appendChild(imgHeart2);
		div.appendChild(imgHeart3);
		div.appendChild(imgHeart4);
	}
	DianzanNum.prototype.refreshData = function (num,timeCount) {
		/* var self = this,
			initialValue = parseInt(this.span.innerHTML),
			data = parseInt((num-initialValue)/timeCount);
			this.count = 0;
		    this.loop = setInterval(function(){
				self.addNum(data,timeCount,num);
			},1000); */
			this.span.innerHTML = num;
	}
	DianzanNum.prototype.addNum = function(data,timeCount,finalNum){
		this.count += 1;
		if(this.count === timeCount){
			clearInterval(this.loop);
			this.span.innerHTML = finalNum;
			return;
		}
		var num = parseInt(this.span.innerHTML) + data;
		this.span.innerHTML = num;
	}
	DianzanNum.prototype.visited = function () {
		this.isVisited = true;
		this.img.src = "/public/images/" + templateClass + "/dianzan_hover.png";
	}
	return DianzanNum;
})();
//显示观看人数单例
var WatcherNum = (function () {
	var watcherNum;
	function WatcherNum(targetId, num, templateId) {
		if (watcherNum || templateId === "root") {
			watcherNum.isExist = true;
			return watcherNum;
		}
		this.num = num;
		this.targetId = targetId;
		this.isExist = false;
		return watcherNum = this;
	}
	WatcherNum.prototype.init = function () {
		var ele = document.getElementById(this.targetId) || document.getElementsByClassName(this.targetId)[0],
		div = document.createElement("div"),
		img = document.createElement("img"),
		span = document.createElement("span");
		div.id = "watchDom";
		img.src = "/public/images/" + templateClass + "/watcher.png";
		if(this.num>10000){
			this.num = (this.num/10000).toFixed(1) + "万";
		}
		span.innerHTML = this.num;
		this.span = span;
		this.img = img;
		div.appendChild(img);
		div.appendChild(span);
		ele.appendChild(div);
	}
	WatcherNum.prototype.refreshData = function (num,timeCount) {
		//new DianzanNum().refreshData.apply(this,arguments);
		this.span.innerHTML = num;
	}
	WatcherNum.prototype.addNum = function(data,timeCount,finalNum){
		this.count += 1;
		if(this.count === timeCount){
			clearInterval(this.loop);
			this.span.innerHTML = finalNum;
			return;
		}
		var num = parseInt(this.span.innerHTML) + data;
		this.span.innerHTML = num;
	}
	return WatcherNum;
})();
//显示倒计时单例
var CountDown = (function () {
	var countDown;
	function CountDown(targetId, time, templateId) {
		if (countDown || templateId === "root") {
			countDown.isExist = true;
			return countDown;
		}
		this.time = time;
		this.targetId = targetId;
		this.isExist = false;
		return countDown = this;
	}
	CountDown.prototype.init = function (isCountDown) {

		var ele = document.getElementById(this.targetId) || document.getElementsByClassName(this.targetId)[0],
		div = document.createElement("div"),
		span = document.createElement("span"),
		span1 = document.createElement("span");
		div.id = "countDom";
		this.isCountDown = isCountDown;
		if(isCountDown){
			span.innerHTML = "直播倒计时:";
		}else{
			span.innerHTML = "直播中:";
		}
		this.span1 = span1;
		this.countTime();
		div.appendChild(span);
		div.appendChild(span1);
		ele.appendChild(div);
	}
	CountDown.prototype.countTime = function () {
		var self = this
			setTimeout(function () {
				self.countTime();
			}, 1000);
		var day,
		hours,
		minutes,
		seconds;
		if(this.time <= 0){
			this.time = 0;
			this.isCountDown = false;
		}
		day = Math.floor(this.time / (1000 * 60 * 60 * 24));
		hours = Math.floor((this.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((this.time % (1000 * 60)) / 1000);
		 if (day < 10) {
			day = "0" + day;
		} 
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
	 	if (seconds < 10) {
			seconds = "0" + seconds;
		} 
		if(this.isCountDown){
			this.time = this.time - 1000;
			this.span1.innerHTML = day + "&nbsp;<span style='color:black;font-size:.2rem;'>天</span>&nbsp;" + hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;";
		}else{
			this.time = this.time + 1000; 
			this.span1.innerHTML =hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;"+seconds+"&nbsp;<span style='color:black;font-size:.2rem;'>秒</span>&nbsp;";
		}
	}
	return CountDown;
})();
//显示访问聊天室的新用户信息
var NewChatPeople = (function () {
	var newChatPeople;
	function NewChatPeople(targetId, userName, userPic) {
		this.targetId = targetId;
		this.userName = userName;
		this.userPic = userPic;
	}
	NewChatPeople.prototype.init = function () {
		var ele = document.getElementById(this.targetId) || document.getElementsByClassName(this.targetId)[0],
		div = document.createElement("div"),
		img = document.createElement("img"),
		span = document.createElement("span"),
		span1 = document.createElement("span");
		spanWrapper = document.createElement("span");
		img.src = this.userPic;
		//div.id = "new-chat-people";
		div.className = "message-wrapper";
		span.innerHTML = "欢迎";
		span1.innerHTML =  this.userName + "来捧场";
		spanWrapper.appendChild(span);
		spanWrapper.appendChild(img);
		spanWrapper.appendChild(span1);
		div.appendChild(spanWrapper);
		ele.appendChild(div);
	}
	return NewChatPeople;
})();
//多机位构造函数
var MultiCamera = (function(){
	function MultiCamera(targetId,cameraArray,roomId){
		this.targetId = targetId;
		this.cameraArray = cameraArray;
		this.roomId = roomId;
	}
	MultiCamera.prototype.init = function(){
		var cameraData = this.cameraArray,
			self = this,
			id,
			channelNo,
			streamInputId,
			ele = document.getElementById(this.targetId) || document.getElementsByClassName(this.targetId)[0]; 
		if(!cameraData){
			return;
		}
		for(var i =0,len = cameraData.length;i<len;i++){
			var div = document.createElement("div");
			id = cameraData[i].id;
			channelNo = cameraData[i].channel_no;
			streamInputId = cameraData[i].stream_input_id;
			div.id = id;
			div.className = "multi-camera-button";
			div.setAttribute("data-channelNo",channelNo);
			div.setAttribute("data-streamInputId",streamInputId);
			div.innerHTML = channelNo;
			(function(streamInputId){
				div.addEventListener("click",function(){
						self.switcherLiveUrl(streamInputId);
				});
			})(streamInputId);
			ele.appendChild(div);
		}
	}
	MultiCamera.prototype.switcherLiveUrl = function(streamInputId){
		$.get("/api/page-api/api?method=getPageChannelUrl&stream_input_id="+streamInputId,function(data){
			var data =  JSON.parse(data);
			console.log(data);
			if(data.code === 10000){
				document.getElementsByTagName("video")[0].src = data.params.output_url;
			}
		});
	}
	return MultiCamera;
})()
