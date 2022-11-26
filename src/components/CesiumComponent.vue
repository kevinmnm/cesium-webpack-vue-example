<template>
   <v-sheet
      ref="cesium_component"
      width="100%"
      :height="cesium_height"
      outlined
   >
      <div
         id="cesium_container"
         ref="cesium_container"
         :style="{
            height: cesium_height,
            border: '2px solid yellow',
            position: 'relative',
         }"
      >
         <!-- <v-card class="region-name" :style="{
            width: '50px',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            'z-index': 10,
            'font-size': '20px',
            'background-color': 'red',
         }">REGION</v-card> -->
         <v-card
            :style="{
               position: 'absolute',
               'z-index': 1,
               left: '50%',
               bottom: 0,
               background: 'red',
               'margin-bottom': '10px',
               'user-select': 'none',
            }"
         >
            <v-card
               :style="{
                  position: 'relative',
                  left: '-50%',
                  background: 'blue',
                  'font-size': '30px',
               }"
               >REGION</v-card
            >
         </v-card>
      </div>
   </v-sheet>
</template>

<script>
import logo from "@/assets/logo.png";
// import airplane from "@/assets/glb/Cesium_Air.glb";
// console.log(airplane);
// import * as ischecker from 'is-checker';
// ischecker

export default {
   name: "CesiumComponent",

   data: () => ({
      iframe: null,
      myLocations: {},
   }),

   computed: {
      my_locations: {
         get() {
            return this.$store.state.my_locations;
         },
         set(value) {
            this.$store.commit("MY_LOCATIONS", value);
         },
      },
      cesium_height() {
         const windowHeight = window.innerHeight;
         if (!windowHeight) return "100%";
         return `calc(${windowHeight}px - 50px)`;
      },
      mouse_coords() {
         return this.$store.state.mouse_coords;
      },
      viewer: {
         get() {
            return this.$store.state.viewer;
         },
         set(viewer) {
            this.$store.commit("VIEWER", viewer);
         },
      },
   },

   methods: {
      async detectMyLocation() {
         return new Promise((resolve, reject) => {
            const geo = window.navigator?.geolocation;
            // const Cesium = this.$cesium;
            if (!geo) reject(false);

            geo.getCurrentPosition(
               (positions) => {
                  const coords = positions.coords;
                  this.myLocations = {
                     longitude: coords.longitude,
                     latitude: coords.latitude,
                     altitude: coords.altitude,
                  };

                  console.log({ positions });

                  // const longitudeDegree = Cesium.Math.toDegrees(coords.longitude);
                  // const latitudeDegree = Cesium.Math.toDegrees(coords.latitude);
                  // const altitudeDegree = Cesium.Math.toDegrees(coords.altitude);

                  this.my_locations = {
                     longitude: coords.longitude,
                     latitude: coords.latitude,
                     altitude: coords.altitude,
                     // longitude: longitudeDegree,
                     // latitude: latitudeDegree,
                     // altitude: altitudeDegree,
                  };

                  resolve(positions);
               },
               (error) => {
                  if (error) console.error(error);
               },
               {
                  enableHighAccuracy: true,
               }
            );
         });
      },
      // goToMyLocation() {
      //    const geo = window.navigator?.geolocation;
      //    if (!geo) return;

      //    const { longitude, latitude, height } = this.myLocations;

      //    this.viewer.camera.flyTo({
      //       // destination: this.$cesium.Cartesian3.fromDegrees(
      //       //    longitude,
      //       //    latitude,
      //       //    height
      //       // ),
      //    });
      // },
      addPointEntity(entity) {
         if (!entity) return;
         const viewer = this.viewer;
         viewer.entities.add(entity);
      },
      createDescription(description) {
         const { latitude, longitude, altitude } = description;
         return `
            <v-sheet>
               <div>Longitude: ${longitude}</div>
               <div>Latitude: ${latitude}</div>
               <div>Altitude: ${altitude}</div>
            </v-sheet>
         `;
      },
      mousePosToGlobeCoords(position) {
         const viewer = this.viewer;
         const Cesium = this.$cesium;
         const { x, y } = position;
         const ellipsoid = viewer.scene.globe.ellipsoid;
         const mousePos = new Cesium.Cartesian2(x, y);

         const cartesian = viewer.camera.pickEllipsoid(mousePos, ellipsoid);
         if (!cartesian) return false;
         const cartographic = ellipsoid.cartesianToCartographic(cartesian);
         const longitudeDegree = Cesium.Math.toDegrees(cartographic.longitude);
         const latitudeDegree = Cesium.Math.toDegrees(cartographic.latitude);
         const heightDegree = Cesium.Math.toDegrees(cartographic.height);
         return {
            longitude: longitudeDegree,
            latitude: latitudeDegree,
            height: heightDegree,
         };
      },
      initializeGlobalOptions() {
         const viewer = this.viewer;
         const Cesium = this.$cesium;

         viewer.scene.screenSpaceCameraController.enableTilt = true;
         viewer.scene.screenSpaceCameraController.minimumTrackBallHeight = 10;
         viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20_000_000;
         viewer.scene.postProcessStages.fxaa.enabled = false;
         viewer.scene.globe.maximumScreenSpaceError = 4;
         viewer.scene.globe.showGroundAtmosphere = false;
         viewer.scene.globe.tileCacheSize = 200000;
         viewer.scene.moon.show = true;
         viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
         viewer.scene.fog.enabled = false;

         //@@ Disables right click drag zooming @@//
         // viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL];
      },
      configureScreenSpaceEventHandler() {
         const viewer = this.viewer;
         const Cesium = this.$cesium;
         // const canvas = viewer.scene.canvas;
         // const center = new Cesium.Cartesian2(
         //    canvas.clientWidth / 2.0,
         //    canvas.clientHeight / 2.0
         // );
         // const ellipsoid = viewer.scene.globe.ellipsoid;
         // const position = viewer.camera.pickEllipsoid(center, ellipsoid);
         // console.log({position});

         // const cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
         // console.log(cartographicPosition);

         // canvas.addEventListener('mousemove', evt => {
         //    const test = new Cesium.CameraEventAggregator(canvas);
         //    console.warn({test, evt});
         // });

         const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
         );

         console.log(screenSpaceEventHandler);

         // screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN);
         screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
         );

         screenSpaceEventHandler.setInputAction((position) => {
            const {
               endPosition: { x, y },
            } = position;
            this.$store.commit("MOUSE_POSITION", { x, y });
            // const {
            //    latitude: lat,
            //    longitude: lon,
            //    height: alt,
            // } = this.mousePosToGlobeCoords({ x, y });

            const coords = this.mousePosToGlobeCoords({ x, y });

            if (!coords) return;
            const { latitude: lat, longitude: lon, height: alt } = coords;

            this.$store.commit("MOUSE_COORDS", { lat, lon, alt });
         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

         screenSpaceEventHandler.setInputAction(() => {
            const coords = this.mouse_coords;
            if (!coords) return;
            const { latitude: lat, longitude: lon } = coords;
            if (!lat || !lon) return;
         }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

         // screenSpaceEventHandler.setInputAction( position => {

         // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

         screenSpaceEventHandler.setInputAction(() => {
            const coords = this.mouse_coords;
            this.viewer.camera.flyTo({
               // destination: this.$cesium.Cartesian3.fromDegrees({
               //    longitude: +coords.lon,
               //    latitude: +coords.lat,
               //    height: +coords.alt,
               // }),
               destination: this.$cesium.Cartesian3.fromDegrees(
                  coords.lon,
                  coords.lat,
                  350000
               ),
            });
         }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);

         // screenSpaceEventHandler.setInputAction( movement => {
         //    console.log(movement);
         // });
      },
   },

   async mounted() {
      const Cesium = this.$cesium;
      Cesium.Primitive.allowPicking = false;
      const esri = new Cesium.ArcGisMapServerImageryProvider({
         url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
         enablePickFeatures: false,
      });
      const viewer = new this.$cesium.Viewer("cesium_container", {
         imageryProvider: esri,
         baseColor: Cesium.Color.ALICEBLUE,
         // baseLayerPicker: false,
         geocoder: false,
         navigationHelpButton: false,
         sceneModePicker: false,
         fullscreenButton: false,
         homeButton: false,
         animation: false,
         bottomContainer: false,
         timeline: false,
         infoBox: false,
         selectionIndicator: true,
         // scene3DOnly: true,
         // skyAtmosphere: false,
         // orderIndependentTranslucency: false,
         // creditContainer: 'test_test',
         // creditContainer: new Cesium.Credit('<div>test</div>'),
         // creditViewport: new Cesium.Credit('<div>test</div>'),
         shadows: true,
      });

      viewer.extend(Cesium.viewerCesiumInspectorMixin);
      viewer.extend(Cesium.viewerDragDropMixin);
      viewer.extend(Cesium.viewerPerformanceWatchdogMixin, {
         lowFrameRateMessage: "Why is this going so <em>slowly</em>?",
      });

      const frameRateMonitor = new Cesium.FrameRateMonitor({
         scene: viewer.scene,
      });
      frameRateMonitor.lowFrameRate.addEventListener( scene => {
         console.log('Low frame rate!', scene);
      });

      // const glb = Cesium.Model.fromGltf({
      //    url: 'src/assets/glb/Cesium_Air.glb',
      //    // url: 'http://locsalhost:8080/src/assets/glb/Cesium_Air.glb',
      //    show: true,
      //    ready: true,
      // });

      // viewer.scene.primitives.add(glb);

      // var credit = new Cesium.Credit(
      //    "Title", true
      // );
      // console.log(credit);

      // viewer.scene.frameState.creditDisplay.addDefaultCredit(viewer.scene.creditContainer);
      // viewer.scene.frameState.creditDisplay.removeDefaultCredit();

      // viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit({html:'<div>test</div>'}));

      // const scene = viewer.scene;

      // const iframe = viewer.infoBox.frame;
      // this.iframe = iframe;
      // iframe.removeAttribute("sandbox");
      // iframe.src = "about:blank";
      // iframe.setAttribute('sandbox', `${iframe.getAttribute('sandbox')} allow-scripts`);

      this.viewer = viewer;
      window.viewer = viewer;
      console.log(this.$root);

      await this.detectMyLocation();
      // this.goToMyLocation();

      // https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/
      this.addPointEntity({
         name: "My Location Information",
         description: this.createDescription(this.my_locations),
         position: this.$cesium.Cartesian3.fromDegrees(
            this.my_locations.longitude,
            this.my_locations.latitude
         ),
         point: {
            pixelSize: 10,
            color: this.$cesium.Color.BLUE,
            outlineColor: this.$cesium.Color.ALPHA,
            // heightReference: 10
         },
      });
      console.log(Cesium.Color.RED);

      viewer.entities.add({
         name: "Citizens Bank Park",
         position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
         point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
               40000,
               Number.MAX_VALUE
            ),
         },
         billboard: {
            image: logo,
            width: 40,
            height: 40,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
               0,
               // Number.MAX_VALUE
               40000
            ),
         },
         label: {
            text: "Citizens Bank Park",
            font: "14px monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
         },
      });

      const resource = await Cesium.IonResource.fromAssetId(1125587);
      console.warn({ resource });
      const start = Cesium.JulianDate.fromIso8601("2022-03-09T23:10:00Z");
      const stop = Cesium.JulianDate.addSeconds(
         start,
         100,
         new Cesium.JulianDate()
      );

      const positionProperty = new Cesium.SampledPositionProperty();
      const time = Cesium.JulianDate.addSeconds(
         start,
         30,
         new Cesium.JulianDate()
      );

      positionProperty.addSample(
         time,
         Cesium.Cartesian3.fromDegrees(38.9072, 77.0369, 50)
      );

      const airplane = viewer.entities.add({
         name: "Airplane Model",
         // position: Cesium.Cartesian3.fromDegrees(38.9072, 77.0369, 50),
         position: positionProperty,
         availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: start, stop: stop }),
         ]),
         // billboard: {
         //    image: airplane,
         //    width: 40,
         //    height: 40,
         // }
         // model: {
         //    uri: "cesium/assets/Cesium_Air.glb"
         // },
         model: { uri: resource },
         orientation: new Cesium.VelocityOrientationProperty(positionProperty),
         // model: Cesium.Model({
         //    url: "/src/assets/glb/Cesium_Air.glb",
         // }),
         // model: Cesium.Model.fromGltf({
         //    url: '/src/assets/glb/Cesium_Air.glb'
         // }),
         // path: new Cesium.PathGraphics({ width: 3 }),
      });

      viewer.trackedEntity = airplane;

      this.configureScreenSpaceEventHandler();
      this.initializeGlobalOptions();

      viewer.selectedEntityChanged.addEventListener((entity) => {
         // viewer.trackedEntity = entity;
         console.log({ entity });
      });
   },

   // mounted() {
   //    const viewer = new this.$cesium.Viewer("cesium_container", {
   //       terrainProvider: this.$cesium.createWorldTerrain(),
   //    });

   //    const iframe = viewer.infoBox.frame;
   //    this.iframe = iframe;
   //    iframe.removeAttribute("sandbox");

   //    this.viewer = viewer;
   // },
};
</script>

<style>
.cesium-widget-credits {
   display: none !important;
}
</style>