#!/bin/bash

# This is an example of how to run the code through the Closure
# compiler. You'll have to update the path to reflect where it's
# installed on your system. I used the compiler for static code
# analysis only; index.html runs the unminified code.

java -jar /home/rahulraj/dls/closure-compiler/compiler.jar \
  --js=game.js \
  --js=formFields.js \
  --js=loginForm.js \
  --js=registerForm.js \
  --js=urls.js \
  --js=factory.js \
  --externs=externs.js --warning_level=VERBOSE \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  > /dev/null # We only care about the error output
