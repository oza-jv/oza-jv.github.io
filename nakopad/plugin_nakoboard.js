/**
 * なでしこ3 追加プラグイン 2021/5/3
 * file : plugin_nakoboard.js
 * Chromeブラウザでなでしこボードを使うためのプラグイン。
 */

// JSルーチン
let outputReportId = 0;
let device;
var ADval = 0;
var USBconnected = 0;	// 処理可＝1，不可＝０
var outputReport = new Uint8Array(64);
const filters = [
  {
    // なでしこボードのHIDフィルタ
    vendorId: 0x3289,
    productId: 0x2001
  }
];

/*---------------------------------------------*/

// 接続状態の確認
function ChkHIDItem() {
	if (!device)  {
		USBconnected = -1;			// 未接続
	} else if( device.opened ) {
		USBconnected = 1;			// 接続＆オープン完了
	} else {
		USBconnected = 0;			// 接続したが未オープン
	}
	return USBconnected;
};

// 接続時のイベント
navigator.hid.addEventListener('connect', ({device}) => {
	console.log(`HID connected: ${device.productName}`);
});

//切断時のイベント
navigator.hid.addEventListener('disconnect', ({device}) => {
	console.log(`HID disconnected: ${device.productName}`);
});


// ヘルパー関数
const waitFor = (n) => new Promise(resolve => setTimeout(resolve, n));

// センサ１測定用の関数
const WaitForInputReport = () => new Promise(resolve => device.addEventListener("inputreport", resolve));
async function AD1input() {
	// send
	outputReport[0] = 'A'.charCodeAt(0);
	await device.sendReport(outputReportId, outputReport);
	await WaitForInputReport();		// イベント発生まで待つ
	console.log( `AD1input: ${ADval}` );
	return Promise.resolve(ADval);
}

// ボード側から受信したときのイベント
function handleInputReport(e) {
	const { data, device, reportId } = e;
	
	if( device.productId !== filters.productId && reportId !== 0 ) return;
	
	//console.log(e.device.productName + ": got input report " + reportId);
	//console.log(new Uint8Array(data.buffer));
	
	// 測定値
	ADval = data.getUint8(2);
	ADval = (ADval << 8) | data.getUint8(1);
	console.log(`sensor: ${ADval}` );
}

/*---------------------------------------------*/
// なでしこ用命令の追加
const PluginNakoBoard = {
  'ボード接続': {
    type: 'func',
    josi: [[]],
    fn: function (sys) {
		// HID APIを使えるか
		if(!("hid" in navigator)) {
		    console.log('HID NG');
		    return;
		} else {
		    console.log('HID OK');
		};

		// すでに開いているか
		if( ChkHIDItem() == 1 ) return;

		// 接続を要求
		(async () => {
			await navigator.hid.getDevices()
				.then( async (devices) => {
					if( devices.length == 0 ) {
						// 接続されていないときは，接続する
						[device] = await navigator.hid.requestDevice({ filters });
						if (!device) return;

						// 接続できました
						console.log(`User selected "${device.productName}" HID device.`);
						
					} else {
						// すでに接続されているとき
						device = devices[0];
						console.log(`User previously selected "${device.productName}" HID device.`);
					}
				});

			// デバイスをオープンする
			await device.open();

			await device.addEventListener("inputreport", handleInputReport);
			console.log(`${device.productName} opened: ${device.opened}`);
			console.log( device );
		})().catch( e => console.log(e) );
	}
  },
  
  'ボード切断': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		if (!device) return;
		if( ChkHIDItem() < 1 ) return;

		device.close();
		console.log(`${device.productName} opened: ${device.opened}`);
    }
  },
  
  'ボード状態': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		ChkHIDItem();
		console.log(USBconnected);
		return USBconnected;
    }
  },

  '止': {
    type: 'func',
    josi: [['で']],
    fn: async function (text, sys) {
		var sec = parseInt(text) * 1000;
		if( sec > 10000 ) sec = 10000;
		if( sec < 0 ) sec = 0;
		console.log(sec);
		await waitFor(sec);
    }
  },


  '発音': {
    type: 'func',
    josi: [[]],
    fn: async function (text, sys) {
    	var note;

		ChkHIDItem();
		if( USBconnected == 1 ) {
			note = 15;

			// beep
			outputReport[0] = 'P'.charCodeAt(0);
			outputReport[1] = note;
			await device.sendReport(outputReportId, outputReport);
			console.log(`beep on  note:${note}`);

			await waitFor(500);

			// beep
			outputReport[0] = 'P'.charCodeAt(0);
			outputReport[1] = 23;
			await device.sendReport(outputReportId, outputReport);
			console.log("beep off");
		}
	}
  },

  'LEDオン': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		ChkHIDItem();
		if( USBconnected == 1 ) {
			// turn on
			outputReport[0] = 'O'.charCodeAt(0);
			outputReport[1] = 0;
			outputReport[2] = 1;
			device.sendReport(outputReportId, outputReport);
			console.log("led on");
		}
	}
  },

  'LEDオフ': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		ChkHIDItem();
		if( USBconnected == 1 ) {
			// turn on
			outputReport[0] = 'O'.charCodeAt(0);
			outputReport[1] = 0;
			outputReport[2] = 0;
			device.sendReport(outputReportId, outputReport);
			console.log("led off");
		}
	}
  },

  '出力1オン': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		ChkHIDItem();
		if( USBconnected == 1 ) {
			// turn on
			outputReport[0] = 'O'.charCodeAt(0);
			outputReport[1] = 1;
			outputReport[2] = 1;
			device.sendReport(outputReportId, outputReport);
			console.log("output1 turn on");
		}
	}
  },

  '出力1オフ': {
    type: 'func',
    josi: [[]],
    fn: function (text, sys) {
		ChkHIDItem();
		if( USBconnected == 1 ) {
			// turn on
			outputReport[0] = 'O'.charCodeAt(0);
			outputReport[1] = 1;
			outputReport[2] = 0;
			device.sendReport(outputReportId, outputReport);
			console.log("output1 turn off");
		}
	}
  },

  'センサ1': { type: 'const', value : 0 },
  'センサ1測定': {
    type: 'func',
    josi: [[]],
    fn: function (sys) { 
    	ChkHIDItem();
		if( USBconnected == 1 ) {
			try {
				( async () => {
					// send
					outputReport[0] = 'A'.charCodeAt(0);
					await device.sendReport(outputReportId, outputReport);
					await WaitForInputReport();		// イベント発生まで待つ
					console.log( `result: ${ADval}` );
				})()
			} catch(e) {
				return e;
			} finally {
				return ADval;	// ※１回前の測定値が返される…。asyncの問題…。
			}
		}
	}
  },

  'センサ1値': {
    type: 'func',
    josi: [[]],
    fn: function (sys) {
    	ChkHIDItem();
		if( USBconnected == 1 ) {
			return ADval;
		}
	}
  }

}

// モジュールのエクスポート(必ず必要)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PluginNakoBoard
}
//プラグインの自動登録
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginNakoBoard', PluginNakoBoard)
}
