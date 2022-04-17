<template>
   <div id="cesium_container" ref="cesium_container"></div>
</template>

<script>
export default {
   name: "CesiumComponent",

   data: () => ({
      viewer: null,
      iframe: null,
   }),

   mounted() {
      const viewer = new this.$cesium.Viewer("cesium_container", {
         terrainProvider: this.$cesium.createWorldTerrain(),
      });

      const iframe = viewer.infoBox.frame;
      this.iframe = iframe;
      // iframe.removeAttribute("sandbox");
      // iframe.src = "about:blank";
      // iframe.setAttribute('sandbox', `${iframe.getAttribute('sandbox')} allow-scripts`);
      console.warn({ iframe });

      this.viewer = viewer;
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
</style>