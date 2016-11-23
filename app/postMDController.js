/**
 * Created by chuck on 2016/11/23.
 */
var postMDController = function () {
    var postMD = {};
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
    return postMD;
};