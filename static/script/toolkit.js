/*
 * toolkit lib v1.0
 *
 * Copyright 2011, enix@foxmail.com
 * Includes toolkit lib
 * Date: 2011-9-14
 * lastmodified: 2011-6-5
 *http://bluescript.iteye.com/
 */


/*
 *	����[toolKit]
 *	���ܣ��������
 *	���ã�΢�����
 */

!function (window, doc, undefined) {
    var toolKit = function () {
        var indicator = arguments.callee, that = this;


        Object.keys || (Object.keys = function (o) {
            var t = [];
            for (t[t.length] in o);
            return t;
        });

        indicator.prototype = {
            slice:([]).slice,
            is:function (o) {
                return ({}).toString.call(o).slice(8, -1);
            },
            isOnDom:function (node) {

                if (!node || !node.nodeType || node.nodeType !== 1) return;
                var body = doc.body;
                while (node.parentNode) {
                    if (node === body) return true;
                    node = node.parentNode;
                }
                return false;
            },
            each:function (object, callback) {
                var index, i = 0, len = object.length>>>0, isO =({}).toString.call(object).slice(8, -1) === 'Object';
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
            toArray:function (o) {
                return that.slice.call(o);
            },
            getHtmlElement:function (O) {
                var that = toolKit;
                that.element || (that.element = {});
                that.element[O] || (that.element[O] = doc.createElement(O));
                return that.element[O].cloneNode(true);
            },
            getEvent:function (e) {
                return e || window.event;
            },
            getTarget:function (e) {
                return e.srcElement || e.target;
            },
            stopEvent:function (e) {
                e.returnValue && (
                    e.returnValue = false,
                        e.cancelBubble = false
                    );
                e.preventDefault && (
                    e.preventDefault(),
                        e.stopPropagation()
                    );
            },
            contains:function (a, b) {
                try {
                    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b))
                } catch (e) {}
            },
            getViewportSize:function () {
                var value = [0, 0];
                undefined !== window.innerWidth ? value = [window.innerWidth, window.innerHeight] : value = [doc.documentElement.clientWidth, doc.documentElement.clientHeight];
                return value;
            },
            getClinetRect:function (f) {
	            if(!f)return;
                var d = f.getBoundingClientRect(), e = (e = {left:d.left, right:d.right, top:d.top, bottom:d.bottom, height:(d.height || (d.bottom - d.top)), width:(d.width || (d.right - d.left))});
                return e;
            },
            getScrollPosition:function () {
                var position = [0, 0];
                if (window.pageYOffset) {
                    position = [window.pageXOffset, window.pageYOffset];
                }
                else if (typeof doc.documentElement.scrollTop != 'undefined' && doc.documentElement.scrollTop > 0) {
                    position = [doc.documentElement.scrollLeft, doc.documentElement.scrollTop];
                } else if (typeof doc.body.scrollTop != 'undefined') {
                    position = [doc.body.scrollLeft, doc.body.scrollTop];
                }
                return position;
            },
            getOffsetXY:function (o) {
                if (!o || o.nodeType !== 1) {
                    return -1
                }
                var x = 0, y = 0;
                while (o.offsetParent) {
                    x += o.offsetLeft;
                    y += o.offsetTop;
                    o = o.offsetParent;
                }
                return [x, y];
            },
            addEvent:function (elem, evType, fn, capture) {
                var indicator = arguments.callee;
	            elem && elem.attachEvent && (indicator = function (elem, evType, fn) {
                    elem.attachEvent('on' + evType, fn)
                }).apply(this, arguments);
	            elem && elem.addEventListener && (indicator = function (elem, evType, fn) {
                    elem.addEventListener(evType, fn, capture || false);
                }).apply(this, arguments);
	            elem &&  elem['on' + evType] && (indicator = function (elem, evType, fn) {
                    elem['on' + evType] = function () {
                        fn();
                    };
                }).apply(this, arguments);
            },

            removeEvent:function (elem, evType, fn, capture) {

                var indicator = arguments.callee;
                elem && elem.detachEvent && (indicator = function (elem, evType, fn) {
                    elem.detachEvent('on' + evType, fn)
                }).apply(this, arguments);
	            elem && elem.removeEventListener && (indicator = function (elem, evType, fn) {
                    elem.removeEventListener(evType, fn, capture || false);
                }).apply(this, arguments);
	            elem && elem['on' + evType] && (indicator = function (elem, evType, fn) {
                    elem['on' + evType] = null;
                }).apply(this, arguments);
            },
            currentStyle:function (element, property) {
                if (element.nodeType !== 1) return;
                return undefined !== element.currentStyle ? element.currentStyle[property] : doc.defaultView.getComputedStyle(element, null)[property];
            },
            getClipboardText:function (e) {
                e = this.getEvent(e);
                var cText = e.clipboardData;
                return cText.getData('text');
            },
            setClipboardText:function (e, value) {
                e = this.getEvent(e);
                /*if (e.clipboardData) {
                 return e.clipboardData.setData('text/plain', value);
                 } else if (window.clipboardData) {
                 return window.clipboardData.setData('text', value);
                 }*/

                try {
                    window.clipboardData.setData('text', value);
                } catch (e) {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                    trans.addDataFlavor('text/unicode');
                    var nsiStr = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                    nsiStr.data = value;
                    trans.setTransferData("text/unicode", nsiStr, value.length * 2);
                    var clipid = Components.interfaces.nsIClipboard;
                    clip.setData(trans, null, clipid.kGlobalClipboard);
                }
            },
            ready:function (fn) {
                var delay;
                /^loade|c/.test(doc.readyState) ? delay = setTimeout(function () {
                    arguments.callee.apply(null, arguments)
                }, 50) : delay && clearTimeout(delay), setTimeout(fn, 1);
            },
            dynamicScriptProxy:function (src, data, callback,name) {
                var  script = doc.createElement('script'), timestamp = +(new Date()), keygen = 'abcdefghijk', key = Math.random().toFixed(1) * 10, method = keygen[key] + timestamp,name=name || 'callback';

                src += src.indexOf('?') > 0 ? '' : '?',

                this.is(data)==='Array' ?(
                    this.is(data)==='Array' && (src+=data.join(','))
                ):(

                    this.each(data,function(a,b){
                        src+=a  + '=' + data[a] + '&';
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
            },
            trigger:function (elem, evType) {//��װģ���û���Ϊ�ķ�����
                var event;
                undefined !== doc.createEvent ? (event = doc.createEvent('MouseEvents'), event.initMouseEvent(evType, true, true, doc.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null), elem.dispatchEvent(event)) : (event = doc.createEventObject(), event.screenX = 100, event.screenY = 0, event.clientX = 0, event.clientY = 0, event.ctrlKey = false, event.altKey = false, event.shiftKey = false, event.button = false, elem.fireEvent('on' + evType, event));
            },
            duffsDevice:function (items, fn) {
                if ('function' !== typeof(fn)) return;
                var iterations = items.length % 8, i = items.length - 1, callback = fn;
                while (iterations) {
                    callback(items[i--]);
                    iterations--;
                }

                iterations = Math.floor(items.length / 8);

                while (iterations) {
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    callback(i--, items[i]);
                    iterations--;
                }
            },
            getCursortPosition:function (ctrl) {
                ctrl.focus();
                var CaretPos = 0;   // IE Support
                if (doc.selection) {
                    ctrl.focus();
                    var Sel = doc.selection.createRange();
                    Sel.moveStart('character', -ctrl.value.length);
                    CaretPos = Sel.text.length;
                }
                // Firefox support
                else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                    CaretPos = ctrl.selectionStart;
                return (CaretPos);
            },
            setCaretPosition:function (ctrl, pos) {
                if (ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                }
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }

            },
            getElementsByTagNames: function(list, obj){
                if (!obj) obj = doc;
                var tagNames = list.split(',');
                var resultArray = new Array();
                for (var i = 0; i < tagNames.length; i++) {
                    var tags = obj.getElementsByTagName(tagNames[i]);
                    for (var j = 0; j < tags.length>>>0; j++) {
                        resultArray.push(tags[j]);
                    }
                }
                var testNode = resultArray[0];
                if (!testNode) return [];
                if (testNode.sourceIndex) {
                    resultArray.sort(function (a, b) {
                        return a.sourceIndex - b.sourceIndex;
                    });
                }
                else if (testNode.compareDocumentPosition) {
                    resultArray.sort(function (a, b) {
                        return 3 - (a.compareDocumentPosition(b) & 6);
                    });
                }
                return resultArray;
            },
            getElementsByClassName:  doc.getElementsByClassName? function(className){
                return   doc.getElementsByClassName(className);
            }:function (className, parentNode) {
                var parentNode = parentNode || doc,elem = parentNode.getElementsByTagName('*'), i = elem.length, node = [], reg = /(^|\s)className(\s|$)/gi, temp;
                for (; i--;(
                    temp = elem[i],
                    reg.test(temp) && (node.push(temp))
                )) {}

                return node;
            }
        };

        if (window === this || 'indicator' in this) {
            return new indicator;
        }
    }();
    im.tk || (im.tk = toolKit);
}(this,document);

