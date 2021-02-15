const util = require('util')
const fs = require('fs-extra')
const path = require('path')
const simpleExifTool = require('simple-exiftool')
const exif = util.promisify(simpleExifTool)

class ExifDating {

  constructor (argv) {
    this.argv = argv
  }

  async process () {
    this.sourcePath = path.resolve(this.argv.path)

    console.log('Source path :', this.sourcePath)

    if (!await fs.pathExists(this.sourcePath)) {
      throw Error('Path does not exist...')
    }

    const dir = await fs.readdir(this.sourcePath)

    if (dir.length > 0) {

      dir.forEach(this.processFile.bind(this))

    } else {
      console.log('There is no file in this directory')
    }
  }

  async processFile (file) {
    const filePath = path.resolve(this.sourcePath, file)
    const stats = fs.statSync(filePath)

    console.log('Reading', file, '...')

    if (!stats.isFile()) {
      console.log(file, 'is not a file')
      return
    }

    try {

      const tags = await exif(filePath)
      const creationDate = tags?.CreateDate ?? tags?.DateTimeOriginal ?? (this.argv.modified ? tags.FileModifyDate : null) ?? null
      if (creationDate !== null) {

        this.moveDatedFile(filePath, file, creationDate)

      } else {

        this.moveNotDatedFile(filePath, file)

      }

    } catch (err) {
      console.error(err)
    }
  }

  async moveDatedFile (filePath, file, creationDate) {

    const re = creationDate.match(/^(?<year>\d+):(?<month>\d+):(?<day>\d+) (?<end>.+)/)
    const utc = Date.UTC(re.groups.year, ~~re.groups.month - 1, re.groups.day)
    const date = new Date(0)

    date.setUTCMilliseconds(utc)

    const destPath = path.resolve(
      this.sourcePath,
      'dated',
      String(date.getUTCFullYear()),
      this.argv.month || this.argv.day ? ('0' + String(date.getUTCMonth() + 1)).slice(-2) : '',
      this.argv.day ? ('0' + String(date.getUTCDate())).slice(-2) : '',
      file
    )

    console.log('Date found :', date)
    await fs.move(filePath, destPath)

  }

  async moveNotDatedFile (filePath, file) {
    console.log('No date found')
    const destPath = path.resolve(this.sourcePath, 'nodate', file)
    await fs.move(filePath, destPath)
  }

}

module.exports = ExifDating