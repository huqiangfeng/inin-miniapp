Component({
    properties: {
        cardInfo: {
            type: Object,
            val: {}
        }
    },
    data: {
        // cardInfo: {}
    },
    methods: {
        // 点击添加好友 friend,applying,null
        addFriend(e) {
            this.triggerEvent("addFriend");
        },
        // 跳用户信息
        to_userInfo(e) {
            let userId = e.currentTarget.dataset.id
            wx.navigateTo({
                url: "/pages/im/userInfo/userInfo?userId=" + userId
            });
        },

    },
});