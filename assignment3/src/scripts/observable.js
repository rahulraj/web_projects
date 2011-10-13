


/**
 * Interface for objects being observed in the Observer pattern.
 * @interface
 */
othello.Observable = function() {};


/**
 * Add an observer
 * @param {othello.Observer} observer the observer.
 */
othello.Observable.prototype.addObserver = function(observer) {};


/**
 * Inform the observers that state has changed.
 */
othello.Observable.prototype.notifyObservers = function() {};
