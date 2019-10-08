$(function(window)
{
	var head = {};

	head.tostehead = {
		group: null,
		head: null,
		shit: null,
		value: {
			scale:0
		},
		closed: {
			scale:0.01, 
			position: {x:-0.2, y:-0.4, z:0.5}
		},
		open: {
			scale:5, 
			position: {x:0, y:0, z:0.5}
		}
	}

	head.model = null;
	head.shit = null;
	
	head.materials = {
		hair: new THREE.MeshStandardMaterial({color: 0x453f31, roughness: 0.6, metalness: 0.2}),
		skin: new THREE.MeshStandardMaterial({color: 0xffdcba, roughness: 0.5, metalness: 0}),
		eye: new THREE.MeshPhongMaterial({color: 0x383328, specular:0xa2a2a2, shininess:70}),
		mtongue: new THREE.MeshStandardMaterial({color: 0xbc2d0c, roughness: 0.3, metalness: 0}),
		shit: new THREE.MeshPhongMaterial({color: 0x735b37, specular:0xf2f2f2, shininess:10}),
		teeth: new THREE.MeshPhongMaterial({color: 0xffffff, specular:0x999999, shininess:30}),
		background: new THREE.MeshStandardMaterial({color: 0x000000, roughness: 1, metalness: 0})
	}

	head.eyelid = {
		left:{top:null, bottom:null},
		right: {top:null, bottom:null},
		open: {
			left: {
				top:{x:4.29, y:5.45, z:5.98}, 
				bottom:{x:1.49, y:2.77, z:2.97}
			},
			right: {
				top:{x:4.10, y:4.00, z:5.98}, 
				bottom:{x:1.25, y:0, z:2.97}
			}
		},
		closed: {
			left:{
				top:{x:5.68, y:4.59, z:5.98}, 
				bottom:{x:0, y:1.95, z:2.97}
			},
			right:{
				top:{x:5.78, y:4.49, z:5.98}, 
				bottom:{x:0, y:0.2, z:2.97}
			}
		}
	}

	head.setOpacity = function(mateiralArray, opacity)
	{
		for (var i = 0; i < mateiralArray.length; i++) 
		{
			var item = mateiralArray[i];

			if(head.materials.hasOwnProperty(item))
			{
				//about.materials[item].wireframe = true;
				head.materials[item].transparent = true;
				head.materials[item].opacity = opacity;
			}
		}
	}

	head.setMaterials = function(obj)
	{
		for (var i = 0; i < obj.children.length; i++) 
		{
			var item = obj.children[i];
			
			if(item.type=='Mesh')
			{
				var name = item.material.name;

				if(head.materials.hasOwnProperty(name))
					obj.children[i].material = head.materials[name];
			}
			else if(item.type=='Group')
			{
				head.setMaterials(item);
			}
		}
	}

	head.open = function(time, callback)
	{
		time = (time==undefined) ? 1 : time;

		TweenMax.to(head.tostehead.value, 1.8 * time, {scale:head.tostehead.open.scale, delay:1 * time, ease:Elastic.easeOut, onUpdate:function()
		{
			if(head.tostehead.group!=null)
				head.tostehead.group.scale.set(head.tostehead.value.scale, head.tostehead.value.scale, head.tostehead.value.scale);
		}});

		if(window.about!=undefined)
		{
			TweenMax.to(about.smoothmousePos, 3 * time, {x:head.tostehead.open.position.x, y:head.tostehead.open.position.y , z:head.tostehead.open.position.z, delay:1 * time, ease:Elastic.easeOut, onComplete:callback});
		}
		else
		{
			if(callback!=undefined)
				callback();
		}

		head.blink();
	}

	head.close = function(time, callback)
	{
		time = (time==undefined) ? 1 : time;

		TweenMax.killDelayedCallsTo(head.blink);

		TweenMax.to(head.tostehead.value, 0.6 * time, {scale:head.tostehead.closed.scale, delay:1 * time, ease:Back.easeIn, onUpdate:function()
		{
			if(head.tostehead.group!=null)
				head.tostehead.group.scale.set(head.tostehead.value.scale, head.tostehead.value.scale, head.tostehead.value.scale);
		}});

		if(window.about!=undefined)
		{
			TweenMax.to(about.smoothmousePos, 0.8 * time, {x:head.tostehead.closed.position.x, y:head.tostehead.closed.position.y, z:head.tostehead.closed.position.z, delay:1 * time, ease:Back.easeIn, onComplete:callback});
		}
		else
		{
			if(callback!=undefined)
				callback();
		}
	}

	head.eyeOpen = function(side, time, delay)
	{
		time = (time==undefined) ? 0.2 : time;
		delay = (delay==undefined) ? 0 : delay;

		if(head.eyelid[side]!=undefined && head.eyelid[side].top!=undefined && head.eyelid[side].bottom!=undefined)
		{
			TweenMax.to(head.eyelid[side].top.rotation, time, {x:head.eyelid.open[side].top.x, y:head.eyelid.open[side].top.y, z:head.eyelid.open[side].top.z, delay:delay, ease:Sine.easeInOut});
			TweenMax.to(head.eyelid[side].bottom.rotation, time, {x:head.eyelid.open[side].bottom.x, y:head.eyelid.open[side].bottom.y, z:head.eyelid.open[side].bottom.z, delay:delay, ease:Sine.easeInOut});
		}
	}

	head.eyeClosed = function(side, time, delay)
	{
		time = (time==undefined) ? 1 : time;
		delay = (delay==undefined) ? 0 : delay;

		if(head.eyelid[side]!=undefined && head.eyelid[side].top!=undefined && head.eyelid[side].bottom!=undefined)
		{
			TweenMax.to(head.eyelid[side].top.rotation, time, {x:head.eyelid.closed[side].top.x, y:head.eyelid.closed[side].top.y, z:head.eyelid.closed[side].top.z, delay:delay, ease:Sine.easeInOut});
			TweenMax.to(head.eyelid[side].bottom.rotation, time, {x:head.eyelid.closed[side].bottom.x, y:head.eyelid.closed[side].bottom.y, z:head.eyelid.closed[side].bottom.z, delay:delay, ease:Sine.easeInOut});
		}
	}

	head.blink = function()
	{
		head.eyeClosed('left', 0.1);
		head.eyeClosed('right', 0.1);

		head.eyeOpen('left', 0.1, 0.15);
		head.eyeOpen('right', 0.1, 0.15);

		var time = 0.5 + (Math.random() * 4);
		TweenMax.delayedCall(time, head.blink);
	}

	window.head = head;
}(window));