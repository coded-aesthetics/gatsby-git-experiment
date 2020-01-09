/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/paper-snowflakes.git`,
        outDir: `public`,
        buildCommands: [
          'NODE_ENV=development yarn install',
          './node_modules/.bin/parcel build ./index.html --out-dir ./public --public-url .'
        ]
      }
    }
  ]
  /* Your site config here */
}
