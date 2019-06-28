

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
    flag:true,
    dayInfos: [
                {"name": "17:00-18:00"},
               { "name": "18:00-19:00"}
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
    var openid = getApp().globalData.openid //获取用户信息
    console.log("openid" + openid)

    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    console.log(year+"-"+month+"-"+day)
    var date = year + "-" + month + "-" + day
    var dayInfos = [
      { "name": "17:00-18:00", "year": year, "month": month, "day": day, "date": date },
      { "name": "18:00-19:00", "year": year, "month": month, "day": day, "date": date  }
    ]
    var dayclass ="days-item-text-select";
    var flag= false;
    // 获取数据库信息
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
        date: date

    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    this.setData({

      dayInfos: dayInfos,
      flag:flag
     
    })
    console.log(day)
    this.updateDays(year, month, day)
  },
  book:function(e){
    var date = e.currentTarget.dataset.date
    var name = e.currentTarget.dataset.name
    const db = wx.cloud.database()
    var userInfo=getApp().globalData.userInfo //获取用户信息
    db.collection('counters').add({
      data: {
        count: 1,
        name: userInfo.nickName,
        classname: name,
        date:date
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })  
  },
  dateData: function () {
    var date = new Date();
    var days = [];
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    this.updateDays(year, mouth, day)


  },
  updateDays: function (year, mouth,day) {
    
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
     // console.log(day+"=="+index)
      if (day==index){
        days.push({ "value": index, "class": "days-item-text-select" })
      }else{
        days.push({ "value": index, "class": "days-item-text" })
      }
     
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