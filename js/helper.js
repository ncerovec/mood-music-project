function formattedDateTime(date)
{
    var dateTimeString =
        date.getUTCFullYear() +"/"+
        ("0" + (date.getUTCMonth()+1)).slice(-2) +"/"+
        ("0" + date.getUTCDate()).slice(-2) + " " +
        ("0" + date.getUTCHours()).slice(-2) + ":" +
        ("0" + date.getUTCMinutes()).slice(-2) + ":" +
        ("0" + date.getUTCSeconds()).slice(-2);

    return dateTimeString;
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

function download(data, filename, type)
{
    //Method #1 - not functional
    //var url = 'data:text/json;charset=utf8,' + encodeURIComponent(textData);
	//window.open(url, '_blank');
	//window.focus();

    //Method #2 - functional
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
   
    if (window.navigator.msSaveOrOpenBlob) // IE10+
    {
        window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else
    {
    	// Others
        var url = URL.createObjectURL(file);
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(function()
        {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function print_r(arr,level)
{
    var dumped_text = "";
    if(!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";

    if(typeof(arr) == 'object')
    {   
        //Array/Hashes/Objects 
        for(var item in arr)
        {
            var value = arr[item];

            if(typeof(value) == 'object')
            { 
                //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += print_r(value,level+1);
            }
            else
            {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    }
    else
    { 
        //Stings/Chars/Numbers etc.
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    
    return dumped_text;
}