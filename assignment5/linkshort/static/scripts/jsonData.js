

/**
 * @typedef {{shortenedUrl: string, visits: Array.<shortener.VisitJson>,
 *            sinceLastHour: number, sinceLastDay: number,
 *            sinceLastWeek: number, sinceLastMonth: number,
 *            sinceLastYear: number}}
 */
shortener.PageJson;


/**
 * @typedef {{timeVisited: string}}
 */
shortener.VisitJson;
