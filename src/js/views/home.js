$(function(window)
{
    var home = {};
    home.ajax = null;
	home.canvasWidth = windowWidth;
	home.canvasHeight = windowHeight;
	home.mousePos = new THREE.Vector3();
	home.canUpdate = true;
	home.scrolltop = 0;
	home.this = $('#c-welcome');
	home.body = $('body');
	home.phrases = phrases;
	home.centerCanAnimate = true;
	home.currentindex = 1;
	home.holdTime = 2;
	home.setImageObject = null;
	home.prop = 1;
	home.totalParticles = 10810;
	home.oldImageObject = null;
	home.phrase = home.phrases[home.currentindex];
	home.oldmobile = false;
	home.twmb = 0;
	home.targetTwmb = 0;

    home.init = function(callback)
	{
		home.currentindex = Math.floor(Math.random() * home.phrases.length);
		home.setPhrase(home.phrases[home.currentindex], function(phrase)
		{
			home.phrase = phrase;
			home.onResize();

			if(window.portfolio)
				home.totalParticles = portfolio.totalPixels;

			home.this.off().on('mousedown', function()
			{
				if(home.scrolltop<=10)
				{
					if(home.effectGlitch)
						home.effectGlitch.uniforms['byp'].value = 0;

					TweenMax.to($('#holdbar'), home.holdTime, {width: '100%', ease:Sine.easeOut});
					TweenMax.delayedCall(home.holdTime, home.holdClick);
				}
			}).on('mouseup', function()
			{
				if(home.scrolltop<=10)
				{
					TweenMax.to($('#holdbar'), home.holdTime/4, {width: '0%', ease:Quart.easeOut});

					if(home.effectGlitch)
						home.effectGlitch.uniforms['byp'].value = 1;

					TweenMax.killDelayedCallsTo(home.holdClick);
				}
			});

			$('#mouse-scroll').off().on('click', function()
			{
				address.onChangeUrl('portfolio');
			});

			home.ini3D(callback);
		});
	}

	home.holdClick = function()
	{
		if(!main.mobile && home.centerCanAnimate)
		{
			home.changeCenterObject(0.6, undefined, function()
			{
				TweenMax.to($('#holdbar'), home.holdTime/4, {width: '0%', ease:Quart.easeOut});

				if(home.effectGlitch)
					home.effectGlitch.uniforms['byp'].value = 1;
			});
		}
	}

	home.setPhrase = function(phrase, callback)
	{
		if(phrase.title=='turbotunnel')
		{
			home.loadExeternalData(
			{
				url: "http://bogdoggames.com/turbotunnel/services/deaths"
			}, function(data)
			{
				if(data!='' && data!=undefined && data.deaths!=undefined && isNaN(data.deaths)==false)
				{
					if(callback!=undefined)
						callback({title:data.deaths, phrase:'this is the number of total deaths of the<br>back to the turbo tunnel game until now.'});
				}
				else
				{
					if(callback!=undefined)
						callback({title:'error', phrase:'something went really wrong!'});
				}
			});
		}
		else if(phrase.title=='news')
		{
			home.loadExeternalData(
			{
				url: "http://mentalfloss.com/api/1.0/views/amazing_facts.json",
				data: {rand: Math.ceil(Math.random() * 10000)}
			}, function(data)
			{
				if(data!='' && data!=undefined && data.length>0)
				{
					var index = Math.floor(Math.random() * 10);
					var phrase = data[index].nid.toLowerCase();

					if(callback!=undefined)
						callback({title:'fact', phrase:phrase});
				}
				else
				{
					if(callback!=undefined)
						callback({title:'error', phrase:'something went really wrong!'});
				}
			});
			
		}
		else
		{
			if(callback!=undefined)
				callback(phrase);
		}
	}

	home.loadExeternalData = function(options, callback)
	{
		var $options = $.extend(
		{
			url: '',
			data: {},
			type: 'GET', 
			dataType: 'json'
		}, options);

		if(home.ajax)
			home.ajax.abort();

		home.ajax = $.ajax(
		{
			url: $options.url,
			data: $options.data,
			type: $options.type,
			dataType: $options.dataType,
			success: function(data) 
			{
				if(callback!=undefined)
					callback(data);
			},
			error: function(jqXHR, textStatus, errorThrown ) 
			{
				if(callback!=undefined)
					callback('');
			}
		});	
	}

	home.ini3D = function(callback)
	{
		home.scene = new THREE.Scene();
		home.scene.fog = new THREE.Fog(0x000000, 1, 3000);

		home.camera = new THREE.PerspectiveCamera( 75, home.canvasWidth/home.canvasHeight, 0.8, 2000);
		home.camera.position.z = 600;

		home.renderer = new THREE.WebGLRenderer({antialias: false});
		home.renderer.setClearColor(0x000000, 1);
		home.renderer.setSize(home.canvasWidth, home.canvasHeight);
		home.renderer.autoClear = false;
		home.renderer.sortObjects = false;
		$('#c-welcome').append(home.renderer.domElement);

		var textloader = new THREE.CubeTextureLoader();
		textloader.setPath(static_path + "/assets/textures/");
	    home.envTexture = textloader.load(
	    [
			"dposx.jpg", "dnegx.jpg",
			"dposy.jpg", "dnegy.jpg",
			"dposz.jpg", "dnegz.jpg"
		]);

		var cubeShader = THREE.ShaderLib["cube"];
		var cubeMaterial = new THREE.ShaderMaterial(
		{
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			side: THREE.BackSide,
			depthWrite: false,
		});
		cubeMaterial.uniforms["tCube"].value = home.envTexture;

		home.cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), cubeMaterial);
		home.scene.add(home.cubeMesh);

		home.LoadGeometries(function()
		{
			home.createCenterObject();
			home.centerCanUpdate = (!main.mobile) ? true : false;
			
			home.particles = home.totalParticles;
	    	home.radius = home.canvasWidth/3;
			home.geometry = new THREE.BufferGeometry();
			home.vertices = [];
			home.scales = [];
			home.baseColor = {r:0.1, g:0.6, b:0.6};
			
	    	home.positions = new Float32Array(home.particles*3);
	    	home.colors = new Float32Array(home.particles*3);
	    	home.sizes = new Float32Array(home.particles);
	    	home.rotations = new Float32Array(home.particles);
	    	home.properties = new Float32Array(home.particles*3);
	    	
			for(var i=0, i3=0; i<home.particles; i++, i3+=3) 
			{
	            home.positions[i3+0] = (Math.random()*2-1)*home.radius;
	            home.positions[i3+1] = (Math.random()*2-1)*home.radius;
	            home.positions[i3+2] = -200 + (Math.random() * 600);
	            home.vertices.push(new THREE.Vector3(home.positions[i3+0], home.positions[i3+1], home.positions[i3+2]));
	            
	            home.colors[i3+0] = home.baseColor.r;
	            home.colors[i3+1] = home.baseColor.g;
	            home.colors[i3+2] = home.baseColor.b;

	            home.properties[i3+0] = Math.random() * 5;
	            home.properties[i3+1] = i%2==0 ? 1 : -1;
	            home.properties[i3+2] = Math.random() * 1.5;

	            var sz = 3 + (Math.random() * 2);
	            
	            home.sizes[i] =sz 
	            home.scales.push(sz);

	            home.rotations[i] = Math.random() * (Math.PI * 4);
	        }
	        home.geometry.addAttribute('position', new THREE.BufferAttribute(home.positions, 3));
	    	home.geometry.addAttribute('customColor', new THREE.BufferAttribute(home.colors, 3));        
	    	home.geometry.addAttribute('size', new THREE.BufferAttribute(home.sizes, 1));
	    	home.geometry.addAttribute('rotation', new THREE.BufferAttribute(home.rotations, 1));

			var pointTexture = new THREE.TextureLoader().load(static_path + "/assets/textures/particle.png");
			pointTexture.wrapS = THREE.RepeatWrapping;
			pointTexture.wrapT = THREE.RepeatWrapping;
			pointTexture.repeat.set(1, 1);

			var vertexShader = 		"\
									attribute float size;\
									attribute float rotation;\
									attribute vec3 customColor;\
									varying float vRotation;\
									varying float vPointSize;\
									varying vec3 vColor;\
									void main()\
									{\
										vRotation = rotation;\
										vColor = customColor;\
										vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
										gl_PointSize = size * (300.0 / length(mvPosition.xyz));\
										gl_Position = projectionMatrix * mvPosition;\
										vPointSize = gl_PointSize;\
									}";

			var fragmentShader =	"\
									uniform sampler2D texture;\
									uniform float t;\
									uniform vec2  r;\
									varying float vRotation;\
								    varying float vPointSize;\
								    varying vec3 vColor;\
									\
								    void main()\
									{\
										float mid = 0.45;\
										vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid, cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid);\
										vec4 rotatedTexture = texture2D(texture,  rotated);\
										gl_FragColor = vec4(vColor * rotatedTexture.a, rotatedTexture.a);\
									}";

			var pointMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {
	            	texture: {type: 't', value: pointTexture}
				},
				depthTest: false,
				transparent: true,
				vertexShader: vertexShader,
				fragmentShader: fragmentShader
			});
			
			home.points = new THREE.Points(home.geometry, pointMaterial);

			if(!main.mobile)
				home.scene.add(home.points);

			home.scene.add(new THREE.AmbientLight(0xd2d2d2));
			home.light = new THREE.DirectionalLight(0x999999, 0.6);
			home.scene.add(home.light);

			home.composer = new THREE.EffectComposer(home.renderer);
			home.composer.addPass(new THREE.RenderPass(home.scene, home.camera));
			home.effectGlitch = new THREE.GlitchPass();
			home.effectGlitch.renderToScreen = true;
			home.effectGlitch.goWild = false;
			home.composer.addPass(home.effectGlitch);
			
			home.render();
			home.loop();

			if(callback!=undefined)
				callback();
		});
	}

	home.LoadGeometries = function(callback)
	{
		var loader  = new THREE.ColladaLoader();
		loader.load(static_path+'/assets/pyramid.dae', function (collada) 
		{
			var obj = collada.scene;
			for (var i = 0; i < obj.children.length; i++) 
			{
				var item = obj.children[i];
				if(item.type=='Mesh')
					home.pyramidGeometry = new THREE.Geometry().fromBufferGeometry(item.geometry);
			}
			
			var loader = new THREE.FontLoader();
			loader.load(static_path+'/fonts/helvetiker_regular.typeface.json', function (font)
			{
				home.fontGeometry = font;

				if(callback!=undefined)
					callback();
			});
		});
	}

	home.createCenterObject = function(closed)
	{
		closed = (closed==undefined) ? false : closed;

		home.tvertices = [];
		home.containerObject = new THREE.Object3D();
		home.containerObjectZtarget = 0;
		home.containerObjectYoffsset = 0;
		home.reflectiveObject = null;
		home.wireObject = null;
		home.currentGeometry = null;
		home.lighty = 50;
		home.pow = 2.2;
		home.dist = 0.1;
		home.mindist = 1;

		var reflectMaterial = new THREE.MeshStandardMaterial(
		{
			color: 0x255d5d,
			envMap: home.envTexture,
			roughness: 0.3,
			metalness: 0.8,
			transparent: true,
			opacity: 1
		})

		var wireMaterial = new THREE.MeshPhongMaterial(
		{
			color: 0x208989,
			transparent: true, 
			wireframe:true,
			opacity: 0.3,
			specular:0x54a89c,
			polygonOffset: true,
			polygonOffsetFactor: -0.1
		});

		home.type = (main.mobile || home.phrase.title=='pyramid') ? 'p' : 'l';
		if(home.type=="p")
		{
			wireMaterial.opacity = 0.5;
			reflectMaterial.roughness = 0.05;
			reflectMaterial.metalness = 0.88;
			reflectMaterial.shading = THREE.FlatShading;
			reflectMaterial.envMapIntensity = 2;
			home.lighty = 170;
			
			home.pow = 3;
			home.dist = 0.2;
			home.mindist = 2;

			home.currentGeometry = home.pyramidGeometry.clone();

			home.centerOffset = {x:0, y:-0.7, z:0};

			home.reflectiveObject = new THREE.Mesh(home.currentGeometry, reflectMaterial);
			home.wireObject = new THREE.Mesh(home.currentGeometry, wireMaterial);
			home.wireObject.scale.set(1.05, 1.05, 1.05);

			home.containerObject.rotation.y = Math.PI * 0.65;
			home.containerObject.rotation.x = Math.PI * 0.05;
			home.containerObject.position.y = home.containerObjectYoffsset = 50;

			var scaleCO = main.mobile ? {x:30, y:37, z:30} : {x:40, y:50, z:40};

			home.containerObject.scale.set(scaleCO.x, scaleCO.y, scaleCO.z);			
		}
		else if(home.type=="l")
		{
			reflectMaterial.depthTest = false;
			reflectMaterial.opacity = 0.6;
			home.lighty = 50;
			$('#text-wellcome').html(home.phrase.phrase);

			home.textGeo = new THREE.TextGeometry(home.phrase.title, 
			{
				font: home.fontGeometry,
				size: 200,
				height: 50,
				curveSegments: 1,
				bevelEnabled: false
			});
			home.currentGeometry = home.textGeo;

			home.textGeo.computeBoundingBox();
			home.centerOffset = {x:0.5 * (home.textGeo.boundingBox.max.x - home.textGeo.boundingBox.min.x), y: (0.5 * (home.textGeo.boundingBox.max.y - home.textGeo.boundingBox.min.y)) - 50, z:0};
			
			home.reflectiveObject = new THREE.Mesh(home.textGeo, reflectMaterial);
			home.wireObject = new THREE.Mesh(home.textGeo, wireMaterial);

			home.containerObject.position.x = -home.centerOffset.x;
			home.containerObject.position.y = home.containerObjectYoffsset = -40;
		}

		var vl = home.currentGeometry.vertices.length;
		for (i=0; i<vl; i++) 
			home.tvertices.push(home.currentGeometry.vertices[i].clone());

		home.containerObject.add(home.reflectiveObject);
		home.containerObject.add(home.wireObject);
		home.scene.add(home.containerObject);

		if(closed)
			home.closeCenterObject(0);
	}

	home.changeCenterObject = function(time, callback, precallback)
	{
		if(home.currentGeometry)
		{
			time = (time==undefined) ? 1 : time;
			home.centerCanUpdate = false;

			var rndIndex = Math.floor(Math.random() * home.phrases.length);
			rndIndex = (rndIndex==home.currentindex) ? rndIndex + 1 : rndIndex;
			home.currentindex = rndIndex;

			home.setPhrase(home.phrases[home.currentindex], function(phrase)
			{
				home.phrase = phrase;

				home.closeCenterObject(time, function()
				{
					home.createCenterObject(true);
					TweenMax.delayedCall(0.3 * time, function()
					{
						if(precallback!=undefined)
							precallback();

						home.openCenterObject(time, function()
						{
							home.centerCanUpdate = true;
							if(callback!=undefined)
								callback();
						});
					});
				});
			});
		}
	}

	home.closeCenterObject = function(time, callback)
	{
		home.centerCanAnimate = false;

		TweenMax.to($('#text-wellcome'), 0.8 * time, {bottom:"10vh", 'line-height': '4vh', autoAlpha:0, ease:Quart.easeOut});

		var vl = home.currentGeometry.vertices.length;
		for (i=0; i<vl; i++) 
		{
			var object = home.currentGeometry.vertices[i];
			TweenMax.to(object, 0.5 * time, {x:home.centerOffset.x, y:home.centerOffset.y, z:home.centerOffset.z, delay: 0.002 * i * Math.random() * time, ease:Back.easeInOut, onUpdate:function()
			{
				home.currentGeometry.verticesNeedUpdate = true;
			}});
		}

		TweenMax.delayedCall((0.6 + (0.002 * vl)) * time, function()
		{
			home.centerCanAnimate = true;

			if(callback!=undefined)
				callback();
		});
	}

	home.openCenterObject = function(time, callback)
	{
		home.centerCanAnimate = false;

		if(home.type=="l")
			TweenMax.to($('#text-wellcome'), 0.8 * time, {bottom:"14vh", 'line-height': '6vh', autoAlpha:0.3, ease:Quart.easeOut});
			
		var vl = home.currentGeometry.vertices.length;
		for (i=0; i<vl; i++) 
		{
			var object = home.currentGeometry.vertices[i];
			TweenMax.to(object, 1 * time, {x:home.tvertices[i].x, y:home.tvertices[i].y, z:home.tvertices[i].z, delay: 0.002 * i * Math.random() * time, ease:Elastic.easeOut.config(0.8, 0.6), onUpdate:function()
			{
				home.currentGeometry.verticesNeedUpdate = true;
			}});
		}

		TweenMax.delayedCall((1.2 + (0.002 * vl)) * time, function()
		{
			home.centerCanAnimate = true;

			if(callback!=undefined)
				callback();
		});
	}

	home.moveMouse = function(mouseX, mouseY)
	{
		if(home.camera)
		{
			var vector = new THREE.Vector3();
			vector.set((mouseX/home.canvasWidth) * 2 - 1, -((mouseY)/home.canvasHeight) * 2 + 1, 0.5);
			vector.unproject(home.camera);
			var dir = vector.sub(home.camera.position).normalize();
			var distance = -home.camera.position.z/dir.z;
			home.mousePos = home.camera.position.clone().add(dir.multiplyScalar(distance));
		}
	}

	home.loop = function()
	{
		if(!main.mobile && home.canUpdate && main.canAnimate)
		{
			var time = Date.now() * 0.0008;

			if(home.camera)
			{
				home.camera.position.x += ((mouseX * 0.05)-home.camera.position.x) * 0.01;
				home.camera.position.y += (-(mouseY * 0.1)-home.camera.position.y) * 0.008;
				home.camera.lookAt(home.scene.position);
			}

			if(home.light)
				home.light.position.set(Math.sin(time) * 100, home.lighty, Math.cos(time) * 100);

			if(home.points)
			{
				for(var i=0, i3=0; i<home.particles; i++, i3+=3)
				{
					var vector = new THREE.Vector3(home.positions[i3+0], home.positions[i3+1], home.positions[i3+2]);
					vector.applyMatrix4(home.points.matrixWorld);

					var dist = Math.pow(home.mousePos.distanceTo(vector) * 0.1, 1.5);
					dist = (dist<0.1) ? 0.1 : dist;

					var angle = Math.atan2(vector.y-home.mousePos.y, vector.x-home.mousePos.x);

					var afx, afy, afz, rfx, rfy, movz, rot, sz, cr, cg, cb;
					if(home.imageObject==null)
					{
						afx = (home.vertices[i].x-home.positions[i3+0]) * 0.1;
						afy = (home.vertices[i].y-home.positions[i3+1]) * 0.1;
						afz = 0;

						sz = ((home.scales[i] * home.prop)-home.sizes[i]) * 0.1;

						cr = (home.baseColor.r-home.colors[i3+0]) * 0.1;
						cg = (home.baseColor.g-home.colors[i3+1]) * 0.1;
						cb = (home.baseColor.b-home.colors[i3+2]) * 0.1;

						dist /= 0.3;

						movz = 1;
						rot = 1;
					}
					else
					{
						afx = ((home.imageObject.data[i].x + (home.imageObject.data[i].offsetX * 300))-home.positions[i3+0]) * 0.08;
						afy = ((home.imageObject.data[i].y + (home.imageObject.data[i].offsetY * 300))-home.positions[i3+1]) * 0.08;
						afz = ((home.imageObject.data[i].z + (home.imageObject.data[i].offsetZ * 300))-home.positions[i3+2]) * 0.08 * (0.4-Math.abs(home.imageObject.data[i].offsetZ));

						sz = ((home.imageObject.data[i].size * home.prop)-home.sizes[i]) * 0.1;

						cr = (home.imageObject.data[i].color.r-home.colors[i3+0]) * 0.1;
						cg = (home.imageObject.data[i].color.g-home.colors[i3+1]) * 0.1;
						cb = (home.imageObject.data[i].color.b-home.colors[i3+2]) * 0.1;

						dist /= 0.16;

						movz = Math.abs(home.imageObject.data[i].offsetZ);
						rot = 0;
					}

					rfx = mouseX/dist * Math.sin(angle);
					rfy = mouseY/dist * Math.cos(angle);

					home.positions[i3+0] += afx + rfx;
	            	home.positions[i3+1] += rfy + afy;
	            	home.positions[i3+2] += afz + (1.2 * home.properties[i3+2] * movz);

	            	home.sizes[i] += sz;

	            	home.colors[i3+0] += cr;
	            	home.colors[i3+1] += cg;
	            	home.colors[i3+2] += cb;

	            	if(home.positions[i3+2] > 600)
						home.positions[i3+2] = -400;

					home.rotations[i] += (0.01 * home.properties[i3+0] * home.properties[i3+1]) * rot; 
	    		}

        		home.geometry.attributes.position.needsUpdate = true;
        		home.geometry.attributes.rotation.needsUpdate = true;
        		home.geometry.attributes.size.needsUpdate = true;
        		home.geometry.attributes.customColor.needsUpdate = true;
			}

			if(home.centerCanUpdate)
			{
				var vl = home.currentGeometry.vertices.length;
				for (i=0; i<vl; i++) 
				{
					var object = home.currentGeometry.vertices[i];
					var vector = home.currentGeometry.vertices[i].clone();
					vector.applyMatrix4(home.containerObject.matrixWorld);

					var dist = Math.pow(home.mousePos.distanceTo(vector) * home.dist, home.pow);
					dist = (dist<home.mindist) ? home.mindist : dist;
					
					var angle = Math.atan2(vector.y-home.mousePos.y, vector.x-home.mousePos.x);

					var rfx = 0;
					var rfy = 0;

					if(home.scrolltop<=0)
					{
						rfx = mouseX/dist * Math.sin(angle);
						rfy = mouseY/dist * Math.cos(angle);
					}
					
					var afx = (home.tvertices[i].x-object.x) * 0.1;
					var afy = (home.tvertices[i].y-object.y) * 0.1;

					object.x += afx + rfx;
					object.y += rfy + afy;
				}
				home.currentGeometry.verticesNeedUpdate = true;

				var zstep = (home.containerObjectZtarget-(-home.containerObjectYoffsset + home.containerObject.position.y)) * 0.05;
				home.containerObject.position.y += zstep;

				var mbstep = (home.targetTwmb-home.twmb) * 0.05;
				home.twmb += mbstep;

				$('#text-wellcome').css({'margin-bottom':home.twmb, ease:Sine.easeInOut});
			}

			home.render();
		}

		window.requestAnimationFrame(home.loop);
	}

	home.render = function()
	{
		if(home.renderer)
			home.renderer.clear();

		if(home.composer)
			home.composer.render(0.01);
		else if(home.renderer)
			home.renderer.render(home.scene, home.camera);
	}

	home.setImageObject = function(imageObject)
	{
		if(main.mobile)
		{
			home.imageObject = home.oldImageObject = null;
		}
		else
		{
			home.imageObject = (imageObject==null) ? null : imageObject.image;

			if(home.oldImageObject!=home.imageObject)
			{
				$('#portfolio-info').addClass('out');
				$('#portfolio-cta').addClass('out');

				TweenMax.to($('#portfolio-info'), 0.6, {top:'-10vh', ease:Quart.easeInOut});
				TweenMax.to($('#portfolio-cta'), 0.6, {bottom:'-10vh', ease:Quart.easeInOut, onComplete:function()
				{
					if(imageObject!=null)
					{
						$('#p-client').html(imageObject.info.subtitle);
						$('#p-title').html(imageObject.info.title);

						TweenMax.to($('#portfolio-info'), 0.8, {top:'7vh', ease:Quart.easeOut});
						TweenMax.to($('#portfolio-cta'), 0.8, {bottom:'8.5vh', ease:Quart.easeOut});

						$('#portfolio-info').removeClass('out');
						$('#portfolio-cta').removeClass('out');

						$('#portfolio-cta').off().click(function(event) 
						{
							$($('.gallery-item.portfolio').get(imageObject.index)).click();
						});
					}
				}});

				home.oldImageObject = home.imageObject;
			}
		}
	}

	home.onResize = function(e)
	{
		home.canvasWidth = windowWidth;
		home.canvasHeight = windowHeight;

		if(home.camera)
		{
			home.camera.aspect = home.canvasWidth / home.canvasHeight;
			home.camera.updateProjectionMatrix();
		}

		if(home.renderer)
			home.renderer.setSize(home.canvasWidth, home.canvasHeight);

		if(home.composer)
			home.composer.reset();

		if(main.mobile)
			home.render();

		if(home.oldmobile!=main.mobile)
		{
			home.changeCenterObject(0);

			if(main.mobile)
			{
				if(home.points)
					home.scene.remove(home.points);

				window.setTimeout(home.render, 50);
			}
			else
			{
				if(home.points)
					home.scene.add(home.points);
			}

			home.oldmobile = main.mobile;
		}

		home.prop = windowHeight/900;
		home.onScroll();
    };
	
	home.onScroll = function(e)
	{
		home.scrolltop = scrolltop;

		if(home.containerObject)
		{
			var pctZ = (!main.mobile) ? home.scrolltop/(windowHeight*0.2) : 0;

			home.containerObjectZtarget = 500 * pctZ;
			home.targetTwmb = -(windowHeight*0.5) * pctZ;
		}
	}	

    window.home = home;
}(window));