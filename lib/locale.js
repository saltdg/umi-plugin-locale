"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-undef, prefer-rest-params */
var ReactIntl = require('react-intl');

var React = require('react');

var localeContext;

function setLocale(lang) {
  var realReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var _window = window,
      _window$g_langSeparat = _window.g_langSeparator,
      g_langSeparator = _window$g_langSeparat === void 0 ? '-' : _window$g_langSeparat;
  var localeExp = new RegExp("^([a-z]{2})".concat(g_langSeparator, "?([A-Z]{2})?$"));

  if (lang !== undefined && !localeExp.test(lang)) {
    // for reset when lang === undefined
    throw new Error('setLocale lang format error');
  }

  if (getLocale() !== lang) {
    window.g_lang = lang;
    window.localStorage.setItem('umi_locale', lang || ''); // 触发 context 的 reload
    // 如果要刷新 location ，没必要进行 context 的 reload 了

    if (localeContext && !realReload) {
      localeContext.reloadAppLocale();
    }

    if (realReload) {
      window.location.reload();
    } // chrome 不支持这个事件。所以人肉触发一下


    if (window.dispatchEvent) {
      var event = new Event('languagechange');
      window.dispatchEvent(event);
    }
  }
}

function getLocale() {
  // support SSR
  var _window2 = window,
      _window2$g_langSepara = _window2.g_langSeparator,
      g_langSeparator = _window2$g_langSepara === void 0 ? '-' : _window2$g_langSepara,
      g_lang = _window2.g_lang;
  var lang = typeof localStorage !== 'undefined' ? window.localStorage.getItem('umi_locale') : '';
  var browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-').join(g_langSeparator) : '';
  return lang || g_lang || browserLang;
}

var LangContext = React.createContext({
  lang: getLocale()
}); // init api methods

var intl;
var intlApi = {};
['formatMessage', 'formatHTMLMessage', 'formatDate', 'formatTime', 'formatRelative', 'formatNumber', 'formatPlural', 'LangContext', 'now', 'onError'].forEach(function (methodName) {
  intlApi[methodName] = function () {
    if (intl && intl[methodName]) {
      var _intl$methodName;

      // _setIntlObject has been called
      return (_intl$methodName = intl[methodName]).call.apply(_intl$methodName, [intl].concat(Array.prototype.slice.call(arguments)));
    } else if (console && console.warn) {
      console.warn("[umi-plugin-locale] ".concat(methodName, " not initialized yet, you should use it after react app mounted."));
    }

    return null;
  };
}); // react-intl 没有直接暴露 formatMessage 这个方法
// 只能注入到 props 中，所以通过在最外层包一个组件然后组件内调用这个方法来把 intl 这个对象暴露到这里来
// TODO 查找有没有更好的办法

function _setIntlObject(theIntl) {
  // umi 系统 API，不对外暴露
  intl = theIntl;
}
/**
 * 用于触发 context 的重新渲染 方法。可以实现不刷新进行切换语言
 * @param {*} context
 */


function _setLocaleContext(context) {
  localeContext = context;
}

module.exports = _objectSpread({}, ReactIntl, {}, intlApi, {
  setLocale: setLocale,
  getLocale: getLocale,
  _setIntlObject: _setIntlObject,
  LangContext: LangContext,
  _setLocaleContext: _setLocaleContext
});