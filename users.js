const { MongoClient } = require('mongodb');

// fakedata
const { faker } = require('@faker-js/faker');

const createRandomUser = () => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 1000000,
});

const createUsers = async () => {
    const uri = "mongodb://localhost:27017";
    const DB_NAME = "mongodb-paginated-test";
    const DB_COLLECTION = "users";

    const client = new MongoClient(uri);

    let _message = "";
    //console.log("Users: ", users);

    try {
        await client.connect();
        console.log("Connect to db successful...");

        const db = client.db(DB_NAME);
        const userCollection = db.collection(DB_COLLECTION);

        bulkUpdateOps = [];

        users.forEach((user) => {
            bulkUpdateOps.push({ "insertOne": { "document": user } });
        });

        await userCollection.bulkWrite(bulkUpdateOps).then(function(r) {
            // do something with result
            _message = r;
        });

        return _message;
    } catch (error) {
        console.log(`Ha ocurrido un error en la conexion... ${error}`);
    } finally {
        client.close();
    }

};


createUsers().then((message) => {
    console.log("Message: ", message);
})
.catch((e) => console.log(`Error: ${e}`));