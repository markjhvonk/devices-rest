// pagination functions
var getPagination = function(total, start, limit) {
    // total current items with/without limit
    var currentItems = function(total, start, limit) {
        if (limit == undefined) {
            return total;
        } else {
            return devices.length;
        }
    };

    // Number of pages
    var numberOfPages = function(total, start, limit) {
        if (limit == undefined) {
            return 1;
        } else {
            return Math.ceil(total / limit);
        }
    };

    // Current Page
    var currentPage = function(total, start, limit) {
        if (limit == undefined || start == undefined) {
            return 1;
        } else {
            return start / limit + 1;
        }
    };

    // Get first Query String
    var getFirstQueryString = function(total, start, limit) {
        if (limit == undefined || start == undefined) {
            return "";
        } else {
            return "?start=" + 1 + "&limit=" + limit;
        }
    };

    // Get last Query String
    var getLastQueryString = function(total, start, limit) {
        if (limit == undefined || start == undefined) {
            return "";
        } else {
            var startCalc = total - limit + 1;
            return "?start=" + startCalc + "&limit=" + limit;
        }
    };

    // Get previous Query String - WIP!!!
    var getPreviousQueryString = function(total, start, limit) {
        if (limit == undefined || start == undefined || start == 0) {
            return "";
        } else {
            var startCalc = start - limit;
            return "?start=" + startCalc + "&limit=" + limit;
        }
    };

    // Get Next Query String - WIP!!!
    var getNextQueryString = function(total, start, limit) {
        if (
            limit == undefined ||
            start == undefined ||
            start == total - limit
        ) {
            return "";
        } else {
            var startCalc = start + limit;
            return "?start=" + startCalc + "&limit=" + limit;
        }
    };

    return {
        currentItems: currentItems,
        numberOfPages: numberOfPages,
        currentPage: currentPage,
        getFirstQueryString: getFirstQueryString,
        getLastQueryString: getLastQueryString,
        getPreviousQueryString: getPreviousQueryString,
        getNextQueryString: getNextQueryString
    };
};
module.exports = paginateController;
