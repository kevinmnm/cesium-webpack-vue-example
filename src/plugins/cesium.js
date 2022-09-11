import Vue from 'vue';
import * as Cesium from 'cesium';
import CesiumComponent from '../components/CesiumComponent.vue';
// import 'cesium/Build/Cesium/Widgets/widgets.css'; 
// require('cesium/Widgets/widgets.css');
import 'cesium/Widgets/widgets.css';

const CesiumPlugin = {
   install: function (Vue, options) {
      const accessToken = options.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYTQ2MmRmYy1iMmU2LTQwMzQtYjJiZi02NGY3ZTIyYzNhMDQiLCJpZCI6NzM2NTMsImlhdCI6MTYzNzA5MDk3N30.fCOrQKIlHEatEZk63libsMkWdxOBsKRo297ibGtRVgs';
      // const accessToken = '';
      options;

      Vue.component('cesium-component', CesiumComponent);

      Vue.mixin({
         beforeCreate() {
            Cesium.Ion.defaultAccessToken = accessToken;
            this.$cesium = Cesium;
         },
      });
   }
}

Vue.use(CesiumPlugin, {});

export default CesiumPlugin;