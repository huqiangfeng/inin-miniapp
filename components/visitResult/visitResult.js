// components/visitResult/visitResult.js
const wxRequest = require("../../utils/route")
const util = require("../../utils/util")

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		company: {
            type: Object,
        }
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		visitArray:[],
		readStatus:null,
		static:"按状态",
		show:false,
		staticArr:[
			{
				index:0,
				num:0,
				text:'全部状态',
			},
			{
				index:1,
				num:0,
				text:'状态为已读',
			},
			{
				index:2,
				num:0,
				text:'状态为未读',
			},
		],
		currentActiveStatic:0,
		currentActiveStaticNum:0
	},
	lifetimes:{
		ready(){
			this.getVisitList(null)
		},
		moved(){
			//console.log('moved')
		},
		detached(){
			//console.log('detached')
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		getVisitList(readStatus){
			// read-已读、unread-未读
			let url = 'api/company/' + this.data.company.id + '/mailboxes';
			let data = {
				requirementType:'visit',
				size:100
			}
			if(readStatus != null){
				data.readStatus = readStatus
			}
			wxRequest.req(url, data, "post").then(res => {
				if(res.code == 0){
					let response = res.data;
					for (let index = 0; index < response.length; index++) {
						const element = response[index];
						element.newTiem = util.getDate(element.createTime),
						element.logoUrl = wxRequest.imgUrl + element.sendUserAvatar,
						element.keyWordsArr = element.keywords == null ? ['暂无关键词'] : element.keywords.split(',')
					}
				
					this.setData({
						visitArray:response
					})
				}else{
					wx.showToast({
						title:'获取数据失败',
						icon:'none',
						duration:1000
					})
				}
			})
		},
		onClickHide() {
			this.setData({ show: false });
		},
		showStatic(){
			this.setData({ show: true });
		},
		switchStatic(e){
			let clickIndex = e.currentTarget.dataset.index;
			this.setData({
				currentActiveStatic:clickIndex
			})
			switch (Number(clickIndex)) {
				case 0:
					this.getVisitList(null)
					this.setData({
						static:'全部'
					})
					this.triggerEvent('myevent',0)
					break;
				case 1:
					this.getVisitList('read')
					this.setData({
						static:'已读'
					})
					this.triggerEvent('myevent',1)
					break;
				case 2:
					this.getVisitList('unread')
					this.setData({
						static:'未读'
					})
					this.triggerEvent('myevent',2)
					break;
			}
		},
		viewCard(e){
			let viewIndex = e.currentTarget.dataset.index;
			util.setLocal('visitList',this.data.visitArray)
			wx.navigateTo({
				url:'/pages/email/visitPersonInfo/visitPersonInfo?currentIndex=' + viewIndex
			})
		}
	}
})
