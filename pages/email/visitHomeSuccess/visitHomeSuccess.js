// pages/email/visitHomeSuccess/visitHomeSuccess.js
const wxRequest = require('../../../utils/route')
const util = require("../../../utils/util")
Page({

/**
 * 页面的初始数据
 */
data: {
	companyList:[],
	content:'',
	sendUserName:'',
	sendUserPosition:'',
	sendUserCompany:'',
	currentCompanyID:''
},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		this.getRecommendCompany(options.companyID);
		this.setData({
			content:options.visitText,
			sendUserName:options.sendUserName,
			sendUserPosition:options.sendUserPosition,
			sendUserCompany:options.sendUserCompany,
			currentCompanyID:options.companyID
		});
	},
	getRecommendCompany(companyId){
		wx.showLoading({
			title: '加载中',
		})
		let url = "/api/company/" + companyId + "/mailbox-recommend-companies";
		wxRequest.req(url,{},"post").then( res => {
			//console.log(res,'res')
			if(res.code == 0){
				wx.hideLoading();
				let response = res.data;
				response.map(item => {
					return item.isCheck = true
				})
				this.setData({
					companyList:response
				})
			}else{
				wx.showToast({
					title:"获取数据失败",
					icon:"none",
					duration:1500
				})
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
	switchRadio(e){
		let index = e.currentTarget.dataset.index;
		let tempArr = this.data.companyList;
		let currentItemIsCheck = tempArr[index].isCheck;
		tempArr.map((item,v) => {
			if(index == v){
			return item.isCheck = !currentItemIsCheck
			}
		})
		this.setData({
			companyList:tempArr
		})
	},
	allVisitEvent(){
		let tempArr = this.data.companyList;
		let comapnyIDs = [];
		let allVisitArr = tempArr.filter(item => {
			return item.isCheck == true
		})
		allVisitArr.forEach(item => {
			comapnyIDs.push(item.id)
		});
		util.setLocal('comapnyIDs',comapnyIDs.join(','));
		// this.sendMailboxes(comapnyIDs.join(','))
		let companyInfo = util.getLocal("card");
		companyInfo.companyId = this.data.currentCompanyID;
        companyInfo.nameCompany = this.data.sendUserCompany;
		let tempString = JSON.stringify(companyInfo);
		wx.navigateTo({
			url:'/pages/email/outDemandCard/outDemandCard?from=200&companyInfo=' + encodeURIComponent(tempString)
		})
	},
	sendMailboxes(companyIds){
		let url = 'api/company/mailboxes';
		let data = {
			content:this.data.content,
			sendUserName:this.data.sendUserName,
			sendUserPosition:this.data.sendUserPosition,
			sendUserCompany:this.data.sendUserCompany,
			companyIds:companyIds,
			requirementType:'deliver'
		}
		wxRequest.req(url,data,'post').then(res => {
			if(res.code == 0){
				wx.showToast({
					title:'发送成功',
					icon:'none',
					duration:2000
				});
				setTimeout(() => {
					wx.reLaunch({
						url:'/pages/home/email/email'
					})
				}, 1800);
			}else{
				wx.showToast({
					title:'发送失败',
					icon:'none',
					duration:2000
				});
			}
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