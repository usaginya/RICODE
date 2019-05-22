/**********************
 *   变量定义
 **********************/
//漂浮元素数量
let circleCount = 99;

// 刷洗字符运行情况: 0未运行 1运行中
let chaffleState = 0;

//Parallax包装变量
let parallaxs = () => {};

/**********************
 *   jQ DOM初始化
 **********************/
$(function () {

	// 加入漂浮元素
	let circleDOMs = `<div class="circle-container"><div class="circle"></div></div>`;
	$('.container').append(circleDOMs.repeat(circleCount));

	//初始化视差场景
	ParallaxInit();

	//绑定转换按钮
	BindRicButton();

	//绑定body长按事件
	BindBodyHoldDown();

});

/**********************
 *   初始化视差场景
 **********************/
function ParallaxInit() {
	parallaxs.scene = new Parallax($('.scene')[0]);
	parallaxs.scene2 = new Parallax($('.scene2')[0], {
			pointerEvents: 1
		});

	// 移除 parallax 添加的样式
	$('.bg-box, .code-box').css({
		'left': '',
		'top': ''
	});
}

/**********************
 *     绑定转换按钮
 **********************/
function BindRicButton() {
	$('.ric-button').off('click');
	$('.ric-button').on('click', function () {
		GetConvertData();
	});
}

/**********************
 *  绑定body长按事件
 **********************/
function BindBodyHoldDown() {
	var holdtime;

	$('body').off('mousedown mouseup mouseleave');
	$('body').on('mousedown', (e) => {
		e.stopPropagation();

		clearTimeout(holdtime);
		holdtime = setTimeout(() => {
				if (parallaxs.scene) {
					parallaxs.scene.destroy();
				}
				if (parallaxs.scene2) {
					parallaxs.scene2.destroy();
				}

				parallaxs = null;
				$('body').off('mousedown mouseup mouseleave');

				//fix css
				$('.bg-box').css({
					'position': 'relative'
				});

			}, 8000); //按住8秒后释放Parallax
	});

	$('body').on('mouseup mouseleave', (e) => {
		e.stopPropagation();
		clearTimeout(holdtime);
	});
}

/**********************
 *     取转换数据
 **********************/
function GetConvertData() {
	// 获取数据
	// 判断数据是哪一种类型
	var codestr = $('.codex').val();
	codestr = codestr.replace(/(^\s*)|(\s*$)/g, '');

	if (codestr.length < 1)
		return;

	var xmOption = {
		space: ' ',
		long: '/',
		short: "\\"
	};

	if (/(^[\\|\/|\s]*$)/g.test(codestr)) {
		//RICode
		codestr = xmorse.decode(codestr, xmOption);
		//Send to box
		RunChaffle('sym', codestr, undefined, 15);

	} else {
		//String
		//Send to box, select lang
		var langs = [];
		var langEn = codestr.match(/[a-zA-Z\d]/g);
		var langZh = codestr.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g);
		var langJa = codestr.match(/[\u3040-\u309F\u30A0-\u30FF]/g);

		langs.push(
			['en', langEn ? langEn.length : 0, 380],
			['zh', langZh ? langZh.length : 0, 350],
			['ja-hiragana', langJa ? langJa.length : 0, 350]);

		codestr = xmorse.encode(codestr, xmOption);
		codestr = codestr.replace(/\s/g, '   ');

		var lang = langs.sort((a, b) => {
				return b[1] - a[1];
			})[0];
		RunChaffle(lang[0], codestr, lang[2]);

	}

}

/**********************
 *    运行刷洗字符
 **********************/
function RunChaffle(lang, intext, maxlength = 230, delay = 20) {
	if (chaffleState)
		return;
	chaffleState = 1;

	var chaffle = new Chaffle($('.codex')[0], {
			lang: lang,
			speed: 10,
			delay: delay,
			maxlength: maxlength,
			intext: intext
		}, () => {
			chaffleState = 0;
		});
	chaffle.init();
}

/**********************
 *    控制台信息
 **********************/
console.log("%c 罗德岛CODE\n                 by YIU", "padding-bottom:20px;color:#FFF;font:3.5em Brush Script MT;text-shadow:0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)");
console.log("%c                     Github.com/usaginya/RICODE","font-size:2em;color:rgba(67,153,97,.5);text-shadow:2px 2px 2px rgba(236,144,79, 0.6)");
