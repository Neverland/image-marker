/**
 * Created by JetBrains WebStorm.
 * User: enix@foxmail.com
 * Date: 12-2-3
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 * last modified 2012 6 5
 * version  1.8
 */


void function (window, doc, undefined) {
	//this.im || (this.im=function(){});
	im.module || (im.module = {});
	im.config || (im.config = {});

	im.config = {
		container: 'container',
		information: 'info',
		maxWidth: 900,
		maxSize: 60,
		url: {
			add: '/im/pointlink/addpoint.ctrl?',
			del: '/im/pointlink/deletepoint.ctrl?',
			query: '/im/pointlink/querypoint.ctrl?'
		},
		info: {
			add: '/im/decword/addDecWord.ctrl',
			del: '/im/decword/deleteDecWord.ctrl',
			query: '/im/decword/queryDecWord.ctrl'
		}
	};

	function WorkSpace() {
		var indicator = arguments.callee, that = this, tk = im.tk, Public;
		if (!that instanceof indicator) {
			return new indicator()
		}
		Public = indicator.prototype;
		Public.constructor = indicator;
		Public.getImageURL = function () {
			var ls = location.search;
			return (ls && /\.jpg/.test(ls)) && (ls.substring(1).split('image=')[1]);
		};
		Public.serializationHash = function () {
			var temp = {},
				hash = location.hash.substring(1).split('&');

			that.hash = location.hash;

			tk.each(hash, function (a, b) {
				var c = b.split('=');
				try{
					temp[c[0]] = encodeURI(c[1]).trim();
				}catch(e){}
			});

			return temp;
		};
		indicator.counter || (indicator.counter = []);

		Public.Init = function () {
			that.$img = that.removeInfo = that.information = that.origin = that.mask = that.rect = that.cache = that.index = that.placeholder = that.container = null;
			that.hash = '';
			that.container = doc.getElementById(im.config.container);
			that.info = doc.getElementById('information');
			//that.removeInfo=doc.getElementById('removeInfo');
			//that.formItems=doc.forms[0].elements;
			//that.saveAs=doc.getElementById('saveAs');
			that.done = doc.getElementById('done');
			that.cancel = doc.getElementById('cancel');
			that.addInfo = doc.getElementById('addInfo');
			that.pages = doc.getElementById('pages');
			that.postPhoto = doc.getElementById('postPhoto');
			that.ls = window.localStorage;
			/*that.itemI=doc.getElementsByName('title')[0];
			 that.itemII=doc.getElementsByName('desc')[0];
			 that.itemIII=doc.getElementsByName('link')[0];
			 that.itemVI=doc.getElementsByName('pos')[0];*/
			//序列化location.search数据
			//console.log(that.cancel)
			//
			im.data = that.serializationHash();
			that.createImage();
			that.createImagePreview();
			that.createMask(that.container, 0, 0);
			doc.addEventListener('mouseup', function () {
				tk.isOnDom(that.placeholder) && that.removePlaceholder();
			}, false);
			that.container.addEventListener('click', function (e) {
				e = tk.getEvent(e);
				var target = tk.getTarget(e);
				while (target.nodeType !== 1) {
					target = target.parentNode;
				}

				/Area/.test(target.className) && that.activeInfo(target, that.info)

			}, false);

			that.postPhoto.addEventListener('click', function (e) {
				//pushphotoset();
			}, false);
			that.done.addEventListener('click', function (e) {
				e = tk.getEvent(e);
				var areas = doc.querySelectorAll('.Area');
				that.checkDone(areas, e);
			}, false);
			doc.addEventListener('keypress', function (e) {
				e = tk.getEvent(e);
				var code = e.keyCode || e.charCode;
				if (code === 46 && e.ctrlKey) {
					that.findParent(that.info) && that.removeInfos(that.findParent(that.info));
				}
			}, false);
			that.cancel.addEventListener('click', function (e) {
				that.cancelEdit(e);
			}, false);
			that.addInfo.addEventListener('click', function (e) {
				that.queryInformation();
			}, false);
			window.addEventListener('hashchange', function () {
				if (location.hash == that.hash) return;
				//console.log(location.hash,that.hash);
				that.container.innerHTML = '';
				im.data = that.serializationHash();
				that.createMask(that.container, 0, 0)
				that.createImage();
				that.createImagePreview();
				return false;
			}, false)
		};
		Public.createImage = function () {
			that.image = tk.getHtmlElement('img');
		};
		Public.acceptMarkInfo = function () {
			var info = that.getAreaBundingRect(that.info), parent = info.pop(), data = parent.data;
			parent.setAttribute('axis', info);
			//parent.data || (parent.data=data);
			//that.saveFormItemVale(parent,value);
			that.addAreaInfo(parent, data);
		};
		Public.fixCSS = function (a, p) {
			return  '-moz-#:@;-ms-#:@;-o-#:@;-webkit-#:@;#:@;'.replace(/#:@/g, a + ':' + p);
		}

		Public.createImagePreview = function () {
			var img = new Image,
				src = im.data.image,
				config = im.config,
				info = doc.getElementById(im.config.information);


			if (!src) return;
			that.offsetXY = [];
			that.$img = im.data.image;

			img.onload = function () {
				//console.log(img.width);


				/*
				 *超过900退出编辑，先停用，有问题需要打开，并且关闭强制限制宽度代码
				 * */
				//if (img.width > 900) {
				//alert('图片宽度超过900');
				//window.close();
				//return false;
				//}

				/*
				 *强制限制图片宽度为900
				 * */
				that.size = [ this.width > config.maxWidth ? config.maxWidth : this.width, this.height];

				//that.size = [img.width, img.height];


				that.container.appendChild(that.image);
				that.mask.style.width = that.size[0] + 'px';
				that.mask.style.height = that.size[1] + 'px';
				that.image.src = img.src;


				/*
				 *height: 100%;  有问题需要删除需要改为； 'height:'+this.size[0]+'px; width:'
				 *
				 * */
				that.container.style.cssText = 'width:' + that.size[0] + 'px;' + that.fixCSS('transition', 'all .6s ease-in');


				info.innerHTML = '<b>图片名称：</b><b style="color:red">' + decodeURIComponent(im.data.name || 'Noname') + '</b> <b style="margin-left:10px">图片尺寸：</b>宽:' + img.width + 'px 高:' + img.height + 'px';
				that.addInfo.style.display = 'block';
				that.pages.innerHTML = '<b>' + (im.data.page || 1) + '</b>/' + (im.data.size || 1);
				that.rect = tk.getClinetRect(that.image);

				/*
				 *强制限制图片最大宽度为900   max-width:900px   有问题需要删除；
				 *
				 * */
				that.image.style.cssText = 'max-width:900px;opacity:1;' + that.fixCSS('transition', 'all .4s ease-in');

				//tk.addEvent(that.mask,'mousedown',that.mousemoveCheckThreshold,false);

				img.onload = img.onerror = null;
				that.loadMarkPoint();
				that.loadInfomation();
			};

			img.onerror = function (){
				alert('图片读取错误，请确认图片是否存在！');
			}


			img.src = src;
		};
		Public.loadInfomation = function () {

			that.queryInformation(1);
		};
		Public.loadMarkPoint = function () {
			tk.dynamicScriptProxy(
				im.config.url.query,
				{
					image: that.$img
				}, function (d) {

					d.data.forEach(function (b, a){
						var ax = new Function('return [' +b.axis+']')(),
							area = that.createArea(
								ax[1],
								ax[0],
								ax[2] - 2,
								ax[3] - 2,
								1
							);
						area.data || (area.data = {});
						area.setAttribute('submit', true);
						area.setAttribute('axis', ax.valueOf());
						b['id'] && area.setAttribute('_id', b['id']);
						//area.style.zIndex=1;
						area.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
						b.title && (area.data.title = b.title);
						(b.desc && b.desc !== 'undefined') && (area.data.desc = b.desc);
						(b.link && b.link !== 'undefined') && (area.data.link = b.link);
						//!!b.link && (area.data.link = b.link);
					})

				}
			);
		};
		Public.addInfomForm = function (data) {
			im.module.dialog({
				width: 464,
				height: 150,
				title: '图片说明',
				maskDepth: 40,
				cancelTxt: ' ',
				drag: true,
				html: '<textarea id="infoArea" placeholder="输入文字..." maxlength="90"></textarea><p style="color:red;" id="infoMassage">*限制90个字符</p><table width="100%"><tr><td>选择位置： <input type="radio" name="infoFix" checked="checked" id="infoTop"  />上 <input type="radio" name="infoFix" id="infoBottom" />下</td><td align="right"><input type="button" value=" 取消 " id="infoCancel" /> <input type="button" value=" 保存 " id="infoSave" /> <img src="images/data_waiting.gif" id="infoWait" /> </td></tr></table>'
			}, function () {
				that.informationHandle.call(this, that, data);
				that.dragDialog(this);
			});
		};
		Public.dragDialog = function (t) {
			t.title.addEventListener('mousedown', function () {
			}, false)
		};
		Public.informationHandle = function (thee, d) {
			//console.log(thee.queryInfo(), d)
			var that = this, elems = [
				['infoArea', function () {
					var reg = /<(?:(?:\/?[A-Za-z]\w+\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))>/;
					(d && d['dw']) && (this[0].value = d['dw']);
					this[0].addEventListener('keyup', function (e) {
						e = tk.getEvent(e);
						var target = tk.getTarget(e);
						if (reg.test(target.value)) {
							target.style.cssText = 'border:solid 2px red;background:yellow;';
							elems[1][0].innerHTML = '只能录入文字！';
							elems[5][0].style.display = 'none';
							return false;
						} else {
							target.removeAttribute('style');
							elems[5][0].style.display = '';
						}
						elems[1][0].innerHTML = '还可以输入' + (90 - target.value.length) + '个文字';
						//console.log(target.value);
					}, false);

				}],
				['infoMassage', function () {
				}],
				['infoTop', function () {
				}],
				['infoBottom', function () {
					(d && d.pos === '1') && tk.trigger(this[0], 'click');
				}],
				['infoWait', function () {
					this[0].style.display = 'none';
				}],
				['infoSave', function (t) {
					//this[0].style.display='none';
					this[0].addEventListener('click', function (e) {
						var data = elems[0][0].value
						elems[0][0].disabled = true;
						elems[2][0].disabled = true;
						elems[3][0].disabled = true;
						elems[4][0].style.display = '';
						t.cancel.style.visibility = 'hidden';
						elems[6][0].style.visibility = 'hidden';
						//thee.createInfoPreview(data,elems[2][0].checked);
						this.disabled = true;
						data === '' ? thee.deleteInformation(d && d['_id'], that) : (im.information.data = data, thee.addInformation(d && d['_id'], data, elems[2][0].checked === true ? 0 : 1, that));
					}, false);
				}],
				['infoCancel', function (t) {
					this[0].addEventListener('click', function (e) {
						t.removeDailog();
					}, false);
				}]
			], i = elems.length;
			while (i > 0) {
				elems[--i][0] = doc.getElementById(elems[i][0]);
				elems[i][1](this);
			}
		};
		Public.createMask = function (p, w, h) {
			that.mask = tk.getHtmlElement('div');
			p.appendChild(that.mask);
			that.mask.style.cssText = 'filter:alpha(opacity=5);opacity:0.05;background:#eee; position:absolute;width:' + w + 'px;height:' + h + 'px;';
			that.mask.addEventListener('mousedown', that.mousemoveCheckThreshold, false);
		};
		Public.queryInformation = function (rander) {
			var that = this;
			im.information || (im.information = {});
			tk.dynamicScriptProxy(
				im.config.info.query,
				{
					image:that.$img
				}, function (d) {
					rander === 1 ? (d.length > 0 && that.createInfoPreview(d[0].dw, d[0].pos)) : that.addInfomForm(d);
					//that.addInfomForm(d[0])
				}
			);
			///photo/deleteDecWord.ctrl?callback=?&channelid=0080&setid=123&topicid=ASDD0080&photoid=jjsseeoofsd0080&_id=
		};
		Public.deleteInformation = function (ID, t) {
			tk.dynamicScriptProxy(
				im.config.info.del,
				{
					image:that.$img,
					id: ID
				}, function (d) {
					var info = im.information;
					that.informationContrl.call(t, d.state, 1);
					try {
						delete info.data;
						delete info.preview.parentNode.removeChild(info.preview);
						delete info.preview;
					} catch (e) {
					}
				}
			);
			///photo/deleteDecWord.ctrl?callback=?&channelid=0080&setid=123&topicid=ASDD0080&photoid=jjsseeoofsd0080&_id=
		};
		Public.addInformation = function (ID, data, p, t) {
			var that = this,
				temp = {};

				temp.image = that.$img;
				temp.pos = p;
				temp.decword = encodeURIComponent(data);
				ID === undefined || (temp.id = ID);

			tk.dynamicScriptProxy(
				im.config.info.add,
				temp
				, function (d) {
					that.informationContrl.call(t, d.state);
					that.createInfoPreview(data, p);
				}
			);
			///photo/deleteDecWord.ctrl?callback=?&channelid=0080&setid=123&topicid=ASDD0080&photoid=jjsseeoofsd0080&_id=
		};
		Public.createInfoPreview = function (d, p) {
			//console.log(d+' '+p)
			//if(!im.information.data) return;
			var info = im.information, data = info.data;
			info.preview || (info.preview = tk.getHtmlElement('div'));
			info.preview.innerHTML = d;
			//document.write(d);
			info.preview.style.cssText = 'opacity:0;';
			info.preview.className = p == '0' ? 'infoPreviewTop' : 'infoPreviewBottom';
			info.preview.style.cssText = 'opacity: 1;width:' + (that.size[0] - 20) + 'px;' + that.fixCSS('transition', 'all .4s ease-in .5s');
			im.module.ws.container.appendChild(info.preview);
		};
		Public.informationContrl = function (f, n) {
			var that = this;
			//that.container.innerHTML='<div align="center">'+(n?'删除':'添加')+(f ==='succ'?'成功':'失败')+'，2秒后自动关闭</div>' ;
			//var temp=setTimeout(function(){
			that.removeDailog();
			//clearTimeout(temp);
			//},2000);
		};
		Public.mousemoveCheckThreshold = function (e) {
			e = e || window.event;
			that.offsetXY.length || (that.offsetXY = tk.getOffsetXY(that.image));
			var target = tk.getTarget(e), root = doc.getElementsByTagName('body')[0], scroll = tk.getScrollPosition();
			({
				'mousemove': function (evt) {
					evt = tk.getEvent(evt);
					/*var w = 0,
						h = 0;

						w = evt.clientX - that.origin[0],
						h = evt.clientY - that.origin[1];*/

					if (that.placeholder.parentNode) {
						that.placeholder.style.left = that.origin[0] + 'px';//that.origin[0]
						that.placeholder.style.top = that.origin[1] + 'px';//that.origin[1]
						that.placeholder.style.width = evt.clientX - that.origin[0] - 2 + scroll[0] + 'px';
						that.placeholder.style.height = evt.clientY - that.origin[1] - 2 + scroll[1] + 'px';
					}
					/*tk.addEvent(that.mask, 'mouseup', function(){
					 that.removePlaceholder();
					 }, false);*/
				},
				'mousedown': function (e) {
					//evt=tk.getEvent(evt);
					//var scroll=tk.getScrollPosition();
					that.origin = [0, 0];
					that.origin = [e.clientX + scroll[0], e.clientY + scroll[1]];
					that.placeholder = tk.getHtmlElement('div');
					that.placeholder.className = 'placeholder';
					tk.isOnDom(that.placeholder) && that.removePlaceholder();
					root.appendChild(that.placeholder);
					that.placeholder.style.cssText = 'position:absolute;top:' + that.origin[0] + 'px;left:' + that.origin[1] + 'px;';
					that.mask.addEventListener('mouseup', that.mousemoveCheckThreshold, false);
					that.mask.addEventListener('mousemove', that.mousemoveCheckThreshold, false);
				},
				'mouseup': function (evt) {
					//console.log(e)
					var w = evt.clientX - that.origin[0] + scroll[0], h = evt.clientY - that.origin[1] + scroll[1], size = im.config.maxSize;
					tk.isOnDom(that.placeholder) && that.removePlaceholder();
					if (w < size || h < size) return;
					that.createArea(e.clientY + (+scroll[1]) - that.offsetXY[1] - h, e.clientX + (+scroll[0]) - that.offsetXY[0] - w, w, h);
					tk.removeEventListener(that.mask, 'mousemove', that.mousemoveCheckThreshold, false);
					tk.removeEventListener(that.mask, 'mouseup', that.mousemoveCheckThreshold, false);
				}
			})[e.type](e);
		};
		Public.activeInfo = function (t, p) {

			that.ls._markdata = JSON.stringify(t.data);
			t.appendChild(p);
			p.style.visibility = 'visible';
			p.style.display = 'block';
			t = p = null;
		};
		Public.resetBlur = function () {
			tk.each(that.formItems, function (a, b) {
				b.removeAttribute('style');
				b.blur();
			});
		};
		Public.removePlaceholder = function () {
			try {
				that.placeholder.parentNode.removeChild(that.placeholder);
			} catch (e) {}
		};
		Public.createArea = function (t, l, w, h, flag) {

			//e=tk.getEvent(e);
			//var target=tk.getTarget(e);
			//console.log(that.container);
			//evt.clientX-e.clientX>40 && evt.clientY-e.clientY>40 && target =that.image;

			var markerArea = new im.module.clip(that.container);

			markerArea.index = indicator.counter.length;
			indicator.counter.push(markerArea);
			markerArea.activity(
				{
					top: t,
					left: l,
					width: w,
					height: h
				},
				function () {
					flag || tk.trigger(markerArea.area, 'click');
				}
			);
			return markerArea.area;
		};
		Public.removeInfoArea = function (e) {
			e = tk.getEvent(e);
			var target = tk.getTarget(e), parent = that.findParent(target);
			that.removeInfos(parent);
		};
		Public.proxyRemoveInfos = function () {
			that.removeInfos(that.findParent(that.info));
		};
		Public.removeInfos = function (parent) {
			//console.log(1);
			try {
				if (parent.getAttribute('submit')) {
					confirm('确定删除该标注区域吗？') && that.deleteData(parent, parent.data);
				} else {
					parent.parentNode.removeChild(parent);
				}
			} catch (e) {}
		};
		Public.saveFormItemVale = function (a) {

			//console.log(a.name);
			var parent = that.findParent(that.info);
			parent.data || (parent.data = {});
			parent.data[a.name] = a.value;
		};
		Public.findParent = function (node) {
			var parent = node.parentNode;
			while (!/Area/gi.test(parent.className)) {
				parent = parent.parentNode;
			}
			return parent;
		};
		Public.loadInfo2Cache = function (t) {
			var data = t.data, win = doc.getElementById('markForm').contentWindow;
			//console.log(data);
			/*tk.each(data,function(a,b){
			 (doc.getElementsByName(a)[0]).value=b;
			 });*/
			//console.dir(frames['markForm']);
			//console.log(document.getElementById('markForm').acceptData(data));
		};
		Public.getAreaBundingRect = function (t) {
			var parent = that.findParent(t), rect = tk.getClinetRect(t);
			//console.log(parent.offsetLeft+' '+parent.offsetTop)
			//console.log(parent.offsetHeight+' '+parent.offsetWidth);
			return [parent.offsetLeft, parent.offsetTop, parent.offsetWidth, parent.offsetHeight, parent];
		};
		Public.addAreaInfo = function (parent, data) {

			var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
				temp ={};

			reg.test(data['link']) && (temp.link = encodeURIComponent(data['link']));
			data.desc == undefined || (temp.desc = encodeURIComponent(data['desc']));

			temp.title = data.title || 'im';
			parent.getAttribute('_id') && (temp.id = parent.getAttribute('_id'));
			temp.size = that.size;
			temp.axis = parent.getAttribute('axis');
			temp.image = im.data.image;

			tk.dynamicScriptProxy(
				im.config.url.add,
				temp,
				function (d) {
					//console.log(d['_id']);
					d.state === 'fail' && (parent.style.backgroundColor = 'rgba(255, 0, 0, 0.6)');
					d.state === 'succ' && (parent.style.border = 'solid 1px #fff', parent.style.backgroundColor = 'rgba(0, 0, 0, 0.4)', parent.setAttribute('submit', true), parent.setAttribute('_id', d['_id']));
					that.info.style.visibility = 'hidden';
					that.info.style.display = 'none';
				}
			);
		};
		Public.checkDone = function (A, e) {
			var a = 0;
			A.length > 0 && (tk.each(A, function (c, b) {
				b.getAttribute('submit') || (b.style.backgroundColor = 'rgba(255, 0, 0, 0.4)', a++);
			}));
			if (a > 0) {
				alert('还有 ' + a + '个 标注区域没有保存！');
				return false;
			} else if (a === 0) {
				if (e) {
					window.close();
				} else {
					return true;
				}
			}
			return false;
		};
		Public.cancelEdit = function (e) {
			e = tk.getEvent(e);
			var target = tk.getTarget(e), parent = that.findParent(target);
			'true' === parent.getAttribute('submit') ? (that.info.style.visibility = 'hidden') : that.removeInfos(parent);
		};
		Public.deleteData = function (parent, data) {

			tk.dynamicScriptProxy(
				im.config.url.del,
				{
					image: that.$img,
					id: parent.getAttribute('_id')
				}, function (d) {
					d.state === 'succ' && (parent.parentNode.removeChild(parent));
				}
			);
		};
	}

	im.module.ws || (im.module.ws = new WorkSpace());
}(window, document);

