#!/usr/bin/env node

const util = require('util')
const fs = require('fs-extra')
const path = require('path')
const yargs = require('yargs')

const simpleExifTool = require('simple-exiftool')
const exif = util.promisify(simpleExifTool)

const argv = process.argv.slice(2)

const app = yargs(argv)
  .command(
    '$0 <path>',
    'Date files in <path> folder with Exif data and folderize them',
    () => {
      return yargs
        .option('month', {
          alias: 'm',
          describe: 'Add month to the path'
        })
        .option('day', {
          alias: 'd',
          describe: 'Add day to the path'
        })
        .option('modified', {
          describe: 'Fallback to file modification date'
        })
    },
    async (argv) => {

      const sourcePath = path.resolve(argv.path)

      console.log('Source path :', sourcePath)

      if (!await fs.pathExists(sourcePath)) {
        throw Error('Path does not exist...')
      }

      const dir = await fs.readdir(sourcePath)

      if (dir.length > 0) {

        for (const file of dir) {

          const filePath = path.resolve(sourcePath, file)
          const stats = fs.statSync(filePath)

          console.log('Reading', file, '...')

          if (!stats.isFile()) {
            console.log(file, 'is not a file')
            continue
          }

          try {

            const tags = await exif(filePath)
            const creationDate = tags?.CreateDate ?? tags?.DateTimeOriginal ?? (argv.modified ? tags.FileModifyDate : null) ?? null
            if (creationDate !== null) {

              const re = creationDate.match(/^(?<year>\d+):(?<month>\d+):(?<day>\d+) (?<end>.+)/)
              const utc = Date.UTC(re.groups.year, ~~re.groups.month - 1, re.groups.day)
              const date = new Date(0)

              date.setUTCMilliseconds(utc)

              const destPath = path.resolve(
                sourcePath,
                'dated',
                String(date.getUTCFullYear()),
                argv.month ? ('0' + String(date.getUTCMonth() + 1)).slice(-2) : '',
                argv.day ? ('0' + String(date.getUTCDate())).slice(-2) : '',
                file
              )

              console.log('Date found :', date)
              fs.moveSync(filePath, destPath)

            } else {

              console.log('No date found')
              const destPath = path.resolve(sourcePath, 'nodate', file)
              fs.moveSync(filePath, destPath)

            }

          } catch (err) {
            console.error(err)
          }

        } // for
      } else {
        console.log('There is no file in this directory')
      }
    } // async argv
  )
  .help()
  .argv
