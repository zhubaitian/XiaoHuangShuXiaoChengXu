// pages/home/home.js
const mock = require('../../config/mock');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabId: 1,
    tabBottomSliderOffset:0,
    isDropDownMenuCollapse: true,
    hideTabBottomSlider: false,
    notes: [],
    imgWidth: 0,
    loading: false,
    keywords: mock.home.keywords,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgWidth = ww * 0.48 ;
        this.setData({
          imgWidth: imgWidth
        });
        this.loadNotes();
     }
    })
  },

  onTabBarScroll: (e) => {
    console.log('scroll event:',e);
  },

  onTabSelected: function(e) {
    this.setData({
      activeTabId: e.currentTarget.id,
      tabBottomSliderOffset: e.currentTarget.offsetLeft,
      hideTabBottomSlider: false,
    });
  },

  onCameraTap: function(e) {
    console.log('onCameraTap:', e);
  },

  onSearchInput: function(e) {
    console.log('input with value:',e.detail.value);
  },

  onSearch: function(e) {
    console.log('confirm with value:',e.detail.value);
  },

  onFilterButtonTap: function(e) {
    let self = this;
    if (self.data.isDropDownMenuCollapse === true) {
      self.setData({
        isDropDownMenuCollapse: false,
      });
    }else {
      self.setData({
        isDropDownMenuCollapse: true,
      });
    }
  },

  onTabInDropDownMenuSelected: function(e) {
    this.setData({
      activeTabId: e.currentTarget.dataset.id,
      isDropDownMenuCollapse: true,
      hideTabBottomSlider: true,
    });
  },

  onImageLoad: function (e) {
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    const notes = this.data.notes;
    for (let note of notes) {
      if (note.id == e.currentTarget.dataset.id) {
        note.imgHeight = imgHeight;
      }
    }
    this.setData({
      notes: notes
    });
  },

  loadNotes: function() {
    const notes = mock.home.notes;
    const newNotes = this.data.notes.concat(notes);
    this.setData({
      notes: newNotes
    });
  },

  onReachBottom: function(e) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    this.loadNotes();

    setTimeout( () =>{
      this.setData({
        loading: false,
      })
    }, 20000)
  },

  onPullDownRefresh: function() {
    console.log('Pull down');
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.loadNotes();

    setTimeout( () =>{
      wx.hideNavigationBarLoading(); //在标题栏中显示加载
      wx.stopPullDownRefresh();
    }, 2000)
  }
})