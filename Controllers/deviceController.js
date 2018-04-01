var deviceController = function(Device){

    //post a new item
    var post = function(req, res){
        var device = new Device(req.body);

        if(!req.body.title){
            res.status(400);
            res.send("Title is required!");
        }
        else{
            device.save();
            res.status(201);
            res.send(device);
        }
    }
    //get All the items
    var getAll = function(req,res){
        var query = {};
        if(req.query.type) {
            query.type = req.query.type;
        }
        Device.find(query, function(err,devices){
            if(err)
                res.status(500).send(err);
            else
                var returnDevices = [];
                devices.forEach(function(element, index, array){
                    var newDevice = element.toJSON();
                    newDevice._links = {};
                    newDevice._links.self = {};
                    newDevice._links.self.href = 'http://' + req.headers.host + '/api/devices/' + newDevice._id;
                    returnDevices.push(newDevice);
                });
                res.json( {
                    items : returnDevices,
                    _links : {
                        self: {
                            href: 'http://'+req.headers.host+'/api/devices'
                        }
                    },
                    pagination: {
                        test:"hallo"
                    }
                });
        });
    }


    //get individual item
    var get = function(req,res){
            var returnDevice = req.device.toJSON();
            returnDevice._links = {};
            // var newLink = 'http://' + req.headers.host + '/api/devices/?type=' + returnDevice.type;
            // returnDevice.links.filterByType = newLink.replace(' ', '%20');
            var selfLink = 'http://' + req.headers.host + '/api/devices/' + returnDevice._id;
            returnDevice._links.self = {};
            returnDevice._links.self.href = selfLink;
            var collectionLink = 'http://' + req.headers.host + '/api/devices/';
            returnDevice._links.collection = {};
            returnDevice._links.collection.href = collectionLink;

            res.json(returnDevice);
        }
    //update individual item
    var put = function(req,res){
            if(!req.body.title || !req.body.type || !req.body.room || !req.body.state){
                res.status(400);
                res.send("Not all fields filled in!");
            } else {
                req.device.title    = req.body.title;
                req.device.type     = req.body.type;
                req.device.room     = req.body.room;
                req.device.state    = req.body.state;
                req.device.save(function(err){
                    if(err)
                        res.status(500).send(err);
                    else {
                        res.json(req.device);
                    }
                });
            }
        }
    //update single key in item
    var patch = function(req,res){
            if(req.body._id)
                delete req.body._id;
            for(var p in req.body){
                req.device[p] = req.body[p];
            }
            req.device.save(function(err){
                if(err)
                    res.status(500).send(err);
                else {
                    res.json(req.device);
                }
            });
        }
    //delete single item
    var remove = function(req,res){
            req.device.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else {
                    res.status(204).send("Removed");
                }
            });
        }

    //get options
    var collectionOptions = function(req,res){
        res.header('Allow', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.send(200);
    }
    var singleOptions = function(req,res){
        res.header('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');
        res.send(200);
    }

    return {
        post: post,
        getAll: getAll,
        get: get,
        put: put,
        patch: patch,
        delete: remove,
        collectionOptions: collectionOptions,
        singleOptions: singleOptions
    }
}
module.exports = deviceController;