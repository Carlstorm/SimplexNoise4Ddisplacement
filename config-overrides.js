
//   module.exports = function override(config, env) {
//     let loaders = config.module.rules[1].oneOf;
//     loaders.splice(loaders.length - 1, 0, {
//         test: /\.hdr$/,
//         exclude: /node_modules/,
//         loader: 'THREE.RGBELoader',
//     })
//     return config;
// };