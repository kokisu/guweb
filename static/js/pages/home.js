new Vue({
    el: "#home-app",
    delimiters: ["<%", "%>"],
    data() {
        return {
            online_users: 0,
            registered_users: 0
        }
    },
    created() {
        this.GetOnlineUsers()
    },
    methods: {
        GetOnlineUsers() {
            var vm = this;
            vm.$axios.get(`${window.location.protocol}//api.${domain}/v1/get_player_count`)
                .then(function (response) {
                    vm.online_users = response.data.counts.online;
                    vm.registered_users = response.data.counts.total;
                });
        }
    },
    computed: {
    }
});
