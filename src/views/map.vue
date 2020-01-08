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
export default {
  components: {
    eChartsChild
  },
  data() {
    return {
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
        { location: "120.476636,31.672926", color: 2 },
        { location: "120.471293,31.674497", color: 1 },
        { location: "120.474748,31.679098", color: 1 },
        { location: "120.479168,31.675976", color: 1 },
        { location: "120.480091,31.673839", color: 1 },
        { location: "120.475348,31.671264", color: 1 }
      ],
      satellite: null,
      cejulist: [],
      diancejulist:[],
      wenzicejulist:[]
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

      // ruler = new AMap.RangingTool(map)

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
        map.addControl(new AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());


        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        map.addControl(new AMap.Geolocation());
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
      // console.log(locationData)

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
      }
      markers.setMap(map);
      // 高德地图自适应你想标记的点的显示区域
      map.setFitView();
    },
    closebiaodian() {
      // false 参数的话不会清除覆盖物
      mouseTool.close(true)//关闭，并清除覆盖物

    },
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
</style>
