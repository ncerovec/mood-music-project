$(document).ready(function()
{
	
});

function callAPI() 
{ 
	var keywords = $('#keywords').val();
	getSongs(keywords);
}

function showSongList(result)
{
	$('#output').text(result.songs);
}

function getSongs(keywords) 
{ 
	var result = {songs:'',available:0};
	var pageSize = 100;
	var pageNum = result.available/pageSize;

	var output = $.ajax
	({
		url: 'http://api.musixmatch.com/ws/1.1/track.search', // The URL to the API
		jsonp: 'callback',	// The name of the callback parameter, as specified by the YQL service				
		dataType: 'jsonp',	// Tell jQuery we're expecting JSONP
		type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
	  	//async: false, //synchronous (not supported for cross-domain/jsonp)
		headers: {"Access-Control-Allow-Origin":"*"},
		crossDomain: true,
		beforeSend: function(xhr)
		{
			//xhr.setRequestHeader("X-Mashape-Authorization", "YOUR_API_KEY"); // Enter here your Mashape key
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");	//http://api.musixmatch.com
		},
		data:
		{	
			//callback:'callback',	//separate onReceive callback-function
			apikey:'2c90f6ec95f22aa18a905152f163a9d6',
			format:'JSONP',
			country:'US',
			s_track_rating:'DESC',
			f_has_lyrics:'1',
			page_size:pageSize,
			page:pageNum,
			//f_music_genre_id:'18',
			q_lyrics:keywords
		}, // Additional parameters here
		success: function(data)
		{
			//
			//Change data.source to data.something , where something is whichever part of the object you want returned.
			//To see the whole object you can output it to your browser console using:
			//console.log(data);
			//document.getElementById("output").innerHTML = print_r(data.message);

			if(data.message.header.status_code == 200)
			{
				result.available = data.message.header.available;
				var numSongs = data.message.body.track_list.length;

				for(var i=0; i<numSongs; i++)
				{
					var song = data.message.body.track_list[i].track;

					result.songs += (i+1) + ' [' + song.track_id + '] ' + song.artist_name + ' - ' +  song.track_name + '\n';
				}
			}
		},
		error: function(err)
		{
			alert(err);
		},
		complete: function(xhr, status)
		{
			showSongList(result);
		}
	});
}