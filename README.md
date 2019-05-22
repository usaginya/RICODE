# RHODES ISLAND CODE

------
## 介绍
RHODES ISLAND CODE 也称为“罗德岛CODE”
在游戏《明日方舟》的彩蛋图上，由斜杠组成的符号，类似：`/\/\ /// // /`
其实是个摩斯电码的变种

罗德岛CODE作用就是帮助你直接转换斜杠电码，获得原始信息
当然也能将你的信息转换为斜杠电码

------
## 引用
罗德岛CORE中引用的部分内容：
| 引用        | 来源 |
| ----------- | ---- |
| 罗德岛Logo  | [百度贴吧](https://tieba.baidu.com/p/5627569568) |
| 英文字体    | Swiss921 |
| 中文字体    | Noto Sans S Chinese Bold |
| Xmorse.js (已修改) | [GitHub](https://github.com/hustcc/xmorse) |
| Chaffle.js (已修改)  | [GitHub](https://github.com/blivesta/chaffle) |
| parallax.js  | [GitHub](https://github.com/wagerfield/parallax) |

------
## 其它 
- 视差效果可能比较消耗设备性能，如果感到卡顿，可以长按背景`8秒`以上关闭视差效果

------
##开发学习研究
### 01. Xmorse.js 修改的内容

> * 修改 文本转Unicode过程中转换格式错误
> * 增加 小写英文字母`a-z`扩展码表 (独有功能，原版Morse不支持)
> * 增加 空格`space` 和换行符`enter` 的支持 (独有功能，原版Morse不支持)
> * 删除 进制转换过程冗余步骤 ([字符串>16进制>2进制] 修改为 [字符串>2进制])

### 02. Chaffle.js 修改的内容

> * 增加 **element.value** 的支持
> * 修改 **[data-chaffle]** 的必要属性，现在在js中指定DOM对象，并通过js中的*{ /\* options \*/ }* 设置，也能正常运行
> * 修改 **lang :** `'en'` 范围 (ASCII: 48~122)
> * 修改 **lang :** `'ja'` 为中文 `'zh'`
> * 增加 **lang :** `'sym'` 符号(Symbol)
> * 增加 **maxlength :** `[Number] Max string length` 限制动画字符最大长度（默认为全部字符串的长度）
> * 增加 **intext :** `"String to be replaced"` 用于js动态替换并显示下一组新的字符串（优先于 **element.textContent** 和 **element.value**）
> * 增加 **(f) Callback** `Callback function` 当刷新动画字符工作结束时，会回调一次传入的函数，可以用来在它工作结束时做点什么

#### 例子
``` javascript
// HTML 属性调用    [data-chaffle(='lang')]    [data-chaffle-(speed | delay | maxlength)]
    var elements = document.querySelectorAll('[data-chaffle]');
    Array.prototype.forEach.call(elements, function (el) {
        var chaffle = new Chaffle(el, { /* options */ });
        chaffle.init();
    });
```
``` javascript
// JS or Jquery Call
  var chaffle = new Chaffle($('/* element */')[0], {
    /* options */
    
    lang: 'en', // 掩码字符类型   default: 'en'
            // 'sym' | 'en' | 'ja' | 'ja-hiragana' | 'ja-katakana' | 'ua'

    speed: 20, // 刷新字符速度       default: 20
    
    delay: 100, // 实际字符显示延迟   default: 100
    
    maxlength: 100, // 最大刷新字符长度 default: [text.length]
    
    intext: "Next new text" // 将刷新出现的文本(优先级:最高) 
    
  }, () => {
    /* Do something after callback... */
  } );
  
  chaffle.init();
});
```

------

作者 [@YIU][1]
2019 年 5 月 20 日

[1]: https://github.com/usaginya
