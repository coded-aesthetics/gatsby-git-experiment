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
        repoUrl: `https://github.com/coded-aesthetics/paper-snowflakes.git`
      }
    }
  ]
  /* Your site config here */
}
