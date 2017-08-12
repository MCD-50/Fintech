
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

function DB(credentials) {
  const DB_NAME = 'expenses';
  const COLLECTION_NAME = 'expenses';
  const self = this;
  let db;

  self.type = function() {
    return 'Compose for MongoDB';
  };

  self.init = () => {
    return new Promise((resolve, reject) => {
      var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];
      MongoClient.connect(credentials.uri, {
        mongos: {
          ssl: true,
          sslValidate: true,
          sslCA: ca,
          poolSize: 1,
          reconnectTries: 1
        }
      }, (err, mongoDb) => {
        if (err) {
          reject(err);
        } else {
          db = mongoDb.db(DB_NAME).collection(COLLECTION_NAME);
          resolve();
        }
      });
    })
  };

  self.count = () => {
    console.log('count');
    return new Promise((resolve, reject) => {
      db.count((err, count) => {
        if (err) {
          reject(err);
        } else {
          console.log('counted', count);
          resolve(count);
        }
      });
    });
  };

  self.search = () => {
    console.log('search');
    return new Promise((resolve, reject) => {
      db.find().toArray((err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log('searched', result);
          resolve(result.map(expense => {
            expense.id = expense._id;
            delete expense._id;
            return expense;
          }));
        }
      });
    });
  };

  self.create = (item) => {
    console.log('create', item);
    return new Promise((resolve, reject) => {
      db.insertOne(item, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const newItem = {
            id: result.ops[0]._id,
            title: item.title,
            completed: item.completed,
            order: item.order
          };
          console.log('created', newItem);
          resolve(newItem);
        }
      });
    });
  };

  self.read = (id) => {
    console.log('read', id);
    return new Promise((resolve, reject) => {
      db.findOne({ _id: new mongodb.ObjectID(id) }, (err, item) => {
        if (err) {
          reject(err);
        } else {
          item.id = item._id;
          delete item._id;
          console.log('read', item);
          resolve(item);
        }
      });
    });
  };

  self.update = (id, newValue) => {
    console.log('update', id, newValue);
    return new Promise((resolve, reject) => {
      delete newValue.id;
      db.findAndModify({ _id: new mongodb.ObjectID(id) }, [], newValue, { upsert: true }, (err, updatedItem) => {
        if (err) {
          reject(err);
        } else {
          newValue.id = id;
          delete newValue._id;
          console.log('updated', newValue);
          resolve(newValue);
        }
      });
    });
  };

  self.delete = (id) => {
    console.log('delete', id);
    return new Promise((resolve, reject) => {
      db.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log('deleted', id);
          resolve({ id: id });
        }
      });
    });
  };
}

module.exports = function(credentials) {
  return new DB(credentials);
}
