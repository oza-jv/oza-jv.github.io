/**
 * なでしこ3 追加プラグイン 2020/12/12
 * file : plugin_media.js
 * 音声，静止画，動画を表示・再生するためのプラグイン
 * ローカルのファイルも扱える
 * 文字を「書く」命令もある
 * 
 */
const PluginMedia = {
  // --- 画像関係 ---
  '絵追加': { // @imgタグを追加して，aPicファイルを読み込む。 //@エツイカ
    // pIDを指定するとそれを親要素とする。省略するとdefault親要素の子要素として追加。
    // 生成されたid名を返す。
    type: 'func',
    josi: [['を'],['へ', 'に']],
    isVariableJosi: true,
    return_none: true,
    fn: function (aPic, ...pID) {
      try {
         const sys = pID.pop();
         var parent = sys.__v0['DOM親要素'];
         if ( pID.length > 0 ) {
           parent = document.querySelector("#" + pID[0]);
         };
         const img = document.createElement('img');
         img.src = aPic;
         img.id = 'nadesi-dom-' + sys.__v0['DOM生成個数'];
         parent.appendChild(img);
         sys.__v0['DOM生成個数']++;
         return img.id;
     } catch(e) {
		// エラーを表示
       window.alert('絵追加 ' + e.message);
       return -1;
     }
    }
  },

  '絵読込': { // @id=aIDの画像をaPicに差し替える // @エヨミコミ
    type: 'func',
    josi: [['に'],['を']],
    fn: function (aID, aPic, sys) {
      try {
        const parent = document.querySelector("#" + aID);
        parent.src = aPic;
      } catch(e) {
		// エラーを表示
       window.alert('絵読込 ' + e.message);
       return -1;
      }
    }
  },
  
  // --- 音関係 ---
  '音読込': { // @id=aIDのaudioタグにaSrcファイルを読み込む // @オトヨミコミ
    // あらかじめaudioタグを設置しておく場合はこっち。
    type: 'func',
    josi: [['に'],['を']],
    fn: function (aID, aSrc, sys) {
      try {
        const audio = document.querySelector("#" + aID);
        audio.src = aSrc;
      } catch(e) {
       // エラーを表示
       window.alert('音読込 ' + e.message);
       return -1;
      }
    }
  },
  
  '音追加': { // @audioタグを追加して，aSrcファイルを読み込む // @オトツイカ
    // aIDを指定するとそれを親要素とする。省略するとbodyの子要素として追加。
    // 生成されたid名を返します。
    type: 'func',
    josi: [['を'],['へ', 'に']],
    isVariableJosi: true,
    return_none: true,
    fn: function (aSrc, ...pID) {
      try {
         const sys = pID.pop();
         var parent = document.body;
         if ( pID.length > 0 ) {
           parent = document.querySelector("#" + pID[0]);
         };
         const audio = document.createElement('audio');
         audio.src = aSrc;
         audio.id = 'nadesi-dom-' + sys.__v0['DOM生成個数'];
         parent.appendChild(audio);
         sys.__v0['DOM生成個数']++;
         return audio.id;
     } catch(e) {
		// エラーを表示
       window.alert('音追加 ' + e.message);
       return -1;
     }
    }
  },
    
  '音再生': { // @id=aIDのaudioタグに設定されている音を頭から再生する // @オトサイセイ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const audio = document.querySelector("#" + aID);
        audio.currentTime = 0;
        audio.play();
      } catch(e) {
        // エラーを表示
        window.alert('音再生 ' + e.message);
        return -1;
      }
    }
  },

  '音再開': { // @id=aIDのaudioタグに設定されている音を停止位置から再生する // @オトサイカイ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const audio = document.querySelector("#" + aID);
        audio.play();
      } catch(e) {
        // エラーを表示
        window.alert('音再開 ' + e.message);
        return -1;
      }
    }
  },

  '音停止': { // @id=aIDのaudioタグに設定されている音を一時停止する // @オトテイシ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const audio = document.querySelector("#" + aID);
        audio.pause();
      } catch(e) {
        // エラーを表示
        window.alert('音停止 ' + e.message);
        return -1;
      }
    }
  },
  
  // --- 動画関係 ---
  '動画読込': { // @id=aIDのvideoタグにaSrcファイルを読み込む // @ドウガヨミコミ
    // あらかじめvideoタグを設置しておく場合はこっち。
    type: 'func',
    josi: [['に'],['を']],
    fn: function (aID, aSrc, sys) {
      try {
        const video = document.querySelector("#" + aID);
        video.src = aSrc;
      } catch(e) {
        // エラーを表示
        window.alert('動画読込 ' + e.message);
        return -1;
      }
    }
  },

  '動画追加': { // @videoタグを追加して，aSrcファイルを読み込む // @ドウガツイカ
    // aIDを指定するとそれを親要素とする。省略するとdefault親要素の子要素として追加。
    // 生成されたid名を返す。
    type: 'func',
    josi: [['を'],['へ', 'に']],
    isVariableJosi: true,
    return_none: true,
    fn: function (aSrc, ...pID) {
      try {
        const sys = pID.pop();
        var parent = sys.__v0['DOM親要素'];
        if ( pID.length > 0 ) {
          parent = document.querySelector("#" + pID[0]);
        };
        const video = document.createElement('video');
        video.src = aSrc;
        video.id = 'nadesi-dom-' + sys.__v0['DOM生成個数'];
        video.width = '320';
        video.controls = false;
        video.playsinline = true;
        video.autoplay = true;
        video.muted = true;    // chromeではmutedがtrueでないと再生できない
        parent.appendChild(video);
        sys.__v0['DOM生成個数']++;
        return video.id;
     } catch(e) {
        // エラーを表示
        window.alert('動画追加 ' + e.message);
        return -1;
     }
    }
  },

  '動画再生': { // @id=aIDのvideoタグに設定されている動画を頭から再生する // @ドウガサイセイ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const video = document.querySelector("#" + aID);
        video.currentTime = 0;
        video.play();
        //video.muted = false;
      } catch(e) {
        // エラーを表示
        window.alert('動画再生 ' + e.message);
        return -1;
      }
    }
  },
  
  '動画停止': { // @id=aIDのvideoタグに設定されている動画を一時停止する // @ドウガテイシ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const video = document.querySelector("#" + aID);
        video.pause();
      } catch(e) {
        // エラーを表示
        window.alert('動画停止 ' + e.message);
        return -1;
      }
    }
  },

  '動画再開': { // @id=aIDのvideoタグに設定されている動画を停止位置から再生する // @ドウガサイカイ
    type: 'func',
    josi: [['を']],
    fn: function (aID, sys) {
      try {
        const video = document.querySelector("#" + aID);
        video.play();
      } catch(e) {
        // エラーを表示
        window.alert('動画再開 ' + e.message);
        return -1;
      }
    }
  },
  
  // --- 文字関係 ---
  '書': {
    type: 'func',
    josi: [['と', 'を']],
    fn: function (text, sys) {
      const parent = sys.__v0['DOM親要素']
      var te = document.createElement('span')
      te.innerHTML = text
      parent.appendChild(te)
      
      te = document.createElement('br');
      parent.appendChild(te);
    }
  }
}

// モジュールのエクスポート(必ず必要)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PluginMedia
}
//プラグインの自動登録
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginMedia', PluginMedia)
}
