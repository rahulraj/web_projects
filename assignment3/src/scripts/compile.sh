#!/bin/bash

java -jar ~/dls/closure-compiler/compiler.jar --compilation_level \
    SIMPLE_OPTIMIZATIONS \
    --js=othello.js \
    --js=utils/utils.js \
    --js=utils/option.js --js=utils/functional.js \
    --js=observer.js --js=observable.js \
    --js=point.js --js=board.js --js=piece.js --js=player.js \
    --js=boardTableView.js \
    --js=gameStartForm.js --js=boardHistory.js \
    --js=gameController.js --js=gameModel.js \
    --js=gameView.js --js=gameFactory.js \
    --externs externs.js \
    --warning_level=VERBOSE \
    --js_output_file=/dev/null
