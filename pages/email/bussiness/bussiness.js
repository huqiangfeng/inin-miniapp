// pages/email/bussiness/bussiness.js
const wxRequest = require('../../../utils/route')
const util = require('../../../utils/util')
const app = getApp()

Page({

  	/**
   	* 页面的初始数据
   */
	data: {
		overlayShow:false,
		currentSendIndex:0,
		searchvalue:'',
		location:'',
		pageLat:'',
		pageLng:'',
		firstNavTitle:"地址",
		secendNavTitle:"业务",
		threeNavTitle:"行业",
		fourNavTitle:"距离",
		currentLocationAreaIndex:0,
		currentLoaction:'',
		provinceList:[],
		contentList:[],
		cityList:[{shortName:"北京市",id:110100,name:'北京市'}],
		bussinessList:[{content: "不限",id: 20200430}],
		industriesList:[{
			id: 20200431,
			name: "不限"
		}],
		currentBussinessActiveIndex:0,
		currentBussinessActiveName:'',
		currentBussinessActiveNameTemp:'',
		currentInstryActiveIndex:0,
		currentInstryActiveName:'',
		currentInstryActiveNameTemp:'',
		currentProvinceActiveIndex:0,
		currentCityActiveIndex:-1,//选择的城市
		currentDistanceIndex:0,
		choseDistance:'',
		currenSearchVal:"",
		chonseCityName:'',//选择的城市名
		choseProvinceName:'',//选择的省份名称
		areaParentId:'100000',//国内默认是十万，国外 0
		defaultStart:1,
		distanceList:[
			{
				val:'不限',
				id:0
			},
			{
				val:'小于等于5KM',
				id:5
			}
		],
		isCurrentLocationCity:true,//是否在当前的定位城市
		currentLocationCityName:'',//当前用户所在的定位城市 -- 默认值，初始化之后不会改变
		currentLocationCityLat:'',//当前用户定位的坐标，初始化之后不会改变，除非重新定位
		currentLocationCityLng:'',//当前用户定位的坐标，初始化之后不会改变，除非重新定位
		currentlySelectedCityName:"",//当前用户选择的城市 -- 默认值和当前定位城市一样，直到用户手动切换城市
		locationSuccess:true,//定位成功标志，默认成功
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(app.globalData.locationAuth){
			this.setData({
				pageLat:app.globalData.currentLat,
				pageLng:app.globalData.currentLng,
				currentLocationCityLat:app.globalData.currentLat,
				currentLocationCityLng:app.globalData.currentLng,
				isCurrentLocationCity:true,
				locationSuccess:true
			})
			this.resetLocation();
		}else{
			this.setData({
				isCurrentLocationCity:false,
				pageLat:'',
				pageLng:'',
				currentLocationCityLat:'',
				currentLocationCityLng:'',
				currentLocationCityName:'',
				currentlySelectedCityName:'',
				locationSuccess:false
			})
			this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)

		}
		this.getProvinceList(this.data.areaParentId).then(res => {
			this.setData({
				provinceList:res
			})
		});
		this.getBussinessList();
		this.getIndustryList()

		
	},
	// 重新定位
	resetLocation(){
		let _that = this;
		wx.showLoading({
			title: '正在获取定位信息',
		})
		if(this.data.locationSuccess){
			wx.getLocation({ 
				type: 'wgs84',
				success (res) {
					app.globalData.currentLat =  res.latitude
					app.globalData.currentLng = res.longitude
					app.globalData.locationAuth = true
					wx.hideLoading()
					_that.setData({
						locationSuccess:true,
						pageLat:res.latitude,
						pageLng:res.longitude,
						currentLocationCityLat:res.latitude,
						currentLocationCityLng:res.longitude,
					})
					_that.getCityInfo(res.latitude,res.longitude);
				},
				fail(){
					app.globalData.currentLat =  ''
					app.globalData.currentLng = ''
					app.globalData.locationAuth = false
					_that.setData({
						locationSuccess:false,
						pageLat:'',
						pageLng:"",
						currentLocationCityLat:'',
						currentLocationCityLng:'',
					})
					wx.hideLoading()
				}
			})
		}else{	
			wx.showToast({
				title:"请打开定位权限",
				icon:"none",
				duration:1000
			})
		}
		
	},
	// 根据经纬度获取城市名称
	getCityInfo(lat,lng){
		let latLng = lng + ',' +  lat
		wxRequest.req('public/city',{
			location:latLng
		},'get').then(res => {
			if(res.code == 0){
				this.setData({
					currentLocationCityName:res.data.cityName,
					currentlySelectedCityName:res.data.cityName,

					currentLoaction:res.data.cityName,
					chonseCityName:res.data.cityName,
					firstNavTitle:res.data.cityName
				})
				this.getCompanyList(this.data.currenSearchVal,res.data.cityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
			}else{
				wx.showToast({
					title:'获取位置信息失败',
					icon:'none',
					duration:1200
				})
			}
		})
	},
	getCompanyInfo(e){
		let index = e.currentTarget.dataset.index
		let data = this.data.contentList[index]
		util.setLocal('companyInfo', data)
		wx.navigateTo({
			url: "/pages/email/demandCompany/demandCompany"
		});
	},
	// 加载更多
	onReachBottom(){
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance,true)
	},
	// 搜索  要清空查询条件 行业 业务 距离 城市 经纬度
	startSearch(e){
		let searchVal = e.detail;
		this.setData({
			currenSearchVal:searchVal,
			defaultStart:1,
			choseDistance:'',
			currentBussinessActiveName:'',
			currentInstryActiveName:'',
			currentlySelectedCityName:'',
			pageLng:'',
			pageLat:'',
			firstNavTitle:'地址',
			fourNavTitle:"距离",
			currentBussinessActiveIndex:-1,
			currentInstryActiveIndex:-1

		})
		if(searchVal != ''){
			this.getCompanyList(this.data.currenSearchVal,'','','','')
		}
	},
	// 取消搜索
	cacelSearch(){
		this.setData({
			currenSearchVal:searchVal,
			defaultStart:1,
			choseDistance:'',
			currentBussinessActiveName:'',
			currentInstryActiveName:'',
			currentlySelectedCityName:'',
			pageLng:'',
			pageLat:'',
			firstNavTitle:'地址',
			fourNavTitle:"距离",
			currentBussinessActiveIndex:-1,
			currentInstryActiveIndex:-1
		})
		this.getCompanyList(this.data.currenSearchVal,'','','','')
	},
	// 发送 显示modal
	send(e){
		this.setData({ 
			overlayShow: true,
			currentSendIndex:e.currentTarget.dataset.index
		});
	},
	onClickHide() {
		this.setData({ overlayShow: false });
	},
	visitEvent(){
		let _that = this;
		let index = this.data.currentSendIndex;
		let companyItem = this.data.contentList[index];
		let companyName,companyID,logo ,userName;
		companyName =  companyItem.name;
		companyID = companyItem.id;
		userName = companyItem.rename;
		logo = companyItem.logoUrl;
		wx.navigateTo({
			url:'/pages/email/visitHome/visitHome?companyName=' + companyName + '&companyID=' + companyID + '&logo=' + logo + '&userName=' + userName,
			success(){
				_that.setData({ overlayShow: false });
			}
		})
		
	},
	cooperationEvent(){
		this.onIconSendEvent()
		this.setData({
		  overlayShow:false
		})
	},
	// 一键投递
	onIconSendEvent() {
		let index = this.data.currentSendIndex;
		let companyItem = this.data.contentList[index]
		if (companyItem.canSendRequirement) {
			let companyInfo = util.getLocal("card");
		// 判断有无公司信息
		  if (!companyInfo) {
			this.getCompanyId();
			wx.showToast({
			  title: "请稍后重试",
			  icon: "none",
			  duration: 2000
			});
		  } else {
			companyInfo.companyId = companyItem.id;
			companyInfo.nameCompany = companyItem.name;
			wxRequest.req("api/user/card/authed", {}, "post").then(res => {
			  if (res.code == 0) {
				if (res.data) {
				  let tempString = JSON.stringify(companyInfo);
				  wx.navigateTo({
					url: "/pages/email/outDemandCard/outDemandCard?companyInfo=" + encodeURIComponent(tempString)
				  });
				  
				  return;
				} else {
				  //未认证的情况下跳转认证页面
				  wx.navigateTo({
					url: "/pages/email/authentication/authentication?companyItem=" +
					  JSON.stringify(companyItem)
				  });
				}
			  } else {
				wx.showToast({
				  title: res.msg,
				  icon: 'none',
				  duration: 1500
				});
			  }
			});
		  }
		} else {
			wx.showToast({
				title: "24小时内不能重复投递",
				icon: "none",
				durtation: 2000
			});
		}
	  },
	// 选择距离
	choseDistance(e){
		let disVal = e.currentTarget.dataset.index;
		if(disVal == 0){
			this.setData({
				choseDistance:''
			})
		}else{
			this.setData({
				choseDistance:5000
			})
		}
		this.setData({
			currentDistanceIndex:disVal,
			defaultStart:1
		})
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
		this.selectComponent('#distance').toggle();

	},
	// 获取行业分类
	getIndustryList(){
		let data = {
			access_token:wx.getStorageSync('Login').inin.access_token
		}
		wxRequest.req('api/company/investment/search/industries',data,'get').then(res => {
			if(res.code == 0){
				let response = res.data;
				this.setData({industriesList:this.data.industriesList.concat(response)})
			}else{
				this.setData({industriesList:[]})
			}
		})
	},
	// 获取业务词
	getBussinessList(){
		let data = {
			access_token:wx.getStorageSync('Login').inin.access_token
		}
		wxRequest.req('api/company/investment/search/businessWord',data,'get').then(res => {
			if(res.code == 0){
				let response = res.data;
				this.setData({bussinessList:this.data.bussinessList.concat(response)})
			}else{
				this.setData({bussinessList:[]})
			}
		})
	},
	// 选择行业
	choseIinstry(e){
		this.setData({
			currentInstryActiveIndex:e.currentTarget.dataset.index,
			currentInstryActiveNameTemp:e.currentTarget.dataset.name
		})
	},
	// 确认行业
	confirmIndustry(){
		if(this.data.currentInstryActiveNameTemp == '不限'){
			this.setData({
				defaultStart:1,
				currentInstryActiveName:''
			})
		}else{
			this.setData({
				defaultStart:1,
				currentInstryActiveName:this.data.currentInstryActiveNameTemp
			})
		}
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
		this.selectComponent('#industry').toggle();
	},
	// 重置行业
	resetIndustry(){
		this.setData({
			currentInstryActiveIndex:-1,
			currentInstryActiveName:'',
			currentInstryActiveNameTemp:'',
			defaultStart:1
		})
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
		this.selectComponent('#industry').toggle();
	},
	// 选择业务
	choseBusiness(e){
		this.setData({
			currentBussinessActiveIndex:e.currentTarget.dataset.index,
			currentBussinessActiveNameTemp:e.currentTarget.dataset.name
		})
	},
	// 确定选择的业务
	confirmBusiness(e){
		if(this.data.currentBussinessActiveNameTemp == '不限'){
			this.setData({
				defaultStart:1,
				currentBussinessActiveName:''
			})
		}else{
			this.setData({
				defaultStart:1,
				currentBussinessActiveName:this.data.currentBussinessActiveNameTemp
			})
		}
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
		this.selectComponent('#business').toggle();
	},
	// 重置业务
	resetBusiness(){
		this.setData({
			currentBussinessActiveName:'',
			currentBussinessActiveNameTemp:'',
			currentBussinessActiveIndex:-1,
			defaultStart:1
		})
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)
		this.selectComponent('#business').toggle();
	},
	// 获取定位城市饿信息 判断是否有权限
	getLocationInfo(){
		console.log(this.data.locationSuccess,'this.data.locationSuccess');
		if(this.data.locationSuccess){
			let _currentLoaction = this.data.currentLocationCityName;
			this.setData({
				firstNavTitle:_currentLoaction,
				chonseCityName:_currentLoaction,
				currentlySelectedCityName:_currentLoaction,
				isCurrentLocationCity:true,
				pageLat:this.data.currentLocationCityLat,
				pageLng:this.data.currentLocationCityLng,
				distance:''
			})
			this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance);
			this.selectComponent('#dropdown').toggle();
		}else{
			wx.showToast({
				title:'请打开定位权限',
				icon: 'none',
  				duration: 1000
			})
		}
		

	},
	
	
	// 获取省份 地区列表
	getProvinceList(areaId){
		return new Promise((reslove,reject) => {
			wxRequest.req('area/' + areaId, {},'get').then(res => {
				if(res.code != 0){
					wx.showToast({
						title:'获取省份信息失败',
						icon:'none',
						duration:1500
					})
				}else{
					reslove(res.data)
				}
			})
		})
	},
	// 获取初始化的数据列表
	getCompanyList(companyName,cityName,businessWords,industries,distance,loadMore = false){
		if(loadMore){
			this.setData({
				defaultStart:this.data.defaultStart + 1
			})
		}else{
			this.setData({contentList:[]})
		}
		wx.showLoading({
			title:'获取数据中'
		})
		let url = 'api/company/search';
		let data = {
			type:'cooperation',//investment：投融资、cooperation：商务合作、companystar：企业明星
			keyword:companyName,//搜索企业名
			page:this.data.defaultStart,
			size:50,
			cityName:cityName,
			businessWords:businessWords,//业务类型
			industries:industries,//行业，多个逗号隔开
			lng:this.data.pageLng,
			lat:this.data.pageLat,
			distance:distance
		};
		wxRequest.req(url,data,'post').then(res => {
			if(res.code == 0){
				wx.hideLoading();
				let response = res.data;
				for (let index = 0; index < response.length; index++) {
					const element = response[index];
					element.simpleName  = element.name.substring(0,4);
					if(element.distance){
						if(element.distance > 1000){
							element.distanceKM = ((element.distance) / 1000).toFixed(2)
						}
					}
				}

				this.setData({
					contentList:this.data.contentList.concat(response)
				})
				
			}else{
				this.setData({
					contentList:[]
				})
			}
		})
	},
	//   切换地区
	switchLocation(e){
		let _value = e.currentTarget.dataset.val;
		this.setData({
			currentLocationAreaIndex:Number(e.currentTarget.dataset.index),
			areaParentId:_value,
			cityList:[],
			currentProvinceActiveIndex:0
		})
		this.getProvinceList(_value).then(res => {
			if(_value == 0){
				for (let index = 0; index < res.length; index++) {
					const element = res[index];
					if(element.id == 100000){
						var _tempArr = res.splice(index,1);
					}
				}
			}
			this.setData({
				provinceList:res
			})
		});
	},
	// 切换身份
	switchProvince(e){
		this.setData({
			currentProvinceActiveIndex:Number(e.currentTarget.dataset.index),
			currentCityActiveIndex:-1
		})
		this.getProvinceList(e.currentTarget.dataset.id).then(res => {
			this.setData({
				cityList:res
			})
		})
	},
	// 选择省份下面的城市  判断选择的城市 和 定位的城市时候相同
	choseCity(e){
		if(e.currentTarget.dataset.val == this.data.currentLocationCityName){
			this.setData({
				isCurrentLocationCity:true,
				currentCityActiveIndex:e.currentTarget.dataset.index,
				chonseCityName:e.currentTarget.dataset.val,
				firstNavTitle:e.currentTarget.dataset.val,
				currentlySelectedCityName:e.currentTarget.dataset.val,
				pageLat:this.data.currentLocationCityLat,
				pageLng:this.data.currentLocationCityLng,
				choseDistance:'',
				currentDistanceIndex:0,
				fourNavTitle:"距离"
			})
		}else{
			this.setData({
				isCurrentLocationCity:false,
				currentCityActiveIndex:e.currentTarget.dataset.index,
				chonseCityName:e.currentTarget.dataset.val,
				firstNavTitle:e.currentTarget.dataset.val,
				currentlySelectedCityName:e.currentTarget.dataset.val,
				pageLat:'',
				pageLng:'',
				choseDistance:'',
				currentDistanceIndex:0,
				fourNavTitle:"距离"

			})
		}
		this.selectComponent('#dropdown').toggle();
		this.getCompanyList(this.data.currenSearchVal,this.data.currentlySelectedCityName,this.data.currentBussinessActiveName,this.data.currentInstryActiveName,this.data.choseDistance)

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})