new Vue({
  el: "#app",
  delimiters: ["<%", "%>"],
  data() {
      return {
          flags: window.flags,
          boards : {},
          mapinfo : {},
          stats : {},
          diffs: {},
          bid : 0,
          setid : 0,
          mods : 'vn',
          mode : 'std',
          sort : 'pp',
          load : false,
      };
  },
  created() {
    this.$set(this, 'load', true);
    this.LoadData(bid, setid, mode, mods);
    this.LoadBeatmap(mode, mods, bid, 'diff');
  },
  methods: {
      LoadData(bid, setid, mode, mods) {
        this.$set(this, 'mode', mode);
        this.$set(this, 'mods', mods);
        this.$set(this, 'setid', setid);
        this.$set(this, 'bid', bid);
      },
      LoadBid(bid) {
          this.$set(this, 'bid', bid);
      },
      LoadBeatmap(mode, mods, bmapid, event) {
        if (window.event)
          window.event.preventDefault();
        this.$set(this, 'mode', mode);
        this.$set(this, 'mods', mods);
        this.$set(this, 'bid', bmapid);
        this.$set(this, 'load', true);
        if (event === "diff") {
          const getMapScores = this.$axios.get(`${window.location.protocol}//api.${domain}/v1/get_map_scores`, {
            params: {
              mode: this.StrtoGulagInt(),
              scope: 'best',
              id: bmapid,
            }
          });
          const getMapInfo = this.$axios.get(`${window.location.protocol}//api.${domain}/v1/get_map_info`, {
            params: {
              id: bmapid,
            }
          });
          Promise.all([getMapScores, getMapInfo])
            .then(([mapScoresRes, mapInfoRes]) => {
              this.boards = mapScoresRes.data.scores;
              this.mapinfo = mapInfoRes.data.map;
              window.history.replaceState('', document.title, `/b/${this.bid}?mode=${this.mode}&mods=${this.mods}`);
              this.$set(this, 'load', false);
            })
            .catch(error => {
              console.error(error);
            });
        }
        else {
          this.$axios.get(`${window.location.protocol}//api.${domain}/v1/get_map_scores`, {
            params: {
              mode: this.StrtoGulagInt(),
              scope: 'best',
              id: bmapid,
            }
          }).then(res => {
            this.boards = res.data.scores;
            window.history.replaceState('', document.title, `/b/${this.bid}?mode=${this.mode}&mods=${this.mods}`);
            this.$set(this, 'load', false);
          });
        }
      },
      getTimeAgo(dateString) {
          var currentDate = new Date(); // Current date
          var inputDate = new Date(dateString); // Input date
        
          // Calculate the difference in milliseconds between the current date and input date
          var timeDifference = currentDate.getTime() - inputDate.getTime();
        
          // Convert milliseconds to years and months
          var yearsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
          var monthsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
        
          // Determine whether to display years or months ago
          if (yearsAgo >= 1) {
            return yearsAgo + " year" + (yearsAgo > 1 ? "s" : "") + " ago";
          } else if (monthsAgo >= 1) {
            return monthsAgo + " month" + (monthsAgo > 1 ? "s" : "") + " ago";
          } else {
            return "Less than a month ago";
          }
        },          
        scoreFormat(score) {
          var addCommas = this.addCommas;
          if (score > 1000 * 1000) {
            if (score > 1000 * 1000 * 1000)
              return `${addCommas((score / 1000000000).toFixed(2))}B`;
            return `${addCommas((score / 1000000).toFixed(2))}M`;
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
      StrtoModeInt() {
        switch (this.mode) {
          case 'std':
            return 0;
          case 'taiko':
            return 1;
          case 'catch':
            return 2;
          case 'mania':
            return 3;
        }
      },
      InttoModeStr(nmode) {
        switch (nmode) {
          case 0:
            return 'std';
          case 1:
            this.$set(this, 'mods', `${this.mods === 'ap' ? `vn` : this.mods}`);
            return 'taiko';
          case 2:
            this.$set(this, 'mods', `${this.mods === 'ap' ? `vn` : this.mods}`);
            return 'catch';
          case 3:
            this.$set(this, 'mods', `${this.mods === 'ap' || this.mods === 'rx' ? `vn` : this.mods}`);
            return 'mania';
        }
      },
      secondsToDhm(seconds) {
          seconds = Number(seconds);
          var h = Math.floor(seconds % (3600*24) / 3600);
          var m = Math.floor(seconds % 3600 / 60);
          
          var sDisplay = seconds % 60 >= 10 ? seconds % 60 : "0" + seconds % 60;
          var hDisplay = h + ":";
          var mDisplay = m + ":";
          return h > 0 ? hDisplay : "" + mDisplay + sDisplay;
      },
      getScoreMods(m) {
          const mods = {
            NoFail: 1, Easy: 2, NoVideo: 4, Hidden: 8, HardRock: 16, SuddenDeath: 32, DoubleTime: 64,
            Relax: 128, HalfTime: 256, Nightcore: 512, Flashlight: 1024, Autoplay: 2048, SpunOut: 4096,
            Relax2: 8192, Perfect: 16384, Key4: 32768, Key5: 65536, Key6: 131072, Key7: 262144,
            Key8: 524288, keyMod: 1015808, FadeIn: 1048576, Random: 2097152, LastMod: 4194304,
            Key9: 16777216, Key10: 33554432, Key1: 67108864, Key3: 134217728, Key2: 268435456,
            SCOREV2: 536870912
          };
        
          const modLabels = {
            NoFail: 'NF', Easy: 'EZ', NoVideo: 'TD', Hidden: 'HD', HardRock: 'HR', SuddenDeath: 'SD',
            DoubleTime: 'DT', Relax: 'RX', HalfTime: 'HT', Nightcore: 'NC', Flashlight: 'FL',
            Autoplay: 'AP', SpunOut: 'SO', Relax2: 'AP', Perfect: 'PF', Key4: '4K', Key5: '5K',
            Key6: '6K', Key7: '7K', Key8: '8K', keyMod: '', FadeIn: 'FD', Random: 'RD', LastMod: 'CN',
            Key9: '9K', Key10: '10K', Key1: '1K', Key3: '3K', Key2: '2K', SCOREV2: 'V2'
          };
        
          let r = [];
        
          for (const [modName, modValue] of Object.entries(mods)) {
            if (m & modValue) {
              const modLabel = modLabels[modName];
              if (modLabel !== '') {
                r.push(modLabel);
              }
            }
          }
          
          let modText = r.join('').replace("RXNC", "NCRX").replace("APNC", "NCAP").replace("HDHRNC", "HDNCHR").replace("NFNC", "NCNF").replace("RX", "").replace("AP", "").replace("DTNC", "NC");
          return modText.length > 0 ? modText : "No Mod";
        }
  },
  computed: {
      getStatusIcon() {
        return function(status) {
          if (status === 2) {
            return "fas fa-angle-double-up";
          } else if (status === -1 || status === 0) {
            return "fas fa-question";
          } else if (status === 3 || status === 4) {
            return "fas fa-check";
          } else if (status === 5) {
            return "fas fa-heart";
          } else {
            return "fas fa-question";
          }
        };
      },
      getStatusIconStyle() {
        return function(status) {
          if (status === 2) {
            return { color: 'rgb(0, 128, 255)', fontSize: '22px', marginLeft: '17px', marginTop: '4px' };
          } else if (status === -1 || status === 0) {
            return { color: 'rgb(255, 255, 255)', fontSize: '22px', marginLeft: '20px', marginTop: '5.5px' };
          } else if (status === 3 || status === 4) {
            return { color: 'rgb(0, 204, 0)', fontSize: '22px', marginLeft: '20px', marginTop: '5.5px' };
          } else if (status === 5) {
            return { color: 'rgb(255, 105, 180)', fontSize: '22px', marginLeft: '15px', marginTop: '4px' };
          } else {
            return { color: 'rgb(255, 255, 255)', fontSize: '22px', marginLeft: '20px', marginTop: '5.5px' };
          }
        };
      },
      getStatusDpStyle() {
        return function(status) {
          if (status === 2) {
            return { margin: '-56px', marginLeft: '-28px' };
          } else if (status === -1 || status === 0) {
            return { margin: '-56px', marginLeft: '-45px' };
          } else if (status === 3 || status === 4) {
            return { margin: '-56px', marginLeft: '-45px' };
          } else if (status === 5) {
            return { margin: '-56px', marginLeft: '-28px' };
          } else {
            return { margin: '-56px', marginLeft: '-45px' };
          }
        };
      },
      getStatusTxt() {
        return function(status) {
            switch(status)
            {
              case -1:
              case 0:
                return "Graveyard";
              case 2:
                return "Ranked";
              case 3:
                return "Approved";
              case 4:
                return "Qualified";
              case 5:
                return "Loved";
            }
        };
      },
  },
});