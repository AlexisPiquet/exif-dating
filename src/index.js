#!/usr/bin/env node

const yargs = require('yargs')
const ExifDating = require('./ExifDating')

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

      const exif = new ExifDating(argv)
      return await exif.process()

    }
  )
  .help()
  .argv
