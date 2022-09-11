<template>
   <v-sheet :height="cesium_height" outlined>
      <cesium-component />
   </v-sheet>
</template>

<script>
export default {
   name: "HomeView",

   computed: {
      cesium_height() {
         const windowHeight = window.innerHeight;
         if (!windowHeight) return '100%';
         return `calc(${windowHeight}px - 48px)`;
      }
   },

};
</script>
