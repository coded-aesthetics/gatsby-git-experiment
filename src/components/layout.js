import styles from './layout.module.css'
import React from "react"
import { StaticQuery } from 'gatsby'
import SideBar from './sideBar'
export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query ProjectQuery {
        allProjectBuiltFromGit {
          edges {
            node {
              name
              id
              fields {
                pages {
                  path
                  slug
                  tag
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <React.Fragment>
        <div className={styles.container}>
          <SideBar projects={data.allProjectBuiltFromGit.edges} className={styles.sidebar} headerText="test"></SideBar>
          <div className={styles.content}  style={{ margin: `3rem auto`, padding: `0 1rem` }}>
            {children}
          </div>
        </div>
      </React.Fragment>
    )}
  />
)
