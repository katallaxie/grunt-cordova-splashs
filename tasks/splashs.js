// syntax
'use strict';

// module
module.exports = (grunt) => {
  // dependencies
  const gm = require('gm');
  const path = require('path');
  const fs = require('fs');
  const async = require('async');
  // map grunt
  const log = grunt.log;
  const util = grunt.util;
  // defaults
  let splashs = {
    ios: require('ios-splash')(),
    android: require('android-splash')()
  };

  // run the queued image processing tasks
  function run(tasks, done) {
    //done(false);
    async.parallel(tasks, (error) => {
      if (error) {
        throw new util.error(`Error-> Processing splashs`);
      }
      // nothing else to do
      done(true);
    });
  }

  // splash task
  function splash(src, dst, size) {
    return (callback) => {
      gm(src)
        .resize(size.width, size.height, '^')
        .gravity('Center')
        .extent(size.width, size.height)
        .crop(size.width, size.height)
        .write(dst, error => {
          util.error(error);
          if (error) {
            log.fail(error);
          } else {
            callback(null, `${dst}`);
          }
        });
    };
  }

  // oh dir!
  function mkdir(dir) {
    grunt.file.mkdir(dir);
  }

  // check for the image
  function isImage(file) {
    try {
      if (fs.statSync(file).isFile()) {
        return true;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        log.fail(`${file} does not exists or is not an image.`);
      }
      return false;
    }
  }

  // register as multi task to have multiple targets running
  grunt.registerMultiTask('splashs', 'Creates splash screens for a Cordova project', function() {
    // console.log(this);
    let done = this.async(),
      tasks = [],
      src = this.files[0].src[0],
      dest = this.files[0].dest;
    // being explicit
    tasks.length = 0;

    // merging task-specific and/or target-specific options witht the defaults
    let options = this.options({
      config: 'config.xml',
      platforms: ['ios', 'android'],
      expand: true
    });

    // so, in case just a string was passed in
    if (util.kindOf(options.platforms) !== 'array') {
      options.platforms = [options.platforms];
    }

    // filter for available platforms in task
    options.platforms = options.platforms.filter(platform => {
      return splashs.hasOwnProperty(platform) || false;
    });

    // check the image
    if (!isImage(src)) {
      throw new util.error(`${src} is either not a file or not an image`);
    }

    // proccess the platforms
    options.platforms.forEach(platform => {
      // setting the dir that the splash are written to
      let dir = options.expand ? path.join(dest, 'splashs', platform) : dest;
      // create the directory
      mkdir(dir);
      // queue the creation tasks to be executed async in parallel
      splashs[platform].forEach(s => {
        // set filename
        let file = path.join(dir, s.name);
        // push to the tasks queue
        tasks.push(splash(src, file, {width: s.width, height: s.height}));
      });
    });

    // check the task queue
    if (tasks.length > 0) {
      // run the task queue; pass along the promise
      run(tasks, done);
    } else {
      // end if there is nothing in the queue
      done();
    }
  });
};
