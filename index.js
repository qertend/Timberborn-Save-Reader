const fs = require("fs")
const path = require("path")
const saveReader = require("./saveReader.js")
const express = require("express")
const app = express()
const savesDir = fs.readFileSync(__dirname + "/Timberborn_save_location.txt").toString("utf-8")

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    //console.log("requested home page")
    res.sendFile(__dirname + "/public/homePage.html")
})

app.get("/saves", (req, res) => {
    //dir filtering stolen from https://stackoverflow.com/questions/41472161/fs-readdir-ignore-directories
    const dirents = fs.readdirSync(savesDir, { withFileTypes: true })
    const cache = {}
    const dirNames = dirents
        .filter(dirent => !dirent.isFile())
        .sort((a, b) => {
            /**
             * Sorts folders based on the last modified file in the folders; \
             * youngest folder first
             */
            let AlatestSaveTime = 0;
            if (!cache[a.name]) {
                for (file of fs.readdirSync(path.join(a.path, a.name))) {
                    let saveTime = fs.statSync(path.join(a.path, a.name, file)).mtimeMs
                    if (saveTime > AlatestSaveTime) AlatestSaveTime =  saveTime
                }
                cache[a.name] = AlatestSaveTime
            }
            let BlatestSaveTime = 0;
            if (!cache[b.name]) {
                for (file of fs.readdirSync(path.join(b.path, b.name))) {
                    let saveTime = fs.statSync(path.join(b.path, b.name, file)).mtimeMs
                    if (saveTime > BlatestSaveTime) BlatestSaveTime =  saveTime
                }
                cache[b.name] = BlatestSaveTime
            }
            return cache[b.name] - cache[a.name]
        })
        .map(dirent => dirent.name);
    res.end(JSON.stringify(dirNames))
})

app.get("/data", (req, res) => {
    //console.log(req.query)
    const curSave = path.join(savesDir, req.query.save)
    let saveFilePath;
    let latestMTime = 0;
    for (file of fs.readdirSync(curSave)) {
        var stats = fs.statSync(path.join(curSave, file))
        var mtime = stats.mtimeMs
        if (mtime > latestMTime) {
            latestMTime = mtime
            saveFilePath = file
        }
    }
    saveFilePath = path.join(curSave, saveFilePath)
    
    saveReader(saveFilePath, (result) => {
        if (!req.query.sendErrors) result.errors = undefined
        res.end(JSON.stringify(result));
    })
    
})

app.listen(8000, () => {
    console.log("server up and running on http://localhost:8000")
})