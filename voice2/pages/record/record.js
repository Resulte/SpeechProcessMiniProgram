// pages/record/record.js
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    currentText: '',
    translateText: '',
    lfrom:'',
    lto:''
  },
  streamRecord: function(e) {
    let that = this;
    console.log(e.target.dataset.lang);
    if(e.target.dataset.lang == 'ch'){
        that.setData({
          lfrom: 'zh_CN',
          lto: 'en_US'
        })
    }else{
      that.setData({
        lfrom: 'en_US',
        lto: 'zh_CN'
      })
    }
    //开始识别
    manager.start({
      duration:60000,
      lang: that.data.lfrom,
    })
  },
  streamRecordEnd: function() {
    //结束识别
    manager.stop()
  },
  initRecord: function() {    
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {      
      let text = res.result      
      this.setData({
        currentText: text,
      })
    }    // 识别结束事件
    manager.onStop = (res) => {      
      let text = res.result      
      if(text == '') {        // 用户没有说话，可以做一下提示处理...
        wx.showModal({
          title: '提示',
          content: '请再说一次'
        })
        return
      }      
      this.setData({
        currentText: text,
      })      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  translateTextAction: function() {
    //let lfrom =  'zh_CN'
    //let lto = 'en_US'
    var that = this;
    plugin.translate({
      lfrom: that.data.lfrom,
      lto: that.data.lto,
      content: that.data.currentText,
      tts: true, // 需要合成语音
      success: (resTrans)=>{        // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间
        let text = resTrans.result        
        this.setData({
          translateText: text,
        })        // 得到合成语音让它自动播放出来
        wx.playBackgroundAudio({
          dataUrl: resTrans.filename,
          title: '',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRecord()
  }
})