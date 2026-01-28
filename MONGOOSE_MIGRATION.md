# MongoDB + Mongoose Migration Guide

## Step 1: MongoDB Setup (Run in mongosh)

```javascript
use authServiceDb

db.createCollection("authUsers")
db.createCollection("realms")
db.createCollection("authRealms")
db.createCollection("realmUsers")
db.createCollection("secrets")

// Auth Users
db.authUsers.insertOne({
  id: "1",
  email: "yassin@gmail.com",
  password: "$2b$10$XOrNr7r6/jXHT7P4Y.eLz.zMQsov8adejEUNdWIuVD/dDk/WPSZEa",
  username: "yassin",
  roles: ["admin", "user"],
  realmId: 1
})

// Realms
db.realms.insertMany([
  {
    id: "1",
    name: "realm 1",
    description: "new realm"
  },
  {
    id: "2",
    name: "realm 2",
    description: "second realm"
  }
])

// Auth Realms
db.authRealms.insertOne({
  id: 1,
  name: "User managment",
  description: "auth realm"
})

// Realm Users
db.realmUsers.insertMany([
  {
    id: 1,
    email: "mohamed1@gmail.com",
    username: "mohamed2",
    password: "$2b$10$2cxqAQ1petQX.nvZB8gPt.YMNOMvZIj8wMQtx.wcSxTgHUMohjURq",
    roles: ["user"],
    realmId: 1
  },
  {
    id: 2,
    email: "samy@gmail.com",
    username: "samy",
    password: "$2b$10$GA0p3eOKGeospcKbAO.MN.vN2lEUQEXfmeTCzGskQPowPlrVfjXoG",
    roles: ["admin", "supervisor"],
    realmId: 2
  },
  {
    id: 3,
    email: "hamma@gmail.com",
    username: "hamma",
    password: "$2b$10$3N0sV6oCGbXcQ3lr2RdIXu7uElPfBNe4rNNNqzgyKYQKBBTrNd4ry",
    roles: ["user"],
    realmId: 1
  }
])

// Secrets
db.secrets.insertMany([
  {
    realmId: 1,
    realmSecret: "this_is_an_updated_realm_secret"
  },
  {
    realmId: 2,
    realmSecret: "nodejs"
  },
  {
    realmId: 3,
    realmSecret: "this_is_a_new_realm_secret"
  }
])
```

## Step 2: Mongoose Migration Done

✅ Created Mongoose models:
- `src/models/AuthUser.ts`
- `src/models/RealmUser.ts`
- `src/models/Realm.ts`
- `src/models/Secret.ts`
- `src/models/AuthRealm.ts`

✅ Created database config:
- `src/config/database.ts`

✅ Updated server connection:
- `src/server.ts` - Now connects to MongoDB

✅ Updated JWT service:
- `src/services/jwtService.ts` - Uses Mongoose instead of file I/O

✅ Updated authUsers service (PARTIAL):
- `src/authUsers/authUsersService-new.ts` - Created with Mongoose patterns

## Step 3: Complete Remaining Services

Update remaining services similarly:
1. `src/realms/appRealm/appRealmService.ts` - Replace with Mongoose
2. `src/realms/authServiceRealm/authRealmService.ts` - Replace with Mongoose
3. `src/realms/realmUsers/realmUsersService.ts` - Replace with Mongoose
4. `src/realms/secrets/secretService.ts` - Replace with Mongoose

## Step 4: Update .env

Add MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/authServiceDb
ISSUER=your_issuer
```

## Step 5: Install and Build

```bash
npm install
npm run build
npm start
```

## Notes

The migration replaces all file-based I/O (db.json) with MongoDB queries via Mongoose.
- `.find()` - Get all documents
- `.findOne()` - Get single document
- `.findByIdAndUpdate()` - Update document
- `.findByIdAndDelete()` - Delete document
- `.save()` - Create document
