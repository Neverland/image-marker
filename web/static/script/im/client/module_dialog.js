/*
 * Dailog v:1.0
 *
 * Copyright 2011, enix@foxmail.com
 * Date: 2011-11-14
 * Includes toolkit lib
 * last modified 2012 5 6
 *http://bluescript.iteye.com/
 */


/*
 *	类名：[Dailog]
 *	功能：UI组件
 *	作用：对话框
 */

! function (window, undefined) {
	function Dialog(O,fn) {
		if (!(this instanceof arguments.callee)) return new arguments.callee(O,fn);
		var indicator,doc,that,frame,root,tk,Public;

		(
			doc = document,
				that = this,
				tk = im.tk,
				root = doc.body,
				frame = doc.createDocumentFragment(),
				indicator = arguments.callee
			)


		O || (O = {});


		that.html = O.html;
		that.titleTxt = O.title || '标题';
		that.buttonText = O.btn || ' 确定 ';
		that.hasMask = O.hasMask || true;
		that.hasCancel = O.cancel || true;
		that.cancelTxt = O.cancelTxt || ' X ';
		that.width = O.width || 400;
		that.height = O.height || 300;
		that.hasAnimate = O.animate || false;
		that.drag= O.drag || false;
		that.name = O.name || '';

		that.maskColor = O.maskColor || 'black';
		that.maskDepth = O.maskDepth || 50;
		that.dialogBg = O.dialogBg || 'white';
		that.zIndex = Math.floor(999 + Math.random() * 9000);
		that.viewPort = tk.getViewportSize();
		that.scollPos = tk.getScrollPosition();
		that.maxSize = [that.viewPort[0] + that.scollPos[0],that.viewPort[1] + that.scollPos[1]];

		typeof fn === 'function' && (that.fn = fn);

		that.mask = that.title = that.titleCon = that.cancel = that.container = null;


		indicator.fn = indicator.prototype;
		indicator.fn.constructor = indicator;
		Public = indicator.fn;

		Public.init = function() {
			that.htmlFactory();
			that.hasMask && that.createMask();
			that.createDailog();
			that.addEvent();
		};
		Public.htmlFactory = function() {
			that.mask = tk.getHtmlElement('div');
			that.dialog = tk.getHtmlElement('div');
			that.title = tk.getHtmlElement('h3');
			that.titleCon = tk.getHtmlElement('span');
			that.cancel = tk.getHtmlElement('b');
			that.container = tk.getHtmlElement('div');
		};
		Public.createMask = function() {
			//console.log(root.offsetHeight);
			root.appendChild(that.mask);
			that.mask.style.cssText = 'position:absolute;z-index:' + that.zIndex + ';background-color:' + that.maskColor + ';opacity:' + that.maskDepth / 100 + ';width:100%;height:' + (root.parentNode.scrollHeight) + 'px;top:0;left:0;';
		};
		Public.createDailog = function() {


			that.titleCon.appendChild(doc.createTextNode(that.titleTxt));
			that.title.appendChild(that.titleCon);

			that.cancel.appendChild(doc.createTextNode(that.cancelTxt));
			that.cancel.style.cssText = 'position:absolute;cursor:pointer';


			that.title.appendChild(that.cancel);
			that.container.appendChild(that.title);
			that.name && (that.container.id='dialogContainer-'+that.name);
			that.container.className='dialogContainer';

			that.dialog.appendChild(that.title);
			that.dialog.style.cssText = 'position:absolute;z-index:' + (that.zIndex + 1) + ';width:' + that.width + 'px;height:' + that.height + 'px;left:' + (that.viewPort[0] - that.width) / 2 + 'px;top:' + ((that.viewPort[1] - that.height) / 2 + that.scollPos[1]) + 'px;background-color:' + that.dialogBg;

			that.name && (that.dialog.id = 'dialog-'+that.name);
			that.dialog.className='dialog';

			that.dialog.appendChild(that.container);



			that.hasAnimate && (
				that.dialog.style.opacity = 0,
					im.animate.fadeIn.call(that.dialog, 80)
				);
			frame.appendChild(that.dialog);
			root.appendChild(frame);
			root.style.overflowY='hidden';

			that.html && (that.container.innerHTML=that.html);

			that.fn && (that.fn.call(that));

		};
		Public.removeDailog = function() {
			try{
				/*that.hasAnimate && (
				 im.animate.fadeOut.call(that.dialog, 20,function(){
				 delete that.dialog.parentNode.removeChild(that.dialog);
				 })
				 );*/
				that.dialog.parentNode.removeChild(that.dialog);

			}catch(e){}

			try{
				that.mask.parentNode.removeChild(that.mask);
			}catch(e){}
			root.removeAttribute('style');
			that.dialog=that.mask=null;
		};
		Public.addEvent = function() {
			tk.addEvent(that.cancel, 'click', function() {
				that.removeDailog();
			}, false)
			tk.addEvent(that.title, 'mousedown', function(e) {
				that.drag && that.mousemoveCheckThreshold(e,this.parentNode)
			}, false)
		};
		Public.mousemoveCheckThreshold=function(e,taregt){
			e=tk.getEvent(e);
			/*var target=tk.getTarget(e);
			 while (target !== that.dialog) {
			 target = target.parentNode;
			 }*/
			var scroll=tk.getScrollPosition();
			if(!taregt.nodeType || taregt.nodeType !==1) { return; }
			that.currentTarget=taregt;

			({
				mousedown:function(e) {
					e = tk.getEvent(e);
					tk.stopEvent(e);

					var target=that.currentTarget;


					that.pos = tk.getClinetRect(that.currentTarget);
					that.origin = [e.clientX - that.pos.left,e.clientY - that.pos.top];


					/*tk.addEvent(doc, 'mouseup', function(e){
					 that.mousemoveCheckThreshold(e,taregt)
					 }, false);
					 tk.addEvent(doc, 'mousemove', function(e){
					 that.mousemoveCheckThreshold(e,taregt)
					 }, false);*/
					doc.onmousemove=function(e){
						that.mousemoveCheckThreshold(e,taregt)
					}
					doc.onmouseup=function(e){
						that.mousemoveCheckThreshold(e,taregt)
					}
				},
				mousemove:function(e) {
					e = tk.getEvent(e);
					var target = that.currentTarget, reffer;

					/*target && (reffer = {
					 top:e.clientX,
					 right:e.clientY + target.offsetWidth,
					 down:e.clientX + target.offsetHeight,
					 left:e.clientY
					 });*/
					try{
						that.currentTarget.style.top = e.clientY-that.origin[1]+scroll[1]+'px';
						that.currentTarget.style.left = e.clientX-that.origin[0]+scroll[0]+'px';
					} catch(e){}
					//target.nodeName.toLowerCase() === 'b' ? that.handlerMove.call(target, e ,that) : that.areaMove.call(target, e,that);
					tk.stopEvent(e);
				},
				mouseup:function(e) {
					e = tk.getEvent(e);
					var target = that.currentTarget;


					/*tk.removeEvent(doc, 'mousemove',  function(e){
					 console.log(2121212);
					 that.mousemoveCheckThreshold(e,taregt)
					 } , false);
					 tk.removeEvent(doc, 'mouseup',  function(e){
					 console.log(11212);
					 that.mousemoveCheckThreshold(e,taregt)
					 },  false);*/
					doc.onmousemove=null;
					doc.onmouseup=null;
					/*doc.onmousemove=null;
					 doc.onmouseup=null;*/
					that.currentTarget=null;

					tk.stopEvent(e);
				}
			})[e.type](e)
		}
		that.init();
	}
	im.tk.addEvent(window,'load',function(){
		im.module.dialog || (im.module.dialog=Dialog);
	},false);

}(window)