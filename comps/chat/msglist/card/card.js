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

    },
});