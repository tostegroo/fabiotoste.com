$(function(window)
{
    var share = {};
	share.url = 'http://fabiotoste.com/';

	share.shareFacebook = function()
	{
		var url = encodeURIComponent(share.url);
		var fbs = (main.mobile) ? 'http://m.facebook.com/sharer.php?u=' : 'https://www.facebook.com/sharer.php?u='

		utils.openPopup(
			fbs+url,
			'fabiotoste.com',
			626,
			436
		);
	}
	
	share.shareTwitter = function()
	{
		var hashtags = 'fabiotoste.com';
		var description = 'Want to know more about Fabio Toste?';
		var url = encodeURIComponent(share.url);
		
		utils.openPopup(
			'http://twitter.com/share?url='+url+'&text='+description,
			'fabiotoste.com',
			626,
			436
		);
	}
	
	share.shareGplus = function()
	{
		var url = encodeURIComponent(share.url);
		utils.openPopup(
			'https://plus.google.com/share?url='+url,
			'fabiotoste.com',
			500,
			460
		);
	}
    window.share = share;
	
}(window));