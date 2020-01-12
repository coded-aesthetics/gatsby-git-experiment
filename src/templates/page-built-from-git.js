import React from 'react'
import Layout from '../components/layout'
import styles from './page-built-from-git.module.css'
import { graphql } from 'gatsby'

export default ({ data }) => {
  const post = data.pageBuiltFromGit
  return (
    <Layout>
      <iframe title="page-built-from-git" className={styles.iframe} src={post.path}></iframe>
    </Layout>
  )
}
export const query = graphql`
  query($slug: String!) {
    pageBuiltFromGit(fields: { slug: { eq: $slug } }) {
      path
    }
  }
`
