# exif-dating

Dating files with Exif data and folderize them

## Why ?

For people like me who have thousands of thousands pictures but don't have time to sort them one by one :sweat_smile: 

## Compatibility

* **Linux :** Of course, tested on Xubuntu
* **Mac OSX :** Surely, but not tested
* **Windows :** I think it certainly works... If you install Ubuntu on it ^^

## Prerequisites

To install exif-dating, you'll need to install  [ExifTool](https://exiftool.org/) first which is a Perl library for reading meta informations of files.

* **Ubuntu :**

```bash
sudo apt-get update
sudo apt-get install libimage-exiftool-perl
```

* **Mac :**

```bash
brew update
brew install exiftool
```

* **Ubuntu on Windows :** :trollface:

```bash
sudo apt-get update
sudo apt-get install libimage-exiftool-perl
```

## Installation

Go to the folder where you want exif-dating installed, then :

```bash
git clone https://github.com/ripso/exif-dating.git
cd exif-dating
npm install
npm link
```

## Help

```
exif-dating <path>

Date files in <path> folder with Exif data and sort them in dated folders

Options:
      --version   Show version number                                  [boolean]
      --help      Show help                                            [boolean]
  -m, --month     Add month to the path
  -d, --day       Add day to the path
      --modified  Fallback to file modification date
```

## Usage

You have a folder <__sourceFolder__> which contains files you want to folderize by date.
In a CLI, type :
```
exif-dating <sourceFolder> [options]
```
And it's done ! :tada:
