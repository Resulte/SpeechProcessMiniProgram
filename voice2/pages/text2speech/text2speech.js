const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
let filename = ''
Page({
  data: {
    filename: '',
    lang: 'zh_CN'
  },

  play: function(res){
    let message = res.detail.value.message;
    let that = this;
    if(message == ''){
      wx.showModal({
        title: '提示',
        content: '请输入文本！'
      })
    }
    console.log(message);
    plugin.textToSpeech({
      lang: that.data.lang,
      tts: true,
      content: message,
      success: function(res) {
          console.log("succ tts", res.filename) ;
          wx.playBackgroundAudio({
            dataUrl: res.filename
          })
          filename = res.filename;
          // that.setData({
          //   filename: res.filename
          // });
        },
      fail: function(res) {
          console.log("fail tts", res)
      }
    })
  },
  download(){
    if(filename == ''){
      wx.showModal({
        title: '提示',
        content: '请先合成音频！'
      })
    }
    wx.downloadFile({
      url: filename, //仅为示例，并非真实的资源
      success (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log('download success',res.tempFilePath)
          wx.showToast({
            title: '成功下载到本地',
            icon: 'succes',
            duration: 1000,
            mask:true
        })
        }
        else{
          wx.showModal({
            title: '提示',
            content: '网络错误，下载失败！'
          })
        }
      }
    })
  },
  radioChange: function (e){
    var that = this;
    console.log(e.detail.value);
    that.setData({
      lang: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})