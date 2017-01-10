function Page(option){
	var content = document.getElementById("input-content"),
		roomId = option.roomId,
		bacImg = option.bacImg;
	if(!roomId){
		this.error("The lack of roomId");
	}
	content.style.backgroundImage = "url('"+bacImg+"')";
	content.style.backgroundPosition = "top left";
    //content.sytle.backgroundRepeat = "no-repeat";
    content.style.backgroundSize = "100% 100%";
	//订阅事件缓存数组
	this.clientList = [];
}
//初始化video
Page.prototype.initVideo = function(option){
	var video = document.createElement("video"),
		wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId),
		videoSrc = option.videoSrc,
		poster = option.poster;
	video.id = "live_video";
	video.style.controls = "controls";
	video.style.autoplay = "autoplay";
	//video.sytle.webkitPlaysInline = true;
	video.style.videoSrc = videoSrc;
	//video.sytle.poster = poster;
	this.initWhtl(option,wrapper,video,"video");
};
//video播放监听
Page.prototype.playStatusListener = function(option){
	//将函数存入缓存 接口获取数据后再执行
	this.addSubscribeEvent("videoCallBack",option.onChanged);
}
//初始化倒计时
Page.prototype.initcountDown = function(option){
	var countDown = document.createElement("div"),
		span = document.createElement("span"),
		span1 = document.createElement("span"),
		wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId);
	countDown.id = "countDom";
	span.id = "countDom-span";
	span1.id = "countDom-span1"
	this.initWhtl(option,wrapper,countDown,"countDown");
	countDown.appendChild(span);
	countDown.appendChild(span1);
	//将函数存入缓存 接口获取数据后再执行
	this.addSubscribeEvent("drawCountDown",this.countTime);
};
//后台获取数据后渲染倒计时dom
Page.prototype.countTime = function (option) {
	var self = this
		setTimeout(function () {
			self.countTime(option);
		}, 1000);
	var day,
	hours,
	minutes,
	seconds,
	isCountDown = option.isCountDown;
	if(option.time <= 0){
		option.time = 0;
		option.isCountDown = false;
	}
	if(isCountDown){
		span.innerHTML = "直播倒计时:";
	}else{
		span.innerHTML = "直播中:";
	}
	day = Math.floor(option.time / (1000 * 60 * 60 * 24));
	hours = Math.floor((option.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	minutes = Math.floor((option.time % (1000 * 60 * 60)) / (1000 * 60));
	seconds = Math.floor((option.time % (1000 * 60)) / 1000);
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
		option.time = option.time - 1000;
		document.getElementById("countDom-span").innerHTML = day + "&nbsp;<span style='color:black;font-size:.2rem;'>天</span>&nbsp;" + hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;";
	}else{
		option.time = option.time + 1000; 
		document.getElementById("countDom-span1").innerHTML =hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;"+seconds+"&nbsp;<span style='color:black;font-size:.2rem;'>秒</span>&nbsp;";
	}
}
//初始化观看人次
Page.prototype.initwatcher = function(option){
	var wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId),
		img = document.createElement("img"),
		span = document.createElement("span"),
		watcherDom = document.createElement("div");
	img.src = option.img;
	span.id = "watcher-num";
	this.initWhtl(option,wrapper,watcherDom,"watcher");
	watcherDom.appendChild(img);
	watcherDom.appendChild(span);
	this.addSubscribeEvent("drawWatcher",this.refreshWatcherNum);
};
//渲染观看人次dom
Page.prototype.refreshWatcherNum = function(option){
	document.getElementById("watcher-num").innerHTML = option.num;
}
//初始化点赞
Page.prototype.initsayGood = function(option){
	var wrapper = document.getElementById(option.wrapper),
		DianzanDom = document.createElement("div"),
		img = document.createElement("img"),
		span = document.createElement("span");
	DianzanDom.id = "dianzan-dom";
	span.id = "saygood-num";
	this.initWhtl(option,wrapper,DianzanDom,"sayGood");
	img.src = option.img;
	DianzanDom.appendChild(span);
	DianzanDom.appendChild(img);
	this.addSubscribeEvent("refreshSayGoodNum",this.refreshSayGoodNum);
};
//渲染点赞人次dom
Page.prototype.refreshSayGoodNum = function(option){
	document.getElementById("saygood-num").innerHTML = option.num;
}
//初始化聊天
Page.prototype.initchat = function(option){
	var wrapper = document.getElementById(option.wrapper);
		inputDom = document.createElement("div"),
		img = document.createElement("img"),
		span = document.createElement("span"),
		input = document.createElement("input");
	this.initWhtl(option,wrapper,inputDom,"chat");
	inputDom.appendChild(img);
	inputDom.appendChild(input);
	inputDom.appendChild(span);
};
Page.prototype.addSubscribeEvent = function(key,fn){
	if(!this.clientList[key]){
		this.clientList[key] = [];
	}
	this.clientList[key].push(fn);   //将订阅事件添加进缓存
};
Page.prototype.trigger = function(){
	var key = Array.prototype.shift.call(arguments),
		fns = this.clientList[key];
	if(!fns || fns.length === 0){
		return false;
	}
	for(var i=0,fn;fn = fns[i++];){
		fn.apply(this,arguments);
	}
}
Page.prototype.initWhtl = function(option,wrapper,dom,componentName){
	var width = option.width,
		height = option.height,
		top = option.top,
		left = option.left;
	console.log(wrapper);
	wrapper ? wrapper.appendChild(dom) : this.error("There is no "+componentName +"wrapper");
	wrapper.style.position = "relative";
	dom.style.position = "absolute";
	dom.style.width = option.width;
	dom.style.height = option.height;
	dom.style.top = option.top;
	dom.style.left = option.left;
}
Page.prototype.error = function(errorMsg){
	throw new Error(errorMsg);
}