import React, { Component } from "react";

import { StyleSheet, View, ActivityIndicator, AsyncStorage, Dimensions, Platform, AppState } from "react-native";

import Orientation from "react-native-orientation";

import RNFetchBlob from "react-native-fetch-blob";

if (!global.Blob) {
  global.Blob = RNFetchBlob.polyfill.Blob;
}

global.JSZip = global.JSZip || require("jszip");

global.URL = require("epubjs/libs/url/url-polyfill.js");

if (!global.btoa) {
  global.btoa = require("base-64").encode;
}

import ePub, { Rendition, Layout, EpubCFI } from "epubjs";

const core = require("epubjs/lib/utils/core");
const Uri = require("epubjs/lib/utils/url");
const Path = require("epubjs/lib/utils/path");

const EpubViewManager = require("./EpubViewManager");

const EPUBJS = "(function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t(require('xmldom')):'function'==typeof define&&define.amd?define(['xmldom'],t):'object'==typeof exports?exports.EPUBJSContents=t(require('xmldom')):e.EPUBJSContents=t(e.xmldom)})(this,function(e){var t=String.prototype,n=Math.max;return function(e){function t(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e['default']}:function(){return e};return t.d(n,'a',n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p='',t(t.s=5)}([function(e,t,i){'use strict';function a(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}function o(){var e=new Date().getTime(),t='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(t){var n=0|(e+16*Math.random())%16;return e=g(e/16),('x'==t?n:8|7&n).toString(16)});return t}function l(e){return!isNaN(parseFloat(e))&&isFinite(e)}function r(e,t,n,i,a){var o,l=i||0,d=a||t.length,s=parseInt(l+(d-l)/2);return(n||(n=function(e,t){return e>t?1:e<t?-1:e==t?0:void 0}),0>=d-l)?s:(o=n(t[s],e),1==d-l?0<o?s:s+1:0===o?s:-1===o?r(e,t,n,s,d):r(e,t,n,l,s))}function d(e,t,n,i,a){var o,l=i||0,r=a||t.length,s=parseInt(l+(r-l)/2);return(n||(n=function(e,t){return e>t?1:e<t?-1:e==t?0:void 0}),0>=r-l)?-1:(o=n(t[s],e),1==r-l?0===o?s:-1:0===o?s:-1===o?d(e,t,n,s,r):d(e,t,n,l,s))}function s(e,t){for(var n,a=e.parentNode,o=a.childNodes,l=-1,r=0;r<o.length&&(n=o[r],n.nodeType===t&&l++,n!=e);r++);return l}function u(e,t){return new Blob([e],{type:t})}function c(e,t){return'undefined'==typeof e.querySelector?e.getElementsByTagName(t):e.querySelectorAll(t)}function p(e,t,n){for(var i,a=document.createTreeWalker(e,n,null,!1);i=a.nextNode();)t(i)}function h(e,t){if(t(e))return!0;if(e=e.firstChild,e)do{var n=h(e,t);if(n)return!0;e=e.nextSibling}while(e)}function f(e){for(var t=[e];e;e=e.parentNode)t.unshift(e);return t}var g=Math.floor;Object.defineProperty(t,'__esModule',{value:!0});var m=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();t.isElement=function(e){return!!(e&&1==e.nodeType)},t.uuid=o,t.documentHeight=function(){return n(document.documentElement.clientHeight,document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight)},t.isNumber=l,t.isFloat=function(e){return l(e)&&g(e)!==e},t.prefixed=function(e){var t=['Webkit','webkit','Moz','O','ms'],n=['-webkit-','-webkit-','-moz-','-o-','-ms-'],a=e[0].toUpperCase()+e.slice(1),o=t.length;if('undefined'==typeof document||'undefined'!=typeof document.body.style[e])return e;for(var l=0;l<o;l++)if('undefined'!=typeof document.body.style[t[l]+a])return n[l]+e;return e},t.defaults=function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var a in t=arguments[n],t)void 0===e[a]&&(e[a]=t[a]);return e},t.extend=function(e){var t=[].slice.call(arguments,1);return t.forEach(function(t){t&&Object.getOwnPropertyNames(t).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})}),e},t.insert=function(e,t,n){var i=r(e,t,n);return t.splice(i,0,e),i},t.locationOf=r,t.indexOfSorted=d,t.bounds=function(e){var t=window.getComputedStyle(e),n=0,i=0;return['width','paddingRight','paddingLeft','marginRight','marginLeft','borderRightWidth','borderLeftWidth'].forEach(function(e){n+=parseFloat(t[e])||0}),['height','paddingTop','paddingBottom','marginTop','marginBottom','borderTopWidth','borderBottomWidth'].forEach(function(e){i+=parseFloat(t[e])||0}),{height:i,width:n}},t.borders=function(e){var t=window.getComputedStyle(e),n=0,i=0;return['paddingRight','paddingLeft','marginRight','marginLeft','borderRightWidth','borderLeftWidth'].forEach(function(e){n+=parseFloat(t[e])||0}),['paddingTop','paddingBottom','marginTop','marginBottom','borderTopWidth','borderBottomWidth'].forEach(function(e){i+=parseFloat(t[e])||0}),{height:i,width:n}},t.windowBounds=function(){var e=window.innerWidth,t=window.innerHeight;return{top:0,left:0,right:e,bottom:t,width:e,height:t}},t.cleanStringForXpath=function(e){var t=e.match(/[^'\"]+|['\"]/g);return t=t.map(function(e){return'\\''===e?'\"\\'\"':'\"'===e?'\\'\"\\'':'\\''+e+'\\''}),'concat(\\'\\','+t.join(',')+')'},t.indexOfNode=s,t.indexOfTextNode=function(e){return s(e,v)},t.indexOfElementNode=function(e){return s(e,b)},t.isXml=function(e){return-1<['xml','opf','ncx'].indexOf(e)},t.createBlob=u,t.createBlobUrl=function(e,t){var n,i=window.URL||window.webkitURL||window.mozURL,a=u(e,t);return n=i.createObjectURL(a),n},t.createBase64Url=function(e,t){var n,i;if('string'==typeof e)return n=btoa(e),i='data:'+t+';base64,'+n,i},t.type=function(e){return Object.prototype.toString.call(e).slice(8,-1)},t.parse=function(e,t,n){var a,o;return o='undefined'==typeof DOMParser||n?i(27).DOMParser:DOMParser,65279===e.charCodeAt(0)&&(e=e.slice(1)),a=new o().parseFromString(e,t),a},t.qs=function(e,t){var n;if(!e)throw new Error('No Element Provided');return'undefined'==typeof e.querySelector?(n=e.getElementsByTagName(t),n.length)?n[0]:void 0:e.querySelector(t)},t.qsa=c,t.qsp=function(e,t,n){var i,a;if('undefined'!=typeof e.querySelector){for(var o in t+='[',n)t+=o+'=\\''+n[o]+'\\'';return t+=']',e.querySelector(t)}return(i=e.getElementsByTagName(t),a=Array.prototype.slice.call(i,0).filter(function(e){for(var t in n)if(e.getAttribute(t)===n[t])return!0;return!1}),a)?a[0]:void 0},t.sprint=function(e,t){var n=e.ownerDocument||e;'undefined'==typeof n.createTreeWalker?h(e,function(e){e&&3===e.nodeType&&t(e)},!0):p(e,t,NodeFilter.SHOW_TEXT)},t.treeWalker=p,t.walk=h,t.blob2base64=function(e){return new Promise(function(t){var n=new FileReader;n.readAsDataURL(e),n.onloadend=function(){t(n.result)}})},t.defer=function(){var e=this;this.resolve=null,this.reject=null,this.id=o(),this.promise=new Promise(function(t,n){e.resolve=t,e.reject=n}),Object.freeze(this)},t.querySelectorByType=function(e,t,n){var a;if('undefined'!=typeof e.querySelector&&(a=e.querySelector(t+'[*|type=\"'+n+'\"]')),!a||0===a.length){a=c(e,t);for(var o=0;o<a.length;o++)if(a[o].getAttributeNS('http://www.idpf.org/2007/ops','type')===n||a[o].getAttribute('epub:type')===n)return a[o]}else return a},t.findChildren=function(e){for(var t,n=[],a=e.childNodes,o=0;o<a.length;o++)t=a[o],1===t.nodeType&&n.push(t);return n},t.parents=f;var y=t.requestAnimationFrame='undefined'!=typeof window&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame),b=1,v=3,k=t.RangeObject=function(){function e(){a(this,e),this.collapsed=!1,this.commonAncestorContainer=void 0,this.endContainer=void 0,this.endOffset=void 0,this.startContainer=void 0,this.startOffset=void 0}return m(e,[{key:'setStart',value:function(e,t){this.startContainer=e,this.startOffset=t,this.endContainer?this.commonAncestorContainer=this._commonAncestorContainer():this.collapse(!0),this._checkCollapsed()}},{key:'setEnd',value:function(e,t){this.endContainer=e,this.endOffset=t,this.startContainer?(this.collapsed=!1,this.commonAncestorContainer=this._commonAncestorContainer()):this.collapse(!1),this._checkCollapsed()}},{key:'collapse',value:function(e){this.collapsed=!0,e?(this.endContainer=this.startContainer,this.endOffset=this.startOffset,this.commonAncestorContainer=this.startContainer.parentNode):(this.startContainer=this.endContainer,this.startOffset=this.endOffset,this.commonAncestorContainer=this.endOffset.parentNode)}},{key:'selectNode',value:function(e){var t=e.parentNode,n=Array.prototype.indexOf.call(t.childNodes,e);this.setStart(t,n),this.setEnd(t,n+1)}},{key:'selectNodeContents',value:function(e){var t=e.childNodes[e.childNodes-1],n=3===e.nodeType?e.textContent.length:parent.childNodes.length;this.setStart(e,0),this.setEnd(e,n)}},{key:'_commonAncestorContainer',value:function(e,t){var n=f(e||this.startContainer),a=f(t||this.endContainer);if(n[0]==a[0])for(var o=0;o<n.length;o++)if(n[o]!=a[o])return n[o-1]}},{key:'_checkCollapsed',value:function(){this.collapsed=this.startContainer===this.endContainer&&this.startOffset===this.endOffset}},{key:'toString',value:function(){}}]),e}()},function(e,t,n){'use strict';function i(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}var a='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e};Object.defineProperty(t,'__esModule',{value:!0});var o='function'==typeof Symbol&&'symbol'===a(Symbol.iterator)?function(e){return'undefined'==typeof e?'undefined':a(e)}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':'undefined'==typeof e?'undefined':a(e)},l=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=n(0),d=1,s=3,u=function(){function e(t,n,a){i(this,e);var l;if(this.str='',this.base={},this.spinePos=0,this.range=!1,this.path={},this.start=null,this.end=null,!(this instanceof e))return new e(t,n,a);if('string'==typeof n?this.base=this.parseComponent(n):'object'===('undefined'==typeof n?'undefined':o(n))&&n.steps&&(this.base=n),l=this.checkType(t),'string'===l)return this.str=t,(0,r.extend)(this,this.parse(t));if('range'===l)return(0,r.extend)(this,this.fromRange(t,this.base,a));if('node'===l)return(0,r.extend)(this,this.fromNode(t,this.base,a));if('EpubCFI'===l&&t.path)return t;if(!t)return this;throw new TypeError('not a valid argument for EpubCFI')}return l(e,[{key:'checkType',value:function(t){return this.isCfiString(t)?'string':'object'===('undefined'==typeof t?'undefined':o(t))&&('Range'===(0,r.type)(t)||'undefined'!=typeof t.startContainer)?'range':'object'===('undefined'==typeof t?'undefined':o(t))&&'undefined'!=typeof t.nodeType?'node':'object'===('undefined'==typeof t?'undefined':o(t))&&t instanceof e&&'EpubCFI'}},{key:'parse',value:function(e){var t,n,i,a={spinePos:-1,range:!1,base:{},path:{},start:null,end:null};return'string'==typeof e?(0===e.indexOf('epubcfi(')&&')'===e[e.length-1]&&(e=e.slice(8,e.length-1)),t=this.getChapterComponent(e),!t)?{spinePos:-1}:(a.base=this.parseComponent(t),n=this.getPathComponent(e),a.path=this.parseComponent(n),i=this.getRange(e),i&&(a.range=!0,a.start=this.parseComponent(i[0]),a.end=this.parseComponent(i[1])),a.spinePos=a.base.steps[1].index,a):{spinePos:-1}}},{key:'parseComponent',value:function(e){var t,n={steps:[],terminal:{offset:null,assertion:null}},i=e.split(':'),a=i[0].split('/');return 1<i.length&&(t=i[1],n.terminal=this.parseTerminal(t)),''===a[0]&&a.shift(),n.steps=a.map(function(e){return this.parseStep(e)}.bind(this)),n}},{key:'parseStep',value:function(e){var t,n,i,a,o;if(a=e.match(/\\[(.*)\\]/),a&&a[1]&&(o=a[1]),n=parseInt(e),!isNaN(n))return 0==n%2?(t='element',i=n/2-1):(t='text',i=(n-1)/2),{type:t,index:i,id:o||null}}},{key:'parseTerminal',value:function(e){var t,n,i=e.match(/\\[(.*)\\]/);return i&&i[1]?(t=parseInt(e.split('[')[0])||null,n=i[1]):t=parseInt(e)||null,{offset:t,assertion:n}}},{key:'getChapterComponent',value:function(e){var t=e.split('!');return t[0]}},{key:'getPathComponent',value:function(e){var t=e.split('!');if(t[1]){var n=t[1].split(',');return n[0]}}},{key:'getRange',value:function(e){var t=e.split(',');return 3===t.length&&[t[1],t[2]]}},{key:'getCharecterOffsetComponent',value:function(e){var t=e.split(':');return t[1]||''}},{key:'joinSteps',value:function(e){return e?e.map(function(e){var t='';return'element'===e.type&&(t+=2*(e.index+1)),'text'===e.type&&(t+=1+2*e.index),e.id&&(t+='['+e.id+']'),t}).join('/'):''}},{key:'segmentString',value:function(e){var t='/';return t+=this.joinSteps(e.steps),e.terminal&&null!=e.terminal.offset&&(t+=':'+e.terminal.offset),e.terminal&&null!=e.terminal.assertion&&(t+='['+e.terminal.assertion+']'),t}},{key:'toString',value:function(){var e='epubcfi(';return e+=this.segmentString(this.base),e+='!',e+=this.segmentString(this.path),this.start&&(e+=',',e+=this.segmentString(this.start)),this.end&&(e+=',',e+=this.segmentString(this.end)),e+=')',e}},{key:'compare',value:function(t,n){var a,o,l,r;if('string'==typeof t&&(t=new e(t)),'string'==typeof n&&(n=new e(n)),t.spinePos>n.spinePos)return 1;if(t.spinePos<n.spinePos)return-1;t.range?(a=t.path.steps.concat(t.start.steps),l=t.start.terminal):(a=t.path.steps,l=t.path.terminal),n.range?(o=n.path.steps.concat(n.start.steps),r=n.start.terminal):(o=n.path.steps,r=n.path.terminal);for(var d=0;d<a.length;d++){if(!a[d])return-1;if(!o[d])return 1;if(a[d].index>o[d].index)return 1;if(a[d].index<o[d].index)return-1}return a.length<o.length?1:l.offset>r.offset?1:l.offset<r.offset?-1:0}},{key:'step',value:function(e){var t=e.nodeType===s?'text':'element';return{id:e.id,tagName:e.tagName,type:t,index:this.position(e)}}},{key:'filteredStep',value:function(e,t){var n,i=this.filter(e,t);if(i)return n=i.nodeType===s?'text':'element',{id:i.id,tagName:i.tagName,type:n,index:this.filteredPosition(i,t)}}},{key:'pathTo',value:function(e,t,n){for(var i,a={steps:[],terminal:{offset:null,assertion:null}},o=e;o&&o.parentNode&&o.parentNode.nodeType!=9;)i=n?this.filteredStep(o,n):this.step(o),i&&a.steps.unshift(i),o=o.parentNode;return null!=t&&0<=t&&(a.terminal.offset=t,'text'!=a.steps[a.steps.length-1].type&&a.steps.push({type:'text',index:0})),a}},{key:'equalStep',value:function(e,t){return e&&t&&e.index===t.index&&e.id===t.id&&e.type===t.type}},{key:'fromRange',value:function(e,t,n){var a={range:!1,base:{},path:{},start:null,end:null},l=e.startContainer,r=e.endContainer,d=e.startOffset,s=e.endOffset,u=!1;if(n&&(u=null!=l.ownerDocument.querySelector('.'+n)),'string'==typeof t?(a.base=this.parseComponent(t),a.spinePos=a.base.steps[1].index):'object'===('undefined'==typeof t?'undefined':o(t))&&(a.base=t),e.collapsed)u&&(d=this.patchOffset(l,d,n)),a.path=this.pathTo(l,d,n);else{a.range=!0,u&&(d=this.patchOffset(l,d,n)),a.start=this.pathTo(l,d,n),u&&(s=this.patchOffset(r,s,n)),a.end=this.pathTo(r,s,n),a.path={steps:[],terminal:null};var c,i=a.start.steps.length;for(c=0;c<i&&this.equalStep(a.start.steps[c],a.end.steps[c]);c++)c===i-1?a.start.terminal===a.end.terminal&&(a.path.steps.push(a.start.steps[c]),a.range=!1):a.path.steps.push(a.start.steps[c]);a.start.steps=a.start.steps.slice(a.path.steps.length),a.end.steps=a.end.steps.slice(a.path.steps.length)}return a}},{key:'fromNode',value:function(e,t,n){var i={range:!1,base:{},path:{},start:null,end:null};return'string'==typeof t?(i.base=this.parseComponent(t),i.spinePos=i.base.steps[1].index):'object'===('undefined'==typeof t?'undefined':o(t))&&(i.base=t),i.path=this.pathTo(e,null,n),i}},{key:'filter',value:function(e,t){var n,i,a,o,l,r=!1;return e.nodeType===s?(r=!0,a=e.parentNode,n=e.parentNode.classList.contains(t)):(r=!1,n=e.classList.contains(t)),n&&r?(o=a.previousSibling,l=a.nextSibling,o&&o.nodeType===s?i=o:l&&l.nodeType===s&&(i=l),i?i:e):n&&!r?!1:e}},{key:'patchOffset',value:function(e,t,n){if(e.nodeType!=s)throw new Error('Anchor must be a text node');var i=e,a=t;for(e.parentNode.classList.contains(n)&&(i=e.parentNode);i.previousSibling;){if(i.previousSibling.nodeType!==d)a+=i.previousSibling.textContent.length;else if(i.previousSibling.classList.contains(n))a+=i.previousSibling.textContent.length;else break;i=i.previousSibling}return a}},{key:'normalizedMap',value:function(e,t,n){var a,i,o,l={},r=-1,u=e.length;for(a=0;a<u;a++)i=e[a].nodeType,i===d&&e[a].classList.contains(n)&&(i=s),0<a&&i===s&&o===s?l[a]=r:t===i&&(++r,l[a]=r),o=i;return l}},{key:'position',value:function(e){var t,n;return e.nodeType===d?(t=e.parentNode.children,!t&&(t=(0,r.findChildren)(e.parentNode)),n=Array.prototype.indexOf.call(t,e)):(t=this.textNodes(e.parentNode),n=t.indexOf(e)),n}},{key:'filteredPosition',value:function(e,t){var n,i,a;return e.nodeType===d?(n=e.parentNode.children,a=this.normalizedMap(n,d,t)):(n=e.parentNode.childNodes,e.parentNode.classList.contains(t)&&(e=e.parentNode,n=e.parentNode.childNodes),a=this.normalizedMap(n,s,t)),i=Array.prototype.indexOf.call(n,e),a[i]}},{key:'stepsToXpath',value:function(e){var t=['.','*'];return e.forEach(function(e){var n=e.index+1;e.id?t.push('*[position()='+n+' and @id=\\''+e.id+'\\']'):'text'===e.type?t.push('text()['+n+']'):t.push('*['+n+']')}),t.join('/')}},{key:'stepsToQuerySelector',value:function(e){var t=['html'];return e.forEach(function(e){var n=e.index+1;e.id?t.push('#'+e.id):'text'===e.type||t.push('*:nth-child('+n+')')}),t.join('>')}},{key:'textNodes',value:function(e,t){return Array.prototype.slice.call(e.childNodes).filter(function(e){return e.nodeType===s||t&&e.classList.contains(t)})}},{key:'walkToNode',value:function(e,t,n){var a,o,l,i=t||document,d=i.documentElement,s=e.length;for(l=0;l<s&&(o=e[l],'element'===o.type?o.id?d=i.getElementById(o.id):(a=d.children||(0,r.findChildren)(d),d=a[o.index]):'text'===o.type&&(d=this.textNodes(d,n)[o.index]),!!d);l++);return d}},{key:'findNode',value:function(e,t,n){var i,a,o=t||document;return n||'undefined'==typeof o.evaluate?n?i=this.walkToNode(e,o,n):i=this.walkToNode(e,o):(a=this.stepsToXpath(e),i=o.evaluate(a,o,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue),i}},{key:'fixMiss',value:function(e,t,n,i){var a,o,l=this.findNode(e.slice(0,-1),n,i),r=l.childNodes,u=this.normalizedMap(r,s,i),c=e[e.length-1].index;for(var p in u){if(!u.hasOwnProperty(p))return;if(u[p]===c)if(a=r[p],o=a.textContent.length,t>o)t-=o;else{l=a.nodeType===d?a.childNodes[0]:a;break}}return{container:l,offset:t}}},{key:'toRange',value:function(e,t){var n,i,a,o,l,d,s,u,c=e||document,p=this,h=!!t&&null!=c.querySelector('.'+t);if(n='undefined'==typeof c.createRange?new r.RangeObject:c.createRange(),p.range?(i=p.start,d=p.path.steps.concat(i.steps),o=this.findNode(d,c,h?t:null),a=p.end,s=p.path.steps.concat(a.steps),l=this.findNode(s,c,h?t:null)):(i=p.path,d=p.path.steps,o=this.findNode(p.path.steps,c,h?t:null)),o)try{null==i.terminal.offset?n.setStart(o,0):n.setStart(o,i.terminal.offset)}catch(a){u=this.fixMiss(d,i.terminal.offset,c,h?t:null),n.setStart(u.container,u.offset)}else return console.log('NO START'),null;if(l)try{null==a.terminal.offset?n.setEnd(l,0):n.setEnd(l,a.terminal.offset)}catch(i){u=this.fixMiss(s,p.end.terminal.offset,c,h?t:null),n.setEnd(u.container,u.offset)}return n}},{key:'isCfiString',value:function(e){return'string'==typeof e&&0===e.indexOf('epubcfi(')&&')'===e[e.length-1]}},{key:'generateChapterComponent',value:function(e,t,n){var i=parseInt(t),a='/'+2*(e+1)+'/';return a+=2*(i+1),n&&(a+='['+n+']'),a}}]),e}();t.default=u,e.exports=t['default']},function(e,t,n){'use strict';function i(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}Object.defineProperty(t,'__esModule',{value:!0});var a=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=n(3),l=function(e){return e&&e.__esModule?e:{default:e}}(o),r=function(){function e(t){i(this,e);var n,a;n=t.indexOf('://'),-1<n&&(t=new URL(t).pathname),a=this.parse(t),this.path=t,this.directory=this.isDirectory(t)?t:a.dir+'/',this.filename=a.base,this.extension=a.ext.slice(1)}return a(e,[{key:'parse',value:function(e){return l.default.parse(e)}},{key:'isAbsolute',value:function(e){return l.default.isAbsolute(e||this.path)}},{key:'isDirectory',value:function(e){return'/'===e.charAt(e.length-1)}},{key:'resolve',value:function(e){return l.default.resolve(this.directory,e)}},{key:'relative',value:function(e){return l.default.relative(this.directory,e)}},{key:'splitPath',value:function(e){return this.splitPathRe.exec(e).slice(1)}},{key:'toString',value:function(){return this.path}}]),e}();t.default=r,e.exports=t['default']},function(e){'use strict';function t(e){if('string'!=typeof e)throw new TypeError('Path must be a string. Received '+e)}function n(e,t){for(var n,a='',o=-1,l=0,r=0;r<=e.length;++r){if(r<e.length)n=e.charCodeAt(r);else if(47===n)break;else n=47;if(47===n){if(o==r-1||1==l);else if(o!=r-1&&2==l){if(2>a.length||46!==a.charCodeAt(a.length-1)||46!==a.charCodeAt(a.length-2))if(2<a.length){for(var i=a.length-1,d=i;0<=d&&47!==a.charCodeAt(d);--d);if(d!=i){a=-1==d?'':a.slice(0,d),o=r,l=0;continue}}else if(2===a.length||1===a.length){a='',o=r,l=0;continue}t&&(0<a.length?a+='/..':a='..')}else 0<a.length?a+='/'+e.slice(o+1,r):a=e.slice(o+1,r);o=r,l=0}else 46===n&&-1!=l?++l:l=-1}return a}function i(e,t){var n=t.dir||t.root,i=t.base||(t.name||'')+(t.ext||'');return n?n===t.root?n+i:n+e+i:i}var a='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e};if(!o)var o={cwd:function(){return'/'}};var l={resolve:function(){for(var e,a='',l=!1,r=arguments.length-1;-1<=r&&!l;r--){var i;(0<=r?i=arguments[r]:(void 0==e&&(e=o.cwd()),i=e),t(i),0!==i.length)&&(a=i+'/'+a,l=47===i.charCodeAt(0))}return a=n(a,!l),l?0<a.length?'/'+a:'/':0<a.length?a:'.'},normalize:function(e){if(t(e),0===e.length)return'.';var i=47===e.charCodeAt(0),a=47===e.charCodeAt(e.length-1);return e=n(e,!i),0!==e.length||i||(e='.'),0<e.length&&a&&(e+='/'),i?'/'+e:e},isAbsolute:function(e){return t(e),0<e.length&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return'.';for(var e,n,a=0;a<arguments.length;++a)n=arguments[a],t(n),0<n.length&&(void 0==e?e=n:e+='/'+n);return void 0===e?'.':l.normalize(e)},relative:function(e,n){if(t(e),t(n),e===n)return'';if(e=l.resolve(e),n=l.resolve(n),e===n)return'';for(var a=1;a<e.length&&47===e.charCodeAt(a);++a);for(var o=e.length,r=o-a,d=1;d<n.length&&47===n.charCodeAt(d);++d);for(var s=n.length,u=s-d,c=r<u?r:u,p=-1,h=0;h<=c;++h){if(h==c){if(u>c){if(47===n.charCodeAt(d+h))return n.slice(d+h+1);if(0==h)return n.slice(d+h)}else r>c&&(47===e.charCodeAt(a+h)?p=h:0==h&&(p=0));break}var i=e.charCodeAt(a+h),f=n.charCodeAt(d+h);if(i!==f)break;else 47===i&&(p=h)}var g='';for(h=a+p+1;h<=o;++h)(h===o||47===e.charCodeAt(h))&&(g+=0===g.length?'..':'/..');return 0<g.length?g+n.slice(d+p):(d+=p,47===n.charCodeAt(d)&&++d,n.slice(d))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return'.';for(var n=e.charCodeAt(0),a=47===n,o=-1,l=!0,r=e.length-1;1<=r;--r)if(n=e.charCodeAt(r),47!==n)l=!1;else if(!l){o=r;break}return-1===o?a?'/':'.':a&&1===o?'//':e.slice(0,o)},basename:function(e,n){if(n!==void 0&&'string'!=typeof n)throw new TypeError('\"ext\" argument must be a string');t(e);var a,i=0,o=-1,l=!0;if(void 0!==n&&0<n.length&&n.length<=e.length){if(n.length===e.length&&n===e)return'';var r=n.length-1,d=-1;for(a=e.length-1;0<=a;--a){var s=e.charCodeAt(a);if(47!==s)-1==d&&(l=!1,d=a+1),0<=r&&(s===n.charCodeAt(r)?-1==--r&&(o=a):(r=-1,o=d));else if(!l){i=a+1;break}}return i===o?o=d:-1===o&&(o=e.length),e.slice(i,o)}for(a=e.length-1;0<=a;--a)if(47!==e.charCodeAt(a))-1==o&&(l=!1,o=a+1);else if(!l){i=a+1;break}return-1===o?'':e.slice(i,o)},extname:function(e){t(e);for(var n,a=-1,o=0,l=-1,r=!0,d=0,s=e.length-1;0<=s;--s){if(n=e.charCodeAt(s),47===n){if(!r){o=s+1;break}continue}-1==l&&(r=!1,l=s+1),46===n?-1==a?a=s:1!=d&&(d=1):-1!==a&&(d=-1)}return-1===a||-1===l||0==d||1==d&&a===l-1&&a===o+1?'':e.slice(a,l)},format:function(e){if(null===e||'object'!==('undefined'==typeof e?'undefined':a(e)))throw new TypeError('Parameter \"pathObject\" must be an object, not '+('undefined'==typeof e?'undefined':a(e)));return i('/',e)},parse:function(e){t(e);var n={root:'',dir:'',base:'',ext:'',name:''};if(0===e.length)return n;var a,o=e.charCodeAt(0),l=47===o;l?(n.root='/',a=1):a=0;for(var r=-1,d=0,s=-1,u=!0,c=e.length-1,i=0;c>=a;--c){if(o=e.charCodeAt(c),47===o){if(!u){d=c+1;break}continue}-1==s&&(u=!1,s=c+1),46===o?-1==r?r=c:1!=i&&(i=1):-1!=r&&(i=-1)}return-1==r||-1==s||0==i||1==i&&r==s-1&&r==d+1?-1!=s&&(0==d&&l?n.base=n.name=e.slice(1,s):n.base=n.name=e.slice(d,s)):(0==d&&l?(n.name=e.slice(1,r),n.base=e.slice(1,s)):(n.name=e.slice(d,r),n.base=e.slice(d,s)),n.ext=e.slice(r,s)),0<d?n.dir=e.slice(0,d-1):l&&(n.dir='/'),n},sep:'/',delimiter:':',posix:null};e.exports=l},function(e,t,n){'use strict';function i(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}Object.defineProperty(t,'__esModule',{value:!0});var o=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),l=n(23),r=i(l),d=n(0),s=n(1),u=i(s),c=n(7),p=i(c),h=n(8),f=n(25),g=['keydown','keyup','keypressed','mouseup','mousedown','click','touchend','touchstart'],m=function(){function e(t,n,i,o){a(this,e),this.epubcfi=new u.default,this.document=t,this.documentElement=this.document.documentElement,this.content=n||this.document.body,this.window=this.document.defaultView,this._size={width:0,height:0},this.sectionIndex=o||0,this.cfiBase=i||'',this.pane=void 0,this.highlights={},this.underlines={},this.marks={},this.listeners()}return o(e,[{key:'width',value:function(e){var t=this.content;return e&&(0,d.isNumber)(e)&&(e+='px'),e&&(t.style.width=e),this.window.getComputedStyle(t).width}},{key:'height',value:function(e){var t=this.content;return e&&(0,d.isNumber)(e)&&(e+='px'),e&&(t.style.height=e),this.window.getComputedStyle(t).height}},{key:'contentWidth',value:function(e){var t=this.content||this.document.body;return e&&(0,d.isNumber)(e)&&(e+='px'),e&&(t.style.width=e),this.window.getComputedStyle(t).width}},{key:'contentHeight',value:function(e){var t=this.content||this.document.body;return e&&(0,d.isNumber)(e)&&(e+='px'),e&&(t.style.height=e),this.window.getComputedStyle(t).height}},{key:'textWidth',value:function(){var e,t=this.document.createRange(),n=this.content||this.document.body;return t.selectNodeContents(n),e=t.getBoundingClientRect().width,e}},{key:'textHeight',value:function(){var e,t=this.document.createRange(),n=this.content||this.document.body;return t.selectNodeContents(n),e=t.getBoundingClientRect().height,e}},{key:'scrollWidth',value:function(){var e=this.documentElement.scrollWidth;return e}},{key:'scrollHeight',value:function(){var e=this.documentElement.scrollHeight;return e}},{key:'overflow',value:function(e){return e&&(this.documentElement.style.overflow=e),this.window.getComputedStyle(this.documentElement).overflow}},{key:'overflowX',value:function(e){return e&&(this.documentElement.style.overflowX=e),this.window.getComputedStyle(this.documentElement).overflowX}},{key:'overflowY',value:function(e){return e&&(this.documentElement.style.overflowY=e),this.window.getComputedStyle(this.documentElement).overflowY}},{key:'css',value:function(e,t,n){var i=this.content||this.document.body;return t&&i.style.setProperty(e,t,n?'important':''),this.window.getComputedStyle(i)[e]}},{key:'viewport',value:function(e){var t,n,i=this.document.querySelector('meta[name=\\'viewport\\']'),a={width:void 0,height:void 0,scale:void 0,minimum:void 0,maximum:void 0,scalable:void 0},o=[];if(i&&i.hasAttribute('content')){var l=i.getAttribute('content'),r=l.match(/width\\s*=\\s*([^,]*)/g),d=l.match(/height\\s*=\\s*([^,]*)/g),s=l.match(/initial-scale\\s*=\\s*([^,]*)/g),u=l.match(/minimum-scale\\s*=\\s*([^,]*)/g),c=l.match(/maximum-scale\\s*=\\s*([^,]*)/g),p=l.match(/user-scalable\\s*=\\s*([^,]*)/g);r&&r.length&&'undefined'!=typeof r[1]&&(a.width=r[1]),d&&d.length&&'undefined'!=typeof d[1]&&(a.height=d[1]),s&&s.length&&'undefined'!=typeof s[1]&&(a.scale=s[1]),u&&u.length&&'undefined'!=typeof u[1]&&(a.minimum=u[1]),c&&c.length&&'undefined'!=typeof c[1]&&(a.maximum=c[1]),p&&p.length&&'undefined'!=typeof p[1]&&(a.scalable=p[1])}return e&&((e.width||a.width)&&o.push('width='+(e.width||a.width)),(e.height||a.height)&&o.push('height='+(e.height||a.height)),(e.scale||a.scale)&&o.push('initial-scale='+(e.scale||a.scale)),(e.scalable||a.scalable)&&(o.push('minimum-scale='+(e.scale||a.minimum)),o.push('maximum-scale='+(e.scale||a.maximum)),o.push('user-scalable='+(e.scalable||a.scalable))),!i&&(i=this.document.createElement('meta'),i.setAttribute('name','viewport'),this.document.querySelector('head').appendChild(i)),i.setAttribute('content',o.join(', ')),this.window.scrollTo(0,0)),{width:parseInt(t),height:parseInt(n)}}},{key:'expand',value:function(){this.emit('expand')}},{key:'listeners',value:function(){this.imageLoadListeners(),this.mediaQueryListeners(),this.addEventListeners(),this.addSelectionListeners(),this.resizeListeners(),this.linksHandler()}},{key:'removeListeners',value:function(){this.removeEventListeners(),this.removeSelectionListeners(),clearTimeout(this.expanding)}},{key:'resizeListeners',value:function(){var e,t;clearTimeout(this.expanding),e=this.textWidth(),t=this.textHeight(),(e!=this._size.width||t!=this._size.height)&&(this._size={width:e,height:t},this.pane&&this.pane.render(),this.emit('resize',this._size)),this.expanding=setTimeout(this.resizeListeners.bind(this),350)}},{key:'mediaQueryListeners',value:function(){for(var e=this.document.styleSheets,t=function(e){e.matches&&!this._expanding&&setTimeout(this.expand.bind(this),1)}.bind(this),n=0;n<e.length;n+=1){var i;try{i=e[n].cssRules}catch(t){return}if(!i)return;for(var a=0;a<i.length;a+=1)if(i[a].media){var o=this.window.matchMedia(i[a].media.mediaText);o.addListener(t)}}}},{key:'observe',value:function(e){var t=this,n=new MutationObserver(function(){t._expanding&&t.expand()});return n.observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),n}},{key:'imageLoadListeners',value:function(){for(var e,t=this.document.querySelectorAll('img'),n=0;n<t.length;n++)e=t[n],'undefined'!=typeof e.naturalWidth&&0===e.naturalWidth&&(e.onload=this.expand.bind(this))}},{key:'fontLoadListeners',value:function(){this.document&&this.document.fonts&&this.document.fonts.ready.then(function(){this.expand()}.bind(this))}},{key:'root',value:function(){return this.document?this.document.documentElement:null}},{key:'locationOf',value:function(e,t){var n,i={left:0,top:0};if(this.document){if(this.epubcfi.isCfiString(e)){var a=new u.default(e).toRange(this.document,t);a&&(a.startContainer.nodeType===Node.ELEMENT_NODE?(n=a.startContainer.getBoundingClientRect(),i.left=n.left,i.top=n.top):a.collapsed?n=a.getClientRects()[0]:n=a.getBoundingClientRect())}else if('string'==typeof e&&-1<e.indexOf('#')){var o=e.substring(e.indexOf('#')+1),l=this.document.getElementById(o);l&&(n=l.getBoundingClientRect())}return n&&(i.left=n.left,i.top=n.top),i}}},{key:'addStylesheet',value:function(e){return new Promise(function(t){var n,i=!1;return this.document?(n=this.document.querySelector('link[href=\\''+e+'\\']'),n?void t(!0):void(n=this.document.createElement('link'),n.type='text/css',n.rel='stylesheet',n.href=e,n.onload=n.onreadystatechange=function(){var e=this;i||this.readyState&&'complete'!=this.readyState||(i=!0,setTimeout(function(){e.pane&&e.pane.render(),t(!0)},1))},this.document.head.appendChild(n))):void t(!1)}.bind(this))}},{key:'addStylesheetRules',value:function(e){var t,n,a='epubjs-inserted-css';if(this.document&&e&&0!==e.length){if(t=this.document.getElementById('#'+a),t||(t=this.document.createElement('style'),t.id=a),this.document.head.appendChild(t),n=t.sheet,'[object Array]'===Object.prototype.toString.call(e))for(var o=0,i=e.length;o<i;o++){var l=1,r=e[o],d=e[o][0],s='';'[object Array]'===Object.prototype.toString.call(r[1][0])&&(r=r[1],l=0);for(var u,c=r.length;l<c;l++)u=r[l],s+=u[0]+':'+u[1]+(u[2]?' !important':'')+';\\n';n.insertRule(d+'{'+s+'}',n.cssRules.length)}else{var p=Object.keys(e);p.forEach(function(t){var i=e[t];if(Array.isArray(i))i.forEach(function(e){var i=Object.keys(e),a=i.map(function(t){return t+':'+e[t]}).join(';');n.insertRule(t+'{'+a+'}',n.cssRules.length)});else{var a=Object.keys(i),o=a.map(function(e){return e+':'+i[e]}).join(';');n.insertRule(t+'{'+o+'}',n.cssRules.length)}})}this.pane&&this.pane.render()}}},{key:'addScript',value:function(e){return new Promise(function(t){var n,i=!1;return this.document?void(n=this.document.createElement('script'),n.type='text/javascript',n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){i||this.readyState&&'complete'!=this.readyState||(i=!0,setTimeout(function(){t(!0)},1))},this.document.head.appendChild(n)):void t(!1)}.bind(this))}},{key:'addClass',value:function(e){var t;this.document&&(t=this.content||this.document.body,t.classList.add(e))}},{key:'removeClass',value:function(e){var t;this.document&&(t=this.content||this.document.body,t.classList.remove(e))}},{key:'addEventListeners',value:function(){this.document&&g.forEach(function(e){this.document.addEventListener(e,this.triggerEvent.bind(this),!1)},this)}},{key:'removeEventListeners',value:function(){this.document&&g.forEach(function(e){this.document.removeEventListener(e,this.triggerEvent,!1)},this)}},{key:'triggerEvent',value:function(t){this.emit(t.type,t)}},{key:'addSelectionListeners',value:function(){this.document&&this.document.addEventListener('selectionchange',this.onSelectionChange.bind(this),!1)}},{key:'removeSelectionListeners',value:function(){this.document&&this.document.removeEventListener('selectionchange',this.onSelectionChange,!1)}},{key:'onSelectionChange',value:function(){this.selectionEndTimeout&&clearTimeout(this.selectionEndTimeout),this.selectionEndTimeout=setTimeout(function(){var e=this.window.getSelection();this.triggerSelectedEvent(e)}.bind(this),250)}},{key:'triggerSelectedEvent',value:function(e){var t,n;e&&0<e.rangeCount&&(t=e.getRangeAt(0),!t.collapsed&&(n=new u.default(t,this.cfiBase).toString(),this.emit('selected',n),this.emit('selectedRange',t)))}},{key:'range',value:function(e,t){var n=new u.default(e);return n.toRange(this.document,t)}},{key:'cfiFromRange',value:function(e,t){return new u.default(e,this.cfiBase,t).toString()}},{key:'cfiFromNode',value:function(e,t){return new u.default(e,this.cfiBase,t).toString()}},{key:'map',value:function(e){var t=new p.default(e);return t.section()}},{key:'size',value:function(e,t){var n={scale:1,scalable:'no'};0<=e&&(this.width(e),n.width=e),0<=t&&(this.height(t),n.height=t),this.css('margin','0'),this.css('box-sizing','border-box'),this.viewport(n)}},{key:'columns',value:function(e,t,n,i){var a=(0,d.prefixed)('column-axis'),o=(0,d.prefixed)('column-gap'),l=(0,d.prefixed)('column-width'),r=(0,d.prefixed)('column-fill');this.width(e),this.height(t),this.viewport({width:e,height:t,scale:1,scalable:'no'}),this.css('display','inline-block'),this.css('overflow-y','hidden'),this.css('margin','0',!0),this.css('padding','0',!0),this.css('box-sizing','border-box'),this.css('max-width','inherit'),this.css(a,'horizontal'),this.css(r,'auto'),this.css(o,i+'px'),this.css(l,n+'px')}},{key:'scaler',value:function(e,t,n){var i='';this.css('transform-origin','top left'),(0<=t||0<=n)&&(i=' translate('+(t||0)+'px, '+(n||0)+'px )'),this.css('transform','scale('+e+')'+i)}},{key:'fit',value:function(e,t){var n=this.viewport(),i=e/n.width,a=t/n.height,o=i<a?i:a,l=(t-n.height*o)/2;this.width(e),this.height(t),this.overflow('hidden'),this.viewport({width:e,height:t,scale:1}),this.scaler(o,0,l),this.css('background-color','transparent')}},{key:'mapPage',value:function(e,t,n,i,a){var o=new p.default(t,a);return o.page(this,e,n,i)}},{key:'linksHandler',value:function(){var e=this;(0,h.replaceLinks)(this.content,function(t){e.emit('linkClicked',t)})}},{key:'highlight',value:function(e){var t=this,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},i=arguments[2],a=this.range(e),o=function(){t.emit('markClicked',e,n)};n.epubcfi=e,this.pane||(this.pane=new f.Pane(this.content,this.document.body));var l=new f.Highlight(a,'epubjs-hl',n,{fill:'yellow',\"fill-opacity\":'0.3',\"mix-blend-mode\":'multiply'}),r=this.pane.addMark(l);return this.highlights[e]={mark:r,element:r.element,listeners:[o,i]},r.element.addEventListener('click',o),i&&r.element.addEventListener('click',i),r}},{key:'underline',value:function(e){var t=this,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},i=arguments[2],a=this.range(e),o=function(){t.emit('markClicked',e,n)};n.epubcfi=e,this.pane||(this.pane=new f.Pane(this.content,this.document.body));var l=new f.Underline(a,'epubjs-ul',n,{stroke:'black',\"stroke-opacity\":'0.3',\"mix-blend-mode\":'multiply'}),r=this.pane.addMark(l);return this.underlines[e]={mark:r,element:r.element,listeners:[o,i]},r.element.addEventListener('click',o),i&&r.element.addEventListener('click',i),r}},{key:'mark',value:function(e){var t=this,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},i=arguments[2],a=this.range(e),o=a.commonAncestorContainer,l=1===o.nodeType?o:o.parentNode,r=function(){t.emit('markClicked',e,n)};return l.setAttribute('ref','epubjs-mk'),l.dataset.epubcfi=e,n&&Object.keys(n).forEach(function(e){l.dataset[e]=n[e]}),l.addEventListener('click',r),i&&l.addEventListener('click',i),this.marks[e]={element:l,listeners:[r,i]},l}},{key:'unhighlight',value:function(e){var t;e in this.highlights&&(t=this.highlights[e],this.pane.removeMark(t.mark),t.listeners.forEach(function(e){e&&t.element.removeEventListener('click',e)}),delete this.highlights[e])}},{key:'ununderline',value:function(e){var t;e in this.underlines&&(t=this.underlines[e],this.pane.removeMark(t.mark),t.listeners.forEach(function(e){e&&t.element.removeEventListener('click',e)}),delete this.underlines[e])}},{key:'unmark',value:function(e){var t;e in this.marks&&(t=this.marks[e],t.element.removeAttribute('ref'),t.listeners.forEach(function(e){e&&t.element.removeEventListener('click',e)}),delete this.marks[e])}},{key:'destroy',value:function(){this.observer&&this.observer.disconnect(),this.removeListeners()}}],[{key:'listenedEvents',get:function(){return g}}]),e}();(0,r.default)(m.prototype),t.default=m,e.exports=t['default']},function(e,t,n){'use strict';var i=n(4);e.exports=i},function(e,t,n){'use strict';var i,a=n(10),o=n(17),l=n(13),r=n(20);i=e.exports=function(t,n){var i,l,d,s,u;return 2>arguments.length||'string'!=typeof t?(s=n,n=t,t=null):s=arguments[2],null==t?(i=d=!0,l=!1):(i=r.call(t,'c'),l=r.call(t,'e'),d=r.call(t,'w')),u={value:n,configurable:i,enumerable:l,writable:d},s?a(o(s),u):u},i.gs=function(t,n,i){var d,s,u,p;return'string'==typeof t?u=arguments[3]:(u=i,i=n,n=t,t=null),null==n?n=void 0:l(n)?null==i?i=void 0:!l(i)&&(u=i,i=void 0):(u=n,n=i=void 0),null==t?(d=!0,s=!1):(d=r.call(t,'c'),s=r.call(t,'e')),p={get:n,set:i,configurable:d,enumerable:s},u?a(o(u),p):p}},function(e,t,n){'use strict';function i(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}Object.defineProperty(t,'__esModule',{value:!0});var a=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=n(1),l=function(e){return e&&e.__esModule?e:{default:e}}(o),r=function(){function e(t,n){i(this,e),this.layout=t,this.horizontal='paginated'===this.layout.flow,this._dev=n}return a(e,[{key:'section',value:function(e){var t=this.findRanges(e),n=this.rangeListToCfiList(e.section.cfiBase,t);return n}},{key:'page',value:function(e,t,n,i){var a,o=e&&e.document&&e.document.body;if(o){if(a=this.rangePairToCfiPair(t,{start:this.findStart(o,n,i),end:this.findEnd(o,n,i)}),!0===this._dev){var d=e.document,s=new l.default(a.start).toRange(d),u=new l.default(a.end).toRange(d),c=d.defaultView.getSelection(),p=d.createRange();c.removeAllRanges(),p.setStart(s.startContainer,s.startOffset),p.setEnd(u.endContainer,u.endOffset),c.addRange(p)}return a}}},{key:'walk',value:function(e,t){for(var n,i,a=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode:function(e){return 0<e.data.trim().length?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}},!1);(n=a.nextNode())&&(i=t(n),!i););return i}},{key:'findRanges',value:function(e){for(var t,n,a=[],o=e.contents.scrollWidth(),l=Math.ceil(o/this.layout.spreadWidth),r=l*this.layout.divisor,d=this.layout.columnWidth,s=this.layout.gap,u=0;u<r.pages;u++)t=(d+s)*u,n=d*(u+1)+s*u,a.push({start:this.findStart(e.document.body,t,n),end:this.findEnd(e.document.body,t,n)});return a}},{key:'findStart',value:function(e,t,n){for(var i,a,o=this,l=[e],r=e;l.length;)if(i=l.shift(),a=this.walk(i,function(e){var i,a,d,s;return(e.nodeType==Node.TEXT_NODE?(s=document.createRange(),s.selectNodeContents(e),d=s.getBoundingClientRect()):d=e.getBoundingClientRect(),i=o.horizontal?d.left:d.top,a=o.horizontal?d.right:d.bottom,i>=t&&i<=n)?e:a>t?e:void(r=e,l.push(e))}),a)return this.findTextStartRange(a,t,n);return this.findTextStartRange(r,t,n)}},{key:'findEnd',value:function(e,t,n){for(var i,a,o=this,l=[e],r=e;l.length;)if(i=l.shift(),a=this.walk(i,function(e){var t,i,a,d;return(e.nodeType==Node.TEXT_NODE?(d=document.createRange(),d.selectNodeContents(e),a=d.getBoundingClientRect()):a=e.getBoundingClientRect(),t=o.horizontal?a.left:a.top,i=o.horizontal?a.right:a.bottom,t>n&&r)?r:i>n?e:void(r=e,l.push(e))}),a)return this.findTextEndRange(a,t,n);return this.findTextEndRange(r,t,n)}},{key:'findTextStartRange',value:function(e,t){for(var n,a,o,l=this.splitTextNodeIntoRanges(e),r=0;r<l.length;r++)if(n=l[r],a=n.getBoundingClientRect(),o=this.horizontal?a.left:a.top,o>=t)return n;return l[0]}},{key:'findTextEndRange',value:function(e,t,n){for(var a,o,l,r,d,s=this.splitTextNodeIntoRanges(e),u=0;u<s.length;u++){if(o=s[u],l=o.getBoundingClientRect(),r=this.horizontal?l.left:l.top,d=this.horizontal?l.right:l.bottom,r>n&&a)return a;if(d>n)return o;a=o}return s[s.length-1]}},{key:'splitTextNodeIntoRanges',value:function(e,t){var n,i=[],a=e.textContent||'',o=a.trim(),l=e.ownerDocument,r=t||' ',d=o.indexOf(r);if(-1===d||e.nodeType!=Node.TEXT_NODE)return n=l.createRange(),n.selectNodeContents(e),[n];for(n=l.createRange(),n.setStart(e,0),n.setEnd(e,d),i.push(n),n=!1;-1!=d;)d=o.indexOf(r,d+1),0<d&&(n&&(n.setEnd(e,d),i.push(n)),n=l.createRange(),n.setStart(e,d+1));return n&&(n.setEnd(e,o.length),i.push(n)),i}},{key:'rangePairToCfiPair',value:function(e,t){var n=t.start,i=t.end;n.collapse(!0),i.collapse(!1);var a=new l.default(n,e).toString(),o=new l.default(i,e).toString();return{start:a,end:o}}},{key:'rangeListToCfiList',value:function(e,t){for(var n,a=[],o=0;o<t.length;o++)n=this.rangePairToCfiPair(e,t[o]),a.push(n);return a}}]),e}();t.default=r,e.exports=t['default']},function(e,t,n){'use strict';function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,'__esModule',{value:!0}),t.replaceBase=function(e,t){var n,i;e&&(i=(0,a.qs)(e,'head'),n=(0,a.qs)(i,'base'),!n&&(n=e.createElement('base'),i.insertBefore(n,i.firstChild)),n.setAttribute('href',t.url))},t.replaceCanonical=function(e,t){var n,i,o=t.url;e&&(n=(0,a.qs)(e,'head'),i=(0,a.qs)(n,'link[rel=\\'canonical\\']'),i?i.setAttribute('href',o):(i=e.createElement('link'),i.setAttribute('rel','canonical'),i.setAttribute('href',o),n.appendChild(i)))},t.replaceLinks=function(e,t){var n=e.querySelectorAll('a[href]');if(n.length)for(var o=(0,a.qs)(e.ownerDocument,'base'),r=o?o.getAttribute('href'):void 0,d=function(e){var n=e.getAttribute('href');if(0!==n.indexOf('mailto:')){var i=-1<n.indexOf('://'),a=new l.default(n,r);i?e.setAttribute('target','_blank'):e.onclick=function(){return a&&a.hash?t(a.Path.path+a.hash):a?t(a.Path.path):t(n),!1}}}.bind(this),s=0;s<n.length;s++)d(n[s])},t.substitute=function(e,t,n){return t.forEach(function(t,a){t&&n[a]&&(e=e.replace(new RegExp(t,'g'),n[a]))}),e};var a=n(0),o=n(9),l=i(o),r=n(2),d=i(r)},function(e,t,n){'use strict';function i(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}Object.defineProperty(t,'__esModule',{value:!0});var o=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),l=n(2),r=i(l),d=n(3),s=i(d),u=function(){function e(t,n){a(this,e);var i,o=-1<t.indexOf('://'),l=t;if(this.Url=void 0,this.href=t,this.protocol='',this.origin='',this.hash='',this.hash='',this.search='',this.base=n,!o&&!1!==n&&'string'!=typeof n&&window&&window.location&&(this.base=window.location.href),o||this.base)try{this.Url=this.base?new URL(t,this.base):new URL(t),this.href=this.Url.href,this.protocol=this.Url.protocol,this.origin=this.Url.origin,this.hash=this.Url.hash,this.search=this.Url.search,l=this.Url.pathname}catch(t){this.Url=void 0,this.base&&(i=new r.default(this.base),l=i.resolve(l))}this.Path=new r.default(l),this.directory=this.Path.directory,this.filename=this.Path.filename,this.extension=this.Path.extension}return o(e,[{key:'path',value:function(){return this.Path}},{key:'resolve',value:function(e){var t,n=-1<e.indexOf('://');return n?e:(t=s.default.resolve(this.directory,e),this.origin+t)}},{key:'relative',value:function(e){return s.default.relative(e,this.directory)}},{key:'toString',value:function(){return this.href}}]),e}();t.default=u,e.exports=t['default']},function(e,t,n){'use strict';e.exports=n(11)()?Object.assign:n(12)},function(e){'use strict';e.exports=function(){var e,t=Object.assign;return!('function'!=typeof t)&&(e={foo:'raz'},t(e,{bar:'dwa'},{trzy:'trzy'}),'razdwatrzy'===e.foo+e.bar+e.trzy)}},function(e,t,i){'use strict';var a=i(14),o=i(19);e.exports=function(e,t){var r,d,i,s=n(arguments.length,2);for(e=Object(o(e)),i=function(n){try{e[n]=t[n]}catch(t){r||(r=t)}},d=1;d<s;++d)t=arguments[d],a(t).forEach(i);if(r!==void 0)throw r;return e}},function(e){'use strict';e.exports=function(e){return'function'==typeof e}},function(e,t,n){'use strict';e.exports=n(15)()?Object.keys:n(16)},function(e){'use strict';e.exports=function(){try{return Object.keys('primitive'),!0}catch(t){return!1}}},function(e){'use strict';var t=Object.keys;e.exports=function(e){return t(null==e?e:Object(e))}},function(e){'use strict';var t=Array.prototype.forEach,n=Object.create,i=function(e,t){for(var n in e)t[n]=e[n]};e.exports=function(){var e=n(null);return t.call(arguments,function(t){null==t||i(Object(t),e)}),e}},function(e){'use strict';e.exports=function(e){if('function'!=typeof e)throw new TypeError(e+' is not a function');return e}},function(e){'use strict';e.exports=function(e){if(null==e)throw new TypeError('Cannot use null or undefined');return e}},function(e,n,i){'use strict';e.exports=i(21)()?t.contains:i(22)},function(e){'use strict';var t='razdwatrzy';e.exports=function(){return!('function'!=typeof t.contains)&&!0===t.contains('dwa')&&!1===t.contains('foo')}},function(e){'use strict';var n=t.indexOf;e.exports=function(e){return-1<n.call(this,e,arguments[1])}},function(e,t,n){'use strict';var i,a,o,l,r,s,u,c='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e},p=n(6),d=n(18),h=Function.prototype.apply,f=Function.prototype.call,g=Object.create,m=Object.defineProperty,y=Object.defineProperties,b=Object.prototype.hasOwnProperty,v={configurable:!0,enumerable:!1,writable:!0};i=function(e,t){var n;return d(t),b.call(this,'__ee__')?n=this.__ee__:(n=v.value=g(null),m(this,'__ee__',v),v.value=null),n[e]?'object'===c(n[e])?n[e].push(t):n[e]=[n[e],t]:n[e]=t,this},a=function(e,t){var n,a;return d(t),a=this,i.call(this,e,n=function(){o.call(a,e,n),h.call(t,this,arguments)}),n.__eeOnceListener__=t,this},o=function(e,t){var n,a,o,l;if(d(t),!b.call(this,'__ee__'))return this;if(n=this.__ee__,!n[e])return this;if(a=n[e],'object'===('undefined'==typeof a?'undefined':c(a)))for(l=0;o=a[l];++l)(o===t||o.__eeOnceListener__===t)&&(2===a.length?n[e]=a[l?0:1]:a.splice(l,1));else(a===t||a.__eeOnceListener__===t)&&delete n[e];return this},l=function(e){var t,n,i,a,o;if(b.call(this,'__ee__')&&(a=this.__ee__[e],!!a))if('object'===('undefined'==typeof a?'undefined':c(a))){for(n=arguments.length,o=Array(n-1),t=1;t<n;++t)o[t-1]=arguments[t];for(a=a.slice(),t=0;i=a[t];++t)h.call(i,this,o)}else switch(arguments.length){case 1:f.call(a,this);break;case 2:f.call(a,this,arguments[1]);break;case 3:f.call(a,this,arguments[1],arguments[2]);break;default:for(n=arguments.length,o=Array(n-1),t=1;t<n;++t)o[t-1]=arguments[t];h.call(a,this,o);}},r={on:i,once:a,off:o,emit:l},s={on:p(i),once:p(a),off:p(o),emit:p(l)},u=y({},s),e.exports=t=function(e){return null==e?g(u):y(Object(e),s)},t.methods=r},function(e,t){'use strict';function n(e,n){function t(o){for(var e,t=n.length-1;0<=t;t--)if(e=n[t],!!a(e,o.clientX,o.clientY)){e.dispatchEvent(i(o));break}}for(var o,l=['mouseup','mousedown','click'],r=0;r<l.length;r++)o=l[r],e.addEventListener(o,function(n){return t(n)},!1)}function i(t){var e=Object.assign({},t,{bubbles:!1});try{return new MouseEvent(t.type,e)}catch(i){var n=document.createEvent('MouseEvents');return n.initMouseEvent(t.type,!1,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget),n}}function a(e,t,n){function a(e,t,n){var i=e.top+e.height,a=e.left+e.width;return e.top<=n&&e.left<=t&&i>n&&a>t}var o=e.getBoundingClientRect();if(!a(o,t,n))return!1;for(var l=e.getClientRects(),r=0,i=l.length;r<i;r++)if(a(l[r],t,n))return!0;return!1}Object.defineProperty(t,'__esModule',{value:!0}),t.proxyMouse=n,t.clone=i,t.default={proxyMouse:n}},function(e,t,n){'use strict';function i(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!e)throw new ReferenceError('this hasn\\'t been initialised - super() hasn\\'t been called');return t&&('object'==typeof t||'function'==typeof t)?t:e}function o(e,t){if('function'!=typeof t&&null!==t)throw new TypeError('Super expression must either be null or a function, not '+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}function r(e){var t=e.getBoundingClientRect();return{top:t.top+e.ownerDocument.body.scrollTop,left:t.left+e.ownerDocument.body.scrollLeft,height:t.height+e.scrollHeight,width:t.width+e.scrollWidth}}function d(e,t){e.style.top=t.top+'px',e.style.left=t.left+'px',e.style.height=t.height+'px',e.style.width=t.width+'px'}function s(e,t){return t.right<=e.right&&t.left>=e.left&&t.top>=e.top&&t.bottom<=e.bottom}Object.defineProperty(t,'__esModule',{value:!0}),t.Underline=t.Highlight=t.Mark=t.Pane=void 0;var u=function e(t,n,i){null===t&&(t=Function.prototype);var a=Object.getOwnPropertyDescriptor(t,n);if(a===void 0){var o=Object.getPrototypeOf(t);return null===o?void 0:e(o,n,i)}if('value'in a)return a.value;var l=a.get;return void 0===l?void 0:l.call(i)},c=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),p=n(26),h=i(p),f=n(24),g=i(f),m=t.Pane=function(){function e(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document.body;l(this,e),this.target=t,this.element=h.default.createElement('svg'),this.marks=[],this.element.style.position='absolute',this.element.setAttribute('pointer-events','none'),g.default.proxyMouse(this.target,this.marks),n.appendChild(this.element),this.render()}return c(e,[{key:'addMark',value:function(e){var t=h.default.createElement('g');return this.element.appendChild(t),e.bind(t),this.marks.push(e),e.render(),e}},{key:'removeMark',value:function(e){var t=this.marks.indexOf(e);if(-1!==t){var n=e.unbind();this.element.removeChild(n),this.marks.splice(t,1)}}},{key:'render',value:function(){d(this.element,r(this.target));var e,t=!0,n=!1;try{for(var i,a,o=this.marks[Symbol.iterator]();!(t=(i=o.next()).done);t=!0)a=i.value,a.render()}catch(t){n=!0,e=t}finally{try{!t&&o.return&&o.return()}finally{if(n)throw e}}}}]),e}(),y=t.Mark=function(){function e(){l(this,e),this.element=null}return c(e,[{key:'bind',value:function(e){this.element=e}},{key:'unbind',value:function(){var e=this.element;return this.element=null,e}},{key:'render',value:function(){}},{key:'dispatchEvent',value:function(t){this.element&&this.element.dispatchEvent(t)}},{key:'getBoundingClientRect',value:function(){return this.element.getBoundingClientRect()}},{key:'getClientRects',value:function(){for(var e=[],t=this.element.firstChild;t;)e.push(t.getBoundingClientRect()),t=t.nextSibling;return e}},{key:'filteredRanges',value:function(){var e=Array.from(this.range.getClientRects());return e.filter(function(t){for(var n=0;n<e.length;n++){if(e[n]===t)return!0;var i=s(e[n],t);if(i)return!1}return!0})}}]),e}(),b=t.Highlight=function(e){function t(e,n,i,o){l(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.range=e,r.className=n,r.data=i||{},r.attributes=o||{},r}return o(t,e),c(t,[{key:'bind',value:function(e){for(var n in u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),'bind',this).call(this,e),this.data)this.data.hasOwnProperty(n)&&(this.element.dataset[n]=this.data[n]);for(var n in this.attributes)this.attributes.hasOwnProperty(n)&&this.element.setAttribute(n,this.attributes[n]);this.className&&this.element.classList.add(this.className)}},{key:'render',value:function(){for(;this.element.firstChild;)this.element.removeChild(this.element.firstChild);for(var e=this.element.ownerDocument.createDocumentFragment(),t=this.filteredRanges(),n=this.element.getBoundingClientRect(),a=0,i=t.length;a<i;a++){var o=t[a],l=h.default.createElement('rect');l.setAttribute('x',o.left-n.left),l.setAttribute('y',o.top-n.top),l.setAttribute('height',o.height),l.setAttribute('width',o.width),e.appendChild(l)}this.element.appendChild(e)}}]),t}(y),v=t.Underline=function(e){function t(e,n,i,o){return l(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,i,o))}return o(t,e),c(t,[{key:'render',value:function(){for(;this.element.firstChild;)this.element.removeChild(this.element.firstChild);for(var e=this.element.ownerDocument.createDocumentFragment(),t=this.filteredRanges(),n=this.element.getBoundingClientRect(),a=0,i=t.length;a<i;a++){var o=t[a],l=h.default.createElement('rect');l.setAttribute('x',o.left-n.left),l.setAttribute('y',o.top-n.top),l.setAttribute('height',o.height),l.setAttribute('width',o.width),l.setAttribute('fill','none');var r=h.default.createElement('line');r.setAttribute('x1',o.left-n.left),r.setAttribute('x2',o.left-n.left+o.width),r.setAttribute('y1',o.top-n.top+o.height-1),r.setAttribute('y2',o.top-n.top+o.height-1),r.setAttribute('stroke-width',1),r.setAttribute('stroke','black'),r.setAttribute('stroke-linecap','square'),e.appendChild(l),e.appendChild(r)}this.element.appendChild(e)}}]),t}(b)},function(e,t){'use strict';function n(e){return document.createElementNS('http://www.w3.org/2000/svg',e)}Object.defineProperty(t,'__esModule',{value:!0}),t.createElement=n,t.default={createElement:n}},function(t){t.exports=e}])});";

const INJECTED_SCRIPT = "window.epubContents = undefined;\n(function () {\n \tvar waitForReactNativePostMessageReady;\n\n\tfunction _ready() {\n\t\tvar contents;\n\t\tvar targetOrigin = \"*\";\n\t\tvar sendMessage = function(obj) {\n\t\t\twindow.postMessage(JSON.stringify(obj), targetOrigin);\n\t\t};\n\n\t\tvar isReactNativePostMessageReady = !!window.originalPostMessage;\n\t\tclearTimeout(waitForReactNativePostMessageReady);\n\t\tif(!isReactNativePostMessageReady) {\n\t\t  waitForReactNativePostMessageReady = setTimeout(_ready, 1);\n\t\t\treturn;\n\t\t}\n\n\t\tif (typeof EPUBJSContents === \"undefined\") {\n\t\t\treturn sendMessage({\n\t\t\t\tmethod: \"error\",\n\t\t\t\tvalue: \"EPUB.js is not loaded\"\n\t\t\t});\n\t\t}\n\n\t\tcontents = new EPUBJSContents(document);\n\n\t\tcontents.setCfiBase = function(cfiBase) {\n\t\t\tcontents.cfiBase = cfiBase;\n\t\t};\n\n\t\tvar preventTap = false;\n\t\tcontents.mark = function(cfiRange, data) {\n\t\t\tvar m = EPUBJSContents.prototype.mark.call(contents, cfiRange, data);\n\t\t\tm.addEventListener(\"touchstart\", function (e) {\n\t\t\t\tvar bounds = e.target.getBoundingClientRect();\n\t\t\t\tvar padding = parseFloat(window.getComputedStyle(e.target)[\"paddingRight\"]);\n\t\t\t\tvar clientX = e.targetTouches[0].pageX;\n\t\t\t\tif (clientX >= bounds.right - (padding || 0)) {\n\t\t\t\t\tpreventTap = true;\n\t\t\t\t\tsendMessage({method:\"markClicked\", data: data, cfiRange: cfiRange });\n          e.preventDefault();\n          e.stopPropagation();\n\t\t\t\t}\n\t\t\t});\n\t\t\treturn m;\n\t\t};\n\n\t\tdocument.addEventListener(\"message\", function (e) {\n\t\t\tvar message = e.data;\n\t\t\tvar decoded = (typeof message == \"object\") ? message : JSON.parse(message);\n\t\t\tvar response;\n\t\t\tvar result;\n\n\t\t\tif (decoded.method in contents) {\n\t\t\t\tresult = contents[decoded.method].apply(contents, decoded.args);\n\n\t\t\t\tresponse = {\n\t\t\t\t\tmethod: decoded.method,\n\t\t\t\t\tpromise: decoded.promise,\n\t\t\t\t\tvalue: result\n\t\t\t\t};\n\n\t\t\t\tsendMessage(response);\n\n\t\t\t}\n\t\t});\n\n\t\tcontents.on(\"resize\", function (size) {\n\t\t\tsendMessage({method:\"resize\", value: size });\n\t\t});\n\n\t\tcontents.on(\"expand\", function () {\n\t\t\tsendMessage({method:\"expand\", value: true});\n\t\t});\n\n\t\tcontents.on(\"link\", function (href) {\n\t\t\tsendMessage({method:\"link\", value: href});\n\t\t});\n\n\t\tcontents.on(\"selected\", function (sel) {\n\t\t\tpreventTap = true;\n\t\t\tsendMessage({method:\"selected\", value: sel});\n\t\t});\n\n\t\tvar startPosition = { x: -1, y: -1 };\n\t\tvar currentPosition = { x: -1, y: -1 };\n\t\tvar isLongPress = false;\n\t\tvar longPressTimer;\n\t\tvar touchduration = 300;\n\n\t\tdocument.getElementsByTagName('body')[0].addEventListener(\"touchstart\", function (e) {\n\t\t\tstartPosition.x = e.targetTouches[0].pageX;\n\t\t\tstartPosition.y = e.targetTouches[0].pageY;\n\t\t\tcurrentPosition.x = e.targetTouches[0].pageX;\n\t\t\tcurrentPosition.y = e.targetTouches[0].pageY;\n\t\t\tisLongPress = false;\n\t\t\tlongPressTimer = setTimeout(function() {\n\t\t\t\tisLongPress = true;\n\t\t\t}, touchduration);\n\t\t}, false);\n\n\t\tdocument.getElementsByTagName('body')[0].addEventListener(\"touchmove\", function (e) {\n\t\t\tcurrentPosition.x = e.targetTouches[0].pageX;\n\t\t\tcurrentPosition.y = e.targetTouches[0].pageY;\n\t\t\tclearTimeout(longPressTimer);\n\t\t}, false);\n\n \t\tdocument.getElementsByTagName('body')[0].addEventListener(\"touchend\", function (e) {\n\t\t\tvar cfi;\n\t\t\tclearTimeout(longPressTimer);\n\t\t\tif(Math.abs(startPosition.x - currentPosition.x) < 2 &&\n\t\t\t\t Math.abs(startPosition.y - currentPosition.y) < 2) {\n\n\t\t\t\tcfi = contents.cfiFromNode(e.changedTouches[0].target).toString();\n\n\t\t\t\tif(preventTap) {\n\t\t\t\t\tpreventTap = false;\n\t\t\t\t} else if(isLongPress) {\n\t\t\t\t\tsendMessage({method:\"longpress\", position: currentPosition, cfi: cfi});\n\t\t\t\t\tisLongPress = false;\n\t\t\t\t} else {\n\t\t\t\t\tsetTimeout(function() {\n\t\t\t\t\t\tif(preventTap) {\n\t\t\t\t\t\t\tpreventTap = false;\n\t\t\t\t\t\t\tisLongPress = false;\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tsendMessage({method:\"press\", position: currentPosition, cfi: cfi});\n\t\t\t\t\t}, 10);\n\t\t\t\t}\n\t\t\t}\n\t\t}, false);\n\n    window.addEventListener('scroll', function(e) {\n      window.scrollTo(0, 0);\n    });\n\n\t\tsendMessage({method:\"ready\", value: true});\n\n\t\twindow.epubContents = contents;\n\t}\n\n\tif ( document.readyState === 'complete' ) {\n\t\t_ready();\n\t} else {\n\t\twindow.addEventListener(\"load\", _ready, false);\n\t}\n}());\n";

class Epub extends Component {

  constructor(props) {
    super(props);

    var bounds = Dimensions.get("window");

    this.book_url = this.props.src;
    this.state = {
      toc: [],
      show: false,
      width: bounds.width,
      height: bounds.height
    };

    this.active = true;
  }

  componentDidMount() {
    this._isMounted = true;
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

    Orientation.addSpecificOrientationListener(this._orientationDidChange.bind(this));
    this.orientation = Orientation.getInitialOrientation();
    if (this.orientation === "PORTRAITUPSIDEDOWN" || this.orientation === "UNKNOWN") {
      this.orientation = "PORTRAIT";
    }

    // Android starts as null
    if (this.orientation === null) {
      this.orientation = this.state.width > this.state.height ? "LANDSCAPE" : "PORTRAIT";
    }
    __DEV__ && console.log("inital orientation", this.orientation, this.state.width, this.state.height);

    if (this.book_url) {
      this._loadBook(this.book_url);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    AppState.removeEventListener('change', this._handleAppStateChange);
    Orientation.removeSpecificOrientationListener(this._orientationDidChange);
    clearTimeout(this.orientationTimeout);

    this.destroy();
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextState.show !== this.state.show) {
      return true;
    }

    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      return true;
    }

    if (nextState.width !== this.state.width || nextState.height !== this.state.height) {
      return true;
    }

    if (nextProps.color != this.props.color) {
      return true;
    }

    if (nextProps.backgroundColor != this.props.backgroundColor) {
      return true;
    }

    if (nextProps.size != this.props.size) {
      return true;
    }

    if (nextProps.flow != this.props.flow) {
      return true;
    }

    if (nextProps.origin != this.props.origin) {
      return true;
    }

    if (nextProps.orientation != this.props.orientation) {
      return true;
    }

    if (nextProps.src != this.props.src) {
      return true;
    }

    if (nextProps.onPress != this.props.onPress) {
      return true;
    }

    if (nextProps.onLongPress != this.props.onLongPress) {
      return true;
    }

    return false;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.rendition && this.props.themes && JSON.stringify(prevProps.themes) !== JSON.stringify(this.props.themes)) {
      this.rendition.themes.register(this.props.themes);
      this.rendition.themes.apply(this.props.theme);
    }

    if (this.rendition && prevProps.theme !== this.props.theme) {
      this.rendition.themes.apply(this.props.theme);
    }

    if (this.rendition && prevProps.fontSize !== this.props.fontSize) {
      this.rendition.themes.fontSize(this.props.fontSize);
    }

    if (this.rendition && prevProps.font !== this.props.font) {
      this.rendition.themes.font(this.props.font);
    }

    if (prevProps.src !== this.props.src) {
      this.book_url = this.props.src;
      this._loadBook(this.book_url);
    } else if (prevProps.orientation !== this.props.orientation) {
      _orientationDidChange(this.props.orientation);
    } else if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      this.redisplay();
    } else if (prevProps.flow !== this.props.flow) {
      this.rendition.flow(this.props.flow || "paginated");
      this.redisplay();
    }

    if (prevProps.location !== this.props.location) {
      this.rendition.display(this.props.location);
    }
  }

  // LANDSCAPE PORTRAIT UNKNOWN PORTRAITUPSIDEDOWN
  _orientationDidChange(orientation) {
    var wait = 10;

    if (!this.active) return;

    if (orientation === "UNKNOWN" || orientation == "PORTRAITUPSIDEDOWN" || this.orientation === orientation) {
      return;
    }

    this.orientationTimeout = setTimeout(() => {
      if (this._isMounted) {
        this._updateOrientation(orientation);
      }
    }, wait);
  }

  _updateOrientation(orientation) {
    var location = this._visibleLocation ? this._visibleLocation.start.cfi : this.props.location;
    var width, height;
    var bounds = Dimensions.get('window');
    var _width = bounds.width,
        _height = bounds.height;
    var reversed = false;

    __DEV__ && console.log("orientation", orientation, bounds.width, bounds.height);

    switch (orientation) {
      case "PORTRAIT":
        if (_width > _height) {
          reversed = true;
        };
        break;
      case "LANDSCAPE":
        width = this.props.height || _width;
        height = this.props.width || _height;
        break;
      case "LANDSCAPE-RIGHT":
        if (_height > _width) {
          reversed = true;
        };
        break;
      case "LANDSCAPE-LEFT":
        if (_height > _width) {
          reversed = true;
        };
        break;
      default:
        reversed = false;
    }

    this.orientation = orientation;

    if (reversed) {
      width = this.props.width || _height;
      height = this.props.height || _width;
    } else {
      width = this.props.width || _width;
      height = this.props.height || _height;
    }

    this.setState({ width, height }, () => {
      if ((!this.props.width || !this.props.height) && this.rendition) {
        this.redisplay(location);
      }
    });

    this.props.onOrientationChanged && this.props.onOrientationChanged(orientation);
  }

  redisplay(location) {
    var _location = location;
    if (!_location) {
      _location = this._visibleLocation ? this._visibleLocation.start.cfi : this.props.location;
    }

    if (this.rendition) {
      this.rendition.manager.clear(() => {
        this.rendition.settings.globalLayoutProperties = this.rendition.determineLayoutProperties(this.book.package.metadata);
        this.rendition.layout(this.rendition.settings.globalLayoutProperties);
        this.rendition.display(_location);
      });
    }
  }

  _loadBook(bookUrl) {

    // __DEV__ && console.log("loading book: ", bookUrl);

    this.book = ePub({
      replacements: this.props.base64 || "none"
    });

    return this._openBook(bookUrl);

    // var type = this.book.determineType(bookUrl);

    // var uri = new Uri(bookUrl);
    // if ((type === "directory") || (type === "opf")) {
    //   return this._openBook(bookUrl);
    // } else {
    // return this.streamer.start()
    // .then((origin) => {
    //   this.setState({origin})
    //   return this.streamer.get(bookUrl);
    // })
    // .then((localUrl) => {
    //   console.log("local", localUrl);
    //   return this._openBook(localUrl);
    // });
    // }
  }

  _openBook(bookUrl, useBase64) {
    var type = useBase64 ? "base64" : null;
    var unzipTimer = Date.now();

    this.book.open(bookUrl).then(() => {
      // __DEV__ && console.log("book opened", Date.now() - unzipTimer);
    }).catch(err => {
      console.error(err);
    });

    // load epubjs in views
    /*
    book.spine.hooks.content.register(function(doc, section) {
      var script = doc.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", EPUBJS_LOCATION);
       doc.getElementsByTagName("head")[0].appendChild(script);
    });
    */

    // Load the epubjs library into a hook for each webview
    this.book.spine.hooks.content.register(function (doc, section) {
      var script = doc.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.textContent = EPUBJS;
      doc.getElementsByTagName("head")[0].appendChild(script);

      var iscript = doc.createElement("script");
      iscript.setAttribute("type", "text/javascript");
      iscript.textContent = INJECTED_SCRIPT;
      doc.getElementsByTagName("head")[0].appendChild(iscript);
    }.bind(this));

    this.manager = this.refs["manager"];

    this.rendition = new Rendition(this.book, {
      flow: this.props.flow || "paginated",
      minSpreadWidth: 550,
      manager: this.manager,
      stylesheet: this.props.stylesheet,
      script: this.props.script
    });

    // Pass marks along
    this.rendition.hooks.content.register(contents => {
      contents.on("markClicked", (cfiRange, data) => this.rendition.emit("markClicked", cfiRange, data, contents));
    });

    if (this.props.onSelected) {
      this.rendition.on("selected", (cfiRange, contents) => {
        this.props.onSelected(cfiRange, contents);
      });
    }

    if (this.props.onMarkClicked) {
      this.rendition.on("markClicked", (cfiRange, data, contents) => {
        this.props.onMarkClicked(cfiRange, data, contents);
      });
    }

    if (this.props.onViewAdded) {
      this.rendition.manager.on("added", view => {
        this.props.onViewAdded(view, view.contents);
      });
    }

    if (this.props.beforeViewRemoved) {
      this.rendition.manager.on("hidden", view => {
        this.props.beforeViewRemoved(view, view.contents);
      });
    }

    // this.rendition.setManager(this.manager);

    if (this.props.themes) {
      this.rendition.themes.register(this.props.themes);
    }

    if (this.props.theme) {
      this.rendition.themes.apply(this.props.theme);
    }

    if (this.props.fontSize) {
      this.rendition.themes.fontSize(this.props.fontSize);
    }

    if (this.props.font) {
      this.rendition.themes.font(this.props.font);
    }

    this.rendition.display(this.props.location || undefined).then(() => {
      if (this.props.generateLocations != false) {
        requestAnimationFrame(() => {
          this.loadLocations().then(() => {
            this.rendition.reportLocation();
            this.props.onLocationsReady && this.props.onLocationsReady(this.book.locations);
          });
        });
      }
    });
    // Disable Scrollbar for Android
    /*
    this.rendition.hooks.content.register((contents) => {
      contents.addStylesheetRules([
        ["html",
          ["position", "fixed"],
          ["overflow", "hidden"],
          ["height", "100%"],
          ["width", "100%"]
        ]
      ]);
    });
    */

    this.rendition.on("relocated", visibleLocation => {

      this._visibleLocation = visibleLocation;

      if (this.props.onLocationChange) {
        this.props.onLocationChange(visibleLocation);
      }
    });

    this.book.ready.then(() => {
      this.setState({ show: true });

      this.props.onReady && this.props.onReady(this.book);
    });

    this.book.loaded.navigation.then(nav => {
      this.setState({ toc: nav.toc });
      this.props.onNavigationReady && this.props.onNavigationReady(nav.toc);
    });
  }

  loadLocations() {
    return this.book.ready.then(() => {
      // Load in stored locations from json or local storage
      var key = this.book.key() + "-locations";

      return AsyncStorage.getItem(key).then(stored => {
        if (this.props.regenerateLocations != true && stored !== null) {
          return this.book.locations.load(stored);
        } else {
          var locationsTimer = Date.now();
          return this.book.locations.generate(this.props.locationsCharBreak || 600).then(locations => {
            // __DEV__ && console.log("locations generated", Date.now() - locationsTimer);
            // Save out the generated locations to JSON
            AsyncStorage.setItem(key, this.book.locations.save());
          });
        }
      });
    });
  }

  visibleLocation() {
    return this._visibleLocation;
  }

  getRange(cfi) {
    return this.book.getRange(cfi);
  }

  _onShown(shouldShow) {
    console.log("_onShown", shouldShow);
    this.setState({ show: shouldShow });
  }

  _handleAppStateChange(appState) {
    if (appState === "active") {
      this.active = true;
    }

    if (appState === "background") {
      this.active = false;
    }

    if (appState === "inactive") {
      this.active = false;
    }
  }

  destroy() {
    if (this.book) {
      this.book.destroy();
    }
  }

  render() {

    var loader;
    if (!this.state.show) {
      loader = <View style={[styles.loadScreen, {
        backgroundColor: this.props.backgroundColor || "#FFFFFF"
      }]}>
          <ActivityIndicator color={this.props.color || "black"} size={this.props.size || "large"} style={{ flex: 1 }} />
        </View>;
    }

    return <View ref="framer" style={styles.container}>
        <EpubViewManager ref="manager" style={[styles.manager, {
        backgroundColor: this.props.backgroundColor || "#FFFFFF"
      }]} flow={this.props.flow || "paginated"} request={this.book && this.book.load.bind(this.book)} onPress={this.props.onPress} onLongPress={this.props.onLongPress} onShow={this._onShown.bind(this)} origin={this.props.origin} backgroundColor={this.props.backgroundColor} lastSectionIndex={this.book && this.book.spine.length - 1} bounds={{ width: this.props.width || this.state.width,
        height: this.props.height || this.state.height }} />
        {loader}
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  manager: {
    flex: 1
  },
  scrollContainer: {
    flex: 1,
    marginTop: 0,
    flexDirection: "row",
    flexWrap: "nowrap",
    backgroundColor: "#F8F8F8"
  },
  rowContainer: {
    flex: 1
  },
  loadScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});

module.exports = Epub;