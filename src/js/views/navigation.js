$(function(window)
{
	var navigation = {};
	navigation.container = null;
	navigation.element = null;
	navigation.position = {x:0, y:0};
	navigation.targetposition = {x:0, y:0};
	navigation.inertia = 0.1;
	navigation.inertiaOffset = 0.01;
	navigation.wheelstep = 100;
	navigation.keystep = 100;
	navigation.offset = {x:0, y:0, max:{x:0, y:0}, min:{x:0, y:0}};
	navigation.dragpos = {x:0, y:0};
	navigation.curpos = {x:0, y:0};
	navigation.useinertiaoffset = false;
	navigation.dragging = false;
	navigation.zoomvalue = 0;
	navigation.canzoom = true;

	navigation.init = function(container, element, callback)
	{
		navigation.container = container;
		navigation.element = element;

		navigation.container.focus();
		$(window).focus();

		navigation.container.on('mousedown', function(e) 
		{
			e.stopPropagation();

			$(this).focus();
			$(window).focus();
			
			navigation.dragging = true;
			navigation.dragpos = {x:e.clientX, y:e.clientY};
			navigation.curpos = {x:navigation.element.position().left , y: navigation.element.position().top};

		}).on('mouseup', function(e)
        {
        	e.stopPropagation();

        	navigation.dragging = false;

        }).on('mousemove', function(e)
        {
        	e.preventDefault();

        	var dragx = e.clientX - navigation.dragpos.x + navigation.curpos.x;
        	var dragy = e.clientY - navigation.dragpos.y + navigation.curpos.y;
      
        	if(navigation.dragging)
        	{
        		navigation.targetposition.y = dragy;
        		navigation.targetposition.x = dragx;
        	}
        }).on('dblclick', function(e)
        {
        	e.preventDefault();

        	if(navigation.canzoom)
        	{
	        	if(navigation.zoomvalue==0)
	        		navigation.zoom(1, 0.4);
	        	else
	        		navigation.zoom(0, 0.4);
	        }
        })

		$(window).on('keydown', function(e)
        {
            if(e.keyCode==39)
               navigation.targetposition.x = navigation.position.x - navigation.keystep;

            if(e.keyCode==37)
	            navigation.targetposition.x = navigation.position.x + navigation.keystep;

            if(e.keyCode==38)
                navigation.targetposition.y = navigation.position.y + navigation.keystep;
            
            if(e.keyCode==40)
                navigation.targetposition.y = navigation.position.y - navigation.keystep;
        }).on('mouseup', function(e)
        {
        	e.stopPropagation();
        	
        	navigation.dragging = false;

        }).on('resize', function()
        {
            navigation.resize();
        }).on('mousewheel', function(event, delta) 
        {
            event.preventDefault();
            event.stopPropagation();
            navigation.targetposition.y = navigation.position.y + (delta * navigation.wheelstep);
        });

        navigation.resize();
        navigation.zoom(0, 0);
        navigation.render();

        if(callback!=undefined)
			callback();
	}

	navigation.render = function()
	{
		if(navigation.zoomvalue>=1)
		{
			if(!navigation.useinertiaoffset)
	        {
	        	navigation.targetposition.y = (navigation.targetposition.y>navigation.offset.max.y) ? navigation.offset.max.y : navigation.targetposition.y;
	        	navigation.targetposition.y = (navigation.targetposition.y<navigation.offset.min.y) ? navigation.offset.min.y : navigation.targetposition.y;

	        	navigation.targetposition.x = (navigation.targetposition.x>navigation.offset.max.x) ? navigation.offset.max.x : navigation.targetposition.x;
	        	navigation.targetposition.x = (navigation.targetposition.x<navigation.offset.min.x) ? navigation.offset.min.x : navigation.targetposition.x;
	        }

			navigation.position.y += (navigation.targetposition.y - navigation.position.y) * navigation.inertia;
			navigation.position.x += (navigation.targetposition.x - navigation.position.x) * navigation.inertia;

	        navigation.element.css({top:navigation.position.y, left:navigation.position.x});

	        if(navigation.useinertiaoffset)
	        {
				navigation.targetposition.y *= (navigation.targetposition.y>navigation.offset.max.y) ? navigation.inertiaOffset : 1;
				navigation.targetposition.x *= (navigation.targetposition.x>navigation.offset.max.x) ? navigation.inertiaOffset : 1;
	        }
	    }

		window.requestAnimationFrame(navigation.render);
	}

	navigation.zoom = function(zoom, time)
	{
		navigation.canzoom = false;

		var top, left, width, height;
		var prop = Number(navigation.element.attr('data-prop'));
		var winprop = windowWidth/windowHeight;

		if(zoom==0)
		{
			if(prop>winprop)
			{
				width = windowWidth;
				height = windowWidth/prop;
			}
			else
			{
				width = windowHeight * prop;
				height = windowHeight;
			}
		}
		else if(zoom==1)
		{
			width = windowWidth;
			height = windowWidth/prop;
		}

		top = (windowHeight-height)/2;
		top = (zoom==1&&top<0) ? 0 : top;

		left = (windowWidth-width)/2;
		left = (zoom==1&&left<0) ? 0 : left;

		TweenMax.to(navigation.element, time, {top:top, left:left, width:width, height:height, ease:Quart.easeInOut, onComplete:function()
		{
			navigation.zoomvalue = zoom;
			navigation.canzoom = true;

			navigation.resize();
		}});
	}

	navigation.resize = function()
	{
		if(navigation.zoomvalue>=1)
		{
			navigation.offset.y = navigation.container.height() - navigation.element.height();
			navigation.offset.min.y = navigation.offset.y;

			navigation.offset.x = navigation.container.width() - navigation.element.width();
			navigation.offset.min.x = navigation.offset.x;

			navigation.position.y = navigation.targetposition.y = 0;
			navigation.position.x = navigation.targetposition.x = 0;
		}
	}

	navigation.update = function()
	{
		navigation.resize();
	}

	navigation.destroy = function()
	{
		$(window).off('keydown', 'mouseup', 'mousewheel');
	}

	window.navigation = navigation;
}(window));