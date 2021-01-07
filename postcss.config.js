module.exports = {
  plugins: [
    // require('postcss-100vh-fix'), //解决移动端遮挡bug
    require('postcss-preset-env'),
    require('postcss-pxtorem'),
    require('postcss-cssnext')
  ]
};