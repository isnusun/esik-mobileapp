import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class DatabaseResidentIndicator {
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
                            this.db.executeSql('SELECT 1 FROM ResidentIndicator LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    ResidentIndicator (\
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
    totalRI(userid) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM ResidentIndicator WHERE userid = ?', [userid]).then(([tx, results]) => {
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

    listRI(userid, limit, offset) {
        return new Promise((resolve, reject) => {
            const residentIndicators = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM ResidentIndicator where userid = ? limit ? offset ?', [userid, limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        // console.log(`ResidentIndicator ID: ${row.id}, ResidentIndicator Name: ${row.nama}`)
                        const { userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query } = row;
                        residentIndicators.push({
                            userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query
                        });
                    }
                    resolve(residentIndicators);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    totalResidentIndicator(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM ResidentIndicator WHERE userid = ? AND label like ?', [userid, '%' + filter + '%']).then(([tx, results]) => {
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

    listResidentIndicator(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const residentIndicators = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM ResidentIndicator WHERE userid = ? AND label LIKE ? LIMIT ? OFFSET ?', [userid, '%' + filter + '%', limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        // console.log(`ResidentIndicator ID: ${row.id}, ResidentIndicator Name: ${row.nama}`)
                        const { userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query } = row;
                        residentIndicators.push({
                            userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query
                        });
                    }
                    resolve(residentIndicators);
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
                tx.executeSql('INSERT INTO ResidentIndicator(userid, id, nourut, nama, label, jenis, detail, foto, opsi, value, query) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userid, item.id, item.nourut, item.nama, item.label, item.jenis, detail, item.foto, opsi, item.value, item.query],
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
                tx.executeSql('UPDATE ResidentIndicator SET nourut = ?, nama = ?, label = ?, jenis = ?, detail = ?, foto = ?, opsi = ?, value = ?, query = ? WHERE userid = ? AND id = ?', [item.nourut, item.nama, item.label, item.jenis, detail, item.foto, opsi, item.value, item.query, userid, id],
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
                tx.executeSql('SELECT * FROM ResidentIndicator WHERE userid = ? AND id = ? LIMIT 1', [userid, id]).then(([tx, results]) => {
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

    // deleteResidentIndicator(userid, id) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM ResidentIndicator WHERE userid = ? AND id = ?', [userid, id]).then(([tx, results]) => {
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
    //             tx.executeSql('DELETE FROM ResidentIndicator WHERE userid = ?', [userid]).then(([tx, results]) => {
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