


/**
 * Observer in the Observer pattern
 * @interface
 * @const
 */
networkStickies.Observer = function() {};


/**
 * Call this method to update the observer about a board change.
 * @param {networkStickies.NoteSet} noteSet the updated set of notes.
 * @const
 */
networkStickies.Observer.prototype.onModelChange = function(noteSet) {};
