// MongoDB Setup Commands - Run these in mongosh

// 1. Use/create the database
use authServiceDb

// 2. Create collections
db.createCollection("authUsers")
db.createCollection("realms")
db.createCollection("authRealms")
db.createCollection("realmUsers")
db.createCollection("secrets")

// 3. Insert sample data

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

// Verify collections
db.getCollectionNames()
