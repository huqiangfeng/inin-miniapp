// pages/email/videoPlay/videoPlay.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util")
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		videoList: [],
		currentPlayVideoId: '0',
		paramsVideoId: '',
		companyId: '',
		defaultStart: 2,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			companyId: options.companyId,
			paramsVideoId: options.currentVideoId
		})
		this.getVideoFn();
	},
	swiperChange(event) {
		if (event.detail.current == this.data.videoList.length - 1) {
			this.getMoreVideo()
		}
	},
	bindanimationfinish(e) {
		console.log('bindanimationfinish');
		let animationEndVideoId = e.detail.current.toString();
		this.setData({
			currentPlayVideoId: animationEndVideoId
		})
		wx.createVideoContext(this.data.currentPlayVideoId).play()
		let vodId = this.data.videoList[e.detail.current].vodId
		req_fn.req(`/api/company/vod/${vodId}/read-log`, {
			vodId
		}, "POST").then(res => {
			console.log(res);
		})
	},
	// 页面滑动的时候暂停正在播放的视频
	bindtransition() {
		wx.createVideoContext(this.data.currentPlayVideoId).pause()

	},
	// 获取视频列表
	getVideoFn() {
		var value = wx.getStorageSync('Login')
		let access_token = value.inin.access_token;
		let data = {
			access_token: access_token,
			companyId: this.data.companyId, //
			pageNum: 1,
			pageSize: 20,
		}
		req_fn.req('api/company/vod/page', data, "get").then(res => {
			if (res.code == "000000") {
				let response = res.data.records;
				let tempVideoArr = [];
				let sameVideoArr = [];
				for (let index = 0; index < response.length; index++) {
					const element = response[index];
					if (element.vod.videoId != this.data.paramsVideoId) {
						tempVideoArr.push({
							index: index,
							name: element.user.name,
							createTime: util.formatTime(element.vod.createTime, true, false),
							description: element.vod.description,
							lookdNum: element.vod.lookdNum,
							playUrl: element.vod.playUrl,
							coverUrl: element.vod.coverUrl,
							videoId: element.vod.videoId,
							vodId: element.vod.vodId
						})
					} else {
						sameVideoArr.push({
							index: index,
							name: element.user.name,
							createTime: util.formatTime(element.vod.createTime, true, false),
							description: element.vod.description,
							lookdNum: element.vod.lookdNum,
							playUrl: element.vod.playUrl,
							coverUrl: element.vod.coverUrl,
							videoId: element.vod.videoId,
							vodId: element.vod.vodId
						})
					}
				}
				let contactArr = [...sameVideoArr, ...tempVideoArr];
				this.setData({
					videoList: contactArr
				})
				console.log('getVideoFn');
				wx.createVideoContext('0').play();
				let vodId = contactArr[0].vodId
				req_fn.req(`/api/company/vod/${vodId}/read-log`, {
					vodId
				}, "POST").then(res => {
					console.log(res);
				})
				// this.currentVideoIsCollected(this.data.videoList[0].videoId)
			} else {
				wx.showToast({
					title: '获取企业视频失败',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
	// 收藏视屏 
	collectionVideo(e) {
		var value = wx.getStorageSync('Login')
		let tempvideoList = this.data.videoList
		let tIndex = e.currentTarget.dataset.index;
		let access_token = value.inin.access_token;
		let videoId = e.currentTarget.dataset.videoid;

		req_fn.req('api/user/vod/' + videoId + '/is-collected', {
			access_token: access_token
		}, 'get').then(res => {
			console.log(res)
			if (res.data) {
				wx.showToast({
					title: "您已经收藏该视频",
					icon: "none",
					duration: 1000
				})
				return
			} else {
				req_fn.req('api/user/vod/collection', {
					access_token: access_token,
					id: videoId
				}, 'post').then(res => {
					console.log(res, 'collection')
					if (res.code == 0) {
						wx.showToast({
							title: "收藏成功",
							icon: "none",
							duration: 1000
						})
						tempvideoList[tIndex].lookdNum = Number(tempvideoList[tIndex].lookdNum) + 1;
						this.setData({
							videoList: tempvideoList
						})
					} else {
						wx.showToast({
							title: "收藏失败",
							icon: "none",
							duration: 1000
						})
					}
				})
			}
		})
	},
	// 视频翻页
	getMoreVideo() {
		var value = wx.getStorageSync('Login')
		let access_token = value.inin.access_token;
		let data = {
			access_token: access_token,
			companyId: this.data.companyId, //
			pageNum: this.data.defaultStart,
			pageSize: 20,
		}
		req_fn.req('api/company/vod/page', data, "get").then(res => {
			if (res.code == "000000") {
				let response = res.data.records;
				if (response == []) {
					wx.showToast({
						title: '暂无新数据',
						icon: 'none',
						duration: 2000
					})
				} else {
					let tempVideoArr = [];
					for (let index = 0; index < response.length; index++) {
						const element = response[index];
						tempVideoArr.push({
							index: index,
							name: element.user.name,
							createTime: util.formatTime(element.vod.createTime, true, false),
							description: element.vod.description,
							lookdNum: element.vod.lookdNum,
							playUrl: element.vod.playUrl,
							coverUrl: element.vod.coverUrl,
							videoId: element.vod.videoId,
							vodId: element.vod.vodId
						})
					}
					let newArr = this.data.videoList.concat(tempVideoArr);
					let newdefaultStart = this.data.defaultStart;
					this.setData({
						videoList: newArr,
						defaultStart: newdefaultStart + 1
					})
				}
			} else {
				wx.showToast({
					title: '获取企业视频失败',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
	// 判断当前的视频时候被收藏
	currentVideoIsCollected(videoId) {
		let url = "api/user/vod/" + videoId + "/is-collected"
		req_fn.req(url, {}, "get").then(res => {
			if (res.code == 0) {
				return res.data
			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(res) {
		//console.log(res)
		return {
			title: '自定义转发标题',
			path: ''
		}
	}
})