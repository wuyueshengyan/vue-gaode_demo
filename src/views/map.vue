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
    </div>
  </div>
</template>

<script>

import AMap from "AMap"
var infoWindow
export default {
  data() {
    return {
      dataList: [
        { location: "120.476636,31.672926", color: 2 },
        { location: "120.471293,31.674497", color: 1 },
        { location: "120.474748,31.679098", color: 1 },
        { location: "120.479168,31.675976", color: 1 },
        { location: "120.480091,31.673839", color: 1 },
        { location: "120.475348,31.671264", color: 1 }
      ],
      satellite: null,
      map: null
    }
  },
  mounted() {
    this.MapInit()
  },
  methods: {
    // 初始化
    MapInit() {
      let _this = this;
      this.map = new AMap.Map("map", {
        center: [120.47471, 31.675743],
        mapStyle: "amap://styles/darkblue", //设置地图的显示样式
        resizeEnable: true,
        //  layers: [new AMap.TileLayer.Satellite()],
        zoom: 16
      });

      AMap.plugin([
        'AMap.ToolBar',
      ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        this.map.addControl(new AMap.ToolBar({
          // 简易缩放模式，默认为 false
          liteStyle: true
        }));
      })

      // 根据color状态展示不同的图片
      const style = [
        {
          // 1
          url: "https://s2.ax1x.com/2020/01/03/lUZRZ4.png",
          anchor: new AMap.Pixel(5, 5),   // 位移
          size: new AMap.Size(20, 20) // 图片大小
        },
        {
          // 2
          url: "https://s2.ax1x.com/2020/01/03/lUguIU.png",
          anchor: new AMap.Pixel(5, 5),
          size: new AMap.Size(20, 20)
        },
        {
          // 3
          url: "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3381573685,1866477444&fm=26&gp=0.jpg",
          anchor: new AMap.Pixel(5, 5),
          size: new AMap.Size(10, 10)
        }
      ];

      let locationData = []; //存放经纬度的数组
      let status = null;
      for (let i = 0; i < _this.dataList.length; i++) {
        let locationArr = _this.dataList[i].location.split(",");
        // 判断需要展示的颜色类型
        if (_this.dataList[i].color === 1) {
          status = 0; //根据下标来相对应样式 例如：绿色对应style数组中的第0个样式
        } else if (_this.dataList[i].color === 2) {
          status = 1;
        } else if (_this.dataList[i].color === 3) {
          status = 2;
        }

        locationData.push({
          lnglat: locationArr,
          style: status // 对应的status相对应的样式 style
        });
      }
      console.log(locationData)

      // 点放置
      let mass = new AMap.MassMarks(locationData, {
        opacity: 0.8,
        zIndex: 111,
        cursor: "pointer",
        style: style
      });

      let marker = new AMap.Marker({ content: " ", map: _this.map });

      infoWindow = new AMap.InfoWindow({
        infoTitle: '<strong style="font-size: 15px">' + 1 + '</strong>',
        infoBody: ['<div class="guideWrapper" style="display: flex; justify-content: space-between;">',
          '<div style="font-size: 14px">' + 22 + '</div>&nbsp;',
          '<div><i class="icon iconfont icon-daohang"/></div>',
          '</div>'].join(''),
        // 基点指向marker的头部位置（信息窗体的具体位置）
        offset: new AMap.Pixel(0, -31)
      })

      var lnglats = [
        [120.476636, 31.672926],
        [120.471293, 31.674497],
        [120.474748, 31.679098],
        [120.479168, 31.675976],
        [120.480091, 31.673839],
        [120.475348, 31.671264],
      ];

      for (var i = 0; i < lnglats.length; i++) {
        var ss = new AMap.Marker({
          position: lnglats[i],
          map: this.map
        });
        ss.content = '我是第' + (i + 1) + '个Marker';
        ss.on('click', this.markerClick);
        ss.emit('click', { target: marker });
      }

      mass.on("click", function (e) {
        console.log(e.data.lnglat)
        marker.setPosition(e.data.lnglat); //用户相对应的经纬度
        marker.setLabel({ content: e.data.name }); //用户相对应的名字

        const lng = e.data.lnglat.lng
        const lat = e.data.lnglat.lat

        var position = new AMap.LngLat(lng, lat);

        console.log(infoWindow)

        infoWindow.open(this.map, position);
        console.log(11)
      });

      mass.setMap(this.map);


      //   console.log( this.satellite)
    },
    addWeixin() {
      this.satellite = new AMap.TileLayer.Satellite({
        map: this.map,
      });
    },
    deleteWeixin() {
      if (this.satellite) {
        this.satellite.setMap(null);
      }
    },
    markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(this.map, e.target.getPosition());
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
  display: flex;
}
</style>
