const req_fn = require("../../utils/route");
const util = require("../../utils/util")
Component({
    properties: {
        company: {
            type: Object,
        },
        shareFlag:{
            type:Boolean
        }
    },
    data:{
        videoList:[],
        currentClickVideoIndex:'',
    },
    observers:{
        "shareFlag":function(shareFlag){
            let shareVideoIndex = this.data.currentClickVideoIndex;
            let tempVideoList = this.data.videoList;
            tempVideoList.map((item,index) => {
                if(shareVideoIndex == index){
                    return item.vod.isChecked = !shareFlag
                }
            })
            this.setData({
                videoList:tempVideoList
            })
        }
    },
    methods:{
        // 添加朋友
        addFriend(e){    
            let currentFriendUserId = e.currentTarget.dataset.userid
            //console.log('addFriend',e,currentFriendUserId)
            wx.showLoading({
                title: '加载中',
            })
            req_fn.req("api/user/friend-apply", {
                friendUserId: currentFriendUserId
            }, "post").then(res => {
                wx.hideLoading()
                //console.log(res,'addFriend')
                if(res.code == 0){
                    wx.showToast({
                        title: '添加成功',
                        icon: 'none',
                        duration: 2000
                    })
                    let _videoList_ = this.data.videoList;
                    _videoList_[e.currentTarget.dataset.index].friendStatus = 'applying';
                    this.setData({
                        videoList:_videoList_
                    })
                }else{
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        },
        // 到播放页面
        playVideo(e){
            let currentVideoUrl = this.data.videoList[e.currentTarget.dataset.index].vod.playUrl;
            let currentVideocoverUrl = this.data.videoList[e.currentTarget.dataset.index].vod.coverUrl;
            let currentVideoId =  this.data.videoList[e.currentTarget.dataset.index].vod.videoId;
            if(currentVideoUrl == ''){
                wx.showToast({
                    title: '暂无视频地址',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                wx.navigateTo({
                    url:'/pages/email/videoPlay/videoPlay?playUrl=' + currentVideoUrl + "&coverUrl=" + currentVideocoverUrl + "&companyId=" + this.data.company.id + "&currentVideoId=" + currentVideoId
                })
            }
        },
        // 播放出错
        binderror(){
            wx.showToast({
                title: '请重试',
                icon: 'none',
                duration: 2000
            })
        },
        // 显示分享空间
        shareBtn(e){
            let currentVideoIndex = e.currentTarget.dataset.index;
            let currentVideoUrl = this.data.videoList[e.currentTarget.dataset.index].vod.playUrl;
            if(currentVideoUrl == ''){
                wx.showToast({
                    title: '暂无视频地址',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                let clickVideoInfo = this.data.videoList[currentVideoIndex]
                let tempVideoList = this.data.videoList;
                tempVideoList.map((item,index) => {
                    if(currentVideoIndex == index){
                        return item.vod.isChecked = true
                    }else{
                        return item.vod.isChecked = false
                    } 
                })
                this.setData({
                    videoList:tempVideoList,
                    currentClickVideoIndex:currentVideoIndex
                })
                this.triggerEvent('compontpass',clickVideoInfo)
            }
        }
    },
     // 组件生命周期
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached() {
            //console.log('attached 在组件实例进入页面节点树时执行')
        },
        //在组件在视图层布局完成后执行
        ready() {
            var value = wx.getStorageSync('Login')
            let access_token = value.inin.access_token;
            let data = {
                access_token: access_token,
                companyId:this.data.company.id,//
                pageNum:1,
                pageSize:100,
            }
            req_fn.req('api/company/vod/page', data, "get").then(res => {
                if(res.code == "000000"){
                    let response = res.data.records;
                    response.map(item => {
                        return item.vod.isChecked = false
                    })
                    response.forEach(element => {
                        if(element.user.avatar != null && element.user.avatar.indexOf("http") == -1){
                            element.user.avatar = req_fn.imgUrl + element.user.avatar;
                        }
                        if(element.vod.createTime == null || element.vod.createTime == ''){
                            element.vod.releaseTime = '暂无发布时间'
                        }else{
                            element.vod.releaseTime = util.timeDifference(element.vod.createTime)
                        }
                    });
                    this.setData({
                        videoList: response
                    })
                    console.log(this.data.videoList,'videoList')
                }else{
                    wx.showToast({
                        title: '获取企业视频失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
           
            
            
        },
        // 在组件实例被移动到节点树另一个位置时执行
        moved() {},
        // 在组件实例被从页面节点树移除时执行
        detached() {

        },
        // 每当组件方法抛出错误时执行
        error() {

        }
    },
})