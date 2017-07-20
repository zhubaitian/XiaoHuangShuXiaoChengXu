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
    imgWidth: 0,
    loading: false,
    notes: [],
    keywords: mock.home.keywords,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48 ;

        this.setData({
          imgWidth: imgWidth
        });

        //加载首组图片
        this.loadNotes(true);
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
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度
    // let imgHeight = oImgH * 0.48;

    // console.log('this.data.notes:',this.data.notes);
    const notes = this.data.notes;
    for (let note of notes) {
      console.log('note:',note);
      console.log('e.currentTarget.dataset.id:',e);
      if (note.id == e.currentTarget.dataset.id) {
        console.log('imgHeight:', imgHeight);
        note.imgHeight = imgHeight;
      }
    }
    this.setData({
      notes: notes
    });
    // console.log('e:',e);
  },

  loadNotes: function(firstLoad) {
    console.log('Enter loadNotes');
    const notes = mock.home.notes;

    // let baseId = "img-" + (+new Date());

    for (let i = 0; i < notes.length; i++) {
      // notes[i].id = baseId + "-" + i;
      if (!firstLoad) {
        notes[i].title = 'test title';
      }
    }

    // console.log('notes:',notes);
    const newNotes = this.data.notes.concat(notes);
    // console.log('this.data.notes.concat[notes]:',this.data.notes);
    // console.log('newNotes:',newNotes);
    this.setData({
      notes: newNotes
    });
  },

  onReachBottom: function(e) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    this.loadNotes(false);

    setTimeout( () =>{
      this.setData({
        loading: false,
      })
    }, 2000)
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.loadNotes(false);

    setTimeout( () =>{
      wx.hideNavigationBarLoading(); //在标题栏中显示加载
      wx.stopPullDownRefresh();
    }, 2000)
  }
})