/**
 * Created by chuck on 2016/11/22.
 */
Router = {}
Router.when = function (url, obj) {
    var innerObj = obj || {}
    innerObj.controller = innerObj.controller || function init() {}
    var vm = eval(innerObj.controller)();
    vm.partial = innerObj.partial;
    window[url] = vm
}
Router.when('getEmoji',{
    partial: "getEmoji.html",
    controller: "getEmojiController"
})

Router.when('postMD',{
    partial: "postMD.html",
    controller: "postMDController"
})


miniSPA.changeUrl();