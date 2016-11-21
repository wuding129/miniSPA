/**
 * Created by chuck on 2016/11/21.
 */

/**
 * 定义初始加载的页面片段，即缺省页面，
 * 页面片段对应的url定义同名对象，里面放路径和初始化方法
 */
var home = {};
home.partial = "lib/home.html";
/**
 * 初始化
 */
home.init = function () {

};

/**
 * 404页面片段
 */
var notFound = {};
notFound.partial = "lib/404.html";
notFound.init = function () {
    alert('您访问的页面不存在')
};

/**
 * 定义全局变量
 * html片段缓存，局部刷新所在dom对象
 *
 */
var settings = {};
settings.partialCache = {};
settings.divDemo = document.getElementById("dome");

/**
 * 主程序
 */
var miniSPA = {};
miniSPA.changeUrl = function () {
    var url = location.hash.replace('#', '');
    if (url === '') {
        url = 'home';
    }
    if (!window[url]) {
        url = "notfound";
    }
    miniSPA.ajaxRequest(window[url].partial, 'GET', '', function (status, page) {
        if (status == 404) {
            url = 'notFound';
            miniSPA.ajaxRequest(window[url].partial, 'GET', '', function (status, page404) {
                settings.divDemo.innerHTML = page404;
                miniSPA.initFunc(url); // load 404 controller
            });
        } else {
            settings.divDemo.innerHTML = page;
            miniSPA.initFunc(url); // load url controller
        }
    });
};

miniSPA.ajaxRequest = function (url, method, data, callback) {
    if (settings.partialCache[url]) {
        callback(200, settings.partialCache[url]);
    } else {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method, url, true);
            if (method === 'POST') {
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    switch (xmlhttp.status) {
                        case 404:
                            url = 'notFound';
                            break;
                        default:
                            var parts = url.split('.');
                            // 只缓存静态html页面提升性能
                            if (parts.length>1 && parts[parts.length-1] == 'html') {
                                settings.partialCache[url] = xmlhttp.responseText
                            }
                    }
                    callback(xmlhttp.status, xmlhttp.responseText);
                }
            }
        } else {
            alert('Sorry, your browser is too old to ru this app.');
            callback(404, {});
        }
    }
};

