var header = $('#header');
var footer = $('#footer');
var maincontainer = $('#main');
var mousescrollElm = $('#mouse-scroll');
var containerscroll = maincontainer;
var headerHeight = 0; //header.height();
var windowWidth = $(window).width();
var windowHeight = $(window).height();
var windowHalfX = windowWidth / 2;
var windowHalfY = windowHeight / 2;
var windowInnerHeight = maincontainer.height();
var mouseX = 0, mouseY = 0;
var scrolltop = 0;
var scrollpct = 0;
var loaderElm = $('#main-loader .loader-content');
var loaderMainElm = $('#main-loader');
var loaderObj = {value:0}
var mainscroll = true;

var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

$(function(window)
{
    var main = {};
	main.mobile = false;
	main.canAnimate = true;
	main.onscroll = false;
	main.containers = $('.h-container');
	main.currentPage = '';
	main.aboutOpen = false;
	main.scrollFactor = 1;
	main.views = ["portfolio", "work", "about", "home"];
	main.init = function()
	{
		main.scrollFactor = (main.mobile) ? 0 : 1;

		main.onResize();
		$(window).smartresize(main.onResize);

		main.setEvents();
		main.onScroll();

		var page = $('base').attr('data-page');
		page = (page!='') ? page : undefined;

		main.initViews(function()
		{
			var delay = (page=='about') ? 0.1 : 0;
			TweenMax.delayedCall(delay, function()
			{
				address.onChangeUrl(page);
			});

			main.closeLoader();
		});
    };

    main.setContainerTop = function()
    {
    	var cheight = 0;
    	main.containers.each(function(index, el)
		{
			var tp = cheight;
			var offset = $(this).attr('ID')=='c-portfolio' ? -windowHeight * 0.3 : 0;

			$(this).attr('data-top', tp + offset);
			cheight = tp + $(this).height();
		});
    }

    main.setScroll = function()
    {
    	if(!main.mobile)
		{
			maincontainer.mCustomScrollbar(
			{
			    axis:"y",
			    scrollInertia: 800 * main.scrollFactor,
			    mouseWheel:{deltaFactor: windowHeight/30},
			    callbacks:{
			    	onScrollStart: function()
			    	{
			    		main.onscroll = true;
			    	},
			    	onScroll: function()
			    	{
			    		main.onscroll = false;
			    	},
				    whileScrolling:function()
				    {
				    	main.onScroll(this.mcs);
				    }
				}
			});
			containerscroll = maincontainer.find('.mCSB_container');
		}
		else
		{
			containerscroll = $('body');

			$(window).unbind('scroll');
			$(window).scroll(function(e){e.preventDefault(); main.onScroll()});
		}
    }

    main.initViews = function(callback)
    {
    	if(main.views.length>0)
    	{
    		var view = main.views[0];
    		if(window[view]!=undefined)
    		{
    			window[view].init(function()
				{
					main.views.shift();
    				main.initViews(callback);
				});
    		}
    		else
    		{
    			main.views.shift();
    			main.initViews(callback);
    		}
    	}
    	else
    	{
    		if(callback!=undefined)
    			callback();
    	}
    }

    main.setEvents = function()
    {
    	$('#about-close').off().on('click', function(e)
    	{
    		if($(this).hasClass('open'))
    			main.closeAbout();
    	});

    	$('.section_link').off().on('click', function(e)
    	{
    		e.preventDefault();

    		var link = $(this).attr('data-link');
    		if(link!=undefined && link!='')
    		{
    			analytics.track("home", link);
    			address.onChangeUrl(link);
    		}

    		return false;
    	});

    	$('.social-item-home').on('click', function(e)
    	{
    		e.preventDefault();

    		if($(this).hasClass('twitter'))
    		{
    			analytics.track("home", "twitter");
    			share.shareTwitter();
    		}
    		else if($(this).hasClass('facebook'))
    		{
    			analytics.track("home", "facebook");
    			share.shareFacebook();
    		}
    		else if($(this).hasClass('gplus'))
    		{
    			analytics.track("home", "gplus");
    			share.shareGplus();
    		}

    		return false;
    	});

    	$('.footer-link').on('click', function(e)
    	{
    		var ga = $(this).attr('data-ga');
    		analytics.track("footer", ga);
    	});

		window.onpopstate = history.onpushstate = address.onChangeUrl;
    	document.addEventListener('mousemove', main.onDocumentMouseMove, false );
		//document.addEventListener('touchstart', main.onDocumentTouchStart, false );
		//document.addEventListener('touchmove', main.onDocumentTouchMove, false );
    }

    main.scrollToByID = function(id, time, offset)
	{
		time = (time==undefined) ? 1 : time;
		offset = (offset==undefined) ? 0 : offset;
		if($("#" + id).length>0)
		{
			var top = Math.floor(Number($("#" + id).attr('data-top'))) + offset;

			if(!main.mobile)
			{
				maincontainer.mCustomScrollbar("scrollTo", top,
				{
				    scrollInertia: 1500 * time
				});
			}
			else
			{
				TweenMax.to($('html, body'), 1.5 * time, {scrollTop: top, ease:Quart.easeInOut});
			}
		}
    };

    main.onDocumentMouseMove = function(e)
	{
		mouseX = e.clientX - windowHalfX;
		mouseY = e.clientY - windowHalfY;

		if(window.home!=undefined)
			home.moveMouse(e.clientX, e.clientY);

		if(window.about!=undefined)
			about.moveMouse(e.clientX, e.clientY);
	}

	main.onDocumentTouchStart = function(e)
	{
		if (e.touches.length===1)
		{
			e.preventDefault();
			mouseX = e.touches[0].pageX - windowHalfX;
			mouseY = e.touches[0].pageY - windowHalfY;

			if(window.home!=undefined)
				home.moveMouse(e.touches[0].pageX, e.touches[0].pageY);

			if(window.about!=undefined)
				about.moveMouse(e.touches[0].pageX, e.touches[0].pageY);
		}
	}
	main.onDocumentTouchMove = function(e)
	{
		if (e.touches.length===1)
		{
			e.preventDefault();
			mouseX = e.touches[0].pageX - windowHalfX;
			mouseY = e.touches[0].pageY - windowHalfY;

			if(window.home!=undefined)
				home.moveMouse(e.touches[0].pageX, e.touches[0].pageY);

			if(window.about!=undefined)
				about.moveMouse(e.touches[0].pageX, e.touches[0].pageY);
		}
	}

    main.openLoader = function(callback, time)
    {
    	loaderObj = {value:0};
		TweenMax.to(loaderObj, 3.2, {value: 4, yoyo:false, repeat:-1, ease:Linear.easeNone, onUpdate:function()
		{
			var index = Math.ceil(loaderObj.value);
			loaderElm.removeClass('s1 s2 s3 s4')
			if(index>0)
				loaderElm.addClass('s'+index);
		}});

		loaderMainElm.removeClass('closed');
    	TweenMax.delayedCall(1 * time, function()
		{
			if(callback!=undefined)
				callback();
		});
    }

    main.showLoader = function(callback)
	{
		main.openLoader(function()
		{
			if(callback!=undefined)
				callback();
		}, 1);
    };

    main.closeLoader = function()
	{
		loaderElm.removeClass('animate');

		TweenMax.killTweensOf(loaderObj);
		TweenMax.delayedCall(0.2, function()
		{
			loaderMainElm.addClass('preclose');
			TweenMax.delayedCall(0.5, function()
			{
				loaderMainElm.addClass('closed');
			});
		});
    };

    main.openAbout = function()
    {
    	address.changeUrl('about');
    	main.aboutOpen = true;

    	analytics.track("about", "view");

    	$('#c-about').addClass('open');

		var left = (main.mobile) ? 0 : 80;
		TweenMax.to($('#c-about'), 1, {left:left, ease:Quart.easeInOut});
		TweenMax.to($('#main, #header, #c-welcome'), 0.8, {left:-(windowWidth-left), ease:Quint.easeInOut});

		mainscroll = false;

		$('#about-close').addClass('open');
		main.scrollToByID('c-welcome', 0.5);

		if(window.about!=undefined)
			about.open();

		if(window.home!=undefined)
			home.canUpdate = false;
    }

    main.closeAbout = function()
    {
    	address.changeUrl('');
    	main.aboutOpen = false;

    	$('#c-about').removeClass('open');
		TweenMax.to($('#c-about'), 0.8, {left:'100%', ease:Quart.easeInOut});
		TweenMax.to($('#main, #header, #c-welcome'), 0.9, {left:0, ease:Quint.easeInOut});

		mainscroll = true;

		$('#c-about .about-close').removeClass('open');

		if(window.home!=undefined)
			home.canUpdate = true;

		TweenMax.delayedCall(0.8, function()
		{
			if(window.about!=undefined)
				about.close();
		});
    }

	main.openModal = function(page)
	{
		TweenMax.to($('#modal'), 0.4, {autoAlpha:1});
		TweenMax.to($('#modal-container'), 1, {top:"40%", ease:Elastic.easeOut});
	}

	main.closeModal = function()
	{
		TweenMax.to($('#modal'), 0.5, {autoAlpha:0});
		TweenMax.to($('#modal-container'), 0.2, {top:"20%", ease:Back.easeIn});
	}

	main.onResize = function()
	{
		windowHeight = $(window).height();
		windowWidth = $(window).width();
		windowHalfX = windowWidth / 2;
		windowHalfY = windowHeight / 2;

		main.mobile = (windowWidth<1024) ? true : false;
		main.setScroll();

		var left = (main.mobile) ? 0 : 80;

		if($('#c-about').hasClass('open'))
			TweenMax.to($('#main, #header, #c-welcome'), 0, {left:-(windowWidth-left)});
		else
			TweenMax.to($('#main, #header, #c-welcome'), 0, {left:0});

		if(window.about!=undefined)
			about.onResize();

		if(window.home!=undefined)
			home.onResize();

		if(window.portfolio!=undefined)
			portfolio.onResize();

		if(window.work!=undefined)
			work.onResize();

		main.setContainerTop();
	};

	main.onScroll = function(e)
	{
		windowInnerHeight = containerscroll.height();
		scrolltop = (e!=undefined && e.top!=undefined) ? -e.top : Number($(window).scrollTop());
		scrollpct = scrolltop/(windowInnerHeight-windowHeight);
		scrollpct = (scrollpct<0) ? 0 : scrollpct;
		scrollpct = (scrollpct>1) ? 1 : scrollpct;

		var scrollrelative = main.convertPct(0.85, 1, scrollpct);
		footer.css({bottom: (1-scrollrelative) * -350});

		var changeToPage = '';
		main.containers.each(function(index, el)
		{
			var top = Number($(this).attr('data-top'))
			if(scrolltop > top - (windowHeight * 0.5))
			{
				changeToPage = $(this).attr('data-id');
			}
		});

		if(changeToPage!=main.currentPage)
		{
			analytics.track(changeToPage, "view");

			address.changeUrl(changeToPage);
			main.currentPage = changeToPage;
		}

		if(mainscroll)
		{
			if(scrolltop>headerHeight)
				header.addClass('small');
			else
				header.removeClass('small');

			if(scrolltop>0)
				mousescrollElm.addClass('close');
			else
				mousescrollElm.removeClass('close');

			if(scrollpct>0.95)
				mousescrollElm.addClass('totalscroll');
			else
				mousescrollElm.removeClass('totalscroll');

			if(window.home!=undefined)
				home.onScroll();

			if(window.portfolio!=undefined)
				portfolio.onScroll();

			if(window.work!=undefined)
				work.onScroll();
		}
	}

	main.convertPct = function(from, to, basePct)
	{
		var difpct = to-from;
		var currPCT = basePct-from;
		currPCT  = (currPCT <0) ? 0 : currPCT;
		currPCT  = (currPCT > difpct) ? difpct : currPCT;
		currPCT = currPCT/difpct;
		return currPCT;
	}

	main.error = function()
	{
		html = "<div class=\"error-message\">Sorry, something isn't working well</div>";
		footer.after(html);
	}

    window.main = main;
}(window));

$(document).ready(function(e)
{
	main.mobile = ($('base').attr('data-type')=='mobile') ? true : false;

	preloader.initFunc = main.init;
	preloader.loadBar = $('#loader-bar').children('span');
	preloader.serverPath = root_path;
	//preloader.bypass = true;

	var tm = 0; //($('#main-loader').hasClass('nologo')) ? 1 : 3;
	main.openLoader(function()
	{
        //console.log('preloader');
		preloader.init();
	}, tm);
});
