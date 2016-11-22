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
settings.divDemo = document.getElementById("demo");

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
        url = "notFound";
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
            alert('Sorry, your browser is too old to run this app.');
            callback(404, {});
        }
    }
};

miniSPA.render = function (url) {
    settings.rootScope = window[url];
    miniSPA.refresh(settings.divDemo, settings.rootScope);
};

miniSPA.refresh = function (node, scope) {
    var children = node.childNodes;
    if (node.nodeType != 3) {
        for (var k=0; k<node.attributes.length; k++) {
            // 替换属性中定义的变量
            node.setAttribute(node.attributes[k].name, miniSPA.feedData(node.attributes[k].value, scope));
        }
        if (node.hasAttribute('data-src')) {
            // 替换src属性，直接设置src的值为变量会报错，设置为空值然后用data-src的值替换
            node.setAttribute('src', node.getAttribute('data-src'));
        }
        var childrenCount = children.length;
        for (var j=0; j<childrenCount; j++) {
            // nodeType == 3是文本节点
            if (children[j].nodeType != 3 && children[j].hasAttribute('data-repeat')) {
                var item = children[j].dataset.item;
                var repeat = children[j].dataset.repeat;
                children[j].removeAttribute('data-repeat');
                var repeatNode = children[j];
                // 迭代repeat的数据
                for (var prop in scope[repeat]) {
                    repeatNode = children[j].cloneNode(true);
                    node.appendChild(repeatNode);
                    var repeatScope = scope;
                    var obj = {};
                    obj.key = prop;
                    obj.value = scope[repeat][prop];
                    repeatScope[item] = obj;
                    // 递归调用，替换或迭代所有子节点的变量
                    miniSPA.refresh(repeatNode, repeatScope)
                }
                node.removeAttribute(children[j]);
            } else {
                // 不替换，只迭代子节点
                miniSPA.refresh(children[j], scope)
            }
        }
    } else {
        // 直接替换变量
        node.textContent = miniSPA.feedData(node.textContent, scope);
    }
};

miniSPA.feedData = function (template, scope) {
    return template.replace(/\{\{([^}]+)\}\}/gmi, function (model) {
        var properties = model.substring(2, model.length-2).split('.');
        var result = scope;
        for (var n in properties) {
            if (result) {
                switch (properties[n]) {
                    case 'key':
                        result = result.key;
                        break;
                    case 'value':
                        result = result.value;
                        break;
                    case 'length':
                        var length = 0;
                        for (var x in result) length++;
                        result = length;
                        break;
                    default:
                        result = result[properties[n]];
                }
            }
        }
        return result;
    });
};

miniSPA.initFunc = function (partial) {
    var fn = window[partial].init;
    if (typeof fn === 'function') {
        fn()
    }
};

miniSPA.ajaxRequest('lib/404.html', 'GET', '', function (status, partial) {
    settings.partialCache.notFound = partial;
});