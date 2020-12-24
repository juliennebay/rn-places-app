import * as SQLite from "expo-sqlite";

//expo-sqlite - official docs: https://docs.expo.io/versions/v40.0.0/sdk/sqlite/
//The database is persisted across restarts of your app.

const db = SQLite.openDatabase("places.db");
//connect to this database, or create the db when you first launch the app
//no need to do anything else to access the db
//the code will be executed whenever I execute this file, which happens when you first import this file anywhere

export const init = () => {
  //https://docs.expo.io/versions/v40.0.0/sdk/sqlite/#transaction--objects
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL );",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
  //I can call the init method in other places in the app,
  //and i'll get back a promise that'll either resolve (successful in creating the table) or not resolve (error)
  //note: if the table already exists, no table will be created, but it'll still be resolved.
};

export const insertPlace = (title, imageUri, address, lat, lng) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);",
        //safer to pass in the data into this query like this (prevent sql injection)
        [title, imageUri, address, lat, lng],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
