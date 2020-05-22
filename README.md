# SpeechProcessMiniProgram
语音识别+语音合成+同声传译 微信小程序

### 项目预览

扫描下方小程序码，即可查看预览：

![QRcode](https://github.com/Resulte/SpeechProcessMiniProgram/blob/master/image/gh_8abc46d7ecd7_258.jpg)

### 项目UI

本项目只有4张页面

![index](https://github.com/Resulte/SpeechProcessMiniProgram/blob/master/image/index.png)

![img1](https://github.com/Resulte/SpeechProcessMiniProgram/blob/master/image/img1.png)

![img2](https://github.com/Resulte/SpeechProcessMiniProgram/blob/master/image/img2.png)

![img3](https://github.com/Resulte/SpeechProcessMiniProgram/blob/master/image/img3.png)

### 技术原理

本项目基于微信同声传译插件二次开发：

```json
 "plugins": {
    "WechatSI": {
      "version": "0.3.3",
      "provider": "wx069ba97219f66d99"
    }
  }
```

#### 语音识别

可以识别4种语言：普通话、英语、粤语、四川话。

核心JS代码：

```javascript
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
```

#### 语音合成

可以合成2种语言：普通话、英语，追加了一项把合成好的音频下载到本地的功能。

核心JS代码：

```javascript

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
```

#### 同声传译

英语和普通话之间的相互转换，本质上就是上面两个功能合二为一，只不过中间多了一个文本翻译的过程。