(function(window)
{
	var address = {};
	
	address.onChangeUrl = function(value)
    {
    	var state = '';
    	if(value==undefined)
    		state = (history.state==null || history.state.value==undefined) ? '/' : history.state.value;
    	else
    		state = value;

    	state= state.replace('/', '');

    	if(state!="about")
    	{
    		if(main.aboutOpen)
				main.closeAbout();
    	}

    	switch(state) 
    	{
			case '':
			   	main.scrollToByID("c-welcome");
			    break;
			case 'about':
				if(!main.aboutOpen)
					main.openAbout();
			    break;
			case 'portfolio':
			    main.scrollToByID("c-portfolio", 1, -$(window).height() * 0.3);
			    break;
			case 'work':
			    main.scrollToByID("c-work", 1, 60);
			    break;
		}
    }

    address.changeUrl = function(url)
	{
		url = (url==undefined) ? '/' : url;
		url = (url.substring(0, 1)!='/') ? '/' + url : url;
		history.pushState({value:url}, "", url);
	}
	
    window.address = address;
}(window));
