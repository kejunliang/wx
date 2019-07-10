

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
      { "name": "17:00-18:00", "count": 0,"id":"0001"},
      { "name": "18:00-19:00", "count": 0,"id":"0002"}
              ],
    total:25,
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
    
    var openid = getApp().globalData.openid //获取用户信息
    console.log("openid" + openid)
    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    console.log(year+"-"+month+"-"+day)
    var date = year + "-" + month + "-" + day
    var dayclass = "days-item-text-select";
    this.updateDays(year, month, day)
    this.getBookAll(date)
   
   
  },
  getBookAll:function(date){
    // 调用云函数
    var flag = false;
    var openid =getApp().globalData.openid //获取用户信息
    console.log({
      date: date,
      openid: openid,
      type: "dateandopenid"
    })
    wx.cloud.callFunction({
      name: 'getdata',
      data: {
        date:date,
        openid: openid,
        type:"dateandopenid"
      },
      success: res => {
        
        console.log('[云函数] [getdata] 所有结果: ', res.result)
        var resData = res.result.data
        var dayInfos = [
          { "name": "17:00-18:00", "date": date, "count": 0, "id": "0001" },
          { "name": "18:00-19:00", "date": date, "count": 0, "id": "0002" }
        ]
        // 根据日期返回的数据，用课程id去返回数据查找，找到了就增加数量显示
        dayInfos.forEach(function (obj) {
          console.log(obj)
          console.log(resData)
          var count = 0;
          resData.forEach(function (resObj) {
            if (resObj.classid == obj.id) {

              count = count + 1
            }
          })
          obj.count = count  //将所有的数据返回给原来的对象
        })
        console.log(dayInfos)
        console.log('[数据库] [查询记录] 成功: ', res);
        // console.log(day)
        this.setData({
          queryResult: resData,
          dayInfos: dayInfos,
          flag: flag
        })
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
       
      }
    })
  },
   book:function(e){
     var openid = getApp().globalData.openid
    var date = e.currentTarget.dataset.date
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    var userInfo=getApp().globalData.userInfo //获取用户信息
    db.collection('counters').add({
      data: {
        count: 1,
        name: userInfo.nickName,
        classname: name,
        date:date,
        classid:id,
        dateAndopenid: date + openid
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '预约成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        //预约成功后查询数据库
        this.getBookAll(date) 
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
    this.getBookAll(year+"-"+mouth+"-"+day) //根据默认日期获取列表数据

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
      console.log(day+"=="+index)
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
    //console.log(days)
  
    this.setData({
      days: days,
      year: year,
      mouth: mouth,
     
    })
   
  }
})