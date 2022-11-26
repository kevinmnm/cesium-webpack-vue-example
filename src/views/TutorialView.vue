<template>
   <v-sheet :height="cesium_height">
      <div id="cesium_tutorial_viewer" :style="{ height: cesium_height }"></div>
   </v-sheet>
</template>

<script>
const flightData = require("/ztest.js");
const glb = require('../assets/glb/Cesium_Air.glb');
console.log({glb});

export default {
   name: "TutorialView",

   data: () => ({
      viewer: null,
   }),

   computed: {
      cesium_height() {
         const windowHeight = window.innerHeight;
         if (!windowHeight) return "100%";
         return `calc(${windowHeight}px - 50px)`;
      },
      flight_data() {
         return flightData;
      },
   },

   methods: {
      viewerInit() {
         const Cesium = this.$cesium;
         Cesium.Primitive.allowPicking = false;
         const esri = new Cesium.ArcGisMapServerImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            enablePickFeatures: false,
         });
         const viewer = new this.$cesium.Viewer("cesium_tutorial_viewer", {
            imageryProvider: esri,
            baseColor: Cesium.Color.ALICEBLUE,
            geocoder: false,
            navigationHelpButton: false,
            sceneModePicker: false,
            fullscreenButton: false,
            homeButton: false,
            animation: false,
            bottomContainer: false,
            timeline: true,
            infoBox: false,
            selectionIndicator: true,
            shadows: true,
            // terrainProvider: Cesium.createWorldTerrain(),
         });

         // const viewer = new Cesium.Viewer("cesium_tutorial_viewer", {
         //    terrainProvider: Cesium.createWorldTerrain(),
         // });

         this.viewer = viewer;
      },
      tutorialInit() {
         const Cesium = this.$cesium;
         const viewer = this.viewer;
         const flightData = this.flight_data;
         if (!viewer) return;
         console.log({ viewer });
         viewer.scene.primitives.add(Cesium.createOsmBuildings());

         // viewer.scene.primitives.add(
         //    Cesium.createOsmBuildings()
         // );

         /* Initialize the viewer clock:
            Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
            Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST 
            to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See 
            https://simple.wikipedia.org/wiki/Julian_day.)
            Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated. 
            Also, set the viewer's current time to the start time and take the user to that time. 
         */

         const timeStepInSeconds = 30;
         const totalSeconds = timeStepInSeconds * (flightData.length - 1);
         const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
         const stop = Cesium.JulianDate.addSeconds(
            start,
            totalSeconds,
            new Cesium.JulianDate()
         );

         viewer.clock.startTime = start.clone();
         viewer.clock.stopTime = stop.clone();
         viewer.clock.currentTime = start.clone();
         viewer.timeline.zoomTo(start, stop);
         // Speed up the playback speed 50x.
         viewer.clock.multiplier = 50;
         // Start playing the scene.
         viewer.clock.shouldAnimate = true;

         // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
         const positionProperty = new Cesium.SampledPositionProperty();

         for (let i = 0; i < flightData.length; i++) {
            const dataPoint = flightData[i];

            // Declare the time for this individual sample and store it in a new JulianDate instance.
            const time = Cesium.JulianDate.addSeconds(
               start,
               i * timeStepInSeconds,
               new Cesium.JulianDate()
            );
            const position = Cesium.Cartesian3.fromDegrees(
               dataPoint.longitude,
               dataPoint.latitude,
               dataPoint.height
            );
            // Store the position along with its timestamp.
            // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
            positionProperty.addSample(time, position);

            viewer.entities.add({
               description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
               position: position,
               point: { pixelSize: 10, color: Cesium.Color.RED },
            });
         }

         // const modelResource = new Cesium.IonResource();
         const modelResource = new Cesium.Resource({
            url: "src/assets/glb/",
         });

         const airplaneEntity = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
               new Cesium.TimeInterval({ start: start, stop: stop }),
            ]),
            position: positionProperty,
            // Automatically compute the orientation from the position.
            model: {
               // uri: 'src/assets/glb/Cesium_Air.glb',
               // uri: modelResource,
            },
            orientation: new Cesium.VelocityOrientationProperty(
               positionProperty
            ),
            path: new Cesium.PathGraphics({ width: 1 }),
            point: {
               pixelSize: 10,
               color: this.$cesium.Color.BLUE,
               outlineColor: this.$cesium.Color.ALPHA,
               // heightReference: 10
            },
         });

         console.warn({ modelResource });

         airplaneEntity;
         // viewer.trackedEntity = airplaneEntity;
      },
   },

   mounted() {
      this.viewerInit();
      this.tutorialInit();
   },
};
</script>

<style>
</style>