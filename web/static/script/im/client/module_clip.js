/*
 * Clip v:final
 *
 * Copyright 2011, enix@foxmail.com
 * Date: 2012-2-3
 *http://bluescript.iteye.com/
 */


/*
 *	类名：[Clip]
 *	功能：UI组件
 *	作用：剪裁框组件，稳定版本
 */
!function (window, undefined) {
	var Clip = function (node) {
		var indicator = arguments.callee,
			doc = document,
			tk = im.tk,
			that = this,
			handlerSize = 6,
			rules = null;
		node = node || doc.getElementsByTagName('body')[0];

		if (!that instanceof indicator) {
			return new indicator(node)
		}

		rules = {
			'TL':{
				css :'top:0;left:0;cursor:nw-resize',
				size:function (e, that) {//左上
					rules.CL.size(e, that);
					rules.TC.size(e, that);
				}
			},
			'TC':{
				css :'top:0;left:48%;cursor:n-resize',
				size:function (e, that) {//上
					/*that.hanlderInfo.height= Math.max(that.hanlderInfo._down - e.clientY,40);
					 that.hanlderInfo.top = that.hanlderInfo._fixTop - that.hanlderInfo.height;*/
					if (that.hanlderInfo) {
						that.correctY(that.hanlderInfo._down - e.clientY, that.hanlderInfo._mxTH, that);
						that.correctTop(that);
					}
				}
			},
			'TR':{
				css :'right:0;top:0;cursor:ne-resize',
				size:function (e, that) {//右上
					rules.CR.size(e, that);
					rules.TC.size(e, that);
				}
			},
			'CL':{
				css :'top:48%;left:0;cursor:w-resize',
				size:function (e, that) {//左
					/*that.hanlderInfo.width = Math.max(that.hanlderInfo._right - e.clientX,40);
					 that.hanlderInfo.left = that.hanlderInfo._fixLeft - that.hanlderInfo.width;*/
					if (that.hanlderInfo) {
						that.correctX(that.hanlderInfo._right - e.clientX, that.hanlderInfo._mxLW, that);
						that.correctLeft(that);
					}
				}
			},
			'CR':{
				css :'top:48%;right:0px;cursor:e-resize',
				size:function (e, that) {//右
					//that.hanlderInfo.width = Math.max(e.clientX - that.hanlderInfo._left,40);
					if (that.hanlderInfo) {
						that.correctX(e.clientX - that.hanlderInfo._left, that.hanlderInfo._mxRW, that);
					}
				}
			},
			'BL':{
				css :'bottom:0;left:0;cursor:sw-resize',
				size:function (e, that) {//左下
					rules.CL.size(e, that);
					rules.BC.size(e, that);
				}
			},
			'BC':{
				css :'bottom:0;left:48%;cursor:s-resize',
				size:function (e, that) {//下
					//that.hanlderInfo.height = Math.max(e.clientY-that.hanlderInfo._up,40);
					if (that.hanlderInfo) {
						that.correctY(e.clientY - that.hanlderInfo._top, that.hanlderInfo._mxDH, that);
					}
				}
			},
			'BR':{
				css :'bottom:0;right:0px;cursor:se-resize',
				size:function (e, that) {//右下
					rules.CR.size(e, that);
					rules.BC.size(e, that);
				}
			}
		};
		that.area = null;
		indicator.prototype.constructor = indicator,
			indicator.fn = indicator.prototype,
			indicator.fn.constructor = indicator;

		indicator.fn.activity = function (config, fn) {

			var handler = null, handleStyle = [];
			typeof fn === 'function' && (that.fn = fn);
			that.data && (that.Data = null);
			if (null === that.area) {
				that.info = tk.getHtmlElement('span')
				that.area = tk.getHtmlElement('div');
				that.area.style.visibility = 'hidden';
				that.area.className = 'Area';
				that.area.appendChild(that.info);
				node.appendChild(that.area);
				handleStyle = ['TL', 'TC', 'TR', 'CL', 'CR', 'BL', 'BC', 'BR'];
				tk.each(Array(8), function (a, b) {
					handler = tk.getHtmlElement('b');
					handler.className = handleStyle[a];
					handler.fn = rules[handleStyle[a]];
					tk.addEvent(handler, 'mousedown', function (e) {
						that.mousemoveCheckThreshold(e, that)
					}, false);
					/*handler.onmousedown=function(e){
					 that.mousemoveCheckThreshold(e,that)
					 }*/
					that.area.appendChild(handler);
					that.setHanldPosition(handler, that.area, handleStyle[a]);
				});
				tk.addEvent(that.area, 'mousedown', function (e) {
					that.mousemoveCheckThreshold(e, that)
				}, false);
				/*that.area.onmousedown=function(e){
				 that.mousemoveCheckThreshold(e,that)
				 }*/
				that.area.style.visibility = 'visible';
			}
			//that.setProp(+config.width, +config.height);
			var parent = that.area.parentNode;
			that.area.style.cssText = 'width:' + config.width + 'px;height:' + config.height + 'px;top:' + (parent.scrollTop + config.top) + 'px;left:' + (parent.scrollLeft + config.left) + 'px';
			that.fn && that.fn();
			/*that.area.style.width=config.width+'px';
			 that.area.style.height=config.height+'px';
			 that.area.style.top=that.area.parentNode.scrollTop+'px';
			 that.area.style.left=that.area.parentNode.scrollLeft+'px';*/
		};
		indicator.fn.setHanldPosition = function (c, p, d) {
			var W = p.offsetWidth, H = p.offsetHeight, w1 = (W - handlerSize), w2 = Math.floor((W - handlerSize) / 2), h1 = (H - handlerSize), h2 = Math.floor((W - handlerSize) / 2);
			c.style.cssText = rules[d].css;
		};
		indicator.fn.mousemoveCheckThreshold = function (e, that) {
			e = tk.getEvent(e);
			var target = tk.getTarget(e),
				pointer = [],
				eType = e.type,
				evFn = function (e) {
					that.mousemoveCheckThreshold(e, that)
				};
			while (target && target.nodeType !== 1) {
				target = target.parentNode;
			}



			({
				mousedown:function (e) {
					e = tk.getEvent(e);
					tk.stopEvent(e);
					doc.currentTarget = target;
					that.pos = tk.getClinetRect(target);
					that.origin = [e.clientX - that.pos.left, e.clientY - that.pos.top];
					target.nodeName.toLowerCase() === 'b' && that.checkHandler(e, that);
					tk.addEvent(doc, 'mouseup', evFn, false);
					tk.addEvent(doc, 'mousemove', evFn, false);
					/*doc.onmouseup=function(e){
					 that.mousemoveCheckThreshold(e,that)
					 }
					 doc.onmousemove=function(e){
					 that.mousemoveCheckThreshold(e,that)
					 }*/
				},
				mousemove:function (e) {
					e = tk.getEvent(e);
					var target = doc.currentTarget, reffer = {
						top  :e.clientX,
						right:e.clientY + target.offsetWidth,
						down :e.clientX + target.offsetHeight,
						left :e.clientY
					};
					target.nodeName.toLowerCase() === 'b' ? that.handlerMove.call(target, e, that) : that.areaMove.call(target, e, that);
					tk.stopEvent(e);
				},
				mouseup  :function (e) {
					e = tk.getEvent(e);
					var target = tk.getTarget(e),
						timeout;

					if (target.nodeName.toLowerCase() !== 'b') {
						try {
							//target.style.cursor = 'crosshair'
						} catch (e) {}
					}
					tk.removeEvent(doc, 'mousemove', evFn, false);
					tk.removeEvent(doc, 'mouseup', evFn, false);
					/*doc.onmousemove=null;
					 doc.onmouseup=null;*/
					that.hanlderInfo = that.pos = that.origin = null;
					delete that.hanlderInfo;
					tk.stopEvent(e);
				}
			})[e.type](e)
		};
		indicator.fn.checkHandler = function (e, that) {
			e = tk.getEvent(e);
			var target = tk.getTarget(e), parent = target.parentNode, rect = tk.getClinetRect(parent);
			//that.hanlderInfo || (that.hanlderInfo = {});
			that.hanlderInfo = {};
			that.hanlderInfo.mxT = 0;
			that.hanlderInfo.mxL = 0;
			that.hanlderInfo.mxR = parent.parentNode.clientWidth + parent.parentNode.scrollLeft - 2;
			that.hanlderInfo.mxB = parent.parentNode.clientHeight + parent.parentNode.scrollTop - 2;
			that.hanlderInfo.mxR = Math.max(that.hanlderInfo.mxR, that.hanlderInfo.mxL + 60);
			that.hanlderInfo.mxB = Math.max(that.hanlderInfo.mxB, that.hanlderInfo.mxT + 60);
			//起始信息
			that.hanlderInfo.width = parent.clientWidth;
			that.hanlderInfo.height = parent.clientHeight;
			that.hanlderInfo.left = parent.offsetLeft;
			that.hanlderInfo.top = parent.offsetTop;
			//元素四个边界的位置
			that.hanlderInfo._left = rect.left;
			that.hanlderInfo._right = rect.right;
			that.hanlderInfo._top = rect.top;
			that.hanlderInfo._down = rect.bottom;
			/*that.hanlderInfo._left=e.clientX-that.hanlderInfo.width;
			 that.hanlderInfo._right=e.clientX+that.hanlderInfo.width;
			 that.hanlderInfo._top=e.clientY-that.hanlderInfo.height;
			 that.hanlderInfo._down=e.clientY+that.hanlderInfo.height;*/
			that.hanlderInfo._fixLeft = that.hanlderInfo.width + that.hanlderInfo.left;
			that.hanlderInfo._fixTop = that.hanlderInfo.height + that.hanlderInfo.top;
			that.hanlderInfo._mxRW = that.hanlderInfo.mxR - that.hanlderInfo.left;
			that.hanlderInfo._mxDH = that.hanlderInfo.mxB - that.hanlderInfo.top;
			that.hanlderInfo._mxTH = Math.max(that.hanlderInfo._fixTop - that.hanlderInfo.mxT, 0);
			that.hanlderInfo._mxLW = Math.max(that.hanlderInfo._fixLeft - that.hanlderInfo.mxL, 0);
		};
		indicator.fn.correctX = function (w, mxW, that) {
			w = that.correctWidth(w, mxW);
			that.hanlderInfo.width = w;
		};
		indicator.fn.correctY = function (h, mxH, that) {
			h = that.correctHeight(h, mxH);
			that.hanlderInfo.height = h;
		};
		indicator.fn.correctWidth = function (w, mxW) {
			w = Math.min(mxW, w);
			w = Math.max(w, 60, 0);
			return w;
		};
		indicator.fn.correctHeight = function (h, mxH) {
			h = Math.min(mxH, h);
			h = Math.max(h, 60, 0);
			return h;
		};
		indicator.fn.correctTop = function (that) {
			that.hanlderInfo.top = that.hanlderInfo._fixTop - that.hanlderInfo.height;
		};
		indicator.fn.correctLeft = function (that) {
			that.hanlderInfo.left = that.hanlderInfo._fixLeft - that.hanlderInfo.width;
		};
		indicator.fn.handlerMove = function (e, that) {
			e = tk.getEvent(e);
			var d = this.id;
			this.fn.size(e, that);
			that.resize(that);
			tk.stopEvent(e);
		};
		indicator.fn.resize = function (that) {
			var target = that.area;
			if (that.hanlderInfo) {
				target.style.cssText = 'width:' + that.hanlderInfo.width + 'px;height:' + that.hanlderInfo.height + 'px;top:' + (that.hanlderInfo.top + 1) + 'px;left:' + (that.hanlderInfo.left + 1) + 'px';
			}
			//that.setProp(that.hanlderInfo.width, that.hanlderInfo.height);
		};
		indicator.fn.areaMove = function (e, that) {
			if (!this.parentNode) {
				return;
			}
			var pointer = [e.clientX, e.clientY],
				parent,
				max,
				size = tk.getClinetRect(this.parentNode),
				tL,
				tT;

			if (this.parentNode) {
				parent = this.parentNode;
				max = [parent.offsetWidth, parent.offsetHeight]
			} else {
				return
			}
			//this.style.cursor = 'move';
			that.origin || (that.origin = []);
			tL = Math.max(pointer[0] - size.left + parent.scrollLeft - that.origin[0], 0);
			tL = Math.min(tL, max[0] - this.offsetWidth);
			this.style.left = tL + 'px';
			tT = Math.max(pointer[1] - size.top + parent.scrollTop - that.origin[1], 0);
			tT = Math.min(tT, max[1] - this.offsetHeight);
			this.style.top = tT + 'px';
		};
		indicator.fn.removeArea = function (fn) {
			try {
				that.area.parentNode.removeChild(that.area), that.area = null;
			} catch (e) {
			} finally {
				('function' === typeof fn) && fn();
			}
		};
		indicator.fn.getData = function () {
			try {
				return [that.area.offsetLeft, that.area.offsetTop, that.area.offsetWidth, that.area.offsetHeight];
			} catch (e) {
			}
		};
		indicator.fn.setProp = function (a, b) {
			that.info.innerHTML = '\u5bbd:' + Math.ceil(a) + 'px&nbsp;&nbsp;\u9ad8:' + Math.ceil(b) + 'px&nbsp;&nbsp;\u6bd4\u4f8b:' + that.proportion(a, b);
		};
		indicator.fn.proportion = function (x, y) {
			x = x.toPrecision(1), y = y.toPrecision(1);
			var z = ((x < y) ? x : y);
			while (true) {
				if (x % z == 0 && y % z == 0) {
					break;
				}
				z--;
			}
			return (Math.abs(x / z) + ":" + Math.abs(y / z));
		};
	};
	/*im.tk.domReady(function() {
	 im.module.clip || (im.module.clip = new Clip(document.getElementById(im.config.container)));
	 });*/
	im.tk.addEvent(document, 'DOMContentLoaded', function () {
		im.module.clip || (im.module.clip = Clip);
		//im.module.clip || (im.module.clip = new Clip(document.getElementById(im.config.container)));
	}, false);
}(window);
