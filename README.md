# grunt-cordova-splashs

> Creates the splash screens for an [Cordova](http://cordova.apache.org) project

## Supported platforms

> Please contribute your relevant platforms

- iOS
- Android
- ...

## Requirements

- [Grunt](http://gruntjs.com)
- [Cordova](http://cordova.apache.org)
- [GraphicsMagick](http://graphicsmagick.org)

Grunt and Cordova can be installed via [NPM](http://npmjs.com):

```
npm i -g grunt-cli cordova
```

GraphicsMagick can be installed via [Homebrew](http://brew.sh):

```
brew install graphicsmagick
```

## Usage of the 'splashs' task

The task uses one base image (e.g. `splash.png`) that you provide and resizes it to the various needed icon sizes. The image should be of the size of 3925 x 3925 as to account for the various sizes.

What is done is that the image is resized to the longest side, then extend as to fill the area, and then cropped to the size needed.

In our project `Gruntfile.js`, add a section named `icons` to the config object that is passed into `grunt.initConfig`.

Run the task via

```
grunt splashs
```

### Example

```
icons: {
  options: {
    platforms: ['ios', 'android']
  },
  // this would only produce the icons for iOS
  ios: {
    options: {
      platforms: 'ios'
    },
    src: './splash.png',
    dest: 'build/res'
  },
  // this would only produce the icons for Android; with the folders not expanded
  android {
    options: {
      platforms: ['android'],
      expand: false
    },
    src: './splash.png',
    dest: 'build/res/android'
  }
}
```

### Options

#### options.cordova (todo)

Type: `String`  
Default: `config.xml`

This is the configuration file that is extended with the icons.

#### options.expand

Type: `Boolean`  
Default: `true`

Expands the `dest` as to be of the format `/splashs/platform`. Otherwise write all the files in the flat directory.

#### options.platforms

Type: `Array` or `String`  
Default: `[ios, android]`

This is the list of platforms the icons should be created for.

---
Task coded and submitted by [Sebastian Döll](http://github.com/katallaxie)
