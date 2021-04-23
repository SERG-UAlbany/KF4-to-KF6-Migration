from pymongo import MongoClient
from bson.objectid import ObjectId
import html2text
from random import randrange

# edit this variables
DB_NAME = 'kf6-dev'
DB_HOST = 'localhost'
DB_PORT = 27017
PSEUDO_NAME = 'pseudoName'

client = MongoClient(DB_HOST, DB_PORT)



#communityId = "6048e9939104bc3139e43f12"
communityId = raw_input("Enter communityId")

# UPDATE KLINK POSITION

db = client[DB_NAME]
kLinks = db['klinks']
# GET THE COMMUNITYID FROM DATABASE FIRST
links = db['klinks'].find({"communityId" : ObjectId(communityId),"data.showInPlace": {"$exists": "true"},"data.x":10, "data.y":10})

countx = 10
county = 10

# GET THE RANDOM POSITION FOR LINKS
for link in links:
    countx = randrange(100)
    county = randrange(100)
    kLinks.update_one({'_id': link['_id']}, {'$set': {"data.showInPlace":"true", "data.x":20*countx, "data.y":20*county}})  # SET SHOWINPLACE TRUE





# UPDATE BUILDON PERMISSION

# GET THE COMMUNITYID FROM DATABASE FIRST
links = db['klinks'].find({"communityId" : ObjectId(communityId),"type" : "contains" })

# ADD NOTE PERMISSION PROTECTED AND ADD TEXT4SEARCH
for link in links:
    kLinks.update_one({'_id': link['_id']}, {'$set': {"_from.permission" :"protected","_to.permission" :"protected"}})  # ADD PROTECETD PERMISSION

# GET THE COMMUNITYID FROM DATABASE FIRST
links = db['klinks'].find({"communityId" : ObjectId(communityId),"type" : "buildson" })

# ADD NOTE PERMISSION PROTECTED AND ADD TEXT4SEARCH
for link in links:
    kLinks.update_one({'_id': link['_id']}, {'$set': {"_from.permission" :"protected","_to.permission" :"protected"}})  # ADD PROTECETD PERMISSION





# REMOVE EMPTY TITLE NOTES UPDATE TEXT4SEARCH 

kObjects = db['kobjects']

kObjects.remove({"communityId" : ObjectId(communityId), "type" : "Note", "title" : ""})

# GET THE COMMUNITYID FROM DATABASE FIRST
notes = db['kobjects'].find({"communityId" : ObjectId(communityId),"type" : "Note" })

# ADD NOTE PERMISSION PROTECTED AND ADD TEXT4SEARCH
for note in notes:
    html = note['data']['body']
    textStr = html2text.html2text(html)
    kObjects.update_one({'_id': note['_id']}, {'$set': {'permission': "protected",'text4search': textStr}})  # ADD PROTECETD PERMISSION






# UPDATE USER COUNTER AND PSEUDONAME

kObjects = db['kobjects']
users = db['users']

usersToUpdate = db['users'].find({"userCounter" : { "$exists": False}})
# CHANGE THIS
userCounter = db['users'].count()

for user in usersToUpdate:
    userCounter += 1
    users.update_one({'_id': user['_id']}, {'$set': {"userCounter": userCounter}})

    # FIND AUTHORS WITH SAME USERID AND UPDATE PSEUDONAMES ACCORDING TO ROLES
    authors = kObjects.find({'type': 'Author', 'userId': user['_id']})
    if authors:
        for author in authors:
            role = author["role"]
            if role == 'manager':
                kObjects.update_one({'_id': author['_id']}, {'$set': {
                    PSEUDO_NAME: 'M'+str(userCounter)}})  # ADD PSEUDONAME M{USERCOUNTER}
            elif role == 'writer':
                kObjects.update_one({'_id': author['_id']}, {'$set': {
                    PSEUDO_NAME: 'W'+str(userCounter)}})  # ADD PSEUDONAME W{USERCOUNTER}





client.close()



