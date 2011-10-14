


/**
 * Interface for objects being observed in the Observer pattern.
 * @interface
 * @const
 */
othello.Observable = function() {};


/**
 * Add an observer
 * @param {othello.Observer} observer the observer.
 * @const
 */
othello.Observable.prototype.addObserver = function(observer) {};


/**
 * Inform the observers that state has changed.
 * @const
 */
othello.Observable.prototype.notifyObservers = function() {};

/**
 * Let the observers know the game has started.
 * @const
 */
othello.Observable.prototype.publishInitialMessage = function() {};
