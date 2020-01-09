<template>
  <div class="map_box">
    <div
      class="map"
      id="map"
    >
    </div>
    <div class="tuceng">
      <button @click="addWeixin">卫星图</button>
      <button @click="deleteWeixin">夜景图</button>
      <button @click="ceju">测距</button>
      <button @click="biaodian">标点</button>
      <button @click="closebiaodian">删除鼠标工具</button>
      <button
        id="setFitView"
        @click="changeCenter"
      >自适应中心点</button>
    </div>
    <div
      class="right"
      :class="{shengji_animation_show : animation,shengji_animation_showC : animationC}"
    >
      右侧菜单展示栏
      
        <ul>
          <li v-for="(item,index) in dataList" :key="index" @click="clickRightDian(item.location)">{{item.name}}</li>
        </ul>

      <button class="shouqi" @click="shou">收起</button>
    </div>
    <!-- <eChartsChild :id="'bargraph'" :data="option2" style="height:350px;"></eChartsChild> -->
  </div>
</template>

<script>

import AMap from "AMap"
import eChartsChild from '@/components/echartsChild.vue'
var infoWindow
var map
var ruler
var mouseTool
var gaoliangdian
var dingshiqi
export default {
  components: {
    eChartsChild
  },
  data() {
    return {
      animation: false,
      animationC:false,
      id: 'bargraph2',
      option2: {
        title: {
          text: '全年设备产量对比图',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['检品机1', '检品机2', '检品机3', '检品机4', '检品机5', '检品机6', '检品机7']
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          left: 'center',
          data: ['本年', '上年'],
          bottom: 0
        },
        grid: {
          left: '1%',
          right: '2%',
          bottom: '8%',
          containLabel: true
        },
        series: [
          {
            name: '本年',
            data: [1000, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: 30,
          },
          {
            name: '上年',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: 30,
          }]

      },
      dataList: [
        { location: "120.476636,31.672926", color: 2 , name:'点1'},
        { location: "120.471293,31.674497", color: 1 ,name:'点2'},
        { location: "120.474748,31.679098", color: 1 ,name:'点3'},
        { location: "120.479168,31.675976", color: 1 ,name:'点4'},
        { location: "120.480091,31.673839", color: 1 ,name:'点5'},
        { location: "120.475348,31.671264", color: 1 ,name:'点6'}
      ],
      satellite: null,
      lastDian: {
        lng: 0,
        lat: 0,
      }
    }
  },
  mounted() {
    this.MapInit()
  },
  methods: {
    // 初始化
    MapInit() {
      infoWindow = new AMap.InfoWindow({
        // isCustom: true,  //使用自定义窗体
        offset: new AMap.Pixel(0, -30)
      })
      let _this = this;
      map = new AMap.Map("map", {
        center: [120.47471, 31.675743],
        mapStyle: "amap://styles/darkblue", //设置地图的显示样式
        resizeEnable: true,
        //  layers: [new AMap.TileLayer.Satellite()],
        zoom: 16
      });

      map.plugin(["AMap.MouseTool"], function () {
        //在地图中添加MouseTool插件
        mouseTool = new AMap.MouseTool(map)

      });

      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.MapType',
        'AMap.Geolocation',
      ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar({ liteStyle: true }));

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // map.addControl(new AMap.Scale());

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        // map.addControl(new AMap.Geolocation());
      });

      // 根据color状态展示不同的图片
      const style = [
        {
          image: 'https://s2.ax1x.com/2020/01/03/lUZRZ4.png',
          // icon里面图片的大小
          imageSize: new AMap.Size(20, 20),
          // 图片的位移，相当背景定位
          imageOffset: new AMap.Pixel(0, 0)
        },
        {
          // icon大小
          size: new AMap.Size(20, 20),
          image: 'https://s2.ax1x.com/2020/01/06/lrWs5d.png',
          // icon里面图片的大小
          imageSize: new AMap.Size(20, 20),
          // 图片的位移，相当背景定位
          imageOffset: new AMap.Pixel(0, 0)
        }
      ];

      let locationData = []; //存放经纬度的数组
      let status = null;
      for (let i = 0; i < _this.dataList.length; i++) {
        let locationArr = _this.dataList[i].location.split(",");
        locationData.push({
          lnglat: locationArr,
          style: status // 对应的status相对应的样式 style
        });
      }

      let marker = new AMap.Marker({ content: " ", map: _this.map });

      var endIcon
      // 创建点
      for (var i = 0; i < this.dataList.length; i++) {

        // 判断需要展示的颜色类型
        if (this.dataList[i].color === 1) {
          endIcon = new AMap.Icon(style[0])
        } else if (this.dataList[i].color === 2) {
          endIcon = new AMap.Icon(style[1])
        }

        var markers = new AMap.Marker({
          position: this.dataList[i].location.split(","),
          map: map,
          icon: endIcon,
        });

        markers.content = '我是第' + (i + 1) + '个Marker的信息窗口';
        markers.on('mousemove', this.markerClick);
        markers.emit('mousemove', { target: marker });

        markers.on('click', this.markerAutoCenter);
        // markers.emit('click', { target: marker });
      }
      markers.setMap(map);
      // 高德地图自适应你想标记的点的显示区域
      map.setFitView();
    },
    // 点击地图覆盖物事件
    markerAutoCenter(e) {
      var center = map.getCenter(); //获取当前地图中心位置
      // 2.拿到本次经纬度
      let currentDian = e.target.B.position
      // console.log(center)
      // 1.判断上次有无点击点，上次没有点击的点的话，就不执行里面的操作，保存点就行，首先需要上次的点击点的经纬度
      if (this.lastDian.lng) {
        // console.log(e.target.B.position)
        // 3.计算两个点之间经纬度的差值
        let reslat = currentDian.lat - this.lastDian.lat
        let reslng = currentDian.lng - this.lastDian.lng
        // 4.当前中心点加差值
        let lat = center.lat + reslat
        let lng = center.lng + reslng
        // 5.重新设置中心点
        map.setCenter([lng, lat]);
      }
      // 6.保存本地点击的点，方便下次计算
      this.lastDian.lng = currentDian.lng
      this.lastDian.lat = currentDian.lat

      this.domChange()
    },
    clickRightDian(location){
     if(gaoliangdian){
        map.remove(gaoliangdian)
        clearTimeout(dingshiqi)
     }
      let newLocation = location.split(',')
      map.setCenter(newLocation);
      var position = new AMap.LngLat(...newLocation);
       // 点标记显示内容，HTML要素字符串
    var markerContent = '' +
        '<div class="custom-content-marker">' +
        '   <img src="https://s2.ax1x.com/2020/01/09/lRjD3j.png">' +
        '</div>';

     gaoliangdian = new AMap.Marker({
        position: position,
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -50)
    });

    // 将 markers 添加到地图
    map.add(gaoliangdian);
        // 清除 marker

   dingshiqi=  setTimeout(()=>{map.remove(gaoliangdian)},5000)

    },
    shou(){
      this.animation = false
      this.animationC = true
    },
    domChange() {
      this.animation = true
      this.animationC = false
      console.log(this.animation)
    },
    closebiaodian() {
      // false 参数的话不会清除覆盖物
      mouseTool.close(true)//关闭，并清除覆盖物

    },
    // 标点工具
    biaodian() {
      mouseTool.marker();
    },
    ceju() {
      mouseTool.rule();
    },
    addWeixin() {
      this.satellite = new AMap.TileLayer.Satellite({
        map: map,
      });
    },
    deleteWeixin() {
      if (this.satellite) {
        this.satellite.setMap(null);
      }
    },
    markerClick(e) {
      // console.log(e.target)
      var arr = [
        e.target.content,
        `<div><img src="https://dgss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-09-27/297f5edb1e984613083a2d3cc0c5bb36.png">`,
        `<div style="\"padding:0px" 0px="" 4px;\"=""><b>嘟嘟软件有限公司</b>`,
        `电话 : 010-888888888   邮编 : 666666`,
        `地址 :说的市望京阜阿诗丹顿大街方恒大会上肯德基6层</div></div>`,
        // <eChartsChild :id="'bargraph'" :data="${this.option2}" style="height:350px;"></eChartsChild>
      ]

      infoWindow.setContent(arr.join("<br>"));
      // infoWindow.setContent(div);
      infoWindow.open(map, e.target.getPosition());

    },
    changeCenter() {
      // 无参数传入的情况下 默认包括所有覆盖物的情况 map.setFitView();
      var newCenter = map.setFitView();
      // document.getElementById('centerCoord').innerHTML = '当前中心点坐标：' + newCenter.getCenter();
    }
  }
}
</script>

<style>
.map {
  width: 100%;
  height: 600px;
}
.amap-logo,
.amap-copyright {
  display: none !important;
}
.map_box {
  position: relative;
  overflow: hidden;
}
.tuceng {
  position: absolute;
  top: 0;
  left: 10%;
  display: flex;
}
#mydiv {
  background: #fff;
  width: 300px;
  height: 300px;
}
.right {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 9999;
  width: 300px;
  height: 100%;
  transform: translatex(300px);
  background-color: #fff;
  text-align: center;
}
ul li{
 margin: 2px;
  width: 100px;
  height: 20px;
  line-height: 20px;
  background: #ccc;
  list-style: none;
  cursor: pointer;
}
.shengji_animation_show {
  animation-duration: 1s;
  animation-name: fadeinB;
  transform: translatex(0px);
}
@keyframes fadeinB {
  0% {
    opacity: 0;
    transform: translatex(300px);
  }
  100% {
    opacity: 1;
    transform: translatex(0px);
  }
}

.shengji_animation_showC {
  animation-duration: 1s;
  animation-name: fadeinC;
  transform: translatex(300px);
}
@keyframes fadeinC {
  0% {
    opacity: 1;
    transform: translatex(0px);
  }
  100% {
    opacity: 0;
    transform: translatex(300px);
  }
}
.shouqi{
    position: absolute;
    top: 50%;
    left: 0;
}
  .custom-content-marker {
            position: relative;
            width: 25px;
            height: 34px;
        }

        .custom-content-marker img {
            width: 100%;
            height: 100%;
        }

</style>
