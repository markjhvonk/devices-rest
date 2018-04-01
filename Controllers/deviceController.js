var deviceController = function (Device) {
    //post a new item
    var post = function (req, res) {
        var device = new Device(req.body);

        if (!req.body.title) {
            res.status(400);
            res.send("Title is required!");
        } else {
            device.save();
            res.status(201);
            res.send(device);
        }
    };

    // pagination variables
    var start;
    var limit;
    var total;

    // var getPagination = require('paginateController.js')(total, start, limit);

    //get All the items
    var getAll = function (req, res) {
        if (req.query.start != undefined) {
            start = parseInt(req.query.start);
            console.log("start: " + start);
        } else {
            start = undefined;
        }
        if (req.query.limit != undefined) {
            limit = parseInt(req.query.limit);
            console.log("limit: " + limit);
        } else {
            limit = undefined;
        }

        var query = {};
        if (req.query.type) {
            query.type = req.query.type;
        }

        //Get total
        Device.count({}, function (err, count) {
            total = count;
            console.log("Count is " + count);
        });

        Device.find(query, function (err, devices) {
            // pagination functions
            // total current items with/without limit
            function currentItems(total, start, limit) {
                if (limit == undefined) {
                    return total;
                } else {
                    return devices.length;
                }
            }
            console.log("CurrentItems: " + currentItems(total, start, limit));

            // Total number of pages
            function numberOfPages(total, start, limit) {
                if (limit == undefined) {
                    return 1;
                } else {
                    return Math.ceil(total / limit);
                }
            }
            console.log("NumberOfPages: " + numberOfPages(total, start, limit));

            // Current Page
            function currentPage(total, start, limit) {
                if (limit == undefined || start == undefined) {
                    return 1;
                } else {
                    return Math.ceil(start / limit) + 1;
                }
            }
            console.log("currentPage: " + currentPage(total, start, limit));

            // Get first Query String
            function getFirstQueryString(total, start, limit) {
                if (limit == undefined || start == undefined) {
                    return "";
                } else {
                    return "?start=" + 0 + "&limit=" + limit;
                }
            }
            console.log(
                "getFirstQueryString: " +
                getFirstQueryString(total, start, limit)
            );

            // Get last Query String
            function getLastQueryString(total, start, limit) {
                if (limit == undefined || start == undefined) {
                    return "";
                } else {
                    // var startCalc = total - limit + 1;
                    var startCalc = (Math.ceil(total / limit) * limit) - limit;
                    return "?start=" + startCalc + "&limit=" + limit;
                }
            }
            console.log(
                "getLastQueryString: " + getLastQueryString(total, start, limit)
            );

            // Get previous Query String
            function getPreviousQueryString(total, start, limit) {
                if (limit == undefined || start == undefined || start == 0) {
                    return "";
                } else {
                    var startCalc = start - limit;
                    return "?start=" + startCalc + "&limit=" + limit;
                }
            }
            console.log(
                "getPreviousQueryString: " +
                getPreviousQueryString(total, start, limit)
            );

            // Get Next Query String
            function getNextQueryString(total, start, limit) {
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
            }
            console.log(
                "getNextQueryString: " + getNextQueryString(total, start, limit)
            );

            // console.log(devices);
            if (err) res.status(500).send(err);
            else var returnDevices = [];
            devices.forEach(function (element, index, array) {
                var newDevice = element.toJSON();
                newDevice._links = {};
                newDevice._links.self = {};
                newDevice._links.self.href =
                    "http://" +
                    req.headers.host +
                    "/api/devices/" +
                    newDevice._id;
                returnDevices.push(newDevice);
            });
            res.json({
                items: returnDevices,
                _links: {
                    self: {
                        href: "http://" + req.headers.host + "/api/devices"
                    }
                },
                pagination: {
                    currentPage: currentPage(total, start, limit),
                    currentItems: currentItems(total, start, limit),
                    totalPages: numberOfPages(total, start, limit),
                    totalItems: total,
                    _links: {
                        first: {
                            page: 1,
                            href:
                                "http://" +
                                req.headers.host +
                                "/api/devices/" +
                                getFirstQueryString(total, start, limit)
                        },
                        last: {
                            page: numberOfPages(total, start, limit),
                            href:
                                "http://" +
                                req.headers.host +
                                "/api/devices/" +
                                getLastQueryString(total, start, limit)
                        },
                        previous: {
                            page: currentPage(total, start, limit) - 1,
                            href:
                                "http://" +
                                req.headers.host +
                                "/api/devices/" +
                                getPreviousQueryString(total, start, limit)
                        },
                        next: {
                            page: currentPage(total, start, limit) + 1,
                            href:
                                "http://" +
                                req.headers.host +
                                "/api/devices/" +
                                getNextQueryString(total, start, limit)
                        }
                    }
                }
            });
        })
            .skip(start)
            .limit(limit);
    };

    //get individual item
    var get = function (req, res) {
        var returnDevice = req.device.toJSON();
        returnDevice._links = {};
        // var newLink = 'http://' + req.headers.host + '/api/devices/?type=' + returnDevice.type;
        // returnDevice.links.filterByType = newLink.replace(' ', '%20');
        var selfLink =
            "http://" + req.headers.host + "/api/devices/" + returnDevice._id;
        returnDevice._links.self = {};
        returnDevice._links.self.href = selfLink;
        var collectionLink = "http://" + req.headers.host + "/api/devices/";
        returnDevice._links.collection = {};
        returnDevice._links.collection.href = collectionLink;

        res.json(returnDevice);
    };
    //update individual item
    var put = function (req, res) {
        if (
            !req.body.title ||
            !req.body.type ||
            !req.body.room ||
            !req.body.state
        ) {
            res.status(400);
            res.send("Not all fields filled in!");
        } else {
            req.device.title = req.body.title;
            req.device.type = req.body.type;
            req.device.room = req.body.room;
            req.device.state = req.body.state;
            req.device.save(function (err) {
                if (err) res.status(500).send(err);
                else {
                    res.json(req.device);
                }
            });
        }
    };
    //update single key in item
    var patch = function (req, res) {
        if (req.body._id) delete req.body._id;
        for (var p in req.body) {
            req.device[p] = req.body[p];
        }
        req.device.save(function (err) {
            if (err) res.status(500).send(err);
            else {
                res.json(req.device);
            }
        });
    };
    //delete single item
    var remove = function (req, res) {
        req.device.remove(function (err) {
            if (err) res.status(500).send(err);
            else {
                res.status(204).send("Removed");
            }
        });
    };

    //get options
    var collectionOptions = function (req, res) {
        res.header("Allow", "GET,POST,OPTIONS");
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.send(200);
    };
    var singleOptions = function (req, res) {
        res.header("Allow", "GET,PUT,PATCH,DELETE,OPTIONS");
        res.header(
            "Access-Control-Allow-Methods",
            "GET,PUT,PATCH,DELETE,OPTIONS"
        );
        res.send(200);
    };

    return {
        post: post,
        getAll: getAll,
        get: get,
        put: put,
        patch: patch,
        delete: remove,
        collectionOptions: collectionOptions,
        singleOptions: singleOptions
    };
};
module.exports = deviceController;
