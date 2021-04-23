const data = require('./exportedData.json')
const fs = require('fs')
ObjectID = require('mongodb').ObjectID

//globalHashMap
let globalHashmap = new Map()

//SAVE A JSON FILE WHICH SCAFFOLD[OLD_ID] = NEW OBJECT_ID
let scaffoldIds = data.community.scaffolds
let scaffoldDictionary = new Map()
scaffoldIds.map(oldId =>{
    let newId = new ObjectID()
    scaffoldDictionary.set(oldId, newId)
    globalHashmap.set(oldId, newId)
})

console.log("HashMap", scaffoldDictionary);

let strigifiedScaffold = JSON.stringify([...scaffoldDictionary])
fs.writeFileSync('scaffoldDictionary.json',strigifiedScaffold)

//SAVE A JSON FILE WHICH SCAFFOLD[OLD_ID] = NEW OBJECT_ID
let viewIds = data.community.views
let viewsDictionary = new Map()
viewIds.map(oldId =>{
    let newId = new ObjectID()
    viewsDictionary.set(oldId, newId)
    globalHashmap.set(oldId, newId)
})

console.log("HashMap", viewsDictionary);

let strigifiedViews = JSON.stringify([...viewsDictionary])
fs.writeFileSync('viewsDictionary.json',strigifiedViews)


//SAVE A JSON FILE WHICH AUTHORS[OLD_ID] = NEW OBJECT_ID
let authorIds = data.authors
let authorsDictionary = new Map()
authorIds.map(oldId =>{
    let newId = new ObjectID()
    authorsDictionary.set(oldId._id, newId)
    globalHashmap.set(oldId._id, newId)
})

console.log("HashMap", authorsDictionary);

let strigifiedAuthors = JSON.stringify([...authorsDictionary])
fs.writeFileSync('authorsDictionary.json',strigifiedAuthors)


//SAVE A JSON FILE WHICH LINK[OLD_ID] = NEW OBJECT_ID
let linkIds = data.links
let linksDictionary = new Map()
linkIds.map(oldId =>{
    let newId = new ObjectID()
    linksDictionary.set(oldId._id, newId)
    globalHashmap.set(oldId._id, newId)
})

console.log("HashMap", linksDictionary);

let strigifiedLinks = JSON.stringify([...linksDictionary])
fs.writeFileSync('linksDictionary.json',strigifiedLinks)



//SAVE A JSON FILE WHICH OBJECTS[OLD_ID] = NEW OBJECT_ID
let objectIds = data.contributions
let objectsDictionary = new Map()
objectIds.map(oldId =>{
    let newId = new ObjectID()
    objectsDictionary.set(oldId._id, newId)
    globalHashmap.set(oldId._id, newId)
})

console.log("HashMap", objectsDictionary);

let strigifiedObjects = JSON.stringify([...objectsDictionary])
fs.writeFileSync('objectsDictionary.json',strigifiedObjects)



// FINAL GLOBAL HASHMAP WRITE
let jsonObject = {};
globalHashmap.forEach((value, key) => {  
    jsonObject[key] = value  
});  
console.log(JSON.stringify(jsonObject))  

let strigifiedGlobal = JSON.stringify(jsonObject)
fs.writeFileSync('globalHashmapDictionary.json',strigifiedGlobal)

// let strigifiedGlobal = JSON.stringify([...globalHashmap])
//fs.writeFileSync('globalHashmapDictionary.json',strigifiedGlobal)









