var page = new Page({roomId:1026,bacImg:'./images/bac.png'});
//视频初始化
var video = page.initVideo({
	wrapper:'player-content',
	poster:'',
	videoDom:{
		width:'100%',
		height:'100%',
		top:'0',
		left:'0'
	}

});
page.playStatusListener({
	onChanged:function(status){
		switch(status){
			case 'start':
				//doing somthing
				 break;
		   case 'playing':
				//doing somthing
				 break;
			case 'playend':
				//doing somthing
				 break;
		}
	}
});
//倒计时初始化
var countDown = page.initcountDown({
	wrapper:'time-wrapper',
	countDownDom:{
		width:'3.7rem',
		height:'50%',
		top:'.2rem',
		left:'0',
		color:'white'
	},
	color:'#9cf',
	timeColor:'red',
	titleFontSize:'.2rem',
	fontSize:'.25rem'
});
//观看人次初始化
var watcher = page.initwatcher({
	wrapper:'time-wrapper',
	watcherDom:{
		width:'1rem',
		height:'1rem',
		top:'.15rem',
		left:'4rem'
	},
	imgSrc:'./images/watcher.png',
	color:'white',
	fontSize:'.2rem',
	imgWidth:'.3rem',
	imgHeight:'.3rem'
});
//点赞初始化
var sayGood = page.initsayGood({
	wrapper:'chat-wrapper',
	dianzanDom:{
		width:'.65rem',
		paddingTop:'1rem',
		bottom:'.3rem',
		right:'0rem'
	},	
	imgSrc:'./images/dianzan.png',
	type:'heart',
	visitedImgSrc:'./images/dianzan_hover.png',
	color:'red',
	fontSize:'.2rem',
	imgWidth:'.3rem',
	imgHeight:'.25rem'
});
//聊天初始化
var chatContent = page.initChatContent({
	wrapper:'chat-wrapper',
	txtInput:{
		width:'3rem',
		height:'.5rem',
		left:'.8rem',
		bottom:'.25rem'
	},
	sendButton:{
		width:'1rem',
		height:'.5rem',
		bottom:'.25rem',
		right:'.1rem'
	},
	rongEmoji:{
		width:'.5rem',
		height:'.5rem',
		bottom:'.25rem',
		left:'.1rem'
	},
	emojiWrapper:{
		width:'90%',
		height:'70%',
		bottom:'.8rem',
		left:'5%'
	},
	messageWrapper:{
		top:'.4rem',
		left:'0',
		right:'0',
		bottom:'.9rem',
		height:'auto',
		padding:'0 7%',
		width:'auto'
	},
	wapInput:{
		bottom:'.25rem',
		left:'.1rem',
		padding:'.1rem',
		width:'4.2rem',
		fontSize:'.23rem',
		color:'gray'
	},
	liveTitle:{
		fontWeight:'normal',
		color:'#ee6e79',
		top:'0',
		left:'.15rem',
		fontSize:'.3rem'
	},
	fontSize:'.2rem'
})