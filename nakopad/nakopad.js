// nadesiko init
const LSKEY = "nakoedit";	// ローカルストレージの保存キー

function nako3_run() {
	if (typeof(navigator.nako3) === 'undefined' || editor === undefined) {
		alert('現在ライブラリを読み込み中です。しばらくお待ちください。')
		return
	}
	const code = editor.getValue()
	var div_name = "#nako3_result"
	var canvas_name = "#nako3_canvas"
	var addon =
		"「" + div_name + "」へDOM親要素設定;" +
		"「" + div_name + "」に「」をHTML設定;" +
		"「" + canvas_name + "」へ描画開始;"
	const preCode = addon
	try {
		nako3_clear(2)
		navigator.nako3.runReset(preCode + code, "main.nako3", preCode)
		//scr_to_id( "nako3_result" );
		scr_to_id( "nako3_retop" );
		//console.log("DONE")
	} catch (e) {
		nako3_print("==ERROR==" + e.message + "")
		//editor.editorMarkers.addByError(code, e)
		//console.log(e)
	}
}

const nako3_print = function (s) {
	//console.log("[表示] " + s)
	var info = document.getElementById("nako3_info")
	if (!info) return
	var err = document.getElementById("nako3_error")
	if (!err) return
	s = "" + s // 文字列に変換

	var audio = document.querySelector("#audio1");
	
	// エラーだった場合
	if (s.substr(0, 9) == "==ERROR==") {
		s = s.substr(9)
		err.innerHTML = s
		err.style.display = 'block'
		info.style.display = 'none'
		audio.src = './audio/se_maoudamashii_system18.mp3';
		//scr_to_id( "nako3_error" );
		scr_to_id( "nako3_retop" );
	} else {
		info.innerHTML = to_html(s);
		info.style.display = 'block'
		err.style.display = 'none'
		audio.src = './audio/se_maoudamashii_system13.mp3';
		//scr_to_id( "nako3_info" );
		scr_to_id( "nako3_retop" );
	}

	// エラー音
	audio.currentTime = 0;
	audio.play();
}

function to_html(s) {
	s = '' + s
	return s.replace(/\&/g, '&amp;')
			.replace(/\</g, '&lt;')
			.replace(/\>/g, '&gt;')
}

function scr_to_id( id ) {
	var el = document.getElementById( id );
	if (!el) return;
	var rect = el.getBoundingClientRect();
	
	var elemtop = rect.top + window.pageYOffset;
	if( elemtop < 200 ) elemtop = 0;
	document.documentElement.scrollTop = elemtop;
}

const nako3_clear = function (s) {
	// 引数0ならエラーとinfoだけ消す。1なら実行結果だけ。2なら全て。
	if ( s > 0 )	{
		var result = document.getElementById("nako3_result")
		if (!result) return
		// 要素を削除するように変更 21.3.20
		while(result.firstChild){
			result.removeChild(result.firstChild);
		}

		var canvas = document.getElementById("nako3_canvas")
		if (!canvas) return
		//canvas.style.visibility='hidden';
		var ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		canvas.hidden = true;
	}

	if ( (s == 0) || (s == 2) ) {
		var err = document.getElementById("nako3_error")
		if (!err) return
		err.innerHTML = ''
		err.style.display = 'none'

		var info = document.getElementById("nako3_info")
		if (!info) return
		info.innerHTML = ''
		info.style.display = 'none'
	}
}

// load and save to local storage
const nako3_loadls = function () {
	try {
		var s = localStorage.getItem(LSKEY);
		if (!s) {
			nako3_print("==ERROR==ローカルストレージには，何も保存されていません");
		} else {
			const c = confirm("ローカルストレージに保存されているプログラムを読み込んでいいですか？");
			if (c) {
				nako3_clear(1);
				s = "" + s;
				editor.setValue(s, 1);
				nako3_print("ローカルストレージに保存されているプログラムを読み込みました");
			}
		}
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_savels = function (flag) {
	try {
		var c = false;
		if (flag > 0) {
			c = confirm("ローカルストレージにプログラムを保存していいですか？");
		} else {
			c = true;
		}
		
		if (c) {
			var s = editor.getValue();
				localStorage.setItem(LSKEY, s);
				nako3_print("ローカルストレージにプログラムを保存しました");
		}
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_clearls = function (flag) {
	try {
		var c = false;
		if (flag > 0) {
			c = confirm("ローカルストレージに保存されているプログラムを消去していいですか？");
		} else {
			c = true;
		}
		
		if (c) {
			localStorage.removeItem(LSKEY);
			nako3_print("ローカルストレージに保存されているプログラムを消去しました");
		}
	} catch(e) {
		nako3_print(e);
	}
}

// load and save to file
const nako3_loadfile= function () {
	try {
		// file select
		const f = document.getElementById("nako3_file").files[0];
		if (!f) return;

		const c = confirm( f.name + " を読み込んでいいですか？");
		if (c) {
			//nako3_clear(1);
			const reader = new FileReader();

			reader.addEventListener('load', (event) => {
				editor.setValue( event.target.result, 1 );
				nako3_clear(0);
				nako3_print( f.name + " を読み込みました");
				
				// ファイル名をセット
				var s = baseName( f.name );
				var fn = document.getElementById("nako3_filename");
				fn.value = s;
			});
			reader.readAsText(f);
		}
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_loadsample= function () {
	try {
		// file select
		const sel = document.getElementById("nako3_sample");
		var f = sel.value;
		if (!f) return;
		var s = sel.options[ sel.selectedIndex ].text;
		
		const c = confirm( s + " を読み込んでいいですか？");
		if (c) {
			fetch( f )
				.then((data) => {
					if (data.ok) {
						return data.text();
					} else {
						return Promise.reject(new Error('読み込み失敗'));
					}
				})
				.then((text) => {
					editor.setValue( text, 1 );
					nako3_clear(1);
					nako3_print( s + " を読み込みました");
				})
				.catch(e => {
					nako3_print(e);
				});
		}
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_loaddefault= function (editor) {
	if (!editor) return;

	try {
		var f = "default.txt";
		var defs =	"クジラを絵追加。\n「こんにちは、クジラです。よろしくね。」と声出す。\n";
		fetch( f )
			.then((data) => {
				if (data.ok) {
					return data.text();
				} else {
					return Promise.reject(new Error('読み込み失敗'));
				}
			})
			.then((text) => {
				editor.setValue( text, 1 );
			})
			.catch(e => {
				editor.setValue( defs , 1);
			});
	} catch(e) {
		editor.setValue( defs , 1);
	}
}

const nako3_savefile= function () {
	try {
		// テキスト取得
		const txt = editor.getValue();
		if( txt.length < 1 ) {
			nako3_print( "==ERROR==保存するプログラムがありません。");
			return;
		}
		
		const f = document.getElementById("nako3_filename");
		if (!f) return;
		var fn = f.value;
		if ( fn.length < 1 ) {
			nako3_print( "==ERROR==ファイル名を入力してください。");
			return;
		} else {
			fn += ".txt";
		}
		
		// 文字をBlob化
		const blob = new Blob([txt], { type: 'text/plain' });
		
		// ダウンロード用のaタグ生成
		const a = document.getElementById("nako3_save");
		a.href = URL.createObjectURL( blob );
		a.download = fn;
		a.click();
		
		nako3_print( "プログラムを保存しました。保存したファイルは，ダウンロードフォルダにあります。" );
	} catch(e) {
		nako3_print(e);
	}
}

// メディアファイルのObjectURLを取得する
const nako3_getObjURL= function () {
	try {
		// file select
		const f = document.getElementById("load_media").files[0];
		if (!f) return;

		//const c = confirm( f.name + " を読み込んでいいですか？");
		//if (c) {
			objURL = URL.createObjectURL( f );
			editor.insert("「" + objURL + "」");	// カーソル位置にObjectURLを挿入
		//}
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_click_load_media = function () {
	const fileElem = document.getElementById("load_media");
	if (fileElem) {
		fileElem.click();
	}
}

// メディアファイルのローカルパスを取得する
const nako3_getFilepath= function () {
	try {
		// file select
		//const f = document.getElementById("load_media2").files[0];
		const f = document.getElementById("load_media2").files[0];
		if (!f) return;

		editor.insert("「" + f.name + "」");	// カーソル位置にURLを挿入
	} catch(e) {
		nako3_print(e);
	}
}

const nako3_click_load_localmedia = function () {
	const fileElem = document.getElementById("load_media2");
	if (fileElem) {
		fileElem.click();
	}
}

const nako3_canvas_on = function () {
	var canvas = document.getElementById( "nako3_canvas" )
	if (!canvas) return
	//canvas.style.visibility='visible';
	canvas.hidden = false;
}

const nako3_canvas_off = function () {
	var canvas = document.getElementById( "nako3_canvas" )
	if (!canvas) return
	//canvas.style.visibility='hidden';
	canvas.hidden = true;
}

// 独自関数の登録
var nako3_add_func = function () {
  navigator.nako3.setFunc("描画オン", [], nako3_canvas_on);
  navigator.nako3.setFunc("描画オフ", [], nako3_canvas_off);
}
var nako3_init_timer = setInterval(function(){
	if (typeof(navigator.nako3) === 'undefined') return
	clearInterval(nako3_init_timer)
	nako3_add_func()
}, 500);

// ファイル名から拡張子を取り除く
function baseName(str) {
	var base = new String(str).substring(str.lastIndexOf('/') + 1); 
	if( base.lastIndexOf(".") != -1 )       
		base = base.substring(0, base.lastIndexOf("."));
   return base;
}

// 「止める」ボタン…メディアの再生とタイマーを停止
function nako3_break() {
	const media = document.getElementsByClassName('media');
	for (let i = 0; i < media.length; i++ ) {
		media[i].pause();
	}
	speechSynthesis.cancel();
}

// 初期
nako3_loaddefault();
nako3_clear(2);
nako3_canvas_off();
