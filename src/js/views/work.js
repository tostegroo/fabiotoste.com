$(function(window)
{
	var work = {};
	work.this = $('#c-work');
	work.itemsPL = Math.round($('#work-gallery').width() / $('.gallery-item.work').width());
	work.totalItens = $('.gallery-item.work').length;
	work.zpos = 30;
	work.scaleX = 1;
	work.rotateY = 0;
	work.scaleY = 1;
	work.rotateX = 0;
	work.ajax = null;
	work.singlethumb = $('#single-thumb');
	work.singleclose = $('#single-close');
	work.singleloader = $('#single-loader');
	work.singleimage = null;
	work.openElm = null;
	work.loaderElm = null;
	work.loaderObj = {value:0};
	work.dummy = {value:0};
	work.singleOpen = false;

	work.init = function(callback)
	{
		$(window).smartresize(work.resize);
		$(window).scroll(work.onScroll);

		work.onResize();
		work.setEvents();

		if(callback!=undefined)
			callback();
	}

	work.setEvents = function()
	{
		$('.gallery-item.work').off().hover(function(e)
		{
			if(!main.mobile)
			{
				var leftelm = '', rightelm = '', topelm = '', bottomelm = '';
				$('.gallery-item.work').addClass('animate').addClass('overlay');
				$('.gallery-item.work').removeClass('p-top p-bottom p-left p-right p-top-left p-top-right');

				$(this).removeClass('animate').removeClass('overlay');

				var elmindex = $(this).index();
				var lineIndex = elmindex%work.itemsPL;
				var line = Math.ceil((elmindex+1)/work.itemsPL);

				if(lineIndex>0)
					leftelm = $('.gallery-item.work').get(elmindex - 1);

				if(lineIndex<work.itemsPL-1)
					rightelm = $('.gallery-item.work').get(elmindex + 1);

				if(elmindex - work.itemsPL>=0)
					topelm = $('.gallery-item.work').get(elmindex - work.itemsPL);

				if(elmindex + work.itemsPL<work.totalItens)
					bottomelm = $('.gallery-item.work').get(elmindex + work.itemsPL);

				if(topelm!='')
				{
					$(topelm).addClass('p-top');
					$(topelm).css(
					{
						'-moz-transform': 'rotateX('+work.rotateX+'deg) scale(1,'+work.scaleY+')',
						'-ms-transform': 'rotateX('+work.rotateX+'deg) scale(1,'+work.scaleY+')',
			    		'-webkit-transform': 'rotateX('+work.rotateX+'deg) scale(1,'+work.scaleY+')',
			    		'transform': 'rotateX('+work.rotateX+'deg) scale(1,'+work.scaleY+')'
					});
				}

				if(bottomelm!='')
				{
					$(bottomelm).addClass('p-bottom');
					$(bottomelm).css(
					{
						'-moz-transform': 'rotateX(-'+work.rotateX+'deg) scale(1,'+work.scaleY+')',
						'-ms-transform': 'rotateX(-'+work.rotateX+'deg) scale(1,'+work.scaleY+')',
			    		'-webkit-transform': 'rotateX(-'+work.rotateX+'deg) scale(1,'+work.scaleY+')',
			    		'transform': 'rotateX(-'+work.rotateX+'deg) scale(1,'+work.scaleY+')'
					});
				}

				if(leftelm!='')
				{
					$(leftelm).addClass('p-left');
					$(leftelm).css(
					{
						'-moz-transform': 'rotateY(-'+work.rotateY+'deg) scale('+work.scaleX+',1)',
						'-ms-transform': 'rotateY(-'+work.rotateY+'deg) scale('+work.scaleX+',1)',
			    		'-webkit-transform': 'rotateY(-'+work.rotateY+'deg) scale('+work.scaleX+',1)',
			    		'transform': 'rotateY(-'+work.rotateY+'deg) scale('+work.scaleX+',1)'
					});
				}

				if(rightelm!='')
				{
					$(rightelm).addClass('p-right');
					$(rightelm).css(
					{
						'-moz-transform': 'rotateY('+work.rotateY+'deg) scale('+work.scaleX+',1)',
						'-ms-transform': 'rotateY('+work.rotateY+'deg) scale('+work.scaleX+',1)',
			    		'-webkit-transform': 'rotateY('+work.rotateY+'deg) scale('+work.scaleX+',1)',
			    		'transform': 'rotateY('+work.rotateY+'deg) scale('+work.scaleX+',1)'
					});
				}
			}
		},
		function(e)
		{
			if(!main.mobile)
				work.hoverout();
		}).on('click', function()
		{
			id = $(this).attr('data-id');
			work.openSingle($(this), id);
		});
	}

	work.hoverout = function()
	{
		$('.gallery-item.work').removeClass('overlay p-top p-bottom p-left p-right p-top-left p-top-right');
		$('.gallery-item.work').css(
		{
			'-moz-transform': '',
			'-ms-transform': '',
    		'-webkit-transform': '',
    		'transform': ''
		});
	}

	work.loadworkContent = function(id, delay, callback)
	{
		if(work.ajax)
			work.ajax.abort();

		work.openInternalLoader(delay, function()
		{
			$('#single-content-work').html('');
			work.ajax = $.ajax(
			{
				url: root_path + "/work/work_single_content",
				data: {id: id},
				type: 'POST',
				success: function(html)
				{
					$('#single-content-work').html(html);
					work.singleimage = $('#single-img').children('img');

					var url = work.singleimage.attr('data-url');
					work.singleimage.loadImage(url, function()
					{
						if(window.navigation)
							navigation.init(work.singleimage.parent('.single-img'), work.singleimage);

						work.closeInternalLoader();

						if(callback!=undefined)
							callback();
					});
				},
				error: function(jqXHR, textStatus, errorThrown )
				{
					main.error();

					if(callback!=undefined)
						callback();
				}
			});
		});
	}

	work.setNavigation = function(elm)
	{
		elm = (elm==undefined) ? work.openElm : elm;
		var index = elm.index();

		if(index<=0)
			$('#single-prev').addClass('closed');
		else
			$('#single-prev').removeClass('closed');

		if(index>=work.totalItens-1)
			$('#single-next').addClass('closed');
		else
			$('#single-next').removeClass('closed');
	}

	work.navSingle = function(elm)
	{
		if(elm.length>0)
		{
			var id = elm.attr('data-id');

			TweenMax.to(work.openElm, 0, {autoAlpha:1});
			TweenMax.to(elm, 0, {autoAlpha:0});

			work.openElm = elm;
			work.loadworkContent(id, 0);
		}
	}

	work.openSingle = function(elm, id)
	{
		work.singleOpen = true;

		if(work.ajax)
			work.ajax.abort();

		work.ajax = $.ajax(
		{
			url: root_path + "/work/work_single",
			type: 'POST',
			success: function(html)
			{
				$('.gallery-item.work').removeClass('hover');
				work.hoverout();

				footer.after(html);

				var margin = 0;
				work.singlethumb = $('#single-thumb');
				work.singleclose = $('#single-close');
				work.singleloader = $('#single-loader');
				work.loaderElm = work.singleloader.children('.loader-content');

				work.openElm = elm;

				var thumbPosLeft = (!main.mobile) ? elm.offset().left : elm.offset().left;
				var thumbPosTop = (!main.mobile) ? elm.offset().top : elm.offset().top - containerscroll.scrollTop();

				work.singlethumb.css({top: thumbPosTop, left: thumbPosLeft, width: elm.width(), height: elm.height()});
				TweenMax.to(work.singlethumb, 0, {autoAlpha:0});

				TweenMax.to(work.singlethumb, 0.35, {autoAlpha:1, ease:Quint.easeInOut, delay:0.2, onComplete:function(){TweenMax.to(elm, 0, {autoAlpha:0});}});

				var tWidth = (main.mobile) ? 80 : elm.width();
				TweenMax.to(work.singlethumb, 0.6, {top:margin, left:margin, width:tWidth, delay:0.6, ease:Quint.easeInOut});

				TweenMax.to(work.singlethumb, 0.3, {height: '100%', delay:1.4, ease:Quart.easeInOut});
				TweenMax.to(work.singlethumb, 0.6, {width: '100%', delay:1.7, ease:Quart.easeInOut});

				var cWidth = (main.mobile) ? 48 : 80;
				var cRight = (main.mobile) ? 20 : 50;
				var cTop = (main.mobile) ? 0 : 50;

				TweenMax.to(work.singleclose, 0.2, {width: cWidth, delay:2, ease:Quint.easeInOut});
				TweenMax.to(work.singleclose, 0.6, {right: cRight, top: cTop, 'margin-right':0, 'margin-top':0, delay:2.2, ease:Quart.easeInOut});

				$('.single-nav').off().hover(function(e)
				{
					var parent = $(this);
					var elm = $(this).children('span');
					TweenMax.to(elm, 0.2, {height:0, ease:Quint.easeInOut, onComplete:function()
					{
						var angle = (parent.hasClass('next')) ? '45deg' : '-45deg';

						if(parent.hasClass('next'))
							TweenMax.to(elm, 0, {left:'80%', 'border-color':'#22bfbf', rotation: angle});
						else
							TweenMax.to(elm, 0, {right:'80%', 'border-color':'#22bfbf', rotation: angle});

						TweenMax.to(elm, 0.3, {height:'50%', ease:Quint.easeInOut});
					}});
				}, function(e)
				{
					var parent = $(this);
					var elm = $(this).children('span');
					TweenMax.to(elm, 0.2, {height:0, ease:Quint.easeInOut, onComplete:function()
					{
						if(parent.hasClass('next'))
							TweenMax.to(elm, 0, {left:'0%', 'border-color':'#000', rotation: '0deg'});
						else
							TweenMax.to(elm, 0, {right:'0%', 'border-color':'#000', rotation: '0deg'});

						TweenMax.to(elm, 0.3, {height:'50%', ease:Quint.easeInOut});
					}});
				}).on('click', function()
				{
					if(!$(this).hasClass('disabled') && work.openElm!=null)
					{
						if($(this).hasClass('next'))
							work.navSingle(work.openElm.next());
						else if($(this).hasClass('prev'))
							work.navSingle(work.openElm.prev());
					}
				});

				work.loadworkContent(id, 2.2);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				main.error();
			}
		});
	}

	work.closeSingle = function()
	{
		work.singleOpen = false;
		var time = work.singleloader.hasClass('onscreen') ? 1 : 0;

		work.closeInternalLoader(time, false, function()
		{
			$('#single-label').addClass('closed');
			$('.single-nav').addClass('closed');
			$('.gallery-item.work').addClass('hover');

			TweenMax.killTweensOf(work.singleclose);
			TweenMax.killTweensOf(work.singlethumb);
			TweenMax.killTweensOf(work.openElm);
			TweenMax.killTweensOf(work.singleloader);
			TweenMax.killTweensOf(work.dummy);

			if(window.navigation!=undefined)
				navigation.destroy();

			if(work.singleimage!=null)
				TweenMax.to(work.singleimage, 0.5, {autoAlpha:0, ease:Sine.easeInOut});

			TweenMax.to(work.singleclose, 0.3, {top:-80, autoAlpha:0, ease:Quart.easeInOut});

			var thumbPosLeft = (!main.mobile) ? work.openElm.offset().left : work.openElm.offset().left;
			var thumbPosTop = (!main.mobile) ? work.openElm.offset().top : work.openElm.offset().top - containerscroll.scrollTop();

			TweenMax.to(work.singlethumb, 0.5, {top: thumbPosTop, left: thumbPosLeft, width: work.openElm.width(), height: work.openElm.height(), delay:0.5, ease:Quint.easeInOut});
			TweenMax.to(work.openElm, 0, {autoAlpha:1});

			TweenMax.to(work.singlethumb, 0.3, {autoAlpha:0, delay:1.1, ease:Sine.easeInOut, onComplete:function()
			{
				$('#work-single').remove();
				work.openElm = null;
				work.singleimage = null;
			}});
		});
	}

	work.openInternalLoader = function(delay, callback)
	{
		delay = (delay==undefined) ? 0 : delay;

		work.singleclose.off();
		work.singleclose.removeClass('open');

		$('#single-label').addClass('closed');
		$('.single-nav').addClass('closed');

		if(!work.singleloader.hasClass('onscreen'))
		{
			TweenMax.to(work.singleloader.children('.loader-content'), 0, {left:""});
			TweenMax.to(work.singleloader, 0, {left: 0, width: 0});
		}

		if(work.loaderElm!=null)
		{
			work.loaderObj = {value:0};
			TweenMax.to(work.loaderObj, 3.2, {value: 4, yoyo:false, repeat:-1, ease:Linear.easeNone, onUpdate:function()
			{
				var index = Math.ceil(work.loaderObj.value);
				work.loaderElm.removeClass('s1 s2 s3 s4')
				if(index>0)
					work.loaderElm.addClass('s'+index);
			}});
		}

		work.dummy.value = 0;
		TweenMax.to(work.dummy, delay, {value:1, onComplete:function()
		{
			work.singleloader.addClass('open');
			TweenMax.to(work.singleloader, 0.8, {width: windowWidth, ease:Quint.easeInOut, onComplete:function()
			{
				work.singleloader.addClass('onscreen');

				if(callback!=undefined)
					callback();
			}});
		}});
	}

	work.closeInternalLoader = function(time, openhud, callback)
	{
		if(!work.singleloader.hasClass('close'))
		{
			time = (time==undefined) ? 1 : time;
			openhud = (openhud==undefined) ? true : openhud;
			work.singleloader.addClass('close');

			TweenMax.to(work.singleloader.children('.loader-content'), 0.8 * time, {left: -(windowWidth/2), delay:0.2 * time, ease:Quart.easeInOut});
			TweenMax.to(work.singleloader, 0.8 * time, {left: windowWidth, width: 0, delay:0.2 * time, ease:Quart.easeInOut, onComplete:function()
			{
				work.singleloader.removeClass('onscreen');

				if(openhud)
				{
					$('#single-label').removeClass('closed');
					work.setNavigation();
				}

				if(work.loaderElm!=null)
					TweenMax.killTweensOf(work.loaderElm);

				TweenMax.killTweensOf(work.loaderObj);

				work.singleclose.addClass('open');
				work.singleclose.off().on('click', function()
				{
					work.closeSingle();
				});

				work.singleloader.removeClass('close').removeClass('open');

				if(callback!=undefined)
					callback();
			}});
		}
		else
		{
			if(callback!=undefined)
				callback();
		}
	}

	work.onResize = function()
	{
		var itemWidth = $('.gallery-item.work').width();
		$('.gallery-item.work').css({height: itemWidth});

		var itemHeight = itemWidth;
		work.itemsPL = Math.round($('#work-gallery').width() / itemWidth);

		work.scaleX = Math.sqrt(work.zpos * work.zpos + itemWidth * itemWidth) / itemWidth;
		work.rotateY = Math.atan2(work.zpos, itemWidth) * 180 / Math.PI;

		work.scaleY = Math.sqrt(work.zpos * work.zpos + itemHeight * itemHeight) / itemHeight;
		work.rotateX = Math.atan2(work.zpos, itemHeight) * 180 / Math.PI;

		if(work.singleOpen)
		{
			var cWidth = (main.mobile) ? 48 : 80;
			var cRight = (main.mobile) ? 20 : 50;
			var cTop = (main.mobile) ? 0 : 50;

			TweenMax.to(work.singleclose, 0, {width: cWidth});
			TweenMax.to(work.singleclose, 0, {right: cRight, top: cTop, 'margin-right':0, 'margin-top':0});

			if(window.navigation)
				navigation.zoom(0, 0);
		}
	};

	work.onScroll = function(e){}

	window.work = work;
}(window));
