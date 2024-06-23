// vue.config.js
const path = require('path')
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const resolve = (dir) => path.join(__dirname, dir)
const Timestamp = new Date().getTime()

module.exports = {
  publicPath:
    process.env.VUE_APP_TITLE === 'dev'
      ? '/dev'
      : process.env.VUE_APP_TITLE === 'market'
      ? '/'
      : process.env.VUE_APP_TITLE === 'test'
      ? '/test'
      : './', // 公共路径
  indexPath: 'index.html', // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  // lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: (config) => {
    config.resolve.symlinks(true) // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap((args) => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none'
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = 'false'
      return args
    })
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@images', resolve('src/assets/images'))
      .set('@service', resolve('src/service'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'))

    if (process.env.NODE_ENV === 'production') {
      // 给js和css配置Timestamp
      config.output.filename('static/js/[name].' + Timestamp + '.js').end()
      config.output.chunkFilename('static/js/[name].' + Timestamp + '.js').end()
      config.plugin('extract-css').tap(() => [
        {
          filename: `static/css/[name].${Timestamp}.css`,
          chunkFilename: `static/css/[name].${Timestamp}.css`
        }
      ])
      // 给img配置Timestamp
      config.module
        .rule('images')
        .use('url-loader')
        .tap((options) => {
          options.name = `static/img/[name].${Timestamp}.[ext]`
          options.fallback = {
            loader: 'file-loader',
            options: {
              name: `static/img/[name].${Timestamp}.[ext]`
            }
          }
          return options
        })
    }
  },
  // css: {
  //   extract: IS_PROD,
  //   requireModuleExtension: false, // 去掉文件名中的 .module
  //   loaderOptions: {
  //     // 给 less-loader 传递 Less.js 相关选项
  //     less: {
  //       // `globalVars` 定义全局对象，可加入全局变量
  //       globalVars: {
  //         primary: '#333'
  //       }
  //     }
  //   }
  // }
  // vue-cli3.0 里面的 vue.config.js做配置
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      '/api': {
        target: 'http://labapi.swrtest.com/', // 后台接口域名
        ws: true, // 如果要代理 websockets，配置这个参数
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
