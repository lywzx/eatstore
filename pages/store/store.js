const app = getApp();
const api = require('../../utils/request.js')
const urls = require('../../utils/urls.js')
const query = wx.createSelectorQuery()
// pages/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seller: {},
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
    offsetX: 0,
    changeX: 0,
    isTouching: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获得seller数据
    let that = this
    if (!app.globalData.seller) {
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
    // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      }
    })
  },
  changeBigDisShow() {
    this.setData({
      bigDisShow: !this.data.bigDisShow
    })
  },
  changeShowTab(e) {
    this.setData({
      showTab: e.currentTarget.dataset.i,
      offsetX: -e.currentTarget.dataset.i * this.data.winWidth,
    })
  },
  tabTouchStart(e) {
    this.setData({
      beforeOffX: e.changedTouches[0].pageX,
      isTouching: true
    })
  },
  tabTouchMove(e) {
    let changeX = e.changedTouches[0].pageX - this.data.beforeOffX
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
    // console.log(touchChangeX)
    if (changeX > 50) {
      let newIndex = this.data.showTab - 1 < 0?0:this.data.showTab - 1
      this.setData({
        showTab: newIndex
      })
    } else if (changeX < -50) {
      let newIndex = this.data.showTab + 1 > 2?2:this.data.showTab + 1
      this.setData({
        showTab: newIndex
      })
    }
    this.setData({
      offsetX: -this.data.showTab * this.data.winWidth,
      isTouching: false
    })
  }
})