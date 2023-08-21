const { MongoClient } = require('mongodb');

const itemsAggregate = async (limit, page) => {
    const uri = "mongodb://localhost:27017";
    const DB_NAME = "mongodb-paginated-test";
    const DB_COLLECTION = "users";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connect to db successful...");

        const db = client.db(DB_NAME);
        const userCollection = db.collection(DB_COLLECTION);

        // Aggregate
        const usersPaginated = await userCollection.aggregate([
            { '$match'    : { "username": { $ne: null }} },
            { '$sort'     : { 'name': -1 } },
            { '$facet'    : {
                metadata: [ { $count: "total" }],
                data: [ { $skip: page * limit }, { $limit: limit } ] // add projection here wish you re-shape the docs
            } }
        ]).toArray();

        return usersPaginated[0];
    } catch (error) {
        console.log(`Ha ocurrido un error en la conexion... ${error}`);
    } finally {
        client.close();
    }

};

const itemsFind = async (limit, page) => {
    const uri = "mongodb://localhost:27017";
    const DB_NAME = "mongodb-paginated-test";
    const DB_COLLECTION = "users";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connect to db successful...");

        const db = client.db(DB_NAME);
        const userCollection = db.collection(DB_COLLECTION);

        // Find
        const usersPaginated = await userCollection.find({
            "username": { $ne: null }
        });
        const total = await usersPaginated.count();

        return {
            data: await usersPaginated.limit(limit).skip(limit * page).sort({"name": -1}).toArray(),
            metadata: {
                total
            }
        };
    } catch (error) {
        console.log(`Ha ocurrido un error en la conexion... ${error}`);
    } finally {
        client.close();
    }

};

module.exports = {
    itemsAggregate,
    itemsFind
};