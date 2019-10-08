$(function(window)
{
	var about = {};
	about.this = $('#c_about');
	about.head = new THREE.Object3D();
	about.backgroundElm = $('#about-background');
	about.scrollElm = $('#about-scroll');
	about.canvasWidth = windowWidth-80;
	about.canvasHeight = windowHeight;
	about.mousePos3D = new THREE.Vector3();
	about.mousePos = new THREE.Vector3();
	about.smoothmousePos = new THREE.Vector3();
	about.smoothmousePos3D = new THREE.Vector3();
	about.containerscroll = about.this;
	about.head;
	about.background = null;
	about.canFollow = false;
	about.canUpdate = false;
	about.pointlight = null;
	about.ambient = null;
	about.lightOn = true;
	about.backgroundColor = {alpha:1, color:0x22bfbf};

	var slices = {x:28, y:8};
	var size = {x:1800, y:600};
	var limitx = {min:-0.2, max:0.2};
	var limity = {min:-0.2, max:0.2};
	var d = {x:size.x/slices.x, y:size.y/slices.y, z:60};
	var angle = 0;
	
	about.init = function(callback)
	{
		about.canvasWidth = (main.mobile) ? windowWidth : windowWidth-80;
		
		about.onScroll();
		
		$('#switchButton').off().on('click', function()
		{
			about.toggleLight();
		});

		$('#about-scroll').off().on('click', function()
		{
			about.scrollTo(windowHeight);
		});

		about.ini3D(callback);
	}

	about.scrollTo = function(to, time, callback)
	{
		time = (time==undefined) ? 1 : time;
		var top = to;
		if(!main.mobile)
		{
			$("#about-content").mCustomScrollbar("scrollTo", top, 
			{
			    scrollInertia: 1000 * time
			});

			if(callback!=undefined)
				TweenMax.delayedCall(1.5 * time, callback);
		}
		else
		{
			TweenMax.to(about.containerscroll, 1 * time, {scrollTop: top, ease:Quart.easeInOut, onComplete: callback});
		}
	}

	about.setScroll = function()
    {
    	if(!main.mobile)
		{
			$("#about-content").mCustomScrollbar(
			{
			    axis:"y",
			    scrollInertia: 600 * main.scrollFactor,
			    mouseWheel:{deltaFactor: windowHeight/30},
			    callbacks:{
				    whileScrolling:function()
				    {
				    	about.onScroll(this.mcs);
				    }
				}
			});
			about.containerscroll = $('#about-content').find('.mCSB_container');
		}
		else
		{
			about.containerscroll = $('#about-content');
			about.containerscroll.off().scroll(function(e){e.preventDefault(); about.onScroll()});
		}
    }

	about.open = function(time)
	{
		about.canUpdate = true;

		if(window.head)
		{
			head.open(time, function()
			{
				about.canFollow = true;
			});
		}		
	}

	about.close = function(time)
	{
		about.canUpdate = false;
		about.canFollow = false;

		if(window.head!=undefined)
			head.close(0);
	}

	about.toggleLight = function()
	{
		about.lightOn = !about.lightOn; 

		var plightintensity = (about.lightOn) ? 0.7 : 1.3;
		var alightintensity = (about.lightOn) ? 0.85 : 0.05;
		var backgroundAlpha = (about.lightOn) ? 1 : 0.01;

		$('#switchButton').toggleClass('off');

		TweenMax.to(about.backgroundColor, 0.2, {alpha:backgroundAlpha, ease:Quart.easeInOut, onUpdate:function()
		{
			about.renderer.setClearColor(about.backgroundColor.color, about.backgroundColor.alpha);
		}});

		TweenMax.to(about.pointlight, 0.2, {intensity:plightintensity, ease:Quart.easeInOut});
		TweenMax.to(about.ambient, 0.2, {intensity:alightintensity, ease:Quart.easeInOut});
	}

	about.ini3D = function(callback)
	{
		about.scene = new THREE.Scene();
		about.scene.fog = new THREE.Fog(0x000000, 1, 2000);

		about.camera = new THREE.PerspectiveCamera(30, about.canvasWidth/about.canvasHeight, 1, 2000);
		about.camera.position.z = 1000;

		about.renderer = new THREE.WebGLRenderer({antialias: false});
		about.renderer.setClearColor(about.backgroundColor.color, about.backgroundColor.alpha);
		about.renderer.setSize(about.canvasWidth, about.canvasHeight);
		about.renderer.autoClear = false;
		about.renderer.sortObjects = false;
		about.backgroundElm.append(about.renderer.domElement);

		var geometry = new THREE.PlaneGeometry(size.x, size.y, slices.x, slices.y);
		var material = new THREE.MeshStandardMaterial(
		{
			color: 0xffffff, 
			roughness: 0.6, 
			metalness: 0, 
			shading:THREE.FlatShading, 
			transparent:true, 
			opacity:1, 
			blending:THREE.SubtractiveBlending
		});

		for (var i = 0; i < geometry.vertices.length; i++) 
    	{
    		geometry.vertices[i].x += (d.x * limitx.min) + (Math.random() * (d.x * (limitx.max-limitx.min)));
    		geometry.vertices[i].y += (d.y * limity.min) + (Math.random() * (d.y * (limity.max-limity.min)));
    		geometry.vertices[i].z += -d.z + (Math.random() * (d.z * 2));
    	}
    	geometry.computeVertexNormals();

		var scale = 1;
		geometry.scale(scale, scale, scale);
		about.background = new THREE.Mesh(geometry, material);
		about.background.position.z = -500;
		about.scene.add(about.background);

		var loader  = new THREE.ColladaLoader();
		loader.load(static_path+'/assets/tostehead.dae', function (collada) 
		{
			if(window.head!=undefined)
			{
				head.tostehead.group = collada.scene;
				head.setMaterials(head.tostehead.group);

				head.tostehead.head = head.tostehead.group.getObjectByName('head');
				head.tostehead.shit = head.tostehead.group.getObjectByName('shitbrain');

				head.eyelid.left.top = head.tostehead.head.getObjectByName('eyelid_left_top');
				head.eyelid.left.bottom = head.tostehead.head.getObjectByName('eyelid_left_bottom');
				head.eyelid.right.top = head.tostehead.head.getObjectByName('eyelid_right_top');
				head.eyelid.right.bottom = head.tostehead.head.getObjectByName('eyelid_right_bottom');
				
				head.tostehead.group.lookAt(about.smoothmousePos);
				head.eyeOpen('left', 0);
				head.eyeOpen('right', 0);
				about.close(0);

				about.head.add(head.tostehead.group);
				about.scene.add(about.head);
			}

			about.ambient = new THREE.AmbientLight(0xffffff, 0.85)
			about.scene.add(about.ambient);
			
			about.light = new THREE.DirectionalLight(0x212121, 0.6);
			about.light.position.set(0.5, 0.8, 1);
			about.scene.add(about.light);

			about.pointlight = new THREE.PointLight(0xffffff, 0.7, 0, 2);
			about.pointlight.position.set(0, 0, 0);
			about.scene.add(about.pointlight);

			about.render();

			if(callback!=undefined)
				callback();
		});
	}

	about.moveMouse = function(mouseX, mouseY)
	{
		about.mousePos = new THREE.Vector3(((mouseX-80)/about.canvasWidth) * 2 - 1, -(mouseY/about.canvasHeight) * 2 + 0.6, 0.5);
		about.mousePos.x *= 0.2;
		about.mousePos.y *= 0.15;

		if(about.camera)
		{
			var vector = new THREE.Vector3();
			vector.set(((mouseX-80)/about.canvasWidth) * 2 - 1, -((mouseY)/about.canvasHeight) * 2 + 1, 0.5);
			vector.unproject(about.camera);
			var dir = vector.sub(about.camera.position).normalize();
			var distance = -about.camera.position.z/dir.z;
			about.mousePos3D = about.camera.position.clone().add(dir.multiplyScalar(distance));
			about.mousePos3D.z = 300;
		}
	}

	about.render = function()
	{
		if(about.canUpdate && main.canAnimate)
		{
			var time = Date.now() * 0.2;

			if(about.canFollow && about.camera)
			{
				about.camera.position.x += (-(mouseX * 0.1)-about.camera.position.x) * 0.008;
				about.camera.position.y += ((mouseY * 0.1)-about.camera.position.y) * 0.005;
				about.camera.lookAt(about.scene.position);
			}	

			if(about.pointlight)
			{
				about.smoothmousePos3D.x += (about.mousePos3D.x-about.smoothmousePos3D.x) * 0.1;
				about.smoothmousePos3D.y += (about.mousePos3D.y-about.smoothmousePos3D.y) * 0.1;
				about.smoothmousePos3D.z += (about.mousePos3D.z-about.smoothmousePos3D.z) * 0.1;

				about.pointlight.position.set(about.smoothmousePos3D.x, about.smoothmousePos3D.y, about.smoothmousePos3D.z); 
			}

			if(about.canFollow)
			{
				about.smoothmousePos.x += (about.mousePos.x-about.smoothmousePos.x) * 0.04;
				about.smoothmousePos.y += (about.mousePos.y-about.smoothmousePos.y) * 0.04;
				about.smoothmousePos.z += (about.mousePos.z-about.smoothmousePos.z) * 0.04;
			}

			if(!main.mobile && about.background)
			{ 
				for (var i = 0; i < about.background.geometry.vertices.length; i++) 
		    		about.background.geometry.vertices[i].z += Math.sin((time + (i * 90)) / 180 * Math.PI);
		    	
		    	about.background.geometry.verticesNeedUpdate = true;
			}
			
			if(window.head!=undefined && head.tostehead.group)
				head.tostehead.group.lookAt(about.smoothmousePos);
			
			if(about.renderer)
				about.renderer.clear();

			if(about.composer)
				about.composer.render(0.01);
			else if(home.renderer)
				about.renderer.render(about.scene, about.camera);
		}

		window.requestAnimationFrame(about.render);
	}

	about.onResize = function()
	{
		about.canvasWidth = (main.mobile) ? windowWidth : windowWidth-80;
		about.canvasHeight = windowHeight;
		about.this = $('#c-about');

		about.setScroll();

		if(about.camera)
		{
			about.camera.aspect = about.canvasWidth / about.canvasHeight;
			about.camera.updateProjectionMatrix();
		}

		if(about.renderer)
			about.renderer.setSize(about.canvasWidth, about.canvasHeight);

		if(main.mobile)
		{
			about.head.scale.set(0.7, 0.7, 0.7);

			if(about.this.hasClass('open'))
				about.this.css({left: 0});
			else
				about.this.css({left: "100%"});
		}
		else
		{
			about.head.scale.set(1, 1, 1);

			if(about.this.hasClass('open'))
				about.this.css({left: 80});
			else
				about.this.css({left: "100%"});
		}
	};

	about.setHeadScroll = function(time, forceCenter)
	{
		forceCenter = (forceCenter==undefined) ? false : true;

		if(about.scrolltop<=windowHeight*0.1 || forceCenter)
		{
			if(about.backgroundElm.hasClass('side'))
			{
				about.backgroundElm.removeClass('side');

				TweenMax.to(about.head.position, 1.2 * time, {x:0, ease:Quart.easeInOut});
				TweenMax.to(about.head.rotation, 1.2 * time, {y:0, ease:Sine.easeInOut});
			}

			about.scrollElm.removeClass('close');
		}
		else
		{
			if(!about.backgroundElm.hasClass('side'))
			{
				about.backgroundElm.addClass('side');

				TweenMax.to(about.head.position, 1.5 * time, {x:500, ease:Quart.easeInOut});
				TweenMax.to(about.head.rotation, 1.7 * time, {y:-(Math.PI/2), ease:Quart.easeInOut});
			}

			about.scrollElm.addClass('close');
		}
	}

	about.onScroll = function(e)
	{
		windowInnerHeight = about.containerscroll.height();
		about.scrolltop = (e!=undefined && e.top!=undefined) ? -e.top : Number(about.containerscroll.scrollTop());
		about.scrollpct = about.scrolltop/windowHeight;
		about.scrollpct = (about.scrollpct<0) ? 0 : about.scrollpct;
		about.scrollpct = (about.scrollpct>1) ? 1 : about.scrollpct;

		$('li').each(function(index, el) 
		{
			var top = $(this).offset().top-windowHeight;
			if(top<0 && !$(this).hasClass('loaded'))
				$(this).addClass('loaded');
		});

		if(!main.mobile && about.head)
			about.setHeadScroll(1);
		else
			about.setHeadScroll(1, true);

		$('.title.s-title').each(function() 
        {
            $(this).css('top', $('#about-title').offset().top-$(this).closest('.about-section').offset().top);
        });
	}	
	window.about = about;
}(window));