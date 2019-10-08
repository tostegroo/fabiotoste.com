$(function(window)
{
    var home = {};
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
	home.phrase = home.phrases[home.currentindex];

    home.init = function()
	{
		home.currentindex = Math.floor(Math.random() * home.phrases.length);
		home.phrase = home.phrases[home.currentindex];
		home.ini3D();
		home.onResize();

		home.this.on('click', function()
		{
			if(!main.mobile && home.centerCanAnimate)
				home.changeCenterObject();
		});
	}

	home.ini3D = function()
	{
		//scene
		home.scene = new THREE.Scene();
		home.scene.fog = new THREE.Fog(0x000000, 1, 3000);

		//camera
		home.camera = new THREE.PerspectiveCamera(75, home.canvasWidth/home.canvasHeight, 0.8, 2000);
		home.camera.position.z = 200;

		//renderer
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
			home.centerCanUpdate = true;
		});

		home.particlesUpdate = false;
		home.particles = (main.mobile) ? 3000 : 10810;
    	home.radius = (main.mobile) ? home.canvasWidth : home.canvasHeight/4;
		home.geometry = new THREE.BufferGeometry();
		home.vertices = [];

    	home.positions = new Float32Array(home.particles*3);
    	home.colors = new Float32Array(home.particles*3);
    	home.sizes = new Float32Array(home.particles);
    	home.rotations = new Float32Array(home.particles);
    	home.properties = new Float32Array(home.particles*3);
    	var color = new THREE.Color();

    	//New code
		var image = new Image();
		image.src = $($('.gallery-item').get(0)).children('.gi-img').children('img').attr('src');
		var imageData = home.getImageData(image);
		var pp = [];

		for (var i=0; i<imageData.width; i+=7) 
		{
			for (var j=0; j<imageData.height; j+=6) 
			{
				var pixel = home.getPixel(imageData, i, j);
				pp.push({x:i, y:j, color:pixel});
			}
		}

		console.log(pp.length);

		for(var i=0, i3=0; i<home.particles; i++, i3+=3) 
		{
            home.positions[i3+0] = -70 + (pp[i].x/6); //(Math.random()*2-1)*home.radius;
            home.positions[i3+1] = 40 + (-pp[i].y/6); //(Math.random()*2-1)*home.radius;
            home.positions[i3+2] = 100; //(Math.random()*2-1)*home.radius;

            home.vertices.push(new THREE.Vector3(home.positions[i3+0], home.positions[i3+1], home.positions[i3+2]));
            
            color.setRGB(pp[i].color.r/255, pp[i].color.g/255, pp[i].color.b/255);
            //color.setRGB(0.1, 0.5, 0.5);
            
            home.colors[i3+0] = color.r;
            home.colors[i3+1] = color.g;
            home.colors[i3+2] = color.b;

            home.properties[i3+0] = Math.random() * 5;
            home.properties[i3+1] = i%2==0 ? 1 : -1;
            home.properties[i3+2] = Math.random() * 2;
            
            home.sizes[i] = 5 + (Math.random() * 4); //0.5 + (Math.random() * 4);
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
								uniform vec3 color;\
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
									gl_FragColor = vec4(color * vColor, 1.0);\
							        gl_FragColor = gl_FragColor * rotatedTexture;\
								}";

		var pointMaterial = new THREE.ShaderMaterial(
		{
			uniforms: {
				color: {type: 'c', value: new THREE.Color('rgb(255, 255, 255)')},
            	texture: {type: 't', value: pointTexture}
			},
			depthTest: false,
			transparent: true,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});
		home.points = new THREE.Points(home.geometry, pointMaterial);
		home.scene.add(home.points);


		//lights
		home.scene.add(new THREE.AmbientLight(0xd2d2d2));
		home.light = new THREE.DirectionalLight(0x999999, 0.6);
		home.scene.add(home.light);

		//efects
		//home.composer = new THREE.EffectComposer(home.renderer);
		//home.composer.addPass(new THREE.RenderPass(home.scene, home.camera));

		var effectBloom = new THREE.BloomPass(0.75);
		var effectFilm = new THREE.FilmPass(0.5, 0.5, 1448, false);

		var effectDot = new THREE.ShaderPass(THREE.DotScreenShader);
		effectDot.uniforms['scale'].value = 6;

		var effectRGB = new THREE.ShaderPass(THREE.RGBShiftShader);
		effectRGB.uniforms['amount'].value = 0.0015;
		effectRGB.renderToScreen = true;

		var effectGlitch = new THREE.GlitchPass();
		effectGlitch.renderToScreen = true;
		effectGlitch.goWild = false;

		effectFocus = new THREE.ShaderPass(THREE.FocusShader);
		effectFocus.uniforms["screenWidth"].value = window.innerWidth;
		effectFocus.uniforms["screenHeight"].value = window.innerHeight;
		effectFocus.renderToScreen = true;

		//home.composer.addPass(effectBloom);
		//home.composer.addPass(effectFilm);
		
		//home.composer.addPass(effectDot);
		//home.composer.addPass(effectRGB);
		//home.composer.addPass(effectGlitch);
		//home.composer.addPass(effectFocus);

		home.render();
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
			home.containerObject.position.y = 50;

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
			home.containerObject.position.y = -40;
		}

		var vl = home.currentGeometry.vertices.length;
		for (i=0; i<vl; i++) 
			home.tvertices.push(home.currentGeometry.vertices[i].clone());

		home.containerObject.add(home.reflectiveObject);
		home.containerObject.add(home.wireObject);
		//home.scene.add(home.containerObject);

		if(closed)
			home.closeCenterObject(0);
	}

	home.changeCenterObject = function()
	{
		home.centerCanUpdate = false;

		home.currentindex ++;
		home.currentindex = (home.currentindex>home.phrases.length-1) ? 0 : home.currentindex;

		home.phrase = home.phrases[home.currentindex];
		home.closeCenterObject(1, function()
		{
			home.createCenterObject(true);
			TweenMax.delayedCall(0.2, function()
			{
				home.openCenterObject(1, function()
				{
					home.centerCanUpdate = true;
				});
			});
		});
	}

	home.closeCenterObject = function(time, callback)
	{
		home.centerCanAnimate = false;

		TweenMax.to($('#text-wellcome'), 0.8, {bottom:"10vh", 'line-height': '4vh', autoAlpha:0, ease:Quart.easeOut});

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
			TweenMax.to($('#text-wellcome'), 0.8, {bottom:"14vh", 'line-height': '6vh', autoAlpha:0.3, ease:Quart.easeOut});
			
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

			//$('#stats').html("x: " + home.mousePos.x + "<br>" + "y: " + home.mousePos.y + "<br>" + "z: " + home.mousePos.z);
		}
	}

	home.render = function()
	{
		if(home.canUpdate && main.canAnimate)
		{
			var time = Date.now() * 0.0008;

			if(home.camera)
			{
				home.camera.position.x += ((mouseX * 0.07)-home.camera.position.x) * 0.01;
				home.camera.position.y += (-(mouseY * 0.14)-home.camera.position.y) * 0.008;
				home.camera.lookAt(home.scene.position);
			}

			if(home.light)
				home.light.position.set(Math.sin(time) * 100, home.lighty, Math.cos(time) * 100);

			if(home.particlesUpdate && home.points)
			{
				for(var i=0, i3=0; i<home.particles; i++, i3+=3)
				{
					var vector = new THREE.Vector3(home.positions[i3+0], home.positions[i3+1], home.positions[i3+2]);
					vector.applyMatrix4(home.points.matrixWorld);

					var dist = Math.pow(home.mousePos.distanceTo(vector) * 0.1, 1.5);
					dist = (dist<0.1) ? 0.1 : dist;

					var angle = Math.atan2(vector.y-home.mousePos.y, vector.x-home.mousePos.x);

					var afx = (home.vertices[i].x-home.positions[i3+0]) * 0.3;
					var afy = (home.vertices[i].y-home.positions[i3+1]) * 0.3;
					var rfx = mouseX/dist * Math.sin(angle);
					var rfy = mouseY/dist * Math.cos(angle);

					home.positions[i3+0] += afx + rfx;
	            	home.positions[i3+1] += rfy + afy;
	            	home.positions[i3+2] += 1.2 * home.properties[i3+2];

	            	if(home.positions[i3+2] > 600)
						home.positions[i3+2] = -600;

					home.rotations[i] += 0.01 * home.properties[i3+0] * home.properties[i3+1]; 
	    		}
        		home.geometry.attributes.position.needsUpdate = true;
        		home.geometry.attributes.rotation.needsUpdate = true;
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
			}
			
			if(home.renderer)
				home.renderer.clear();

			if(home.composer)
				home.composer.render(0.01);
			else
				home.renderer.render(home.scene, home.camera);
		}

		window.requestAnimationFrame(home.render);
	}

	home.onResize = function(e)
	{
		home.canvasWidth = windowWidth;
		home.canvasHeight = windowHeight - headerHeight;

		if(home.camera)
		{
			home.camera.aspect = home.canvasWidth / home.canvasHeight;
			home.camera.updateProjectionMatrix();
		}

		if(home.renderer)
			home.renderer.setSize(home.canvasWidth, home.canvasHeight);

		if(home.composer)
			home.composer.reset();

		//effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth;
		//effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight;
    };
	
	home.onScroll = function(e)
	{
		home.scrolltop = scrolltop;
		
		//if(mainscroll)
			//home.this.css({top:-home.scrolltop*0.4});
	}

	home.getImageData = function(image) 
	{
	    var canvas = document.createElement('canvas');
	    canvas.width = image.width;
	    canvas.height = image.height;
	    var context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0);

	    return context.getImageData(0, 0, image.width, image.height);
	}

	home.getPixel = function(imagedata, x, y) 
	{
	    var position = (x + imagedata.width * y) * 4, data = imagedata.data;
	    return {r:data[position], g:data[position + 1], b:data[position + 2 ], a:data[ position + 3]};
	}

    window.home = home;
}(window));