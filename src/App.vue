<template>
   <v-app>
      <v-app-bar app dense height="48px">
         <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
         <v-card>{{ mouse_coords }}</v-card>
         <v-spacer></v-spacer>
         <v-card>{{ mouse_position }}</v-card>
         <v-spacer></v-spacer>
         <v-btn icon tile @click="flyToMyLocation">
            <v-icon>mdi-home-outline</v-icon>
         </v-btn>
         <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
               <v-btn icon tile v-on="on" v-bind="attrs">
                  <v-icon>mdi-cog</v-icon>
               </v-btn>
            </template>
            <v-sheet>
               <v-list>
                  <v-list-item-group v-model="control_mode">
                     <v-list-item
                        v-for="(mode, index) in control_modes"
                        :key="index"
                        :value="mode.mode"
                     >
                        <v-list-item-content>
                           <v-list-item-title>{{
                              mode.mode
                           }}</v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                  </v-list-item-group>
               </v-list>
            </v-sheet>
         </v-menu>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" absolute bottom temporary>
         <v-list nav dense>
            <!-- <v-list-item link :to="{name: 'home'}">
               <v-list-item-content>
                  <v-list-item-title
                     >HOME</v-list-item-title
                  >
               </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'test'}">
               <v-list-item-content>
                  <v-list-item-title
                     >TEST</v-list-item-title
                  >
               </v-list-item-content>
            </v-list-item> -->
            <v-list-item link @click="routeChange('home')">
               <v-list-item-content>
                  <v-list-item-title>HOME</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
            <v-list-item link @click="routeChange('test')">
               <v-list-item-content>
                  <v-list-item-title>TEST</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
            <v-list-item link @click="routeChange('tutorial')">
               <v-list-item-content>
                  <v-list-item-title>TUTORIAL</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>
      <v-main>
         <router-view />
      </v-main>
   </v-app>
</template>

<script>
import $router from "./router/index.js";

export default {
   name: "App",

   data: () => ({
      drawer: false,
      control_modes: [{ mode: "none" }, { mode: "draw" }],
   }),

   computed: {
      mouse_position() {
         return this.$store.state.mouse_position;
      },
      mouse_coords() {
         return this.$store.state.mouse_coords;
      },
      control_mode: {
         get() {
            return this.$store.state.control_mode;
         },
         set(mode) {
            this.$store.commit("CONTROL_MODE", mode);
         },
      },
   },

   methods: {
      flyToMyLocation() {
         this.$store.dispatch("flyTo");
      },
      routeChange(name) {
         $router.push({ name });
      },
   },
};
</script>

<style>
html {
   overflow: hidden !important;
}
</style>