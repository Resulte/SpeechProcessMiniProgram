const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
let filename = ''
Page({
  data: {
    array: ['普通话', '英语', '粤语', '四川话'],
    langArray: ['zh_CN', 'en_US', 'zh_HK', 'sichuanhua'],
    index: 0, 
    currentText: ''
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  streamRecord: function(e) {
    let that = this;
    console.log(e.target.dataset.lang);
    
    //开始识别
    manager.start({
      duration:60000,
      lang: that.data.langArray[that.data.index],
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
      //this.translateTextAction()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRecord()
  },

})