var express = require("express");

var routes = function(Device) {
    var deviceRouter = express.Router();

    var deviceController = require("../Controllers/deviceController.js")(
        Device
    );

    //routes for general post & get methods
    deviceRouter
        .route("/")
        //trigger controller function to post new item
        .post(deviceController.post)
        //trigger controller function to get list of all items
        .get(deviceController.getAll)
        //trigger controller function to get options
        .options(deviceController.collectionOptions);

    //fetch single items
    deviceRouter.use("/:deviceId", function(req, res, next) {
        Device.findById(req.params.deviceId, function(err, device) {
            if (err) res.status(500).send(err);
            else if (device) {
                req.device = device;
                next();
            } else {
                res.status(404).send("no device found");
            }
        });
    });

    deviceRouter
        .route("/:deviceId")
        //trigger controller function to get individual item
        .get(deviceController.get)
        //trigger controller function to update individual item
        .put(deviceController.put)
        //trigger controller function to update single key in individual item
        .patch(deviceController.patch)
        //trigger controller function to delete individual item
        .delete(deviceController.delete)
        //trigger controller function to get options
        .options(deviceController.singleOptions);

    return deviceRouter;
};

module.exports = routes;
