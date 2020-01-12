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
  if (node.internal.type === `ProjectBuiltFromGit`) {
    createNodeField({
      node,
      name: `pages`,
      value: node.pages.map(x => ({
        ...x,
        slug: slugify(x.path.replace(/\//gi, '_'))
      }))
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allProjectBuiltFromGit {
        edges {
          node {
            fields {
              pages {
                slug
                path
              }
            }
          }
        }
      }
    }
  `)
  result.data.allProjectBuiltFromGit.edges.forEach(({ node }) => {
    node.fields.pages.forEach(page => {
      createPage({
        path: page.slug,
        component: path.resolve(`./src/templates/page-built-from-git.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: page.slug
        }
      })
    })
  })
}
