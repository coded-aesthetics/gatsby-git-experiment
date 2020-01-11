var Git = require('nodegit')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fsExtra = require('fs-extra')
const crypto = require('crypto')
var fs = require('fs')

require('colors')

const sequentiallyRunPromises = tasks => {
  return new Promise((resolve, reject) => {
    tasks
      .reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults =>
          currentTask()
            .then(currentResult => [...chainResults, currentResult])
            .catch(reject)
        )
      }, Promise.resolve([]))
      .then(arrayOfResults => {
        resolve(arrayOfResults)
      })
      .catch(reject)
  })
}

const getCommits = async (repoUrl, rootFolder, buildCommands, buildDir) => {
  let repo
  let references = []
  // Clone a given repository into the `./tmp` folder.
  const repoPath = path.join('./.tmp', repoUrl)
  await fsExtra.emptyDir(repoPath)
  return Git.Clone(repoUrl, repoPath)
    .then(() => {
      // Open the repository directory.
      console.log('cloning the repo'.green, repoUrl, 'into', repoPath)
      return (
        Git.Repository.open(repoPath)
          // Open the master branch.
          .then(function (repo_) {
            repo = repo_
          })
          .then(() => {
            console.log('getting all references'.green)
            return repo.getReferences().then(function (stdVectorGitReference) {
              references = references.concat(
                stdVectorGitReference.filter(x => x.isTag())
              )
              console.log(
                'found tags'.green,
                references.map(x => x.shorthand())
              )
            })
          })
      )
    })
    .then(async () => {
      const tasks = references.map(reference => {
        const gitBaseName = path.basename(repoUrl)
        const toPath = path.join(
          rootFolder,
          'static/' + gitBaseName + '/' + reference.shorthand()
        )
        return () => {
          if (fs.existsSync(toPath)) {
            console.log(
              'tag has already been processed'.green,
              reference.name()
            )
            return Promise.resolve({
              path: gitBaseName + '/' + reference.shorthand()
            })
          } else {
            console.log('checking out the tag'.green, reference.name())
            return repo.checkoutRef(reference).then(async () => {
              console.log('checked out the tag'.green, reference.shorthand())
              const commandTasks = buildCommands.map(command => {
                return async () => {
                  console.log('running build command'.green, command)
                  var { stdout, stderr } = await exec(
                    'cd ' + repoPath + ' && ' + command
                  )
                  if (stdout) {
                    console.log('build command output:'.green, stdout)
                  }
                  if (stderr) {
                    console.log('build command error output:'.red, stderr)
                  }
                  return { stdout, stderr }
                }
              })
              await sequentiallyRunPromises(commandTasks)

              const fromPath = path.join(repoPath, buildDir)

              console.log(
                'copying build output:'.green,
                'from',
                fromPath,
                'to',
                toPath
              )

              await fsExtra.ensureDir(toPath)
              await fsExtra.copy(fromPath, toPath)
              return { path: gitBaseName + '/' + reference.shorthand() }
            })
          }
        }
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
  console.log('running the build-from-git-tags plugin'.green)

  const { createNode } = actions

  return await getCommits(
    configOptions.repoUrl,
    configOptions.rootDir,
    configOptions.buildCommands || [],
    configOptions.buildDir || '.'
  ).then(xs => {
    xs.forEach(x =>
      createNode({
        path: x.path,
        id: x.path,
        internal: {
          type: 'PageBuiltFromGit',
          mediaType: `text/html`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(x.path)
            .digest(`hex`)
        }
      })
    )
  })
  // data.forEach(datum => createNode(processDatum(datum)))
  // We're done, return.
}
