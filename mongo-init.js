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
        "password": process.env.PASSWORD,
        "userRole": "admin",
        "userId": "db82fed8c2e3a2bc055cee4a24f89585d7ca857fbdda8e623b0a474d6c41d30b",
        "email": process.env.EMAIL,
    },
]);