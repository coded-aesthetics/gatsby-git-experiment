import React from 'react'
import Layout from '../components/layout'
import styles from './page-built-from-git.module.css'

export default ({ data }) => {
  const post = data.pageBuiltFromGit
  return (
    <Layout>
      <iframe className={styles.iframe} src={post.path}></iframe>
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
