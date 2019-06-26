

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    year: 0,
    mouth: 0,
    dayInfos: [
                {"name": "课程1"},
                { "name": "课程2"}
              ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dateData();
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
  //用户点击减少月份
  minusMouth: function () {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth--
    if (mouth < 1) {
      mouth = 12
      year--
    }
    this.updateDays(year, mouth)
  },
  //用户点击增加月份
  plusMouth: function () {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth++
    if (mouth > 12) {
      mouth = 1
      year++
    }
    this.updateDays(year, mouth)
  },
  getdayinfo:function(e){
    console.log("点击当天事件")
   
    console.log(e)
    
    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    console.log(year+"-"+month+"-"+day)
    var dayInfos = [
      { "name": "课程1" },
      { "name": "课程2" }
    ]
    this.setData({
      dayInfos: dayInfos
    })
  },
  book:function(e){
      
  },
  dateData: function () {
    var date = new Date();
    var days = [];
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    this.updateDays(year, mouth)


  },
  updateDays: function (year, mouth) {
    var days = [];
    var dateDay, dateWeek;
    // 根据日期获取每个月有多少天
    var getDateDay = function (year, mouth) {
      return new Date(year, mouth, 0).getDate();
    }
    //根据日期获取这天是周几
    var getDateWeek = function (year, mouth) {

      return new Date(year, mouth - 1, 1).getDay();
    }

    dateDay = getDateDay(year, mouth)
    dateWeek = getDateWeek(year, mouth)

    console.log(dateDay);
    console.log(dateWeek);
    //向数组中添加天
    for (let index = 1; index <= dateDay; index++) {
      days.push(index)
    }
    //向数组中添加，一号之前应该空出的空格
    for (let index = 1; index <= dateWeek; index++) {
      days.unshift(0)
    }
    console.log(days)
  
    this.setData({
      days: days,
      year: year,
      mouth: mouth,
     
    })
   
  }
})