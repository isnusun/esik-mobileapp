import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {

    initDB() {
        let db;
        return new Promise((resolve, reject) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            console.log("Database OPEN");
                            db.executeSql('SELECT 1 FROM Wilayah LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS Wilayah (userid, tingkat, kode, nama, dusun, rt, rw)');
                                }).then(() => {
                                    console.log("Table created successfully");
                                    resolve(db);
                                }).catch(error => {
                                    console.log(error);
                                    reject(db, error)
                                });
                            });
                            resolve(db)
                        })
                        .catch(error => {
                            console.log(error);
                            reject(db, error)
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                    reject(db, error)
                });
        });
    };

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            console.log("Database was not OPENED");
        }
    };


    insertData({userid, tingkat, kode, nama, dusun, rt, rw}) {
        return new Promise((resolve, reject) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO Wilayah VALUES (?, ?, ?, ?, ?, ?, ?)', [userid, tingkat, kode, nama, dusun, rt, rw]).then(([tx, results]) => {
                        this.closeDatabase(db);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                    this.closeDatabase(db);
                    reject(err)
                });
            }).catch((db, err) => {
                console.log(err);
                this.closeDatabase(db);
                reject(err)
            });
        });
    }

    listData() {
        return new Promise((resolve) => {
            const datas = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT userid, tingkat, kode, nama, dusun, rt, rw FROM Wilayah', []).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`ID: ${row.userid}, Name: ${row.nama}`)
                            const { userid, tingkat, kode, nama, dusun, rt, rw } = row;
                            datas.push({
                                userid, tingkat, kode, nama, dusun, rt, rw
                            });
                        }
                        console.log(datas);
                        resolve(datas);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                    this.closeDatabase(db);
                });
            }).catch((err) => {
                console.log(err);
                this.closeDatabase(db);
            });
        });
    }

    productById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        if (results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }


    updateProduct(id, prod) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?', [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    deleteProduct(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM Product WHERE prodId = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}