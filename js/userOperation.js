var page = new Page({roomId:1049,bacImg:'./images/bac.png'});
//视频初始化
var video = page.initVideo({wrapper:'player-content',width:'100%',height:'80%',poster:'',top:'0',left:'0'});
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
var countDown = page.initcountDown({wrapper:'time-watch-wrapper',width:'3.7rem',height:'50%',top:'.2rem',left:'0',color:'#9cf',timeColor:'red',titleFontSize:'.2rem',fontSize:'.25rem'});
//观看人次初始化
var watcher = page.initwatcher({wrapper:'time-watch-wrapper',width:'1rem',height:'1rem',top:'.2rem',left:'4rem',imgSrc:'./images/watcher.png',color:'red',fontSize:'.2rem',imgWidth:'.3rem',imgHeight:'.2rem'});
//点赞初始化
var sayGood = page.initsayGood({wrapper:'input-content',width:'1rem',paddingTop:'1rem',top:'2rem',right:'0rem',imgSrc:'./images/dianzan.png',type:'heart',visitedImgSrc:'./images/dianzan_hover.png',color:'red',fontSize:'.2rem',imgWidth:'.5rem',imgHeight:'.5rem'});