import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class DatabaseFamilyIndicator {
    db = null
    initDB() {
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
                            this.db = DB;
                            console.log("Database OPEN");
                            this.db.executeSql('SELECT 1 FROM FamilyIndicator LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    FamilyIndicator (\
                                        userid text NOT NULL, \
                                        id, nourut, nama, label, jenis, detail, foto, opsi, value, query, \
                                        PRIMARY KEY(id)\
                                        )'
                                    );
                                }).then(() => {
                                    console.log("Table created successfully");
                                    resolve();
                                }).catch(error => {
                                    console.log(error);
                                    reject(error)
                                });
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error)
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                    reject(error)
                });
        });
    };

    closeDatabase() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                console.log("Closing DB");
                this.db.close()
                    .then(status => {
                        console.log("Database CLOSED");
                        resolve()
                    })
                    .catch(error => {
                        // console.log(error)
                        reject()
                    });
            } else {
                console.log("Database was not OPENED");
                resolve()
            }
        });
    }

    totalFI(userid) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM FamilyIndicator WHERE userid = ?', [userid]).then(([tx, results]) => {
                    // console.log("Query completed");
                    resolve(results.rows.item(0).total)
                });
            }).then((result) => {
                resolve()
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listFI(userid, limit, offset) {
        return new Promise((resolve, reject) => {
            const familyIndicators = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyIndicator where userid = ? limit ? offset ?', [userid, limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        // console.log(`FamilyIndicator ID: ${row.id}, FamilyIndicator Name: ${row.nama}`)
                        const { userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query } = row;
                        familyIndicators.push({
                            userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query
                        });
                    }
                    resolve(familyIndicators);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    totalFamilyIndicator(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM FamilyIndicator WHERE userid = ? AND label like ?', [userid, '%' + filter + '%']).then(([tx, results]) => {
                    // console.log("Query completed");
                    resolve(results.rows.item(0).total)
                });
            }).then((result) => {
                resolve()
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listFamilyIndicator(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const familyIndicators = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyIndicator where userid = ? and label like ? limit ? offset ?', [userid, '%' + filter + '%', limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        // console.log(`FamilyIndicator ID: ${row.id}, FamilyIndicator Name: ${row.nama}`)
                        const { userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query } = row;
                        familyIndicators.push({
                            userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query
                        });
                    }
                    resolve(familyIndicators);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    insertRow(userid, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const detail = JSON.stringify(item.detail)
                const opsi = JSON.stringify(item.opsi)
                tx.executeSql('INSERT INTO FamilyIndicator(userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userid, item.id, item.nourut, item.nama, item.label, item.jenis, detail, item.foto, opsi, item.value, item.query],
                    (tx, results) => {
                        console.log(results)
                        resolve(results);
                    }, (err) => {
                        console.log(err)
                        reject(err)
                    })

            }).then((result) => {
                // console.log(result)
                resolve(result);
            }).catch((err) => {
                // console.log(err)
                reject(err)
            });
        });
    }

    updateById(userid, id, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const detail = JSON.stringify(item.detail)
                const opsi = JSON.stringify(item.opsi)
                tx.executeSql('UPDATE FamilyIndicator SET nourut = ?, nama = ?, label = ?, jenis = ?, detail = ?, foto = ?, opsi = ?, value = ?, query = ? WHERE userid = ? AND id = ?', [item.nourut, item.nama, item.label, item.jenis, detail, item.foto, opsi, item.value, item.query, userid, id],
                    (tx, results) => {
                        // console.log(results)
                        resolve(results);
                    }, (err) => {
                        // console.log(err)
                        reject(err)
                    })
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    findById(userid, id) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyIndicator WHERE userid = ? AND id = ? LIMIT 1', [userid, id]).then(([tx, results]) => {
                    // console.log(results);
                    if (results.rows.length > 0) {
                        let row = results.rows.item(0);
                        resolve(row);
                    } else {
                        resolve(false)
                    }
                });
            }).then((result) => {

            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        })
    }

    // deleteFamilyIndicator(userid, id) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM FamilyIndicator WHERE userid = ? AND id = ?', [userid, id]).then(([tx, results]) => {
    //                 console.log(results);
    //                 resolve(results);
    //             });
    //         }).then((result) => {
    //         }).catch((err) => {
    //             console.log(err);
    //             reject(err)
    //         });
    //     });
    // }

    // deleteAll(userid) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM FamilyIndicator WHERE userid = ?', [userid]).then(([tx, results]) => {
    //                 console.log(results);
    //                 resolve(results);
    //             });
    //         }).then((result) => {
    //         }).catch((err) => {
    //             console.log(err);
    //             reject(err)
    //         });
    //     });
    // }
}