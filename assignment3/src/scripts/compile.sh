#!/bin/bash

# This is an example of how to run the code through the Closure
# compiler. You'll have to update the path to reflect where it's
# installed on your system. I used the compiler for static code
# analysis only; index.html runs the unminified code.

java -jar /home/rahulraj/dls/closure-compiler/compiler.jar \
  --js=othello.js --js=utils/utils.js --js=utils/functional.js \
  --js=utils/option.js --js=point.js --js=piece.js --js=board.js \
  --js=player.js --js=observer.js --js=observable.js \
  --js=boardHistory.js --js=gameStartForm.js --js=startFormController.js \
  --js=boardDivView.js \
  --js=boardTableView.js --js=gameView.js --js=gameModel.js \
  --js=gameController.js --js=gameFactory.js --js=main.js \
  --externs=externs.js --warning_level=VERBOSE \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  > /dev/null # We only care about the error output
