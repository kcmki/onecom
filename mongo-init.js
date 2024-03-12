
db.createUser({
    user: 'aadmin',
    pwd: 'admin123',
    roles: [
      {
        role: 'dbOwner',
    },
  ],
});

db.createCollection('users');
db.collection("users").insertOne([
    {
        "name": "Admin",
        "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        "userRole": "admin",
        "userId": "db82fed8c2e3a2bc055cee4a24f89585d7ca857fbdda8e623b0a474d6c41d30b",
        "email": "test@test.com"
    },
]);

