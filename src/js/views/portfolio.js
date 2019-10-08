$(function(window)
{
	var portfolio = {};
	portfolio.ajax = null;
	portfolio.this = $('#c-portfolio');
	portfolio.title = $('#p-title-portfolio');
	portfolio.mt = 0;
	portfolio.scrolltop = 0;
	portfolio.itemsPL = Math.round($('#portfolio-gallery').width() / $('.gallery-item').width());
	portfolio.totalItens = $('.gallery-item.portfolio').length;
	portfolio.yDivs = 1;
	portfolio.xDivs = 1;
	portfolio.points = 3;
	portfolio.singlethumb = $('#single-thumb');
	portfolio.singleclose = $('#single-close');
	portfolio.singleloader = $('#single-loader');
	portfolio.singlecontent = $('.single-content');
	portfolio.openElm = null;
	portfolio.containerscroll = null;
	portfolio.imagesData = [];
	portfolio.currentIndex = -1;
	portfolio.totalPixels = 0;
	
	portfolio.init = function(callback)
	{
		//if(!main.mobile)
			//portfolio.createFragments($('.gallery-item.portfolio').children('.gi-img'));

		$('.gallery-item.portfolio').each(function(index, el) 
		{
			var img = $(this).children('.gi-img').children('img').attr('src');
			var title = $(this).find('.title').children('span').html();
			var subtitle = $(this).find('.client').children('span').html();
			
			portfolio.imagesData.push({index:index, image:utils.getImageObject(img, 6, 5, 1, 0.5, 0.5), info:{title:title, subtitle:subtitle}});
		});

		if(portfolio.imagesData.length>0)
			portfolio.totalPixels = portfolio.imagesData[0].image.data.length;

		portfolio.setEvents();
		portfolio.onResize();

		if(callback!=undefined)
			callback();
	}

	portfolio.setEvents = function()
	{
		$('.gallery-item.portfolio').off().hover(function(e) 
		{
			var elm = $(this).children('.gi-img');
			elm.children('.slice').each(function(i, e)
			{
				TweenMax.to($(this).children('img'), 0.4, {top:0, left:0, ease:Quart.easeOut});
			});
		}, 
		function(e) 
		{
			var elm = $(this).children('.gi-img');
			elm.children('.slice').each(function(i, e) 
			{
				var sidex = i%2==0 ? -1 : 1;
				var sidey = i%2==0 ? 1 : 1;
				TweenMax.to($(this).children('img'), 0.4, {top: (sidey * (10 + (Math.random() * 20))), left: (sidex * (10 + (Math.random() * 20))), ease:Quart.easeOut});
			});
		}).on('click', function()
		{
			id = $(this).attr('data-id');
			portfolio.openSingle($(this), id);
		});
	}

	portfolio.setScroll = function()
	{
		if(!main.mobile)
		{
			$("#single-content-portfolio").mCustomScrollbar(
			{
			    axis:"y",
			    scrollInertia: 600,
			    mouseWheel:{deltaFactor: windowHeight/30},
			    callbacks:{
				    whileScrolling:function()
				    {
				    	portfolio.onScroll(this.mcs);
				    }
				}
			});
			portfolio.containerscroll = $('#single-content-portfolio').find('.mCSB_container');
		}
		else
		{
			portfolio.containerscroll = $('#single-content-portfolio');
			portfolio.containerscroll.off().scroll(function(e){e.preventDefault(); about.onScroll()});
		}
	}

	portfolio.openSingle = function(elm, id)
	{
		if(portfolio.ajax)
			portfolio.ajax.abort();

		portfolio.ajax = $.ajax(
		{
			url: root_path + "/portfolio/portfolio_single",
			data: {id: id},
			type: 'POST',
			success: function(html) 
			{
				elm.removeClass('hover');
				elm.children('.gi-img').children('.slice').each(function(i, e)
				{
					TweenMax.to($(this).children('img'), 0, {top:0, left:0});
				});

				footer.after(html);

				var margin = 0;
				portfolio.singlethumb = $('#single-thumb');
				portfolio.singleclose = $('#single-close');
				portfolio.singleloader = $('#single-loader');
				portfolio.singlecontent = $('.single-content');
				portfolio.openElm = elm;

				var thumbPosLeft = (!main.mobile) ? elm.offset().left : elm.offset().left;
				var thumbPosTop = (!main.mobile) ? (windowHeight - elm.height())/2 : elm.offset().top - containerscroll.scrollTop();
				var thumbAlpha = (!main.mobile) ? 0 : 0.5;
				var thumbScale = (!main.mobile) ? 0.5 : 1;
				var thumbTime = (!main.mobile) ? 0.8 : 0.6;

				TweenMax.to(portfolio.singlethumb, 0, {autoAlpha:0, top: thumbPosTop, left: thumbPosLeft, width: elm.width(), height: elm.height(), scale:thumbScale});

				var imgthumb = elm.children('.gi-img').children('img').attr('src');
				$('#single-thumb').html('<img src="'+imgthumb+'"></img>');

				var left = 0;
				var top = 0;
				if(windowWidth>windowHeight)
				{
					left = 0;
					top = -((windowWidth * 0.7) - windowHeight) / 2;
				}
				else
				{
					left = -((windowHeight * 1.428) - windowWidth) / 2;
					top = 0;
				}
				TweenMax.to(portfolio.singlethumb.children('img'), 0.6, {left:left, top:top, delay:thumbAlpha, ease:Quint.easeInOut});
				
				if(main.mobile)				
					TweenMax.to(portfolio.singlethumb, 0.35, {autoAlpha:1, ease:Quint.easeInOut, onComplete:function(){TweenMax.to(elm, 0, {autoAlpha:0});}});

				TweenMax.to(portfolio.singlethumb, thumbTime, {autoAlpha:1, scale:1, top:margin, left:margin, width: '100%', height: '100%', delay:thumbAlpha, ease:Quint.easeInOut});

				portfolio.setScroll();

				var cWidth = (main.mobile) ? 48 : 80;
				var cRight = (main.mobile) ? 20 : 50;
				var cTop = (main.mobile) ? 0 : 50;
				
				TweenMax.to(portfolio.singleclose, 0.2, {width: cWidth, delay:0.9, ease:Quint.easeInOut});
				TweenMax.to(portfolio.singleclose, 0.6, {right: cRight, top: cTop, 'margin-right':0, 'margin-top':0, delay:1.1, ease:Quart.easeInOut});
				TweenMax.to(portfolio.singlecontent, 0.8, {top:0, delay:1.2, ease:Quart.easeInOut, onComplete:function()
				{
					portfolio.singleclose.addClass('open');
					portfolio.singleclose.off().on('click', function()
					{
						portfolio.closeSingle();
					});
				}});
			},
			error: function(jqXHR, textStatus, errorThrown) 
			{
				main.error();
			}
		});	
	}

	portfolio.closeSingle = function()
	{
		portfolio.scrollTo(0, 0.4, function()
		{	
			TweenMax.killTweensOf(portfolio.singleclose);
			TweenMax.killTweensOf(portfolio.singlethumb);
			TweenMax.killTweensOf(portfolio.openElm);
			TweenMax.killTweensOf(portfolio.singlecontent);

			$('#project-link').removeClass('open');

			TweenMax.to(portfolio.singlethumb, 0.6, {top: 0, left: 0, ease:Quart.easeInOut});
			TweenMax.to(portfolio.singleclose, 0.2, {autoAlpha:0, ease:Quart.easeInOut});
			TweenMax.to(portfolio.singlecontent, 0.8, {top:'100%', ease:Quart.easeInOut});

			TweenMax.to(portfolio.singlethumb.children('img'), 0.7, {left:0, top:0, delay:0.8, ease:Quint.easeInOut});

			var thumbPosLeft = (!main.mobile) ? portfolio.openElm.offset().left : portfolio.openElm.offset().left;
			var thumbPosTop = (!main.mobile) ? (windowHeight - portfolio.openElm.height())/2 : portfolio.openElm.offset().top - containerscroll.scrollTop();
			var thumbAlpha = (!main.mobile) ? 0 : 1;
			var thumbScale = (!main.mobile) ? 0.5 : 1;
			var thumbTime = (!main.mobile) ? 0.8 : 0.7;

			TweenMax.to(portfolio.singlethumb, thumbTime, {scale:thumbScale, alpha:thumbAlpha, top: thumbPosTop, left: thumbPosLeft, width: portfolio.openElm.width(), height: portfolio.openElm.height(), delay:0.8, ease:Quint.easeInOut});

			portfolio.openElm.children('.gi-img').children('.slice').each(function(i, e)
			{
				TweenMax.to($(this).children('img'), 0, {top:0, left:0});
			});

			TweenMax.to(portfolio.openElm, 0, {autoAlpha:1, delay:1});
			TweenMax.to(portfolio.singlethumb, 0.3, {autoAlpha:0, delay:1.3, ease:Sine.easeInOut, onComplete:function()
			{
				portfolio.openElm.addClass('hover');

				portfolio.openElm.children('.gi-img').children('.slice').each(function(i, e)
				{
					var sidex = i%2==0 ? -1 : 1;
					var sidey = i%2==0 ? 1 : 1;
					TweenMax.to($(this).children('img'), 0.4, {top: (sidey * (10 + (Math.random() * 20))), left: (sidex * (10 + (Math.random() * 20)))});
				});

				portfolio.openElm = null;
				$('#portfolio-single').remove();
			}});
		});
	}

	portfolio.scrollTo = function(to, time, callback)
	{
		time = (time==undefined) ? 1 : time;
		var top = to;
		if(!main.mobile)
		{
			$("#single-content-portfolio").mCustomScrollbar("scrollTo", top, 
			{
			    scrollInertia: 1500 * time
			});

			if(callback!=undefined)
				TweenMax.delayedCall(1.5 * time, callback);
		}
		else
		{
			TweenMax.to(portfolio.containerscroll, 1.5 * time, {scrollTop: top, ease:Quart.easeInOut, onComplete: callback});
		}
	}

	portfolio.destroyFragments = function(elm)
	{
		elm.remove();
	}

	portfolio.createFragments = function(elm)
	{
		elm.each(function(i, e) 
		{
			var vertices = portfolio.getVertices();
        	var triangles = triangulate(vertices);

			var img = $(this).children('img').attr('src');
			for (var i = 0; i < triangles.length; i++) 
        	{
				var p1 = {x:triangles[i].v0.x, y:triangles[i].v0.y};
				var p2 = {x:triangles[i].v1.x, y:triangles[i].v1.y};
				var p3 = {x:triangles[i].v2.x, y:triangles[i].v2.y};

				var pathString = 'polygon('+p1.x+'% '+p1.y+'%,'+p2.x+'% '+p2.y+'%, '+p3.x+'% '+p3.y+'%)';

				var $img = $("<img>", {src: img});
				var $slice = $("<span>", {class: "slice", css:{
					'-webkit-clip-path': pathString,
					'clip-path': pathString
				}}).append($img);

				$(this).append($slice);

				var sidex = i%2==0 ? -1 : 1;
				var sidey = i%2==0 ? 1 : 1;

				TweenMax.to($($slice), 0, {translateZ: (sidey * (30 + (Math.random() * 60)))});
				TweenMax.to($($slice).children('img'), 0, {top: (sidey * (10 + (Math.random() * 20))), left: (sidex * (10 + (Math.random() * 20)))});
			}
		});
	}

	portfolio.getVertices = function()
	{
		var vertices = [];

		vertices.push(new Vertex(0, 0));
		vertices.push(new Vertex(100, 0));
		vertices.push(new Vertex(0, 100));
		vertices.push(new Vertex(100, 100));

		for (var i = 0; i < portfolio.xDivs; i++)
		{
			vertices.push(new Vertex(5 + (Math.random() * 90), 0));
			vertices.push(new Vertex(5 + (Math.random() * 90), 100));
		}

		for (var i = 0; i < portfolio.yDivs; i++)
		{
			vertices.push(new Vertex(0, 5 + (Math.random() * 90)));
			vertices.push(new Vertex(100, 5 + (Math.random() * 90)));
		}

		for (var i = 0; i < portfolio.points; i++)
        	vertices.push(new Vertex(5 + (Math.random() * 90), 5 + (Math.random() * 90)));

        return vertices;
	}

	portfolio.onResize = function()
	{
		portfolio.setScroll();

		if(window.home!=undefined)
		{
			portfolio.mt = home.canvasHeight + 60;
			portfolio.this.css({'margin-top':portfolio.mt});
		}

		var itemWidth = $('.gallery-item.portfolio').width();
		$('.gallery-item.portfolio').css({height: itemWidth * 0.7});

		portfolio.itemsPL = Math.round($('#portfolio-gallery').width() / $('.gallery-item.portfolio').width());

		if(windowWidth<1024)
		{
			if(window.home!=undefined)
				home.setImageObject(null);
		}
		else
		{
			portfolio.onScroll();
		}
	};

	portfolio.onScroll = function(e)
	{
		var portfolioTop = portfolio.this.offset().top;

		if(e!=undefined && portfolio.containerscroll!=null)
		{
			var windowInnerHeight = portfolio.containerscroll.height();
			portfolio.scrolltop = (e!=undefined && e.top!=undefined) ? -e.top : Number(portfolio.containerscroll.scrollTop());

			var offsettop = (main.mobile) ? -30 : 0;
			$('#single-cbg-span').css({top:offsettop + (-portfolio.scrolltop)});
			$('#single-thumb').css({top:-portfolio.scrolltop * 0.2});
		}
		
		var portfolioScrollTop = (e!=undefined && e.top!=undefined) ? -e.top : 0;
		if(portfolioScrollTop>windowHeight)
			$('#project-link').addClass('open');
		else
			$('#project-link').removeClass('open');

		if(!main.mobile)
		{
			var giIndex = -1;
			var galeryimage = null;
			var offset = -windowHeight * 0.8;
			$('.gallery-item.portfolio').each(function(index, el) 
			{
				var size = -$(this).height();

				var calc = $(this).position().top + portfolio.mt - scrolltop + offset;
				if(calc<0 && calc> size)
				{
					galeryimage = portfolio.imagesData[index];
					giIndex = index;
					return false;
				}
			});

			if(giIndex!=portfolio.currentIndex)
			{
				if(window.home)
					home.setImageObject(galeryimage);

				portfolio.currentIndex = giIndex;
			}

			var toffset = windowHeight-((windowHeight*0.12))-140;
			if(portfolioTop<toffset)
				portfolio.title.css({top:toffset-portfolioTop});

			if(-portfolio.this.offset().top>(portfolio.this.height() - windowHeight))
			{
				if(!portfolio.title.hasClass('out'))
				{
					portfolio.title.addClass('out');
					TweenMax.to(portfolio.title, 0.8, {left:-600, ease:Quart.easeInOut});
				}
			}
			else
			{
				if(portfolio.title.hasClass('out'))
				{
					portfolio.title.removeClass('out');
					TweenMax.to(portfolio.title, 0.8, {left:0, ease:Quart.easeOut});
				}
			}
		}
		else
		{
			portfolio.title.css({top:''});
		}
	}	
	window.portfolio = portfolio;
}(window));