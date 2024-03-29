"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocaleFileList = getLocaleFileList;
exports.isNeedPolyfill = isNeedPolyfill;
exports.default = _default;

var _path = require("path");

var _fs = require("fs");

var _umiUtils = require("umi-utils");

var _mustache = _interopRequireDefault(require("mustache"));

var _globby = _interopRequireDefault(require("globby"));

var _lodash = _interopRequireDefault(require("lodash.groupby"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const momentLocation = require.resolve('moment/locale/zh-cn').replace(/zh\-cn\.js$/, '');

function getMomentLocale(lang, country) {
  if ((0, _fs.existsSync)((0, _path.join)(momentLocation, `${lang}-${country.toLocaleLowerCase()}.js`))) {
    return `${lang}-${country.toLocaleLowerCase()}`;
  }

  if ((0, _fs.existsSync)((0, _path.join)(momentLocation, `${lang}.js`))) {
    return lang;
  }

  return '';
} // export for test


function getLocaleFileList(absSrcPath, absPagesPath, singular, separator = '-') {
  const localeFileMath = new RegExp(`^([a-z]{2})${separator}?([A-Z]{2})?\.(js|ts)$`);
  const localeFolder = singular ? 'locale' : 'locales';

  const localeFiles = _globby.default.sync('*.{ts,js}', {
    cwd: (0, _path.join)(absSrcPath, localeFolder)
  }).map(name => (0, _path.join)(absSrcPath, localeFolder, name)).concat(_globby.default.sync(`**/${localeFolder}/*.{ts,js}`, {
    cwd: absPagesPath
  }).map(name => (0, _path.join)(absPagesPath, name))).filter(p => localeFileMath.test((0, _path.basename)(p))).map(fullname => {
    const fileName = (0, _path.basename)(fullname);
    const fileInfo = localeFileMath.exec(fileName).slice(1, 3).filter(Boolean);
    return {
      name: fileInfo.join(separator),
      path: fullname
    };
  });

  const groups = (0, _lodash.default)(localeFiles, 'name');
  return Object.keys(groups).map(name => {
    const fileInfo = name.split(separator);
    return {
      lang: fileInfo[0],
      name,
      country: fileInfo[1] || fileInfo[0].toUpperCase(),
      paths: groups[name].map(item => (0, _umiUtils.winPath)(item.path)),
      momentLocale: getMomentLocale(fileInfo[0], fileInfo[1] || '')
    };
  });
} // data come from https://caniuse.com/#search=intl
// you can find all browsers in https://github.com/browserslist/browserslist#browsers


const polyfillTargets = {
  ie: 10,
  firefox: 28,
  chrome: 23,
  safari: 9.1,
  opera: 12.1,
  ios: 9.3,
  ios_saf: 9.3,
  operamini: Infinity,
  op_mini: Infinity,
  android: 4.3,
  blackberry: Infinity,
  operamobile: 12.1,
  op_mob: 12.1,
  explorermobil: 10,
  ie_mob: 10,
  ucandroid: Infinity
};

function isNeedPolyfill(targets = {}) {
  return Object.keys(targets).find(key => {
    const lowKey = key.toLocaleLowerCase();
    return polyfillTargets[lowKey] && polyfillTargets[lowKey] >= targets[key];
  }) !== undefined;
}

function _default(api, options = {}) {
  const config = api.config,
        paths = api.paths;
  const targets = config.targets;

  if (isNeedPolyfill(targets)) {
    api.addEntryPolyfillImports({
      source: 'intl'
    });
  }

  api.addRuntimePluginKey('locale');
  api.addPageWatcher((0, _path.join)(paths.absSrcPath, config.singular ? 'locale' : 'locales'));
  api.onOptionChange(newOpts => {
    options = newOpts;
    api.rebuildTmpFiles();
  });
  api.addRendererWrapperWithComponent(() => {
    const baseSeparator = options.baseSeparator || '-';
    const remote = options.remote || '';
    const localeFileList = getLocaleFileList(paths.absSrcPath, paths.absPagesPath, config.singular, baseSeparator);
    const wrapperTpl = (0, _fs.readFileSync)((0, _path.join)(__dirname, '../template/wrapper.jsx.tpl'), 'utf-8');
    const defaultLocale = options.default || `zh${baseSeparator}CN`;

    const _defaultLocale$split = defaultLocale.split(baseSeparator),
          _defaultLocale$split2 = _slicedToArray(_defaultLocale$split, 2),
          lang = _defaultLocale$split2[0],
          country = _defaultLocale$split2[1];

    const wrapperContent = _mustache.default.render(wrapperTpl, {
      baseSeparator,
      localeList: localeFileList,
      antd: options.antd !== false,
      baseNavigator: options.baseNavigator !== false,
      useLocalStorage: options.useLocalStorage !== false,
      defaultLocale,
      defaultLang: lang,
      defaultAntdLocale: `${lang}_${country}`,
      defaultMomentLocale: getMomentLocale(lang, country),
      remote,
    });

    const wrapperPath = (0, _path.join)(paths.absTmpDirPath, './LocaleWrapper.jsx');
    (0, _fs.writeFileSync)(wrapperPath, wrapperContent, 'utf-8');
    return wrapperPath;
  });
  api.modifyAFWebpackOpts(memo => {
    return _objectSpread({}, memo, {
      alias: _objectSpread({}, memo.alias || {}, {
        // umi/locale is deprecated
        // recommend use `import { getLocale } from 'umi-plugin-locale';` now.
        'umi/locale': (0, _path.join)(__dirname, './locale.js'),
        'react-intl': (0, _path.dirname)(require.resolve('react-intl/package.json'))
      })
    });
  });
}
