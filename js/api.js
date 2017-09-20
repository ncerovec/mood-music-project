/**
 * Api
 * @param
 * @constructor
 */
function Api()
{
	this.apiKey = musixMatchApiKey;
	this.songDataset = {available:0, songList:[]};
};

Api.prototype.constructor = Api;

Api.prototype.apiFetchKeywordSongs = function() 
{
	showLoader();

	this.noMoreSongs = false
	this.songDataset.songList = [];
	
	var method = 'track.search';
	var url = 'http://api.musixmatch.com/ws/1.1/';
	var path = url + method;

	var keywords = $('#keywords').val();
	var pageSize = 100;
	var pageIndex = 1;

	var parameters = 	{
							//callback:			'callback',	//separate onReceive callback-function
							apikey: 			this.apiKey,
							format: 			'JSONP',
							country: 			'US',
							s_track_rating: 	'DESC',
							f_has_lyrics: 		'1',
							page_size: 			pageSize,
							page: 				pageIndex,
							//f_music_genre_id:	'18',
							q_lyrics: 			keywords
						};

	var fetchLyrics = $("#lyrics").is(':checked');
	this.getSongs(path, parameters, fetchLyrics);
};

Api.prototype.apiFetchTopSongs = function() 
{
	showLoader();

	this.noMoreSongs = false
	this.songDataset.songList = [];

	var method = 'chart.tracks.get';
	var url = 'http://api.musixmatch.com/ws/1.1/';
	var path = url + method;

	var pageSize = 100;
	var pageIndex = 1;

	var parameters = 	{
							//callback:			'callback',	//separate onReceive callback-function
							apikey: 			this.apiKey,
							format: 			'JSONP',
							country: 			'US',
							s_track_rating: 	'DESC',
							f_has_lyrics: 		'1',
							page_size: 			pageSize,
							page: 				pageIndex
							//f_music_genre_id:	'18'
						};

	this.songDataset.available = 200;	//fetch N songs if possible
	
	var fetchLyrics = $("#lyrics").is(':checked');
	this.getSongs(path, parameters, fetchLyrics);
};

Api.prototype.apiFetchSongLyrics = function(song)
{
	var method = 'track.lyrics.get';
	var url = 'http://api.musixmatch.com/ws/1.1/';
	var path = url + method;

	var parameters = 	{
							//callback:			'callback',	//separate onReceive callback-function
							apikey: 			this.apiKey,
							format: 			'JSONP',
							track_id:			song.id
						};

	this.getSongLyrics(path, parameters, song);
}

Api.prototype.printQuery = function(query)
{
	$('#output').append(query);
};

Api.prototype.populateTable = function(songList)
{
	var tableBody = $('#table-songs>tbody');
	tableBody.html('');

	var hasLyrics = $("#lyrics").is(':checked');
	
	for(var i=0; i<songList.length; i++)
	{
		var song = songList[i];		
		var strRelease = formattedDate(new Date(song.release_date));

		var tr = document.createElement('tr');
		tr.classList.add('animate-bottom');

		//song.hasOwnProperty('lyrics');	//always false - lyrics is not fetched yet?

		var tdID = '<td> <h6>'+ (i+1) +'</h6> </td>';
		var btnLyrics = (true) ? '<h6> <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-id="'+ i +'" data-target="#lyrics-modal"> Lyrics </button> </h6>' : '';
		var tdImage = '<td style="vertical-align: middle;"> <a href="'+  song.url +'" target="_blank"> <img src="'+ song.img +'" class="img-rounded" width="60"> </a> '+ (hasLyrics ? btnLyrics : '') +' </td>';
		var tdPrimary = '<td> <h4>'+ song.name +'</h4> <h5><b>'+ song.artist +'</b></h5> <p> <b>Album:</b> '+ song.album +'</p> </td>';
		var tdSecondary = '<td> <h6>Rating: '+ song.rating +'</h6> <h6>Duration: '+ secToTime(song.duration) +'</h6> <h6>Release date: '+ strRelease +'</h6> </td>';
		var tdButton = '<td style="vertical-align: middle;"> <a href="https://www.youtube.com/results?search_query='+  song.name + ' ' + song.artist +'" target="_blank"> <button class="btn btn-default" type="button"> <i class="fa fa-fw s fa-play"></i> Play </button> </a> </td>';

		//play music online: www.listube.com, www.justhearit.com

    	tr.innerHTML += tdID + tdImage + tdPrimary + tdSecondary + tdButton;
    	tableBody.append(tr);
	}

	hideLoader();
}

Api.prototype.generateXML = function()
{
	var stringListXML = '<add>';

	for(var i=0; i<this.songDataset.songList.length; i++)
	{
		var song = this.songDataset.songList[i];

		stringListXML += '<doc>';
		
		/*
		Object.keys(obj).forEach(function(key,index)
		{
			// key: the name of the object key
			// index: the ordinal position of the key within the object 
		});
		*/
			
		for (var property in song)
		{
			if (song.hasOwnProperty(property))
			{
				//console.log(property, song[property]);
				stringListXML += '<field name="'+property+'">'+song[property]+'</field>';
			}
		}

		stringListXML += '</doc>';
	}

	stringListXML += '</add>';

	download(stringListXML, "song_list.xml", "xml");
};

Api.prototype.generateJSON = function()
{
	var stringListJSON = JSON.stringify(this.songDataset.songList);

	download(stringListJSON, "song_list.json", "json");
};

Api.prototype.getSongs = function(path, parameters, fetchLyrics=false) 
{
	var parent = this;
	
	var output = $.ajax
	({
		url: path, // The URL to the API
		jsonp: 'callback',	// The name of the callback parameter, as specified by the YQL service				
		dataType: 'jsonp',	// Tell jQuery we're expecting JSONP
		type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
	  	//async: false, //synchronous (not supported for cross-domain/jsonp)
		headers: {"Access-Control-Allow-Origin":"*"},
		crossDomain: true,
		data: parameters,
		beforeSend: function(xhr)
		{
			//xhr.setRequestHeader("X-Mashape-Authorization", "YOUR_API_KEY"); // Enter here your Mashape key
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");	//http://api.musixmatch.com
		},
		success: function(data)
		{
			//Change data.source to data.something , where something is whichever part of the object you want returned.
			//To see the whole object you can output it to your browser console using:
			//console.log(data);
			//document.getElementById("output").innerHTML = print_r(data.message);

			if(data.message.header.status_code == 200)
			{
				if(data.message.header.available !== undefined)
				{
					parent.songDataset.available = data.message.header.available;
				}

				var numSongs = data.message.body.track_list.length;
				for(var i=0; i<numSongs; i++)
				{
					var song = data.message.body.track_list[i].track;
					
					
					var newSong = 	{
										id:				song.track_id,
										common_id:		song.commontrack_id,
										img:			song.album_coverart_100x100,
										artist:			song.artist_name,
										name:			song.track_name,
										album:			song.album_name,
										duration:		song.track_length,
										rating:			song.track_rating,
										favourite:		song.num_favourite,
										url:			song.track_share_url,
										release_date: 	song.first_release_date,
										query_keywords:	parameters.q_lyrics
									};

					parent.songDataset.songList.push(newSong);

					if(fetchLyrics)
					{
						parent.apiFetchSongLyrics(newSong);
					}

					//var songPrint = (i+1) + ' [' + song.track_id + '] ' + song.artist_name + ' - ' +  song.track_name + '\n';
					//console.log(songPrint);
				}

				if(numSongs == 0) parent.noMoreSongs = true;
			}
			else
			{
				parent.noMoreSongs = true;
			}
		},
		error: function(err)
		{
			alert(err);
		},
		complete: function(xhr, status)
		{
			var songCount = parent.songDataset.songList.length;

			if(parent.songDataset.available > songCount && !parent.noMoreSongs)
			{
				parameters.page++;	//replaces calculation
				//var pageIndex = Math.floor(songCount/parameters.page_size)+1;
				//parameters.page = pageIndex;
				
				parent.getSongs(path, parameters, fetchLyrics);	//recursive call
			}
			else
			{
				parent.printQuery(this.url);

				console.log(parent.songDataset);

				//parent.generateJSON(parent.songDataset);
				parent.populateTable(parent.songDataset.songList);
			}
		}
	});
};

Api.prototype.getSongLyrics = function(path, parameters, song) 
{
	var parent = this;
	
	var output = $.ajax
	({
		url: path, // The URL to the API
		jsonp: 'callback',	// The name of the callback parameter, as specified by the YQL service				
		dataType: 'jsonp',	// Tell jQuery we're expecting JSONP
		type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
	  	//async: false, //synchronous (not supported for cross-domain/jsonp)
		headers: {"Access-Control-Allow-Origin":"*"},
		crossDomain: true,
		data: parameters,
		beforeSend: function(xhr)
		{
			//xhr.setRequestHeader("X-Mashape-Authorization", "YOUR_API_KEY"); // Enter here your Mashape key
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");	//http://api.musixmatch.com
		},
		success: function(data)
		{
			if(data.message.header.status_code == 200)
			{
				var lyrics = data.message.body.lyrics.lyrics_body;

				song.lyrics = lyrics;
			}
		},
		error: function(err)
		{
			alert(err);
		},
		complete: function(xhr, status)
		{
			//song lyrics fetched
		}
	});
};