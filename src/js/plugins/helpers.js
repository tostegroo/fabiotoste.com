(function(window)
{
    var utils = {};
	utils.validateEmail = function (email) 
	{
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if(!emailReg.test(email)) 
		{
			return false;
		} else 
		{
			return true;
		}
	}
	
	utils.fitImage = function(img_width, img_height, container_width, container_height, pct, inside) 
	{
		var style = {left:0, top:0, width:0, height:0};
		var prop = (inside==true) ? container_width/container_height : img_width/img_height;
		var c_prop = (inside==true) ? img_width/img_height : container_width/container_height;
		var width = 0;
		var height = 0;
		
		if(prop>c_prop)
		{
			height = container_height;
			width = container_height * prop;
		}else
		{
			width = container_width;
			height = container_width / prop;
		}
		width = (pct==true) ? (width/container_width) * 100 : width;
		height = (pct==true) ? (height/container_height) * 100 : height;
		
		var left = (pct==true) ? (100 - width) * 0.5 : (container_width - width) * 0.5;
		var top = (pct==true) ? (100 - height) * 0.5 : (container_height - height) * 0.5;
		style =  {left:left, top:top, width:width, height:height};
		return style;
	}
		
	utils.makeSlug = function(string)
	{
		var newstring = "";
		if(string)
		{
			string = string.toString();
			newstring = string.toLowerCase();
			newstring = newstring.replaceAll('+', ' ');
			newstring = $.trim(newstring);
			newstring = newstring.replaceAll(' ', '-');
			newstring = newstring.replaceAll('//', '/');
			newstring = accent_fold(newstring);
			
			function accent_fold(s)
			{
				var ret = '';
				var accent_map = 
				{
					'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
					'ç': 'c',                                                   // c
					'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
					'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
					'ñ': 'n',                                                   // n
					'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
					'ß': 's',                                                   // s
					'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
					'ÿ': 'y'                                                    // y
				};
				if (!s) { return ''; }
				for (var i = 0; i < s.length; i++) 
				{
					ret += accent_map[s.charAt(i)] || s.charAt(i);
				}
				return ret;
			}
		}
		return	newstring;
	}

    utils.openPopup = function (url, name, width, height)
	{
        window_w = $(window).width();
        window_h = $(window).height();
        height = (height == undefined) ? 800 : height;
        width = (width == undefined) ? 500 : width;
        popup = window.open(url, '_blank','height=' + height + ', width=' + width + ', top='+((window_h-height)*0.5)+', left='+((window_w-width)*0.5)+'');
		
        if(popup)
            if (window.focus) {popup.focus()}
        else
           alert('Pop up  blocked.');
    };

    utils.getImageData = function(image) 
	{
	    var canvas = document.createElement('canvas');
	    canvas.width = image.width;
	    canvas.height = image.height;
	    var context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0);

	    return context.getImageData(0, 0, image.width, image.height);
	}

	utils.getPixel = function(imagedata, x, y) 
	{
	    var position = (x + imagedata.width * y) * 4, data = imagedata.data;
	    return {r:data[position]/255, g:data[position+1]/255, b:data[position+2]/255, a:data[ position+3]/255};
	}

	utils.getImageObject = function(src, dx, dy, scale, pivotX, pivotY)
	{
		var imageObject = {total:0, width:0, height:0, data:[]};

		if(src!=undefined && src!='')
		{
			var image = new Image();
			image.src = src;
			var imageData = utils.getImageData(image);
			
			imageObject.width = Math.floor(imageData.width/dx) + 1;
			imageObject.height = Math.floor(imageData.width/dy) + 1;

			var pWidth = imageData.width * pivotX * scale;
			var pHeight = imageData.height * pivotY * scale;
			
			for (var x=0; x<imageData.width; x+=dx) 
			{
				for (var y=0; y<imageData.height; y+=dy) 
				{
					var pixel = utils.getPixel(imageData, x, y);

					var posX = -pWidth + (x * scale);
					var distX = Math.pow(posX/pWidth, 15);
					var offsetX = distX * Math.random();

					var posY = pHeight + (-y * scale);
					var distY = Math.pow(posY/pHeight, 15);
					var offsetY = distY * Math.random();

					var dist = Math.sqrt(distX*distX + distY*distY);
					var size = 30 + (Math.random() * 50) * (1-dist);

					imageObject.data.push({x:posX, y:posY, z:Math.random(), offsetX:offsetX, offsetY:offsetY, offsetZ:-dist + (dist * Math.random() * 2), size:size, color:pixel});
				}
			}
		}

		return imageObject;
	}
    
    window.utils = utils;
}(window));

(function($)
{  
	$.fn.isLoaded = function() 
	{
		return this
			.filter("img")
			.filter(function() { return this.complete; }).length > 0;
	};
})(jQuery);

(function($)
{ 
	$.fn.loadImage = function(url, callback) 
	{
		var $_callback = (callback==undefined) ? null : callback;
		var $_elm = $(this);
		
		if($_elm.length>0)
		{
			$_elm.attr('src', url);
			if($_elm.isLoaded())
			{
				if($_callback!=null)
					$_callback();
			}else
			{
				$_elm.load(function() 
				{
					if($_callback!=null)
						$_callback();
				});
			}
		}
		else
		{
			if($_callback!=null)
				$_callback();
		}

		return $_elm;
	}
})(jQuery);;

(function($)
{ 
	$.fn.fitContainer = function(inside, callback) 
	{
		var $_callback = (callback==undefined) ? null : callback;
		var $_inside = (inside==undefined) ? false : inside;
		var $_elm = $(this);
		
		$(window).resize(function(e)
		{
			window.setTimeout(function()
			{
				fit();	
			}, 500);
			
		});
		fit();
		
		function fit()
		{
			$_elm.each(function(index, element) 
			{
				var elmm = ($(this).get(0).tagName == 'IMG') ? $(this) : $(this).find('img');
				$(this).stop(true, true).fadeOut(0);
				var ceml = $(this);
					
				if(elmm.isLoaded())
				{
					resizeImage(ceml, $_inside);
					
					if($_callback!=null)
						$_callback();
				}else
				{
					elmm.load(function() 
					{
						resizeImage(ceml, $_inside);
						
						if($_callback!=null)
							$_callback();
					});
				}
			});	
		}
		function resizeImage(element, inside)
		{
			element.attr('style','');
			element.css({width:'auto', height:'auto'});
			
			var elm_width = (element.get(0).tagName == 'IMG') ? element.width() : element.find('img').width();
			var elm_height = (element.get(0).tagName == 'IMG') ? element.height() : element.find('img').height();
			var container_width = element.parents().width();
			var container_height = element.parents().height();
			
			var style = utils.fitImage(elm_width, elm_height, container_width, container_height, false, inside);
			if(style.width!=0 && style.height!=0)
			{
				element.attr('style','');
				element.css({'position':'absolute', top:style.top, left:style.left, width:style.width, height:style.height});
				
				if(element.get(0).tagName != 'IMG')
					element.find('img').css({'width':'100%', 'height':'100%'});
			}
			element.css({'opacity':1}).stop(true, true).fadeIn(200);
		}
		
		return $_elm;
	}
})(jQuery);

(function($)
{  
	$.fn.yt_render = function(video_id, options) 
	{
		var $this = $(this);
		var $_options = $.extend(
		{
			controls:1,
			showinfo:0,
			autoplay:0,
			onStartVideo:null,
			onHalfVideo:null,
			onFinishVideo:null
		}, options);
		
		$this.player = null;
		$this.player_interval = null;
		$this.player_play = null;
		$this.container_id = $(this).attr('ID');
		$this.video_id = video_id;
		$this.$_id = getID();
		
		function render()
		{
			var v_width = $this.attr('width');
			var v_height = $this.attr('height');
			
			if($this.player==null)
			{
				$this.player = new YT.Player($this.container_id, {
					width: v_width,
					height: v_height,
					videoId: $this.video_id,
					playerVars: {
						controls: $_options.controls,
						showinfo: $_options.showinfo,
						modestbranding: 1,
						wmode: "opaque",
						autoplay: $_options.autoplay
					},
					events: {
						'onReady': onPlayerReady,
						'onStateChange' : onPlayerState
					}
				});
			}
		};
		
		function playerState(state, id) {}   
		function onPlayerReady(event) {}
		function onPlayerState(state) 
		{
			var id = state.target.getVideoUrl();
			id = id.split('v=')[1];
			var ampersandPosition = id.indexOf('&');
			if(ampersandPosition != -1) 
			{
				id = id.substring(0, ampersandPosition);
			}
			
			if (state.data == 1)
			{
				if ($this.player_play == null)
					$this.player_play = true;
					
			} else if (state.data == 0) 
			{
				if($_options.onFinishVideo!=null)
					$_options.onFinishVideo($this);
					
			}else if (state.data == 3)
			{
				if($_options.onStartVideo!=null)
					$_options.onStartVideo($this);
					
				if ($this.player_interval == null)
				{
					$this.player_interval = window.setInterval(function()
					{                        
						if ($this.player.getPlayerState() == 1)
						{
							if ($this.player.getCurrentTime() > ($this.player.getDuration() / 2))
							{
								if($_options.onHalfVideo!=null)
									$_options.onHalfVideo($this);
								
								window.clearInterval($this.player_interval);
							}
						}
					}, 1000);
				}
			}
		}
		function getID(){return '_' + Math.random().toString(36).substr(2, 9);}
		
		$this.stopVideo = function()
		{
			if($this.player != null)
				$this.player.pauseVideo();
		};
		$this.playVideo = function()
		{
			if($this.player != null)
			{
				$this.player.seekTo(0);
				$this.player.playVideo();
			}
		};
		
		render();
	};
})(jQuery);

(function($)
{
	$.fn.autogrow = function(options) 
	{
		this.filter('textarea').each(function() 
		{
			var $this       = $(this),
				minHeight   = $this.height(),
				lineHeight  = $this.css('lineHeight');
	
			var shadow = $('<div></div>').css({
				position:   'absolute',
				top:        -10000,
				left:       -10000,
				width:      $(this).width() - parseInt($this.css('paddingLeft')) - parseInt($this.css('paddingRight')),
				fontSize:   $this.css('fontSize'),
				fontFamily: $this.css('fontFamily'),
				lineHeight: $this.css('lineHeight'),
				resize:     'none'
			}).appendTo(document.body);
			var update = function() 
			{
				var times = function(string, number) 
				{
					for (var i = 0, r = ''; i < number; i ++) r += string;
					return r;
				};
	
				var val = this.value.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/&/g, '&amp;')
									.replace(/\n$/, '<br/>&nbsp;')
									.replace(/\n/g, '<br/>')
									.replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' ' });
	
				shadow.html(val);
				var step = (options.height) ? options.height : 20;
				$(this).css('height', Math.max(shadow.height() + step - step, minHeight));
			}
			$(this).change(update).keyup(update).keydown(update);
			update.apply(this);
		});
		return this;
	} 
})(jQuery);

(function($, sr)
{
	var debounce = function (func, threshold, execAsap) 
	{
		var timeout;

		return function debounced () 
		{
			var obj = this, args = arguments;
			function delayed () {
			if (!execAsap)
			func.apply(obj, args);
			timeout = null;
		};

		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 250);
		};
	}

	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');

(function($, sr)
{
	var debounce = function (func, threshold, execAsap) 
	{
		var timeout;

		return function debounced () 
		{
			var obj = this, args = arguments;
			function delayed () {
			if (!execAsap)
			func.apply(obj, args);
			timeout = null;
		};

		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 250);
		};
	}

	jQuery.fn[sr] = function(fn){  return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartscroll');

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

String.prototype.replaceAll = function(target, replacement) 
{
	return this.split(target).join(replacement);
};