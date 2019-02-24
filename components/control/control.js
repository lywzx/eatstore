// components/control/control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    food: {
      type: Object
    },
    i: {
      type: Number
    },
    j: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    add() {
      this.triggerEvent("addEvent", {i: this.properties.i, j: this.properties.j})
    },
    reduce() {
      this.triggerEvent("reduceEvent", {i: this.properties.i, j: this.properties.j})
    }
  }
})
