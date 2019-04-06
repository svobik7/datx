const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript({
  target: 'serverless',
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        components: `${__dirname}/components`,
        containers: `${__dirname}/containers`,
        configs: `${__dirname}/configs`,
        models: `${__dirname}/models`,
        stores: `${__dirname}/stores`,
        utils: `${__dirname}/utils`
      }
    }
  })
});
