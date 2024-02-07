new Vue({
    el: "#app",
    delimiters: ["<%", "%>"],
    data() {
        return {
            flags: window.flags,
            boards : {},
            mode : 'std',
            mods : 'vn',
            sort : 'pp',
            country : 'all',
            load : false
        };
    },
    created() {
        this.LoadData(mode, mods, sort);
        this.LoadLeaderboard(sort, mode, mods);
    },
    methods: {
        LoadData(mode, mods, sort) {
            this.$set(this, 'mode', mode);
            this.$set(this, 'mods', mods);
            this.$set(this, 'sort', sort);
        },
        LoadLeaderboard(sort, mode, mods, action = 0) {
            if (window.event)
                window.event.preventDefault();

                if (sort === "score")
                    sort = "rscore";

                let offset = 0;
                let perPage = 50;
                if(action === 0) // first page
                {
                    last_page = page;
                    page = 0;
                }
                else // +1 or -1 page
                  page += action;
                offset = page * perPage;

                if (page !== 0 && action === -1) {
                    offset++;
                }

            this.$set(this, 'mode', mode);
            this.$set(this, 'mods', mods);
            this.$set(this, 'sort', sort);
            this.$set(this, 'load', true);
            let params = {
                mode: this.StrtoGulagInt(),
                sort: this.sort,
                limit: perPage,
                offset: offset
            };
            window.history.replaceState('', document.title, `/leaderboard?mode=${this.mode}&mods=${this.mods}&sort=${this.sort}&page=${page + 1}`);
            this.$axios.get(`${window.location.protocol}//api.${domain}/v1/get_leaderboard`, { params: params })
            .then(res => {
                if (res.data.leaderboard.length !== 51 && offset !== 0) {
                    last_page = page + 1;
                }
                this.boards = res.data.leaderboard;
                this.$set(this, 'load', false);
            });
        },
        scoreFormat(score) {
            var addCommas = this.addCommas;
            if (score > 1000 * 1000) {
                if (score > 1000 * 1000 * 1000)
                    return `${addCommas((score / 1000000000).toFixed(2))} billion`;
                return `${addCommas((score / 1000000).toFixed(2))} million`;
            }
            return addCommas(score);
        },
        addCommas(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        StrtoGulagInt() {
            switch (this.mode + "|" + this.mods) {
                case 'std|vn': return 0;
                case 'taiko|vn': return 1;
                case 'catch|vn': return 2;
                case 'mania|vn': return 3;
                case 'std|rx': return 4;
                case 'taiko|rx': return 5;
                case 'catch|rx': return 6;
                case 'std|ap': return 8;
                default: return -1;
            }
        },
    },
    computed: {}
});
