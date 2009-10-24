// ==UserScript==
// @name          pixiv to drawr gateway
// @namespace     http://lolicsystem.com/gm_scripts/
// @description   pixiv to drawr gateway
// @include       http://www.pixiv.net/member.php*
// @include       http://www.pixiv.net/member_illust.php?id=*
// @include       http://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @include       http://www.pixiv.net/mypixiv_all.php?id=*
// @include       http://www.pixiv.net/bookmark.php?type=user&id=*
// @include       http://www.pixiv.net/bookmark.php?type=reg_user&id=*
// @author        Chiemimaru Kai (lolicsystem)
// @version       0.3
// ==/UserScript==

(function () {
    var waiting_img = '<img src="data:image/gif;data:image/gif;base64,'+
        'R0lGODlhEAAQAPIAAP%2F%2F%2F%2FoORv3F0vyIpPoORgAAAAAAAAAAACH%2BGk'+
        'NyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLj'+
        'ADAQAAACwAAAAAEAAQAAADGwi6MjRiSenIm9hqPOvljAOBZGmeaKqubOu6CQAh%2'+
        'BQQACgABACwAAAAAEAAQAAADHAi63A5ikCEek2TalftWmPZFU%2FWdaKqubOu%2B'+
        'bwIAIfkEAAoAAgAsAAAAABAAEAAAAxwIutz%2BUIlBhoiKkorB%2Fp3GYVN1dWiq'+
        'rmzrvmkCACH5BAAKAAMALAAAAAAQABAAAAMbCLrc%2FjDKycQgQ8xL8OzgBg6ThW'+
        'lUqq5s604JACH5BAAKAAQALAAAAAAQABAAAAMbCLrc%2FjDKSautYpAhpibbBI7e'+
        'OEzZ1l1s6yoJACH5BAAKAAUALAAAAAAQABAAAAMaCLrc%2FjDKSau9OOspBhnC5B'+
        'HfRJ7iOXAe2CQAIfkEAAoABgAsAAAAABAAEAAAAxoIutz%2BMMpJ6xSDDDEz0dMn'+
        'duJwZZulrmzbJAAh%2BQQACgAHACwAAAAAEAAQAAADGwi63P4wRjHIEBJUYjP%2F'+
        '2dZJlIVlaKqubOuyCQAh%2BQQACgAIACwAAAAAEAAQAAADHAi63A5ikCEek2Talf'+
        'tWmPZFU%2FWdaKqubOu%2BbwIAOwAAAAAAAAAAAA%3D%3D'+
        '" style="margin: auto; vertical-align: middle; display: inline;"/>';
    var drawr_ok_img = '<img src="data:image/gif;data:image/gif;base64,'+
        'R0lGODlhEAAQAIMAAPwOS%2FyQgfxUC%2FzL4Pxjtfy1zfyRyvxmHfz7%2B%2Fwx'+
        'FPx%2Bf%2FwfBvxBC%2Fx6wPxtPPzc4iwAAAAAEAAQAAMEcxDISatsGJO9c7sZYT'+
        'zI4H2AoTYGUhQIgqmSug5EExesUa8sWOzR%2B8EepFismBqtWkqm02YYRGmABSKR'+
        'YDAWAeXCK0k8FONvEpGWMBQIBVcY6wokBwZdOQwc8AcCASQPAQ5WA34SDoyBAgIH'+
        'kY8HDhaWFBEAOw%3D%3D'+
        '" style="margin: auto; vertical-align: middle; display: inline;"/>';
    var drawr_ng_img = '<img src="data:image/gif;data:image/gif;base64,'+
        'R0lGODlhEAAQAIMAAFxaXLGxsd%2Ff34qKinV0dcrKyu%2Fw76CgoGprar29vefn'+
        '55SUlH%2BAf9TU1Pz%2B%2FKioqCwAAAAAEAAQAAMEeRDISat8GJ%2FFT35XdgSK'+
        'IzweJgUs6xSF4zzt2gbCKDc1kLC0REPmMAQSCcmvYGgSZcekL2FkJZ7RleGHxBGz'+
        'EgcBQSAAAkRAWYJQgNaC9BrAeDgOCESMWGZIBgxDT0QnA3%2BADyUCAQNDi4YAHA'+
        'uADAwDl5UDCxacFBEAOw%3D%3D'+
        '" style="margin: auto; vertical-align: middle; display: inline;"/>';
    var drawr_zero_img = '<img src="data:image/gif;data:image/gif;base64,'+
        'R0lGODlhEAAQAIMAAI9FTKujp2FbXevV3fKStcJjQvgSRPR%2Fv7a0tp91Z%2BO2'+
        'x%2FY%2FE%2FteFfr6%2Be9xQbgwVCwAAAAAEAAQAAMEdFDISSd4RoTN%2ByZH5i'+
        'FDM3xHKCAsa5YNIRNZy55I0yiHXLOBm87Uo61Iw2Sj%2BGsAFUnmyslSEGBLn6SR'+
        'EBQKC8LQsFhkBCcA2IAlmwWJQKwMHZYZmUShrjQR8AAJDgxXfg4lA38GDw6NDI%2'+
        'BQkQ4GlJWWl5QRADs%3D'+
        '" style="margin: auto; vertical-align: middle; display: inline;"/>';

    // cho45's $X (http://lowreal.net/logs/2006/03/16/1)
    //
    $X = function (exp, context) {
        if (!context) context = document;
        var resolver = function (prefix) {
            var o = document.createNSResolver(context)(prefix);
            return o ? o : (document.contentType == "text/html") ? "" : "http://www.w3.org/1999/xhtml";
        }
        var exp = document.createExpression(exp, resolver);

        var result = exp.evaluate(context, XPathResult.ANY_TYPE, null);
        switch (result.resultType) {
        case XPathResult.STRING_TYPE : return result.stringValue;
        case XPathResult.NUMBER_TYPE : return result.numberValue;
        case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE: {
            result = exp.evaluate(context, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var ret = [];
            for (var i = 0, len = result.snapshotLength; i < len ; i++) {
                ret.push(result.snapshotItem(i));
            }
            return ret;
        }
        }
        return null;
    }

    // 待ちアイコン表示
    //
    var target = $X("//div[@id='profile']/div")[0];
    var orghtml = target.innerHTML;
    target.innerHTML = orghtml + waiting_img;

    // pixivId を、プロフィール画像のURLから取得。プロフィール画像が
    // 存在しない場合は「投稿したイラスト」の1枚目の画像のURLから取得
    //
    var pixivId = '';
    $X("//div[@id='profile']/div/a/img")[0].src.match(/\/profile\/([^\/]+)\//);
    if (RegExp.$1 != '') {
        pixivId = RegExp.$1;
    } else {
        if ($X("//div[@id='content']//a[contains(text(),'投稿したイラスト')]/../..//a/img")[0] != undefined) {
            $X("//div[@id='content']//a[contains(text(),'投稿したイラスト')]/../..//a/img")[0].src.match(/\/img\/([^\/]+)\//);
            if (RegExp.$1 != '') {
                pixivId = RegExp.$1;
            }
        }
    }

    // pixivId が得られなかった場合は、NG(グレー)アイコンを表示して終わり
    //
    if (pixivId == undefined || pixivId == '') {
        target.innerHTML = orghtml + drawr_ng_img;      // If pixivId cannot be get,put NG icon.
        return;
    }

    // pixivId が得られた場合、drawr の URL を作り、接続。
    // 但し、
    //     ・前回の drawr 情報取得から24時間以内
    // の場合は、drawr に繋がず、キャッシュを使う。
    //
    var drawrUrl = 'http://drawr.net/' + pixivId;
    var today = new Date();
    var cacheInfo = eval(GM_getValue("cacheInfo", "({})")) || {};
    var siteinfo = cacheInfo[pixivId] || {};
    if (siteinfo.lasttime == undefined || today.getTime() - siteinfo.lasttime > 86400000) {
        siteinfo.lasttime = today.getTime();
        GM_xmlhttpRequest({
            method : "GET",
            url    : drawrUrl,
            onload : function(r) {
                if (r.status == 200 && r.finalUrl != 'http://drawr.net/') {
                    siteinfo.status = 'ok';
                    var d = document.createElement('div');
                    d.innerHTML = r.responseText;
                    var imagenum = $X(".//li[@class='pbook']/a", d)[0].innerHTML;
                    siteinfo.imagenum = imagenum;
                    if ( imagenum == 0) {
                        target.innerHTML = orghtml + '<a href="' + drawrUrl + '">' + drawr_zero_img + '</a>';
                    } else {
                        target.innerHTML = orghtml + '<a href="' + drawrUrl + '">' + drawr_ok_img + '</a>';
                    }
                } else {
                    target.innerHTML = orghtml + drawr_ng_img;
                    siteinfo.status = 'ng';
                }
                cacheInfo[pixivId] = siteinfo;
                GM_setValue("cacheInfo", cacheInfo.toSource());
            }
        });
    } else {
        if (siteinfo.status == 'ok') {
            if ( siteinfo.imagenum == 0) {
                target.innerHTML = orghtml + '<a href="' + drawrUrl + '">' + drawr_zero_img + '</a>';
            } else {
                target.innerHTML = orghtml + '<a href="' + drawrUrl + '">' + drawr_ok_img + '</a>';
            }
        } else {
            target.innerHTML = orghtml + drawr_ng_img;
        }
    }
})();
