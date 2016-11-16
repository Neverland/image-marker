window.imp || (imp = {});
(function (window, doc, undefined) {
	var toolKit = function () {
		var indicator = arguments.callee, doc = document, that = this;
		Object.keys || (Object.keys = function (o) {
			var t = [];
			for (t[t.length] in o);
			return t;
		});
		indicator.prototype = {
			slice: [].slice,
			is: function (o) {
				return ({}).toString.call(o).slice(8, -1);
			},
			each: function (object, callback) {
				var index, i = 0, len = object.length, isO = len === undefined && ({}).toString.call(object).slice(8, -1) === 'Object';
				if (isO) {
					for (index in object) {
						if (callback.call(object[index], index, object[index]) === false) {
							break;
						}
					}
				} else {
					for (; i < len;) {
						if (callback.call(object[i], i, object[i++]) === false) {
							break;
						}
					}
				}
			},
			contains: function (a, b) {//获得两个节点的包含关系
				try {
					return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
				} catch (e) {
				}
			},
			toArray: function (o) {//类数组数组化
				return that.slice.call(o);
			},
			getHtmlElement: function (O) {//生成一个html节点
				var that = toolKit;
				that.element || (that.element = {});
				that.element[O] || (that.element[O] = doc.createElement(O));
				return that.element[O].cloneNode(true);
			},
			getEvent: function (e) {//获取event
				return e || window.event;
			},
			getTarget: function (e) {//获取target
				return e.srcElement || e.target;
			},
			currentStyle: function (element, property) {//获取计算样式

				if (element.nodeType !== 1) return;
				return undefined !== element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element, null)[property];
			},
			stopEvent: function (e) {//停止冒泡 阻止默认行为
				if (e.returnValue) {
					e.returnValue = false,
						e.cancelBubble = false
				}
				if (e.preventDefault) {
					e.preventDefault(),
						e.stopPropagation()
				}
			},
			getOffsetXY: function (o) {//获取元素在页面中的绝对位置
				var x = 0, y = 0;
				while (o.offsetParent) {
					x += o.offsetLeft;
					y += o.offsetTop;
					o = o.offsetParent;
				}
				return [x, y];
			},
			getViewportSize: function () {//获取视口大小
				var value = [0, 0];
				undefined !== window.innerWidth ? value = [window.innerWidth, window.innerHeight] : value = [document.documentElement.clientWidth, document.documentElement.clientHeight];
				return value;
			},
			getClinetRect: function (f) {//获取元素在视口中的位置
				var d = f.getBoundingClientRect(), e = (e = {left: d.left, right: d.right, top: d.top, bottom: d.bottom, height: (d.height ? d.height : (d.bottom - d.top)), width: (d.width ? d.width : (d.right - d.left))});
				return e;
			},
			addEvent: function (elem, evType, fn, capture) {//为节点注册事件
				var indicator = arguments.callee;
				elem.attachEvent && (indicator = function (elem, evType, fn) {
					elem.attachEvent('on' + evType, fn)
				}).apply(elem, arguments);
				elem.addEventListener && (indicator = function (elem, evType, fn) {
					elem.addEventListener(evType, fn, capture || false);
				}).apply(elem, arguments);
				elem['on' + evType] && (indicator = function (elem, evType, fn) {
					elem['on' + evType] = function () {
						fn();
					};
				}).apply(elem, arguments);
			},
			removeEvent: function (elem, evType, fn, capture) {//销毁注册事件
				var indicator = arguments.callee;
				elem.detachEvent && (indicator = function (elem, evType, fn) {
					elem.detachEvent('on' + evType, fn)
				}).apply(elem, arguments);
				elem.removeEventListener && (indicator = function (elem, evType, fn) {
					elem.removeEventListener(evType, fn, capture || false);
				}).apply(elem, arguments);
				elem['on' + evType] && (indicator = function (elem, evType, fn) {
					elem['on' + evType] = null;
				}).apply(elem, arguments);
			},
			ready: function (fn) {//有性能问题 慎用
				var delay;
				/^loade|c/.test(document.readyState) ? delay = setTimeout(function () {
					arguments.callee.apply(null, arguments)
				}, 50) : delay && clearTimeout(delay), setTimeout(fn, 1);
			},
			trigger: function (elem, evType) {//触发一个事件
				var event, doc = document;
				undefined !== doc.createEvent ? (event = doc.createEvent('MouseEvents'), event.initMouseEvent(evType, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null), elem.dispatchEvent(event)) : (event = doc.createEventObject(), event.screenX = 100, event.screenY = 0, event.clientX = 0, event.clientY = 0, event.ctrlKey = false, event.altKey = false, event.shiftKey = false, event.button = false, elem.fireEvent('on' + evType, event));
			},
			getJSON:function (src, data, callback, name) {

				var doc = document,
					script = doc.createElement('script'),
					timestamp = +(new Date()),
					keygen = 'abcdefghijk',
					key = Math.random().toFixed(1) * 10,
					method = keygen[key] + timestamp,
					name = name || 'callback';

				src += src.indexOf('?') > 0 ? '' : '?';

				this.is(data) === 'Array' ?
					(this.is(data) === 'Array' && (src += data.join(',')))
					:
					(
						this.each(data, function (a, b) {
							src += a + '=' + data[a] + '&';
						})
						);

				src +=name+'=' + method + '&';
				src += 'timestamp=' + timestamp;

				if (typeof callback == 'function') {
					window[method] = function () {
						try {
							callback.apply(this, arguments);
						} catch (e) {
							throw new Error(e);
						} finally {
							window[method] = null;
							if (script.attributes.length > 0) {
								for (var j in script) {

									/*if(script.hasOwnProperty(j)){*/
									try {
										script.removeAttribute(script[j]);
									} catch (e) {
									}
									/*}*/
								}
							}
							if (script && script.parentNode) {
								script.parentNode.removeChild(script);
							}
						}
					}
				}
				script.setAttribute('type', 'text/javascript');
				script.setAttribute('src', src);
				doc.getElementsByTagName('head')[0].appendChild(script);
			}
		};
		if (window === this || 'indicator' in this) {
			return new indicator;
		}
	}();
	imp.tk || (imp.tk = toolKit);

})(window, document);
(function (window, doc, undefined) {

	function MarkPointer(id, t) {
		//console.log(arguments)
		var indicator = arguments.callee,
			that = this,
			tk = imp.tk,
			root = doc.body,
			Public,
			W = t.width,
			H = t.height,
			ox = 0,
			oy = 0;

		that.id = id;
		that.parent = null; //t.offsetParent; //doc.getElementById('photoView');
		//console.log(that.parent, t)
		//if (!that.parent) return;
		Public = indicator.prototype,
			Public.constructor = indicator;


		Public.init = function () {
			indicator.cache || (indicator.cache = {});
			that.fixedOffsetParent(t);

			that.data || (that.data = {});

			that.data._markPointData = [];
			that.data._markWordData = null;

			//console.log(that.parent.innerHTML)



			ox = tk.getClinetRect(t);
			oy = tk.getClinetRect(that.parent);

			//修正鼠标在tips上用键盘翻到下一页bug
			//console.log(info)
			that.image = that.parent.getElementsByTagName('img')[0];
			that.getImageOffsetXY(that.image);

			//that.parseData(data);
			//that.parseInfoData(info);

			that.getPointsData.call(that, that.id);
			that.getInformatonData(that.id);

			indicator.tips || (that.createTip());
			//that.getInformatonData(that.id);

			try {
				tk.trigger(indicator.tips, 'mouseleave');
			} catch (e) {}
		};
		Public.fixedOffsetParent = function (t) {
			var o = t.offsetParent//,temp//===doc.body? t.parentNode: t.offsetParent;

			//img 的父节点确定的话 直接去position为relative的也可以效率要高一些，主要是因为ie6会错误的认为haslayout的元素为offsetParent，导致标注点偏移
			while (tk.currentStyle(o, 'position') === 'static') {
				o = o.offsetParent;
			}
			that.parent = o;
			//console.log(that.parent)
		};
		Public.getPointsData = function (id) { //页面上的点位数据

			var data= [],
				that = this;

			that.killArea();
			if (that.data._markPointData.length> 0) {
				that.parseData.call(that, that.data._markPointData);
				return this;
			}

			that.getData('/im/pointlink/querypoint.ctrl', id, function (d){
				that._markPointData = d.data;
				that.parseData.call(that, d.data);
			});

			return this;
		};
		Public.getInformatonData = function (id) {
			//console.log(id+' --'+1)
			var that = this;

			that.killInfo();

			that.getData('/im/decword/queryDecWord.ctrl', id, function (data){
				//console.log(data)
				that._markWordData = data;
				that.parseInfoData.call(that, data[0]);
			});
			return this;
			//if (!window['_markWordData']) return;
			//return  _markWordData[id] ? _markWordData[id][0] : that.clearInfomation();
		};
		Public.getData = function (url, id, cb){

			imp.tk.getJSON(url, {id: id}, function (d){
				if(d.state == 'fail') return;

				typeof cb ==='function' && cb(d);
			})
		}
		Public.parseData = function (data) { //解析数据创建标注区域
			var that = this;
			//清除上次创建的数据

			tk.each(data, function (a, b) {
				if (!data) return;
				that.createMarkArea.call(that, b, a);
			})
		};
		Public.parseInfoData = function (data) {
			if (!data) return;
			//console.log(data);
			//that.killInfo(function () { //清除上次创建的数据
			that.createInfoPreview(data['dw'], data['pos']);
			//});

		};
		Public.clearInfomation = function () {
			//indicator.preview && (indicator.preview.innerHTML='');
			try {
				indicator.preview.parentNode.removeChild(indicator.preview);
			} catch (e) {}
		};
		Public.getImageOffsetXY = function (img) {//获取图片的绝对位置
			var o = img.offsetParent;
			that.offsetXY = [0, 0];
			while (tk.currentStyle(o, 'position') === 'static') {
				o = o.offsetParent;
			}
			that.offsetXY = [tk.getClinetRect(img).left - tk.getClinetRect(o).left, img.offsetTop];
		};
		Public.createTip = function () {//创建tips  并委派事件
			var elements = {
				tips: 'div',
				wrap: 'div',
				pointer: 'div',
				pointerInner: 'div',
				context: 'dl',
				title: 'dt',
				content: 'dd',
				description: 'p',
				link: 'a'
			};
			/*indicator.tips = tk.getHtmlElement('div'),
			 indicator.wrap = tk.getHtmlElement('div'),
			 indicator.pointer = tk.getHtmlElement('div'),
			 indicator.pointerInner = tk.getHtmlElement('div'),
			 indicator.context = tk.getHtmlElement('dl'),
			 indicator.title = tk.getHtmlElement('dt'),
			 indicator.content = tk.getHtmlElement('dd'),
			 indicator.description = tk.getHtmlElement('p'),
			 indicator.link = tk.getHtmlElement('a');*/
			tk.each(elements, function (a, b) {
				indicator[a] = tk.getHtmlElement(b);
			})


			indicator.link.innerHTML = '\u66f4\u591a&raquo;';
			indicator.link.style.display = 'none';
			indicator.link.target = '_blank';

			indicator.pointer.className = 'markPointer';
			indicator.pointer.innerHTML = '&nbsp;';

			indicator.pointerInner.className = 'mp_RT';
			indicator.wrap.className = 'markWrap';
			indicator.tips.className = 'markTips';
			indicator.tips.style.display = 'none';

			(
				indicator.content.appendChild(indicator.description),
				indicator.content.appendChild(indicator.link),

				indicator.context.appendChild(indicator.title),
				indicator.context.appendChild(indicator.content),
				indicator.pointer.insertBefore(indicator.pointerInner, indicator.pointer.firstChild),
				indicator.wrap.appendChild(indicator.context),
				indicator.tips.appendChild(indicator.wrap)
			)


			return  root.appendChild(indicator.tips),

				indicator.tips.onmouseleave = function (e) {
					e = tk.getEvent(e);
					tk.stopEvent(e);

					var target = e.currentTarget, related = e.relatedTarget || e.toElement;
					if (!tk.contains(target, related) && target !== related) {
						that.hide(e);
					}

					return false;
				},
				indicator.tips.onmouseenter = function (e) {
					e = tk.getEvent(e);
					tk.stopEvent(e);
					var target = e.currentTarget, related = e.relatedTarget || e.fromElement;
					if (!tk.contains(target, related) && target !== related) {
						that.show(e);
					}
					return false;
				},
				[
					indicator.tips,
					indicator.title,
					indicator.description,
					indicator.link
				]

		};
		Public.createMarkArea = function (data, index) {  //创建标注区域 渲染至相应位置 并委派事件
			if (!data || !data.axis) return;
			//console.dir(data);
			var axis = data.axis.split(','),
				that = this;

			that.markArea = tk.getHtmlElement('div');
			that.markPoint = tk.getHtmlElement('div');

			that.markPoint.className = 'markPoint';
			that.markArea.className = 'markArea';

			//that.markArea.appendChild(that.markPoint);
			that.markArea.data = {};
			data.title && (that.markArea.data.title = data.title);
			data.desc && (that.markArea.data.desc = data.desc);
			that.markArea.data.pos = data.pos ? data.pos : 1;
			data.link && (that.markArea.data.link = data.link);

			that.parent.appendChild(that.markArea);


			indicator.cache[that.id] || (indicator.cache[that.id] = [])
			indicator.cache[that.id].push(that.markArea);

			that.markArea.style.cssText = 'width:' + axis[2] + 'px;height:' + (+axis[3]) + 'px;top:' + (that.offsetXY[1] + (+axis[1])) + 'px;left:' + (that.offsetXY[0] + (+axis[0])) + 'px;z-index:' + (1000 + index) + ';';


			that.markArea.onmouseenter = function (e) {

				e = tk.getEvent(e);
				tk.stopEvent(e);
				var target = e.currentTarget, related = e.relatedTarget || e.fromElement;
				if (!tk.contains(target, related) && target != related) {

					that.show(e, that.id);

				}
				return false;
			}
			that.markArea.onmouseleave = function (e) {
				e = tk.getEvent(e);
				tk.stopEvent(e);
				var target = e.currentTarget, related = e.relatedTarget || e.toElement;
				if (!tk.contains(target, related) && target != related) {

					that.hide(e, that.id);

				}
				return false;
			}

		};
		/*Public.taggleBK = function (e, elem) { //废弃 用来控制标注区域的背景
		 e = tk.getEvent(e);
		 elem.style.background = e.type === 'mouseover' ? 'url(http://img1.cache.netease.com/cnews/img/gallery11/on.png) no-repeat center center' :
		 'url(http://img1.cache.netease.com/cnews/img/gallery12/off.png) no-repeat center center ';
		 };*/
		Public.createInfoPreview = function (d, p) {
			if (!d) return;
			var temp = (that.parent.offsetHeight - H) / 2 + 'px,'
			preview = tk.getHtmlElement('em');
			preview.innerHTML = d;
			preview.className = p == '0' ? 'infoPreviewTop' : 'infoPreviewBottom';
			//indicator.preview.style.cssText='width:'+(T-20)+'px;left:'+(960-T)/2+'px';
			//indicator.preview.style.cssText='width:'+(W-20)+'px;left:'+(that.parent.offsetWidth-W)/2+'px;top:'+(that.parent.offsetHeight-H)/2+'px;';
			//console.log(that.parent);
			//preview.style.cssText = 'display:block; width:' + (W - 20) + 'px;left:' + (ox.left - oy.left) + 'px;' + ((p == '0' ? ('top:' + (ox.top - oy.top)) : ('bottom:' + (oy.bottom - ox.bottom))) + 'px;');
			preview.style.cssText = 'display:block; width:' + (W - 20) + 'px;left:' + 0 + 'px;' + ((p == '0' ? ('top:' + 0) : ('bottom:' + 0)) + 'px;');

			that.parent.appendChild(preview);
			//that.parent.appendChild(document.body.firstChild);
			//console.log(d,p);
		};
		Public.show = function (e, id) { //控制tips显示

			e = tk.getEvent(e);
			var target = tk.getTarget(e)

			indicator.delay && clearTimeout(indicator.delay);
			that.togglePointer(e, id);
			that.display(target);

		};
		Public.hide = function (e, id) { //控制tips隐藏
			e = tk.getEvent(e);
			var target = tk.getTarget(e)

			indicator.delay = setTimeout(function () {
				indicator.tips.style.display = 'none';
			}, 200)
			that.togglePointer(e, id);
		};
		Public.display = function (p) {  //控制tips内元素按数据显示
			var data = p.data;
			if (!p.data) return;

			indicator.description.removeAttribute('style');
			indicator.link.removeAttribute('style');
			indicator.title.innerHTML = data.title;
			//indicator.title.style.fontWeight=data.title.length>13? 'normal':'bold';

			undefined === data.desc ?
				(indicator.description.style.display = 'none', indicator.description.innerHTML = '')
				: (indicator.description.innerHTML = data.desc, indicator.description.style.display = 'block');

			undefined === data.link ?
				(indicator.link.style.display = 'none', indicator.link.href = 'javascript: void(0);') :
				indicator.link.href = data.link;

			that.rander(p);
		};
		Public.rander = function (p) { //渲染tips至相应位置
			var xy = tk.getOffsetXY(p), rect, size, x = 0, y = 0, w = 0, h = 0;
			indicator.tips.style.cssText = '';
			indicator.pointer.style.width = 0;
			indicator.tips.style.visibility = 'hidden';

			indicator.wrap.style.borderRadius = ' 3px 3px 3px 0';
			indicator.tips.appendChild(indicator.pointer);
			indicator.tips.style.paddingBottom = '0';
			indicator.pointerInner.className = 'mp_RT';

			indicator.tips.style.display = 'block';

			x = parseInt(xy[0] + p.offsetWidth / 2 - 9);
			y = parseInt(xy[1] + p.offsetHeight / 2 - indicator.tips.offsetHeight + 9);
			w = indicator.tips.offsetWidth;
			h = indicator.tips.offsetHeight;

			//摆放tips至左上角，如果要左下显示 需要修改这里和420行对应代码
			indicator.tips.style.cssText = 'top:' + y + 'px;left:' + x + 'px;height:' + h + 'px;width:' + w + 'px; overflow:hidden;z-index:2000;';
			indicator.pointer.style.width = indicator.tips.offsetWidth + 'px';
			rect = tk.getClinetRect(indicator.tips);

			that.checkTipsPosition(rect.top > 0, tk.getViewportSize()[0] - rect.right > 0, x, y, w, h);

		};
		Public.checkTipsPosition = function (a, b, x, y, w, h) { //检查tips是否摆放正确 并进行修正
			if (a && b) return;//top right没超出返回
			var f = a || b;  //top right是否都超出
			a || (that.correctTop(y, h, f));
			b || (that.correctRight(x, w, f));
			f || (that.correctTR());//如果左右都超出则定位至左下
		};
		Public.correctTop = function (y, h, f) {  //修正顶部 如果顶部超出 则定位到下方
			indicator.tips.style.top = y + h - 18 + 'px';
			indicator.tips.insertBefore(indicator.pointer, indicator.tips.children[0]);

			f && (
				indicator.tips.style.paddingBottom = '10px',
					indicator.wrap.style.borderRadius = '0 3px 3px 3px',
					indicator.pointerInner.className = 'mp_RB'
				)
		};
		Public.correctRight = function (x, w, f) { //修正右边 如果右边超出 则定位到左边
			indicator.tips.style.left = x - w + 18 + 'px';

			f && (
				indicator.wrap.style.borderRadius = '3px 3px 0 3px',
					indicator.pointerInner.className = 'mp_LT'
				)
		};
		Public.correctTR = function () {  //修饰标注箭头样式
			indicator.tips.style.paddingBottom = '10px';
			indicator.wrap.style.borderRadius = '3px 0 3px 3px';
			indicator.pointerInner.className = 'mp_LB';
		};
		Public.togglePointer = function (e, id) { //切换标注区域显示
			e = tk.getEvent(e);

			var type = e.type,
				id = id ;


			tk.stopEvent(e);

			indicator.cache[id] && tk.each(indicator.cache[id], function (a, b) {
				b.style.visibility = (type === 'mouseover' || type === 'mouseenter') ? 'visible' : 'hidden';
			});
			return false;
		};
		Public.killInfo = function (fn) {
			var parent = that.parent,
				child = that.parent.children,
				len = child.length >>> 0;
			//console.log(len)
			while (--len > 0) {
				//console.log(child[len].className);
				/infoPreviewTop|infoPreviewBottom/.test(child[len].className) && parent.removeChild(child[len]);
			}

			fn && ('function' === typeof fn) && fn();
		}
		Public.killArea = function (fn) {  //删除标注区域
			var temp,
				data = indicator.cache[that.id];
			if (!data) return;
			while (data.length) {
				temp = data.pop();
				try {
					temp.style.display = 'none';
					delete    temp.parentNode.removeChild(temp);
				} catch (e) {
				}
			}

			//if (fn) {
			fn && ('function' === typeof fn) && fn();
			//}
		};
		this.init();
		return this;
	}

	imp.IM || (imp.IM = MarkPointer);
})(window, document)