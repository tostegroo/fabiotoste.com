var analytics = {
	use_id: false,
	base_tag: "/fabiotoste.com/",
    trackPage : function(url)
	{
        ga('send', 'pageview', url);
    },
    trackEvent : function(category, action, label)
	{
        ga('send', 'event', category, action, label);
    },
	track : function(_page, _event, _params)
	{
		if(_page!=undefined&&_page!="")
		{
			if(_event!=undefined&&_event!="")
			{
				if(analyticsSetup[_page][_event])
				{
					var evt = analyticsSetup[_page][_event];
					var evt_params = evt;
					if(_params!=undefined&&_params!=null&&_params.length>0)
					{
						for(var i=0; i<_params.length; i++)
						{
							evt_params = evt_params.replace("[param_"+ (i + 1) +"]", _params[i]);
						}
					}
					var tag = evt_params.split("*");
					analytics.trackEvent(analytics.base_tag + tag[0], tag[1], tag[2]); 
				}
			}else
			{
				if(analyticsSetup[_page]!=undefined && analyticsSetup[_page].view!=undefined)
				{
					var view_params = analyticsSetup[_page].view;
					if(_params!=undefined&&_params!=null&&_params.length>0)
					{
						for(var i=0; i<_params.length; i++)
						{
							view_params = view_params.replace("[param_"+(i + 1)+"]", _params[i]);
						}
					}
					analytics.trackPage(analytics.base_tag + view_params);
				}
			}
		}
	}
};

var analyticsSetup = [];
analyticsSetup["home"] = 
{
	view:"",
	twitter:"home*share*twitter",
	facebook:"home*share*facebook",
	gplus:"home*share*gplus",
	about:"home*click*about",
	portfolio:"home*click*portfolio",
	work:"home*click*work",
	interaction:"home*click*interaction",
}
analyticsSetup["about"] = 
{
	view:""
}
analyticsSetup["portfolio"] = 
{
	view:""
}
analyticsSetup["work"] = 
{
	view:"",
}
analyticsSetup["footer"] = 
{
	view:"",
	twitter:"footer*link*twitter",
	facebook:"footer*link*facebook",
	linkedin:"footer*link*linkedin",
	tumblr:"footer*link*tumblr",
	instagram:"footer*link*instagram",
	flickr:"footer*link*flickr",
	contact:"footer*link*tostegroo",
	contactbog:"footer*link*bogdogcontact",
	bogdog:"footer*link*bogdog",
	hive:"footer*link*hive",
	colletivo:"footer*link*colletivo"
}