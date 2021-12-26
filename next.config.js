/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    apiDomain: 'https://data.thetanarena.com/thetan/v1/nif/',
    assetsDomain: 'https://assets.thetanarena.com/',
    marketplaceDomain: 'https://marketplace.thetanarena.com/'
  },
}
