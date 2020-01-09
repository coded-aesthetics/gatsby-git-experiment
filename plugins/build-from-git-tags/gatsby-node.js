var Git = require('nodegit')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const ncpPromise = util.promisify(require('ncp').ncp)

let repo
let references = []



const getCommits = async (repoUrl, rootFolder) => {
  // Clone a given repository into the `./tmp` folder.
  const repoPath = path.join('./.tmp', repoUrl)
  return Git.Clone(repoUrl, repoPath)
    .then(() => {
      // Open the repository directory.

      return (
        Git.Repository.open(repoPath)
          // Open the master branch.
          .then(function (repo_) {
            repo = repo_
          })
          .then(() => {
            return repo.getReferences().then(function (stdVectorGitReference) {
              console.log(stdVectorGitReference)
              references = references.concat(
                stdVectorGitReference.filter(x => x.isTag())
              )
            })
          })
      )
    })
    .then(async () => {
      const tasks = references.map((reference, idx) => {
        return () => repo.checkoutRef(reference).then(async () => {
          var { stdout, stderr } = await exec('npm -v')
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
          var { stdout, stderr } = await exec('printenv NODE_ENV')
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
          var { stdout, stderr } = await exec('cd ' + repoPath +  ' && NODE_ENV=development yarn install')
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
          var { stdout, stderr } = await exec('pwd')
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
          var { stdout, stderr } = await exec(repoPath + '/node_modules/.bin/parcel build ' + repoPath + '/index.html --out-dir ' + repoPath + '/public --public-url .')
          console.log('stdout:', stdout)
          console.log('stderr:', stderr)
          console.log('copying from', path.join(repoPath, 'public'), 'to', path.join(rootFolder, 'static/tmp-' + idx ))
          await ncpPromise(path.join(repoPath, 'public'), path.join(rootFolder, 'static/tmp-' + idx ))
          return { stdout, stderr, path: 'tmp-' + idx }
        })
      })
      return new Promise((resolve, reject) => {
        tasks.reduce((promiseChain, currentTask) => {
          return promiseChain.then(chainResults =>
              currentTask().then(currentResult =>
                  [ ...chainResults, currentResult ]
              )
          );
        }, Promise.resolve([])).then(arrayOfResults => {
          console.log(arrayOfResults)
          resolve(arrayOfResults)
        }).catch(reject);
      })
    })
    .catch(function (err) {
      console.log(err)
    })
}
/*
getCommits('https://github.com/coded-aesthetics/paper-snowflakes.git').then(
  () => {
    console.log('done')
  }
)
*/

exports.sourceNodes = async ({ actions }, configOptions) => {
  console.log('sourceNodes', configOptions)
  // Process data into nodes.

  return await getCommits(configOptions.repoUrl, configOptions.rootDir).then(
    (xs) => {
      console.log(xs)
    }
  )
  //data.forEach(datum => createNode(processDatum(datum)))
  // We're done, return.
}
