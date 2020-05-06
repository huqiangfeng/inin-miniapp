// inbox//download/download.js

const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    fileInfo: {},
    percent: 0,
    time: 0,
    context: '',
    interimFile: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.data) {
      this.setData({
        fileInfo: JSON.parse(options.data),
        context: wx.createCanvasContext("draw")
      })
    }
    // draw
    this.animationB(this.data.context);
    this.data.context.draw();
  },

  // 下载按钮
  downloadApp() {
    req_fn
      .req(req_fn.fileUrl + this.data.fileInfo.attachmentIdAlias)
      .then(res => {
        if (typeof res.code != "undefined" && res.code != 0) {
          // 文件不存在
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        } else {
          // 文件存在，进行下载
          this.download();
        }
      });
  },
  // 文件下载
  download() {
    const downloadTask = wx.downloadFile({
      url: req_fn.fileUrl + this.data.fileInfo.attachmentIdAlias,
      success: res => {
        const filePath = res.tempFilePath; // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: filePath
          });
        }
        this.setData({
          interimFile: filePath
        })
        this.preview(filePath);
      },
      fail: err => {
        //console.log(err);
        wx.showToast({
          title: "下载失败",
          icon: "none",
          duration: 2000
        });
      }
    });
    // 下载进度
    downloadTask.onProgressUpdate(res => {
      this.setData({
        percent: res.progress
      })
      this.animationing(this.context);
      this.context.draw();
      // //console.log("下载进度", res.progress);
      // //console.log("已经下载的数据长度", res.totalBytesWritten);
      // //console.log("预期需要下载的数据总长度", res.totalBytesExpectedToWrite);
    });
  },
  // 预览文件
  preview() {
    let filePath = this.data.interimFile
    if (util.pattern(filePath, "img")) {
      // 图片预览
      wx.previewImage({
        current: filePath, // 当前显示图片的http链接
        urls: [filePath] // 需要预览的图片http链接列表
      });
    } else {
      // 文件预览
      wx.openDocument({
        filePath: filePath,
        success: function (resFile) {
          //console.log("打开文档成功", resFile);
        },
        fail: function (errFile) {
          //console.log("打开文档成功", errFile);
        }
      });
    }
  },
  // 下载初始
  animationB(context) {
    // 设置边框颜色
    context.beginPath();
    context.setStrokeStyle("#DFE6FF");
    context.setLineWidth(6);
    context.arc(30, 30, 25, 0, 2 * Math.PI, true); //创建2条弧线
    context.stroke(); //画出当前路径的边框
    // context.moveTo(0, 0);//移动
    //  context.fill();//当前路径中的内容进行填充
    // context.closePath();

    // 竖线的渐变色
    const grd = context.createLinearGradient(0, 34, 6, 0); //tan33
    grd.addColorStop(0, "#5F7AFF");
    grd.addColorStop(1, "#77A9FF");
    // 左竖线
    context.beginPath();
    context.setStrokeStyle(grd);
    context.setFillStyle(grd);
    context.setLineWidth(1);
    context.arc(24, 24, 3, 0, 1 * Math.PI, true); //创建1条弧线
    context.lineTo(21, 35);
    context.arc(24, 35, 3, 1 * Math.PI, 0, true); //创建1条弧线
    context.lineTo(27, 24);
    context.fill(); //当前路径中的内容进行填充
    context.stroke(); //画出当前路径的边框
    // 右竖线
    context.beginPath();
    context.setStrokeStyle(grd);
    context.setFillStyle(grd);
    context.setLineWidth(1);
    context.arc(36, 24, 3, 0, 1 * Math.PI, true); //创建1条弧线
    context.lineTo(33, 35);
    context.arc(36, 35, 3, 1 * Math.PI, 0, true); //创建1条弧线
    context.lineTo(39, 24);
    context.fill(); //当前路径中的内容进行填充
    context.stroke(); //画出当前路径的边框
  },
  // 下载完成
  animationE(context) {
    context.beginPath();
    context.setStrokeStyle("#6F8DFF");
    context.setLineWidth(6);
    context.arc(30, 30, 25, 0, 2 * Math.PI, true); //创建2条弧线
    context.stroke(); //画出当前路径的边框
  },
  // 下载中
  animationing(context) {
    var angle = -0.5 + this.percent * 0.02;
    this.animationB(context);
    context.beginPath();
    context.setStrokeStyle("#6F8DFF");
    context.setLineWidth(6);
    context.arc(30, 30, 25, -0.5 * Math.PI, angle * Math.PI, false); //创建2条弧线
    context.stroke(); //画出当前路径的边框
  }
})