const data = require('./exportedData.json')
const jsonObject = require('./globalHashmapDictionary.json')
const fs = require('fs')
const { ObjectID } = require('bson')
var crypto = require('crypto');

let globalHashmap = new Map()  
for (var value in jsonObject) {  
    globalHashmap.set(value,jsonObject[value])  
    }  
console.log("map:" + globalHashmap);


// CREATE AUTHORS.JSON FILE
let authors = data.authors
authors.forEach(author => {
    author.userName = author.name.split(" ").join("")
    //SPLIT NAMES
    const [first, last] = author.name.split(/\s+(.*)/)
    author.firstName = first
    author.lastName = last
    author._id = {
        "$oid" : globalHashmap.get(author._id)
    }
    author.__v = 0
    author.email = "kf4_" + author.email.split(" ").join("")
    author.hashedPassword = "lZ/vWnD5yIRAeeKPR+fMym9lEh03TFUmjLm7iFJTB58Je5vhyiBaT/MSB0ipQb9YFdUVzWykaqDdf6e/O4dUIg=="
    // author.salt = crypto.randomBytes(16).toString('base64')
    author.salt = "s+D3itcfgvuz2MqM8McA1Q=="
    author.provider = "local"
    delete author.name
    delete author.workspaces
    delete author.type
})
 

//APPEND INTO FILE SYNCHRONOUSLY
authors.forEach(element=>{
    fs.appendFileSync('users.json',JSON.stringify(element)+"\n")
})


//CREATE KCOMMUNITY.JSON
let community = data.community

// "$oid": "root"+community.title.split(" ").join("")
community.rootContextId = {
    "$oid" : new ObjectID()
}

//CHANGE THIS
community.managerRegistrationKey = "build"
community.archived = false
let today = new Date()
community.created =  {
    "$date":  today.getTime()
}
// console.log("date", community.created);
community.promisingcolorobjs = []
community.magnets = []

let scaffoldArray = community.scaffolds
community.scaffolds = []
scaffoldArray.map(oldId=>{
    community.scaffolds.push(
        {
            "$oid" : globalHashmap.get(oldId)
        }
    )
})


let viewsArray = community.views
community.views = []
viewsArray.map(oldId=>{
    community.views.push(
        {
            "$oid" : globalHashmap.get(oldId)
        }
    )
})
community._id = {
    "$oid" : new ObjectID()
}
    
//CHANGE THIS
community.registrationKey = "ges2013-2014"
community.__v = 0

let communityData = JSON.stringify(community)
fs.writeFileSync('kcommunities.json', communityData)



//KLINK GENERATION
let linkArray = data.links
klinks = []
let supportIds = []
linkArray.map(klink => {
    let fromObj = data.contributions.filter(obj => {
        return obj._id === klink.from
    })[0]

    let fAuthors = []
    fromObj.authors.map( author => {
        fAuthors.push({
            "$oid" :  globalHashmap.get(author)
        })
    })

    let toObj = data.contributions.filter(obj => {
        return obj._id === klink.to
    })[0]

    let tAuthors = []
    toObj.authors.map( author => {
        tAuthors.push({
            "$oid" : globalHashmap.get(author)
        })
    })

    let klinkObj ={}
    klinkObj.data = klink.data
    klinkObj.type = klink.type
    klinkObj.__v= 0
    
    klinkObj.from = {
            "$oid" : globalHashmap.get(klink.from)
        }
    
    klinkObj.created = community.created
    klinkObj.communityId = community._id

    klinkObj.to = {
            "$oid" : globalHashmap.get(klink.to)
        }

    
    klinkObj.modified = community.created
    klinkObj._id = {
        "$oid" : globalHashmap.get(klink._id)
    }
    
    if (fromObj) {
        klinkObj._from = {
            "modified": {
                "$date": new Date(fromObj.modified).getTime()
            },
            "status": fromObj.status,
            "_groupMembers": [],
            "created": {
                "$date": new Date(fromObj.created).getTime()
            },
            "permission": fromObj.permission,
            "authors": fAuthors,
            "type": fromObj.type,
            "title": (fromObj.title ? fromObj.title : "title"),
            "langInNote": []
        }
    }

    if (toObj) {
        klinkObj._to = {
            "modified": {
                "$date": new Date(toObj.modified).getTime()
            },
            "status": toObj.status,
            "_groupMembers": [],
            "created": {
                "$date": new Date(toObj.created).getTime()
            },
            "permission": toObj.permission,
            "authors": tAuthors,
            "type": toObj.type,
            "title": (toObj.title ? toObj.title : "title"),
            "langInNote": []
        }
    }

    //CREATE KLINK BY PUSHING A SINGAL OBJECT EACH TIME
    klinks.push(
            //newKlink Object
            klinkObj
    )

    //CREATE SUPPORT IDS
    if(klink.type==="supports"){
        supportIds.push(klink._id)
    }
});

fs.appendFileSync('supportIds.json', JSON.stringify(supportIds))

//modifying the old authors variable
let kobjectauthors = authors;

//CHANGE THE MANAGER WRITER COUNT
let userIdAuthorIdMap = new Map()
let managerCount = 0
let writerCount = 0
kobjectauthors.map( author => {
        let oldId = author._id.$oid 
        let newId = new ObjectID()
        userIdAuthorIdMap.set(oldId, newId)  
        if(author.role === "manager"){
            managerCount++
            author.pseudoName = "M"+managerCount//M1
        } else{
            writerCount++
            author.pseudoName = "W"+writerCount//W1
        }
        author.type =  "Author",
        author.docShared = [],        
        author.title= "",
        // author.lastName, Keep it as it is
        author.comments = "",
        author.createdBy = "",
        author._community = {
            "title": community.title,
            "managerRegistrationKey": community.managerRegistrationKey,
            "archived": false,
            "created": community.created,
            "promisingcolorobjs": [],
            "_id": community._id,
            "hypothesisToken": "",
            "magnets": [],
            "rootContextId": community.rootContextId,
            "scaffolds": community.scaffolds,
            "views": community.views,
            "__v": community.__v,
            "registrationKey": community.registrationKey,
            "hypothesisGroupId": ""
        },
        // author.firstName keep it as it is
        author.__v = 0,
        //author.userName keep it as it is
        author.modified = community.created,
        author.lang = "",
        author.wordCount = 0,
        author.permission = "protected",
        //IMPORTANT CHANGE HERE AND ADD NEW OBJECTID
        //IMPORTANT THE AUTHOR._ID(USERS.JSON) IS THE USERID
        author.userId = oldId         
        author.data = {}
        author.visitorRole = false
        author.docId = ""
        author._groupMembers = []
        author.favAuthors = []
        author.created = community.created
        author.order = 1 //Should we change it?
        // "email": "admin@admin.com", leave it as it is
        //"role": "manager",
        // "_id" CHANGE CREAT NEW
        author._id  = {
            "$oid" : newId
        }
        author.communityId = community._id,
        author.authors = [],
        author.__t = "KAuthor"
        author.status = "active"
})

console.log("HEYYY", userIdAuthorIdMap);

let kObjectAdminObj = {
    "type": "Author",
    "docShared": [],
    "pseudoName": "M1",
    "title": "",
    "lastName": "Admin",
    "comments": "",
    "createdBy": "",
    "_community": {
        "title": community.title,
        "managerRegistrationKey": community.managerRegistrationKey,
        "archived": false,
        "created": community.created,
        "promisingcolorobjs": [],
        "_id": community._id,
        "hypothesisToken": "",
        "magnets": [],
        "rootContextId": community.rootContextId,
        "scaffolds": community.scaffolds,
        "views": community.views,
        "__v": community.__v,
        "registrationKey": community.registrationKey,
        "hypothesisGroupId": ""
    },
    "firstName": "KF",
    "__v": 0,
    "userName": "admin@admin.com",
    "modified": community.created,
    "lang": "",
    "wordCount": 0,
    "permission": "protected",
    "userId": {
        "$oid": "5ff3a1e24855072db0d9a606"
    },
    "data": {},
    "visitorRole": false,
    "docId": "",
    "_groupMembers": [],
    "favAuthors": [],
    "created": community.created,
    "order": 1,
    "email": "admin@admin.com",
    "role": "manager",
    "_id": {
        "$oid": new ObjectID()
    },
    "communityId": community._id,
    "authors": [],
    "__t": "KAuthor",
    "status": "active"
}

kobjectauthors.push(kObjectAdminObj)
    

//OTHER KOBJECTS LIKE NOTE
let contributionObjs = data.contributions;
contributionObjs.map(obj => {
    if (obj && obj.type==="Note") {
        obj.permission = "protected"
        if(obj.data && obj.data.body){
            supportIds.map(oldId => {
                while(obj.data.body.indexOf('"'+oldId+'"')>0){
                    let newId = globalHashmap.get(oldId)
                    // console.log("newId",newId);
                    obj.data.body = obj.data.body.replace(oldId, newId);
                    // console.log("AFTER.........", obj.data.body);
                    // note.data.body = temp
                }
            })   
            
        }
    } else if(obj && obj.type === "View"){
        obj.permission = "protected"
    }

    let authArray =[]
    obj.authors.map(ele => {
        let newId = userIdAuthorIdMap.get(globalHashmap.get(ele))
        // console.log("newId",newId);
        authArray.push(
            {
                "$oid" : newId
            }
        )
    })

    //"type": "Note",
    obj.docShared = [],
    //"title": "",
    obj.comments = "",
    obj.createdBy = "",
    // obj.status": "unsaved",
    // "data": {}
    // "permission": "protected",
    obj.wordCount = 0,
    obj.keywords = [],
    obj.modified = {
        "$date": new Date(obj.modified).getTime()
    },
    obj.langInNote = [],
    obj.visitorRole = false,
    obj.docId = "",
    obj._groupMembers = [],
    obj.favAuthors = [],
    obj.created = {
        "$date": new Date(obj.created).getTime()
    },
    obj._id = {
        "$oid" : globalHashmap.get(obj._id)
    }
    obj.communityId = community._id
    obj.authors = authArray
    obj.__t = "KContribution",
    obj.__v = 0
})

//OTHER KOBJECT CONTEXT

contributionObjs.push({
    "type": "Context",
    "docId": "",
    "communityId": community._id,
    "favAuthors": [],
    "status": "active",
    "comments": "",
    "modified": community.created,
    "createdBy": "",
    "docShared": [],
    "visitorRole": false,
    "data": {
        "defaultLang": [],
        "plugins": {
            "filter": false,
            "viewRearrangement": true,
            "scaffoldgrowth": true,
            "sideToSideNotePosition": false
        },
        "viewSetting": {
            "showGroup": true,
            "language": false,
            "buildson": true,
            "showTime": true,
            "showAuthor": true,
            "references": false
        },
        "languages": [],
        "embeddedScaffold": false,
        "url": "undefined"
    },
    "permission": "protected",
    "_id": community.rootContextId,
    "wordCount": 0,
    "authors": [kObjectAdminObj._id],
    "__t": "KBContext",
    "__v": 18,
    "title": community.title,
    "created": community.created,
    "_groupMembers": []
})


//concat both
//contributionObjs and kobjectauthors
let bothArrays = contributionObjs.concat(kobjectauthors);

//APPEND INTO FILE SYNCHRONOUSLY
bothArrays.forEach(element=>{
    // console.log("Elemenet",element);
    fs.appendFileSync('kobjects.json',JSON.stringify(element)+"\n")
})


fs.appendFileSync('kObjectTemp.json', JSON.stringify(bothArrays))





let noteToViewIds = new Map()
let buildsOnFromLinks = new Map()

klinks.forEach(klink => {
    // SEE IF FROM THAT NOTEVIEW AND BUILDON VIEW IS SAME
    // NOTE AND ITS VIEWIDARRAY
    if (klink._from.type === "View" && klink._to.type === "Note") {
        let viewIdArray = []
        if (noteToViewIds.has(klink.to.$oid)) {
            viewIdArray.concat(noteToViewIds.get(klink.to.$oid))
        }
        viewIdArray.push(klink.from.$oid)

        noteToViewIds.set(klink.to.$oid, viewIdArray)
        // viewToNoteLinkId.set(klink.to.$oid, globalHashmap.get(klink._id.$oid))
    }

    if (klink.type === "buildson") {
        let fromBuildOnArray = []
        if (buildsOnFromLinks.has(klink.from.$oid)) {
            fromBuildOnArray.concat(buildsOnFromLinks.get(klink.from.$oid))
        }
        fromBuildOnArray.push(klink.to.$oid)
        buildsOnFromLinks.set(klink.from.$oid,fromBuildOnArray)
    }
});

// console.log("NOte", noteToViewIds);
// console.log("And", buildsOnFromLinks);
let toUpdateLinks = new Map()

klinks.forEach(klink => {
    // IF LINK IS A VIEWLINK
    if (klink._from.type === "View" && klink._to.type === "Note") {
        // CHECK IF DATA IS NOT IN MAP
        if (klink.data && !toUpdateLinks.has(klink._id.$oid)) {
            let newx = 0
            let newy = 0
            let count = 0
            
            let countx = Math.floor(Math.random() * 101);
            let county = Math.floor(Math.random() * 101);
            klink.data.x = countx*20
            klink.data.y = county*20 

            newx = klink.data.x + 20
            newy = klink.data.y

            if (buildsOnFromLinks.has(klink.to.$oid)) {
                let arrayOfNoteIds = buildsOnFromLinks.get(klink.to.$oid)
                arrayOfNoteIds.forEach(noteId => {
                    if (noteToViewIds.has(noteId) && noteToViewIds.get(noteId).includes(klink.from.$oid)) {
                        let data = {
                            x: newx,
                            y: newy + count
                        }
                        count = count+ 20
                        let obj = klinks.filter(element => {
                            if (element.to.$oid === noteId && element.from.$oid === klink.from.$oid) {
                                toUpdateLinks.set(element._id.$oid, data) 
                                return true
                            }
                        })
                    }
                });
            }
        }    
    }
});

toUpdateLinks.forEach(obj => {
    console.log("UPDATE", obj);
})

klinks.forEach(klink=>{
    if (toUpdateLinks.has(klink._id.$oid)) {
        console.log("REALLY?");
        let data = toUpdateLinks.get(klink._id.$oid)
        klink.data.x = data.x
        klink.data.y = data.y
    } else if(klink.data && klink.data.x && klink.data.y){
        let countx = Math.floor(Math.random() * 101);
        let county = Math.floor(Math.random() * 101);
        klink.data.x = countx*20
        klink.data.y = county*20 
    }
})

console.log("working!!");


//APPEND INTO FILE SYNCHRONOUSLY
klinks.forEach(element=>{
    if (element._from) {
        if (element._from.authors) {
            element._from.authors.map(old => {
                old.$oid = userIdAuthorIdMap.get(old.$oid)
            })
        }
    } 
    
    if (element._to){
        if (element._to.authors) {
            element._to.authors.map(old => {
                old.$oid = userIdAuthorIdMap.get(old.$oid)
            })
        }
    }
    
    // console.log("Elemenet",element);
    fs.appendFileSync('klinks.json',JSON.stringify(element)+"\n")
})









//NOW LAST KRECORDS
let recordsObj = data.records

recordsObj.map(record => {
    let oldId = globalHashmap.get(record.authorId)
    let newId = userIdAuthorIdMap.get(oldId)
    console.log("old",oldId,"NEW", newId);
    record.authorId = {
        "$oid" : newId
    }
        // "type": "created",
        //CHANGE HERE IMPORTANT
        record._id = {
            "$oid" : new ObjectID()
        }
    
     record.communityId = community._id
     record.targetId = {
        "$oid" : globalHashmap.get(record.targetId)
    }
    record.__v = 0,
    record.timestamp = {
            "$date": new Date(record.timestamp).getTime()
        }
})


// let krecordsData = JSON.stringify(recordsObj)
// fs.writeFileSync('krecords.json', krecordsData)

//APPEND INTO FILE SYNCHRONOUSLY
recordsObj.forEach(element=>{
    // console.log("Elemenet",element);
    fs.appendFileSync('krecords.json',JSON.stringify(element)+"\n")
})


// Make historicalObject
const linkData = klinks


let linkMap = linkData
let historicArray =[]
linkMap.map(link =>{
    let pushObj = {}
    pushObj = {
        "data": link,
        "type": "Link",
        // "$oid": //create New One CHANGE HERE
        "dataId":  {
            "$oid" : new ObjectID()
        },
        "_id": {
            "$oid" : globalHashmap.get(link._id)
        },
        "communityId": link.communityId,
        "dataType": "contains",
        "__v": 0
    }
    
    historicArray.push(
        //object
        pushObj
    )
})

// let historicData = JSON.stringify(historicArray)
// fs.writeFileSync('khistoricalobjects.json', historicData)

//APPEND INTO FILE SYNCHRONOUSLY
historicArray.forEach(element=>{
    // console.log("Elemenet",element);
    fs.appendFileSync('khistoricalobjects.json',JSON.stringify(element)+"\n")
})




//ask about IDs? create one bson
//creatiionDate: now()
//hashed Password is not really hashed
//should delete old attributes which are not necessary like name?
//rootContextId amd communityId just create a new id
//email kf4_name_last
//password: known hashed same pass


//RENAME THE FILES ATTACHMENTS
let communityFolder = community._id.$oid
fs.mkdir(__dirname + "/"+communityFolder);
const files = fs.readdirSync(__dirname + "/attachments")
for (const file of files) {
    console.log(file)
    fs.rename(
        __dirname + "/attachments/" + file,
        __dirname + "/" + communityFolder + "/" + globalHashmap.get(file),
        err => {
          console.log(err)
    })
}

console.log("EOF");