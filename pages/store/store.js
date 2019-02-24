const app = getApp();
const api = require('../../utils/request.js')
const urls = require('../../utils/urls.js')
// pages/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller: {},
    ratings: {},
    goods: {},
    goodsMap: [],
    typeMap: {
      0: {txt: '满减', class: 'mj'},
      1: {txt: '打折', class: 'dj'},
      2: {txt: '特价', class: 'tj'},
      3: {txt: '发票', class: 'fp'},
      4: {txt: '保障', class: 'bz'},
    },
    bigDisShow: false,
    showTab: 0,
    winHeight: 0,
    winWidth: 0,
    beforeOffX: 0,
    beforeOffY: 0,
    offsetX: 0,
    changeX: 0,
    isTouching: false,
    typeActive: 0,
    toView: 't0',
    isClick: false,
    showRatingType: 2,     // 0好评  1差评 2全部
    showHasContent: false,
    scrollView: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获得seller数据
    let that = this
    if (!app.globalData.seller.name) {
      api.request(urls.seller, function (res) {
        app.globalData.seller = res.data.data
        that.setData({
          seller: res.data.data
        })
      })
    } else {
      if (!this.data.seller.name) {
        this.setData({
          seller: app.globalData.seller
        })
      }
    }
    // 获得goods数据
    if (!app.globalData.goods.length) {
      api.request(urls.goods, function (res) {
        app.globalData.goods = res.data.data
        let goodsMap = [0]
        res.data.data.forEach((item) => {
          let scale = that.data.winWidth / 750
          let t = (60 + item.foods.length * 180) * scale + goodsMap[goodsMap.length - 1]
          goodsMap.push(t)
        })
        that.setData({
          goods: res.data.data,
          goodsMap: goodsMap
        })
      })
    } else {
      if (!this.data.seller.name) {
        let goodsMap = [0]
        res.data.data.forEach((item) => {
          let scale = that.data.winWidth / 750
          let t = (60 + item.foods.length * 180) * scale + goodsMap[goodsMap.length - 1]
          goodsMap.push(t)
        })
        this.setData({
          seller: app.globalData.seller,
          goodsMap: goodsMap
        })
      }
    }
    // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      }
    })
    this.setData({
      offsetX: - this.data.showTab * this.data.winWidth
    })
  },
  changeBigDisShow() {
    this.setData({
      bigDisShow: !this.data.bigDisShow
    })
  },
  setShowTab(tabIndex) {
    this.setData({
      showTab: tabIndex,
    })
    if(tabIndex == 2) {
      this.setData({
        scrollView: false
      })
    }
    // 切换tab到1 时再获取ratings数据
    if(tabIndex == 1&&!this.data.ratings.length) {
      if(!app.globalData.ratings.length) {
        api.request(urls.ratings, (res) => {
          let data = res.data.data
          data.map((item) => {
            item.rateTime = this.formatTime(item.rateTime)
          })
          app.globalData.ratings = data
          this.setData({
            ratings: data
          })
        })
      } else {
        if(!this.data.ratings.length) {
          this.setData({
            ratings: app.globalData.ratings
          })
        }
      }
    }
  },
  changeShowTab(e) {
    this.setShowTab(e.currentTarget.dataset.i)
    this.setData({
      offsetX: -e.currentTarget.dataset.i * this.data.winWidth
    })
  },
  tabTouchStart(e) {
    if(!e.changedTouches[0].pageX) { return }
    this.setData({
      beforeOffX: e.changedTouches[0].pageX,
      beforeOffY: e.changedTouches[0].pageY,
      isTouching: true
    })
  },
  tabTouchMove(e) {
    let changeX = e.changedTouches[0].pageX - this.data.beforeOffX
    let changeY = e.changedTouches[0].pageY - this.data.beforeOffY
    if(Math.abs(changeX)<Math.abs(changeY)) {
      return
    }
    let offsetX = -this.data.showTab * this.data.winWidth + changeX
    if (offsetX > 0) {
      offsetX = 0
    } else if (offsetX < - this.data.winWidth * 2) {
      offsetX = - this.data.winWidth * 2
    }
    this.setData({
      offsetX: offsetX,
      changeX: changeX
    })
  },
  tabTouchEnd(e) {
    let changeX = this.data.changeX
    if (changeX > 50) {
      let newIndex = this.data.showTab - 1 < 0?0:this.data.showTab - 1
      this.setShowTab(newIndex)
    } else if (changeX < -50) {
      let newIndex = this.data.showTab + 1 > 2?2:this.data.showTab + 1
      this.setShowTab(newIndex)
    }
    this.setData({
      offsetX: -this.data.showTab * this.data.winWidth,
      isTouching: false,
      changeX: 0
    })
  },
  changeFoodType(e) {
    if(this.data.typeActive == e.target.dataset.i) {
      return
    }
    this.setData({
      isClick: true,
      typeActive: e.target.dataset.i,
      toView: 't' + e.target.dataset.i
    })
  },
  foodScroll (e) {
    for (let i = 0; i < this.data.goodsMap.length; i++) {
      if (e.detail.scrollTop > this.data.goodsMap[i] && e.detail.scrollTop < this.data.goodsMap[i+1]) {
        if (i != this.data.typeActive) {
          let typeActive = i
          if (this.data.isClick) {
            this.setData({
              isClick: false
            })
            typeActive += 1
          }
          this.setData({
            typeActive: typeActive
          })
        }
        break;
      }
    }
  },
  add(e) {
    let i = e.detail.i
    let j = e.detail.j
    let goods = this.data.goods
    if(!goods[i].foods[j].count) {
      goods[i].foods[j].count = 1
    } else {
      goods[i].foods[j].count = goods[i].foods[j].count + 1
    }
    this.setData({
      goods:goods
    })
  },
  reduce(e) {
    let i = e.detail.i
    let j = e.detail.j
    let goods = this.data.goods
    if (!goods[i].foods[j].count) {
      return
    } else {
      goods[i].foods[j].count = goods[i].foods[j].count - 1
    }
    this.setData({
      goods:goods
    })
  },
  changeRatingType(e) {
    this.setData({
      showRatingType: parseInt(e.currentTarget.dataset.i)
    })
  },
  changeShowHasContent() {
    this.setData({
      showHasContent: !this.data.showHasContent
    })
  },
  // 时间处理
  formatTime(time) {
    let date = new Date(time)
    let template = 'yyyy-MM-dd'
    template = template.replace(/y+/g, date.getFullYear())
    let obj = {
      '(M+)': date.getMonth() + 1 + '',
      '(d+)': date.getDate() + '',
      '(h+)': date.getHours() + '',
      '(m+)': date.getMinutes() + '',
      '(s+)': date.getSeconds() + ''
    }
  
    for (let key in obj) {
      let reg = new RegExp(key)
      if (reg.test(template)) {
        let str = RegExp.$1.length === 1 ? obj[key] : this.returnDoubleDate(obj[key])
        template = template.replace(reg, str)
      }
    }
    return template
  },
  returnDoubleDate(time) {
    return ( '00' + time).substr(time.length)
  },
  offScrollView() {
    console.log('off')
    this.setData({
      scrollView: false
    })
  },
  onScrollView() {
    console.log('on')
    if(this.data.showTab == 2) {
      return
    }
    this.setData({
      scrollView: true
    })
  }
})