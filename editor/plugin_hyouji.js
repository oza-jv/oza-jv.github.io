/**
 * なでしこ3 追加プラグイン 2021/2/28
 * file : plugin_hyouji.js
 * サイト用に「表示」を追加するだけ。
 */
const PluginHyouji = {
  '表示': {
    type: 'func',
    josi: [['の', 'と', 'を']],
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
  module.exports = PluginHyouji
}
//プラグインの自動登録
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject('PluginHyouji', PluginHyouji)
}
