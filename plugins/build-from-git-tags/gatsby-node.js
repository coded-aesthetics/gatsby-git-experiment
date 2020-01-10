var Git = require('nodegit')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')
require('colors');

let repo
let references = []

const sequentiallyRunPromises = (tasks) => {
  return new Promise((resolve, reject) => {
    tasks.reduce((promiseChain, currentTask) => {
      return promiseChain.then(chainResults =>
          currentTask().then(currentResult =>
              [ ...chainResults, currentResult ]
          ).catch(reject)
      );
    }, Promise.resolve([])).then(arrayOfResults => {
      resolve(arrayOfResults)
    }).catch(reject);
  })
}

const getCommits = async (repoUrl, rootFolder, buildCommands, buildDir) => {
  // Clone a given repository into the `./tmp` folder.
  const repoPath = path.join('./.tmp', repoUrl)
  await fs.emptyDir(repoPath)
  return Git.Clone(repoUrl, repoPath)
    .then(() => {
      // Open the repository directory.
      console.log("cloning the repo".green, repoUrl, "into", repoPath)
      return (
        Git.Repository.open(repoPath)
          // Open the master branch.
          .then(function (repo_) {
            repo = repo_
          })
          .then(() => {
            return repo.getReferences().then(function (stdVectorGitReference) {
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
          console.log("checked out the ref".green, reference.name())
          const commandTasks = buildCommands.map((command) => {
            return async () => {
              console.log('running build command'.green, command)
              var { stdout, stderr } = await exec('cd ' + repoPath + ' && ' + command)
              if (stdout) {
                console.log('build command output:'.green, stdout)
              }
              if (stderr) {
                console.log('build command error output:'.red, stderr)
              }
              return {stdout, stderr}
            }
          })
          await sequentiallyRunPromises(commandTasks)

          const commit = await reference.peel(Git.Object.TYPE.COMMIT)

          const gitBaseName = path.basename(repoUrl)

          const fromPath = path.join(repoPath, buildDir)
          const toPath = path.join(rootFolder, 'static/' + gitBaseName + '/' + reference.shorthand())

          console.log('copying build output:'.green, "from", fromPath, "to", toPath)

          await fs.ensureDir(toPath)
          await fs.copy(fromPath, toPath)
          return { path: toPath }
        })
      })
      return sequentiallyRunPromises(tasks)
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
  console.log('running the build-from-git-tags plugin'.green, configOptions)

  return await getCommits(configOptions.repoUrl, configOptions.rootDir, configOptions.buildCommands || [], configOptions.buildDir || '.').then(
    (xs) => {

    }
  )
  //data.forEach(datum => createNode(processDatum(datum)))
  // We're done, return.
}
