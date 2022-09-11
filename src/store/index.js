import Vue from 'vue'
import Vuex from 'vuex'
import * as Cesium from 'cesium';

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      viewer: null,
      my_locations: {},
      mouse_position: {
         x: null,
         y: null,
      },
      mouse_coords: {
         lat: null,
         lon: null,
         alt: null,
      },
      control_mode: 'none',
   },
   mutations: {
      VIEWER(state, payload) {
         state.viewer = payload;
      },
      MOUSE_POSITION(state, payload) {
         const { x, y } = payload;
         state.mouse_position = {
            x, y,
         };
      },
      MOUSE_COORDS(state, payload) {
         const { lat, lon, alt } = payload;
         state.mouse_coords = {
            lat, lon, alt,
         };
      },
      MY_LOCATIONS(state, payload) {
         state.my_locations = {
            ...state.my_locations,
            ...payload,
         }
      },
      CONTROL_MODE(state, payload) {
         state.control_mode = payload;
      },
   },
   actions: {
      async flyTo({ state }, payload) {
         const viewer = state.viewer;
         const latitude = payload?.latitude || payload?.lat || state.my_locations.longitude;
         const longitude = payload?.longitude || payload?.lon || state.my_locations.latitude;

         const destination = Cesium.Cartesian3.fromDegrees(latitude, longitude, 3500000, viewer.scene.globe.ellipsoid);

         state.viewer.camera.flyTo({
            destination,
         });
      },
   },
   modules: {
   }
})
