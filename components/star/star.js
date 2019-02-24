// components/star/star.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score: {
      type: Number,
      observer(newVal, oldVal) {
        if (newVal) {
          let score = parseInt(newVal * 2) / 2
          let on = parseInt(score)
          let half = Math.ceil(score % 1)
          let off = 5 - on - half
          let result = []
          let that = this
          // 获取当前是几倍屏
          wx.getSystemInfo({
            success(res) {
              let pixelRatio = res.pixelRatio
              if (pixelRatio != 2 && pixelRatio != 3) {
                pixelRatio = 3
              }
              for (let i = 0; i < on; i++) {
                result.push(`on${pixelRatio}`)
              }
              for (let i = 0; i < half; i++) {
                result.push(`half${pixelRatio}`)
              }
              for (let i = 0; i < off; i++) {
                result.push(`off${pixelRatio}`)
              }
              that.setData({
                starClass: result
              })
            }
          })
          
        }
      }
    }
  },
  lifetimes: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    starClass: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
