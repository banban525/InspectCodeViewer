
/**
 *  GETパラメータを配列にして返す
 *  
 *  @return     パラメータのObject
 *
 */
var getUrlVars = function(){
    var vars = {}; 
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch !== -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key !== '') vars[key] = decodeURI(val);
    } 
    return vars; 
}



var parameters = getUrlVars();

if("therma" in parameters)
{
    if(parameters["therma"] === "dark")
    {
        var styleElement = document.getElementById('codestyle');
        styleElement.href = "../../../css/darkTheme.css";
    }
}

var codeElement = document.getElementById('code');

if("line" in parameters)
{
    codeElement.className = "brush: csharp highlight: "+parameters["line"];

    window.addEventListener("load", ()=>{
        var alllines = document.getElementsByTagName("div");
        for(var i = 0;i<alllines.length;i++)
        {
            if(alllines[i].className.indexOf(`number${parameters["line"]} `) !== -1)
            {
                window.scrollTo(0, alllines[i].offsetTop - window.innerHeight/2);
                break;
            }
        }
    }, false);
}