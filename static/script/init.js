/**
 * Created by JetBrains WebStorm.
 * User: amguo
 * Date: 12-2-3
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */
void function(window,doc,undefined){
    //this.imageMarker || (this.imageMarker=function(){});
    var tk=im.tk,UA=navigator.userAgent;

    /*tk.addEvent(doc,'DOMContentLoaded',function(){
        alert(1);
    },false);*/
    /*tk.domReady(
        function(){
            im.module.ws.createImagePreview();
        }
    );*/

    tk.addEvent(doc,'DOMContentLoaded',function(){

        /*if(!/Gecko/.test(UA) || !doc.documentElement.mozRequestFullScreen){
         }*/
        /*if(!/Firefox/.test(UA) || !parseInt(UA.split('Firefox/')[1])>7){
            doc.innerHTML='';
            doc.write('请使用<br />1.Firefox 8.0+浏览器<a href="http://firefox.com.cn/download/">传送门</a><br />2.网易定制版Firefox 8.0+浏览器<a href="http://download.firefox.com.cn/packaging/netease/firefox-netease-final.exe">传送门</a>');
            return false;
        }*/
        im.module.ws.Init();
    },false);
    /*tk.addEvent(doc,'contextmenu',function(e){
        e=e || window.event;
        tk.stopEvent(e);
    },false);*/
    tk.addEvent(doc,'dragstart',function(e){
        e=e || window.event;
        tk.stopEvent(e);
    },false);
    /*tk.addEvent(doc,'mousedown',function(){
        try {
            document.selection.empty()
        } catch (e) {
            getSelection().removeAllRanges()
        }
    },false);*/
    /*doc.onmousedown=function(){
        try {
            document.selection.empty()
        } catch (e) {
            getSelection().removeAllRanges()
        //}
    }*/
}(window,document);

