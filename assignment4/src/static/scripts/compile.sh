#!/bin/bash

# This is an example of how to run the code through the Closure
# compiler. You'll have to update the path to reflect where it's
# installed on your system. I used the compiler for static code
# analysis only; index.html runs the unminified code.

java -jar /home/rahulraj/dls/closure-compiler/compiler.jar \
  --js=networkStickies.js \
  --js=storageUrl.js \
  --js=utils/utils.js --js=utils/option.js \
  --js=note.js \
  --js=observable.js --js=observer.js \
  --js=noteSet.js --js=noteModel.js \
  --js=noteController.js --js=noteView.js \
  --js=noteExporter.js \
  --js=noteMvcFactory.js \
  --js=main.js \
  --externs=externs.js --warning_level=VERBOSE \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  > /dev/null # We only care about the error output
