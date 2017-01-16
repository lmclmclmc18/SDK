function Page(option){
	var content = document.getElementById("input-content"),
		roomId = option.roomId,
		bacImg = option.bacImg;
	if(!roomId){
		this.error("The lack of roomId");
	}
	this.roomId = roomId;
	//是否点赞
	this.isSayGoodVisited = false;
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
	video.style.backgroundColor = "#000000";
	//video.sytle.webkitPlaysInline = true;
	video.style.videoSrc = videoSrc;
	//video.sytle.poster = poster;
	this.initWhtl(option,wrapper,video,"video");
};
//video播放监听
Page.prototype.playStatusListener = function(option){
	//将函数存入缓存 接口获取数据后再执行
	this.addSubscribeEvent("videoCallBack",option.onChanged);
};
//初始化倒计时
Page.prototype.initcountDown = function(option){
	var countDown = document.createElement("div"),
		span = document.createElement("span"),
		span1 = document.createElement("span"),
		wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId),
		color = option.color,
		timeColor = option.timeColor,
		titleFontSize = option.titleFontSize,
		fontSize = option.fontSize;
	countDown.id = "countDom";
	span.id = "countDom-span";
	span1.id = "countDom-span1"
	this.initWhtl(option,wrapper,countDown,"countDown");
	countDown.appendChild(span);
	countDown.appendChild(span1);
	span.style.color = color;
	$("#countDom-span1").children('span').css('color',color);
	span1.style.color = timeColor;
	span.style.color = color;
	span.style.fontSize = titleFontSize;
	span1.style.fontSize = fontSize;
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
		document.getElementById("countDom-span").innerHTML = "直播倒计时:";
	}else{
		document.getElementById("countDom-span").innerHTML = "直播中:";
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
		document.getElementById("countDom-span1").innerHTML = day + "&nbsp;<span style='color:black;font-size:.2rem;'>天</span>&nbsp;" + hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;";
	}else{
		option.time = option.time + 1000; 
		document.getElementById("countDom-span1").innerHTML =hours + "&nbsp;<span style='color:black;font-size:.2rem;'>时</span>&nbsp;" + minutes + "&nbsp;<span style='color:black;font-size:.2rem;'>分</span>&nbsp;"+seconds+"&nbsp;<span style='color:black;font-size:.2rem;'>秒</span>&nbsp;";
	}
};
//初始化观看人次
Page.prototype.initwatcher = function(option){
	var wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId),
		img = document.createElement("img"),
		span = document.createElement("span"),
		color = option.color,
		fontSize = option.fontSize,
		imgWidth = option.imgWidth,
		imgHeight = option.imgHeight,
		watcherDom = document.createElement("div");
	img.src = option.imgSrc;
	img.style.width = imgWidth;
	img.style.height = imgHeight;
	img.style.marginRight = ".1rem";
	span.id = "watcher-num";
	span.style.fontSize = fontSize;
	span.style.color = color;
	this.initWhtl(option,wrapper,watcherDom,"watcher");
	watcherDom.appendChild(img);
	watcherDom.appendChild(span);
	this.addSubscribeEvent("drawWatcher",this.refreshWatcherNum);
};
//渲染观看人次dom
Page.prototype.refreshWatcherNum = function(option){
	document.getElementById("watcher-num").innerHTML = option.num;
};
//初始化点赞
Page.prototype.initsayGood = function(option){
	var wrapper = document.getElementById(option.wrapper),
		DianzanDom = document.createElement("div"),
		img = document.createElement("img"),
		imgWidth = option.imgWidth,
		imgHeight = option.imgHeight,
		color = option.color,
		fontSize = option.fontSize,
		type = option.type,
		imgHeart1 = document.createElement("img"),
		imgHeart2 = document.createElement("img"),
		imgHeart3 = document.createElement("img"),
		imgHeart4 = document.createElement("img"),
		span = document.createElement("span");
	//wrapper.style.textAlign = "center";
	span.style.width = "100%";
	span.style.marginLeft = ".2rem";
	DianzanDom.id = "dianzan-dom";
	span.id = "saygood-num";
	this.initWhtl(option,wrapper,DianzanDom,"sayGood");
	img.src = option.imgSrc;
	img.id = "sayGoodImg";
	imgHeart1.src = "./images/" + type + "-1.png";
	imgHeart2.src = "./images/" + type + "-2.png";
	imgHeart3.src = "./images/" + type + "-3.png";
	imgHeart4.src = "./images/" + type + "-4.png";
	imgHeart1.className = "heart-img red";
	imgHeart2.className = "heart-img blue";
	imgHeart3.className = "heart-img purple";
	imgHeart4.className = "heart-img yellow";
	img.style.width = imgWidth;
	img.style.height = imgHeight;
	span.style.color = color;
	span.style.fontSize = fontSize;
	span.style.display = "block";
	DianzanDom.appendChild(span);
	DianzanDom.appendChild(img);
	DianzanDom.appendChild(imgHeart1);
	DianzanDom.appendChild(imgHeart2);
	DianzanDom.appendChild(imgHeart3);
	DianzanDom.appendChild(imgHeart4);
	this.addSubscribeEvent("refreshSayGoodNum",this.refreshSayGoodNum);
};
//渲染点赞人次dom
Page.prototype.refreshSayGoodNum = function(option){
	document.getElementById("saygood-num").innerHTML = option.num;
};
//初次点赞改变点赞图片
Page.prototype.changeSayGoodImg = function(){
	document.getElementById("sayGoodImg").src = "./images/dianzan_hover.png";
}
//聊天信息包裹元素渲染
Page.prototype.newMessage = function(option){
	var wrapperId = option.wrapper,
		wrapper = document.getElementById(wrapperId),
		bgColor = option.bgColor,
		fontSize = option.fontSize,
		color = option.color;
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
		paddingTop = option.paddingTop,
		right = option.right;
		left = option.left;
	console.log(wrapper);
	wrapper ? wrapper.appendChild(dom) : this.error("There is no "+componentName +"wrapper");
	wrapper.style.position = "relative";
	if(dom){
		dom.style.position = "absolute";
		width && (dom.style.width = width);
		height && (dom.style.height = height);
		top && (dom.style.top = top);
		left && (dom.style.left = left);
		paddingTop && (dom.style.paddingTop = paddingTop);
		right && (dom.style.right = right);
		
	}
}
Page.prototype.error = function(errorMsg){
	throw new Error(errorMsg);
}