import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class DatabaseFamilyAnswer {
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
                            this.db.executeSql('SELECT 1 FROM FamilyAnswer LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    FamilyAnswer (\
                                        userid text NOT NULL, \
                                        id PRIMARY KEY, \
                                        fi_id, idbdt, answer, foto, lat, lng, \
                                        created_at, \
                                        updated_at \
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

    insertRow(userid, fi_id, idbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                const id = 'fa-' + now
                tx.executeSql('INSERT INTO FamilyAnswer(id, userid, fi_id, idbdt, answer, foto, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, userid, fi_id, idbdt, item.answer, item.foto, item.lat, item.lng, now, now],
                    (tx, results) => {
                        console.log(results)
                        resolve(results);
                    }, (err) => {
                        console.log(err)
                        reject(err)
                    })

            }).then((result) => {
                console.log(result)
                resolve(result);
            }).catch((err) => {
                console.log(err)
                reject(err)
            });
        });
    }

    updateById(userid, fi_id, idbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE FamilyAnswer SET answer = ?, foto = ?, lat = ?, lng = ?, updated_at = ? WHERE userid = ? AND fi_id = ? AND idbdt = ?', [item.answer, item.foto, item.lat, item.lng, now, userid, fi_id, idbdt],
                    (tx, results) => {
                        console.log(results)
                        resolve(results);
                    }, (err) => {
                        console.log(err)
                        reject(err)
                    })
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    findByIdIndicator(userid, fi_id, idbdt) {
        console.log('query' + userid + fi_id + idbdt)
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyAnswer WHERE userid = ? AND fi_id = ? AND idbdt = ?', [userid, fi_id, idbdt]).then(([tx, results]) => {
                    console.log(results);
                    if (results.rows.length > 0) {
                        let row = results.rows.item(0);
                        resolve(row);
                    } else {
                        resolve(false)
                    }
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        })
    }

    findByFamilyId(userid, idbdt) {
        return new Promise((resolve, reject) => {
            const familyAnswers = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyAnswer WHERE userid = ? AND idbdt = ?', [userid, idbdt]).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Family ID: ${row.idbdt}, fi: ${row.fi_id}, answer: ${row.answer}`)
                        const { id, userid, fi_id, idbdt, answer, foto, lat, lng, created_at, updated_at } = row;
                        familyAnswers.push({
                            id, userid, fi_id, idbdt, answer, foto, lat, lng, created_at, updated_at
                        });
                    }
                    // console.log(families);
                    resolve(familyAnswers);
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        })
    }

    totalFamilyAnswer(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM FamilyAnswer WHERE userid = ?', [userid]).then(([tx, results]) => {
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

    listFamilyAnswer(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const familyAnswers = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM FamilyAnswer fa where userid = ? limit ? offset ?', [userid, limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Family ID: ${row.idbdt}, Family Name: ${row.nama_krt}`)
                        const { id, userid, fi_id, idbdt, answer, foto, lat, lng, created_at, updated_at } = row;
                        familyAnswers.push({
                            id, userid, fi_id, idbdt, answer, foto, lat, lng, created_at, updated_at
                        });
                    }
                    // console.log(families);
                    resolve(familyAnswers);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    // deleteFamilyAnswer(userid, fi_id, idbdt) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM FamilyAnswer WHERE userid = ? AND fi_id = ? AND idbdt = ?', [userid, fi_id, idbdt]).then(([tx, results]) => {
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
    //             tx.executeSql('DELETE FROM FamilyAnswer WHERE userid = ?', [userid]).then(([tx, results]) => {
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