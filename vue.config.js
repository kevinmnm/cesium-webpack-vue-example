const { defineConfig } = require('@vue/cli-service');
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = defineConfig({
   transpileDependencies: [
      'vuetify'
   ],
   configureWebpack: config => {
      config.resolve.alias = {
         ...config.resolve.alias,
         // cesium: path.resolve(__dirname, 'node_modules', 'cesium'),
         cesium: path.resolve(__dirname, cesiumSource),
      }
      // config.target = 'node';
      console.log(config.target);
      config.resolve.mainFiles = ['index', 'Cesium'];
      config.plugins = [
         ...config.plugins,
         new CopyWebpackPlugin({
            patterns: [
               { from: path.join(cesiumSource, cesiumWorkers), to: path.join('cesium', 'Workers') },
               // { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
               { from: path.join(cesiumSource, 'Assets'), to: path.join('cesium', 'Assets') },
               // { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
               { from: path.join(cesiumSource, 'Widgets'), to: path.join('cesium', 'Widgets') },
               // { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
               { from: path.join(cesiumSource, 'ThirdParty'), to: path.join('cesium', 'ThirdParty') },
            ]
         }),
         new webpack.DefinePlugin({
            // CESIUM_BASE_URL: (process.env.NODE_ENV === 'production') ? JSON.stringify('/cesium/Build/Cesium/') : JSON.stringify('../vue-and-cesium/node_modules/cesium/Source/'),
            // CESIUM_BASE_URL: JSON.stringify('/cesium/Build/Cesium/'),
            CESIUM_BASE_URL: JSON.stringify('/cesium/'),
         })
      ];
      console.log(config.module.rules[1].use);

      config.module.rules.push({
         test: /\.(glb|gltf)$/,
         use:
            [
               {
                  loader: 'file-loader',
                  options:
                  {
                     outputPath: 'assets/glb/'
                  }
               }
            ]
      });
   },
   // chainWebpack: config => {
   // console.log(config);
   // config.module.rule('glb').test(/\.(glb|gltf)$/).use('assets/glb')
   // },
   // devServer: {
   //    https: true,
   // },
})
