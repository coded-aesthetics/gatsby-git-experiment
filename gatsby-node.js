var path = require('path')
var slugify = require('slugify')

if (process.env.NODE_ENV !== 'production') {
  const express = require(`express`)
  exports.onCreateDevServer = ({ app }) => {
    app.use(express.static(`public`))
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `PageBuiltFromGit`) {
    createNodeField({
      node,
      name: `slug`,
      value: slugify(node.path.replace(/\//gi, '_'))
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allPageBuiltFromGit {
        edges {
          node {
            path
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allPageBuiltFromGit.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/page-built-from-git.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug
      }
    })
  })
}
