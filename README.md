# Smart devices rest api
This is a personal api project to gather smart home objects in 1 place, where you could potentially manage and controll them.
So in the end these are just the bare bones of a system I thought of for managing smart objects with 1 api.

This api was built using Node.js and the express mvc framework.

## Demo
You can check out the live api [here](http://markvonk.com:8000/api/devices).
Or follow [this git](https://github.com/markjhvonk/devices-vue) to set up the api ui I made with vue.

## Setup
To be able to run this project locally you need to do a few things:
1. Run `npm install` in your console. (in the root directory ofc)
2. In `app.js` on line 9, replace `dataBase.data()` with your own mongoose connection string. (will look something like this `mongodb://username:password@host:port/database?options...`)
3. I added this to a seperate `db.js` export file so it was easier to `.gitignore` my private data. You might want to remove the `require` for this file as well on line 4 of the `app.js`. (`dataBase = require('./db')`)
4. When all of that is sorted, try the `gulp` command in your console and you should be able to access your data on http://localhost:8000/api/devices

