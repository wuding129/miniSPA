/**
 * Created by chuck on 2016/11/22.
 */
var getEmoji = {};
getEmoji.partial = "getEmoji.html";
getEmoji.init = function () {
    document.getElementById('spinner').style.visibility = 'visible';
    document.getElementById('content').style.visibility = 'hidden';
    miniSPA.ajaxRequest('https://api.github.com/emojis', 'GET', '', function (status, partial) {
        getEmoji.emojis = JSON.parse(partial);
        miniSPA.render('getEmoji');
        document.getElementById('content').style.visibility = 'visible';
        document.getElementById('spinner').style.visibility = 'hidden';
    });
};

var postMD = {};
postMD.partial = 'postMD.html';
postMD.init = function () {
    miniSPA.render('postMD');
};
postMD.submit = function () {
    document.getElementById('spinner').style.visibility = 'visible';
    var mdText = document.getElementById('mdText');
    var md = document.getElementById('md');
    var data = '{"text":"'+mdText.value.replace(/\n/g, '<br>')+'","mode": "gfm","context": "gethub/gollum"}';
    miniSPA.ajaxRequest('https://api.github.com/markdown', 'POST', data, function (status, page) {
        document.getElementById('spinner').style.visibility = 'hidden';
        md.innerHTML = page;
    });
    mdText.value = '';
};
miniSPA.changeUrl();