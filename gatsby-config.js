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
        buildDir: `public`,
        buildCommands: [
          'rm -rf ./public',
          'NODE_ENV=development yarn install',
          './node_modules/.bin/parcel build ./index.html --out-dir ./public --public-url .'
        ]
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/spirograph-3d.git`
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/planetary-eject.git`,
        buildDir: `src`,
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/springy-things.git`
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/voronoi-wobble.git`
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/paper-gem.git`
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/breaking-rocks.git`
      }
    },
    {
      resolve: `build-from-git-tags`,
      options: {
        rootDir: `${__dirname}/`,
        repoUrl: `https://github.com/coded-aesthetics/learn-rxjs.git`,
        buildDir: `dist`,
        buildCommands: [
          'NODE_ENV=development npm install',
          'ng build --deploy-url=${basePath}'
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `static`,
        path: `${__dirname}/static/`,
      },
    },
  ]
  /* Your site config here */
}
