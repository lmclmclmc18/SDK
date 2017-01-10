var page = new Page({roomId:1100,bacImg:''});
var video = page.initVideo({wrapper:'player-content',width:'100%',height:'3rem',videoSrc:'',poster:'',top:'0',left:'0'});
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
var countDown = page.initcountDown({wrapper:'time-watch-wrapper',width:'',height:'',top:'',left:''});
var watcher = page.initwatcher({wrapper:'time-watch-wrapper',width:'',height:'',top:'',left:'',img:''});
var sayGood = page.initsayGood({wrapper:'input-content',width:'',height:'',top:'',left:'',img:'',visitedImg:''});
var chat = page.initchat({wrapper:'input-content',width:'',height:'',top:'',left:''})