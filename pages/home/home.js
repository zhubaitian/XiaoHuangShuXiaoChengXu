// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId: 1,
    sliderOffset:0,
    isCollapse: true,
    hideSlider: false,
    keywords: [
      {
        id: 1,
        name: '推荐',
      },
      {
        id: 2,
        name: '男人',
      },
      {
        id: 3,
        name: '居家',
      },
      {
        id: 4,
        name: '时尚',
      },
      {
        id: 5,
        name: '美食',
      },
      {
        id: 6,
        name: '旅行',
      },
      {
        id: 7,
        name: '运动',
      },
      {
        id: 8,
        name: '护肤',
      },
      {
        id: 9,
        name: '母婴',
      },
      {
        id: 10,
        name: '女人',
      },
      {
        id: 11,
        name: '宠物',
      },
      {
        id: 12,
        name: '国防',
      },
      {
        id: 13,
        name: '宠物',
      },
      {
        id: 14,
        name: '台湾',
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  scrollEventHandler: (e) => {
    console.log('scroll event:',e);
  },

  tabClick: function(e) {
    this.setData({
      activeId: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft,
      hideSlider: false,
    });
  },

  onCameraTap: function(e) {
    console.log('onCameraTap:', e);
  },

  bindSearchInput: function(e) {
    console.log('input with value:',e.detail.value);
  },

  search: function(e) {
    console.log('confirm with value:',e.detail.value);
  },

  filterTap: function(e) {
    let self = this;
    if (self.data.isCollapse === true) {
      self.setData({
        isCollapse: false,
      });
    }else {
      self.setData({
        isCollapse: true,
      });
    }
  },

  filter: function(e) {
    this.setData({
      activeId: e.currentTarget.dataset.id,
      isCollapse: true,
      hideSlider: true,
    });
  }
})