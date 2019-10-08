var preloader = 
{
	overlay: "",
	loadBar: "",
	loadMask: "",
	loadText: "",
	preloader: "",
	looped:0,
	delay: 0,
	items: new Array(),
	done: false,
	doneStatus: 0,
	doneNow: 0,
	selectorPreload: "body",
	ieLoadFixTime: 2000,
	ieTimeout: "",
	initFunc: null,
	serverPath: "",
	bypass:false,
	
	init: function() 
	{
		if(preloader.bypass==true)
		{
			preloader.doneLoad();
		}
		else
		{
			if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") 	
				return false;
			
			if (preloader.selectorPreload == "body") 
			{
				preloader.spawnLoader();
				preloader.getImages(preloader.selectorPreload);
				preloader.createPreloading();
			} else 
			{
				$(document).ready(function() 
				{
					preloader.spawnLoader();
					preloader.getImages(preloader.selectorPreload);
					preloader.createPreloading();
				});
			}
			
			//help IE drown if it is trying to die :)
			preloader.ieTimeout = setTimeout("preloader.ieLoadFix()", preloader.ieLoadFixTime);
		}
	},
	
	ieLoadFix: function() 
	{
		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
		if (ie!=null && ie[0].match("MSIE")) 
		{
			while ((100 / preloader.doneStatus) * preloader.doneNow < 100) 
			{
				preloader.imgCallback();
			}
		}
	},
	
	imgCallback: function() 
	{
		preloader.doneNow ++;
		preloader.animateLoader();
	},
	
	getImages: function(selector) 
	{
		var everything = $(selector).find("*:not(script)").each(function() 
		{
			var url = "";
			var type = $(this)[0].tagName;

			if ($(this).css("background-image") != "none") 
			{
				var url = $(this).css("background-image");
			} else if (type!="SOURCE" && typeof($(this).attr("src")) != "undefined") 
			{
				var url = $(this).attr("src");
			}
			
			url = url.replace("url(\"", "");
			url = url.replace("url(", "");
			url = url.replace("\")", "");
			url = url.replace(")", "");
	
			if (
				url.indexOf(preloader.serverPath)!=-1 && 
				preloader.items.indexOf(url)==-1 && 
				url.match(/\.(jpg|jpeg|png|gif)$/) && 
				url.length > 0
			) 
			{
				preloader.items.push(url);
			}
		});
	},
	
	createPreloading: function() 
	{
		preloader.preloader = $("<div></div>").appendTo(preloader.selectorPreload);
		$(preloader.preloader).css(
		{
			height: 	"0px",
			width:		"0px",
			overflow:	"hidden"
		});
		
		var length = preloader.items.length; 
		preloader.doneStatus = length;

		preloader.looped = 0;
		preloader.loopImages();
		
		if(length==0)
		{
			preloader.doneStatus = 100;
			preloader.doneNow = 100;
			preloader.animateLoader();
			
			if(preloader.done==false)
				preloader.doneLoad();
		}
	},

	loopImages :function ()
	{
		var length = preloader.items.length;
		if(preloader.looped<length)
		{
			var imgLoad = $("<img></img>");
			$(imgLoad).attr("src", preloader.items[preloader.looped]);

			if($(imgLoad).isLoaded())
			{
				preloader.imgCallback();
			}
			else
			{
				$(imgLoad).off().load(function()
				{
					preloader.imgCallback();
				});
			}
			
			$(imgLoad).appendTo($(preloader.preloader));

			setTimeout(preloader.loopImages, 10);
			preloader.looped++;
		}
	},

	spawnLoader: function(){},
	animateLoader: function() 
	{
		var perc = (100 / preloader.doneStatus) * preloader.doneNow;

		if (perc > 99) 
		{
			if(preloader.loadText!="")
				preloader.loadText.html(Math.floor(perc) + "%");
			
			if(preloader.loadBar!="")
				preloader.loadBar.css({width: perc + "%"});

			if(preloader.loadMask!="")
				preloader.loadMask.css({height: perc + "%"});
				
			if(preloader.done==false)
				preloader.doneLoad();
		} else 
		{
			if(preloader.loadText!="")
				preloader.loadText.html(Math.floor(perc) + "%");
				
			if(preloader.loadBar!="")
				preloader.loadBar.css({width: perc + "%"});

			if(preloader.loadMask!="")
				preloader.loadMask.css({height: perc + "%"});
		}
	},
	
	doneLoad: function() 
	{
		clearTimeout(preloader.ieTimeout);
		preloader.done = true;
		
		if(preloader.initFunc!=null)
			preloader.initFunc(1);
	}
}