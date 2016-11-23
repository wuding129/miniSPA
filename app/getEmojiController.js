/**
 * Created by chuck on 2016/11/23.
 */
var getEmojiController = function () {
    var getEmoji = {};
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
    return getEmoji;
};