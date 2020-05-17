// pages/email/visitHome/visitHome.js
const util = require("../../../utils/util")
const wxRequest = require("../../../utils/route")
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wechatSIIsShow: false, // 听写
		popupShow: false,
		popupShowDepartment: false,
		canSubmit: true,
		username: '',
		companyName: '',
		positionName: '',
		visitTime: [{
				id: 0,
				val: '09:00-10:00'
			},
			{
				id: 1,
				val: '10:00-11:00'
			}, {
				id: 2,
				val: '11:00-12:00'
			}, {
				id: 3,
				val: '13:00-14:00'
			}, {
				id: 4,
				val: '14:00-15:00'
			}, {
				id: 5,
				val: '15:00-16:00'
			}, {
				id: 6,
				val: '16:00-17:00'
			},
		],
		initDepartmentName: [
			// 销售 市场 人事 财务 运营  媒体  推广  管理  风控 法务 生产 总经办 股东 法人
			{
				id: 0,
				marginRight: true,
				name: '销售'
			},
			{
				id: 1,
				marginRight: true,
				name: '市场'
			}, {
				id: 2,
				marginRight: true,
				name: '人事'
			}, {
				id: 3,
				marginRight: true,
				name: '财务'
			}, {
				id: 4,
				marginRight: true,
				name: '运营'
			}, {
				id: 5,
				marginRight: true,
				name: '媒体'
			}, {
				id: 6,
				marginRight: true,
				name: '推广'
			},
			{
				id: 7,
				marginRight: true,
				name: '管理'
			},
			{
				id: 8,
				marginRight: true,
				name: '风控'
			},
			{
				id: 9,
				marginRight: true,
				name: '法务'
			}, {
				id: 10,
				marginRight: true,
				name: '生产'
			}, {
				id: 11,
				marginRight: true,
				name: '总经办'
			}, {
				id: 12,
				marginRight: true,
				name: '股东'
			},
			{
				id: 13,
				marginRight: true,
				name: '法人'
			},
		],
		radio: '',
		choseTime: '',
		appointmentTime: '',
		departmenytName: '',
		departmentActiveIndex: -1,
		minDate: new Date().getTime(),
		currentDate: new Date().getTime(),
		visitText: '',
		visitCompanyInfo: null,
		myselfInfo: null,
		currentCompanyID: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			visitCompanyInfo: options,
			myselfInfo: util.getLocal('card'),
			currentCompanyID: options.companyID
		})
		this.formatterDepartmentName()
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
		this.setData({
			choseTime: '',
			appointmentTime: '',
			visitText: '',
			departmenytName: '',
			departmentActiveIndex: -1
		})
	},
	// 编辑个人信息
	on_Change() {
		let _this = this
		wx.navigateTo({
			url: "/pages/personalInfo/myCard/myCard?isSelect=true",
			events: {
				getChangeCard: function (data) {
					_this.setData({
						myselfInfo: data.card
					})
				}
			}
		});
	},
	// 显示听写
	on_showWechatSI() {
		this.setData({
			wechatSIIsShow: true
		})
	},
	on_hiddenWechatSI() {
		this.setData({
			wechatSIIsShow: false
		})
	},
	on_WechatSIValue(e) {
		if (e.detail !== this.data.visitText) {
			this.setData({
				visitText: this.data.visitText + e.detail
			})
		}
	},
	//   选择时间
	showChoseTime() {
		this.setData({
			popupShow: true
		})
	},
	// 选择部门
	showChoseDepartment() {
		this.setData({
			popupShowDepartment: true
		})
	},
	choseDepartment(e) {
		this.setData({
			departmentActiveIndex: e.currentTarget.dataset.index,
			departmenytName: e.currentTarget.dataset.name
		})
	},
	confirmDepart() {
		if (this.data.departmenytName == '') {
			wx.showToast({
				title: '请选择部门',
				icon: 'none',
				duration: 1500
			})
		} else {
			this.setData({
				popupShowDepartment: false
			})
		}
	},
	bindinput(e) {
		this.setData({
			visitText: e.detail
		})
	},
	onClose() {
		this.setData({
			popupShow: false
		})
	},
	onCloseDepartment() {
		this.setData({
			popupShowDepartment: false
		})
	},
	radioChange(event) {
		this.setData({
			choseTime: event.detail.value
		})
	},
	dateChange(event) {
		this.setData({
			currentDate: event.detail
		});
	},
	confirmTime() {
		if (this.data.choseTime == '') {
			wx.showToast({
				title: '请选择时间段',
				icon: 'none',
				duration: 2000
			})
		} else {
			let time = util.formatTime(this.data.currentDate, true, false) + '' + this.data.choseTime
			this.setData({
				popupShow: false,
				appointmentTime: time
			})
		}
	},
	submit() {
		if (this.data.canSubmit) {
			if (this.data.choseTime == '') {
				wx.showToast({
					title: '请选择时间段',
					icon: 'none',
					duration: 1500
				})
			} else if (this.data.departmenytName == '') {
				wx.showToast({
					title: '请选择部门',
					icon: 'none',
					duration: 1500
				})
			} else if (this.data.visitText == '') {
				wx.showToast({
					title: '请输入拜访业务',
					icon: 'none',
					duration: 1500
				})
			} else {
				//console.log('发送')
				this.setData({
					canSubmit: false
				})
				this.sendVisit()
			}
		} else {
			wx.showToast({
				title: "不可以重复提交",
				icon: "none",
				duration: 1000
			})
		}
	},
	sendVisit() {
		let url = "api/company/" + this.data.visitCompanyInfo.companyID + "/mailbox" //单次发送的请求地址;
		let resTime = this.formatterTime(this.data.appointmentTime);
		let data = {
			content: this.data.visitText,
			sendUserName: this.data.myselfInfo.sendUserName,
			sendUserPosition: this.data.myselfInfo.sendUserPosition,
			sendUserCompany: this.data.myselfInfo.sendUserCompany,
			requirementType: 'visit',
			deliverStartTime: resTime.reqStime,
			deliverEndTime: resTime.reqEtime,
			deliverDepartment: this.data.departmenytName,
		}
		wx.showLoading({
			title: '发送中',
		})
		wxRequest.req(url, data, "post").then(res => {
			if (res.code == 0) {
				wx.hideLoading()
				this.setData({
					canSubmit: true
				})
				wx.navigateTo({
					url: "/pages/email/visitHomeSuccess/visitHomeSuccess?companyID=" + this.data.visitCompanyInfo.companyID + '&visitText=' + this.data.visitText + '&sendUserName=' + this.data.myselfInfo.sendUserName + '&sendUserPosition=' + this.data.myselfInfo.sendUserPosition + '&sendUserCompany=' + this.data.myselfInfo.sendUserCompany
				})
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 1500
				})
				// setTimeout(() => {
				// 	wx.reLaunch({
				// 		url: '/pages/home/email/email'
				// 	})
				// }, 1800);
			}
		})
	},
	formatterTime(appointmentTime) {
		let startTime, endTime, year, month, day, reqStime, reqEtime;
		let oS = appointmentTime.replace('年', '-');
		let tS = oS.replace('月', '-');
		let eS = tS.replace('日', '&');

		startTime = eS.split('&')[1].split('-')[0] + ':00';
		endTime = eS.split('&')[1].split('-')[1] + ':00';

		let teS = eS.split('&')[0];
		year = teS.split('-')[0];
		month = teS.split('-')[1] < 10 ? '0' + teS.split('-')[1] : teS.split('-')[1];
		day = teS.split('-')[2] < 10 ? '0' + teS.split('-')[2] : teS.split('-')[2];
		reqStime = year + '-' + month + '-' + day + ' ' + startTime;
		reqEtime = year + '-' + month + '-' + day + ' ' + endTime;

		return {
			reqStime: reqStime,
			reqEtime: reqEtime
		}

	},
	formatterDepartmentName() {
		let nameArr = this.data.initDepartmentName;
		for (let index = 0; index < nameArr.length; index++) {
			if (nameArr[4 * index + 3]) {
				nameArr[4 * index + 3].marginRight = false
			}
		}
		this.setData({
			initDepartmentName: nameArr
		})
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
	onShareAppMessage: function () {

	}
})