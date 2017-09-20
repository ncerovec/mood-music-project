$(document).ready(function()
{
    $("#loader").hide();

    for (var category in categories)
    {
        $('#themes').append($('<option>', 
        {
            value: category,
            text : category 
        }));
    };
});

$(function(ready)
{
    $('#themes').change(function(e)
    {
        //alert(this.value);

        if(this.value != '-1')
        {
            $("#keywords").val(generateWords(categories[this.value], 3));
        }
    });

    $('#lyrics-modal').on('show.bs.modal', function(e) 
    {
        var songID = $(e.relatedTarget).data('id'); //$(this).data('id');

        if(songID != null)
        {
            var song = api.songDataset.songList[songID];
            
            if(lyrics !== undefined && lyrics !== null)
            {
                $('#lyrics-modal .modal-header h4').text("Lyrics: " + song.artist + " - " + song.name);
                $('#lyrics-modal .modal-body pre').text(song.lyrics);
            }
        }
    });
});

function showLoader()
{
    $("#song-list").hide();
    $("#loader").show();
}

function hideLoader()
{
    $("#loader").hide();
    $("#song-list").show();
}

function generateWords(category, num)
{
    var words = [];

    if(num <= category.length)
    {
        for(var i=0; i<num; i++)
        {
            var word = null;
               
            do
            {
                var index = Math.floor(Math.random()*category.length);
                word = category[index];
            }
            while(words.indexOf(word) >= 0);

            words.push(word);
        }
    }

    return words;
}

function formattedDate(date)
{
    var dateString = ("0" + date.getUTCDate()).slice(-2) + "." + ("0" + (date.getUTCMonth()+1)).slice(-2) + "." + date.getUTCFullYear();
    return dateString;
}

function secToTime(sec)
{
    var date = new Date(sec * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();

    if (hh < 10) {hh = "0"+hh;}
    if (mm < 10) {mm = "0"+mm;}
    if (ss < 10) {ss = "0"+ss;}

    return  hh+":"+mm+":"+ss;
}