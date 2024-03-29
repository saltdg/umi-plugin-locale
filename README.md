# umi-plugin-locale

i18n plugin for umi.

---

Suggest to use together with umi-plugin-react, see our website [umi-plugin-react](https://umijs.org/plugin/umi-plugin-react.html) for more.

---

## 配置

**.umirc.js**

```js
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        locale: {
          default: 'zh-CN', //默认语言 zh-CN，如果 baseSeparator 设置为 _，则默认为 zh_CN
          baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
          antd: true, // 是否启用antd的<LocaleProvider />
          baseSeparator: '-', // 语言默认分割符 -
		  remote: '/api/local', // 配置远程拉取数据地址
        },
      },
    ],
  ],
};
```

**返回数据结构**

```
{
	code: 0,
	message: '',
	data: {
		'app.name': '俺是标题!',
	}
}
```

**注**

> 服务器返回的数据会和组件原本地的语言包合并，如果重复，会覆盖本地语言包！

Other: You can setDefaultLocal in `src/app.js`

```js
export const locale = {
  default: 'en-US', //默认语言 zh-CN，如果 baseSeparator 设置为 _，则默认为 zh_CN
};
```

## 目录及约定

```
.
├── dist/
├── mock/
└── src/
    ├── layouts/index.js
    ├── pages/
    └── locales               // 多语言文件存放目录，里面的文件会被umi自动读取
        ├── zh-CN.js
        └── en-US.js
├── .umirc.js
├── .env
└── package.json
```

> 如果`.umirc.js`里配置了`singular: true`，`locales`要改成`locale`

## 多语言文件约定

多语言文件的命名规范：`<lang><分割符（通过 baseSeparator 配置）><COUNTRY>.js`

多语言文件的内容规范：键-值组成的字面量，如下：

zh-CN.js

```javascript
export default {
  WELCOME_TO_UMI_WORLD: '{name}，欢迎光临umi的世界',
};
```

en-US.js

```javascript
export default {
  WELCOME_TO_UMI_WORLD: "{name}, welcome to umi's world",
};
```

## 扩展 API

使用本插件后，你可以从 umi-plugin-locale 引入国际化相关的 API，获得关于多语言功能在编程上的便利。

```javascript
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi-plugin-locale';

// 获取指定文字的多语言版本
const formatedText = formatMessage(
  {
    id: 'WELCOME_TO_UMI_WORLD',
  },
  {
    name: '小伙子',
  },
);

console.log(formatedText === '小伙子，欢迎光临umi的世界');

// 设置为 en-US
setLocale('en-US');

// 获取当前语言
console.log(getLocale() === 'en-US');

// 渲染一个文字标签
function Example() {
  return <FormattedMessage id="WELCOME_TO_UMI_WORLD" values={{ name: '小伙子' }} />;
}
```
