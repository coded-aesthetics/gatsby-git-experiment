import React from "react"

export default props =>
<div>
    {console.log(props.projects)}
    {props.projects.map(({ node }) =>
        <div key={node.name}>
            <div>{node.name}</div>
            <ul>
                {node.fields.pages.map(page => <li key={page.path}>
                    <a href={page.slug}>
                        {page.tag}
                    </a>
                </li>)}
            </ul>
        </div>
    )}

</div>