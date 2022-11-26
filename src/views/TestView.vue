<template>
   <v-sheet :height="cesium_height" outlined>
      <div id="cesium_comp"></div>
   </v-sheet>
</template>

<script>
export default {
   name: "TestView",

   computed: {
      viewer() {
         return this.$store.state.viewer;
      },
      cesium_height() {
         const windowHeight = window.innerHeight;
         if (!windowHeight) return "100%";
         return `calc(${windowHeight}px - 48px)`;
      },
   },

   mounted() {
      console.log(this.viewer);
   },
};
</script>
