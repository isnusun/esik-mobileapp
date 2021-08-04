import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class DatabaseResidentAnswer {
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
                            this.db.executeSql('SELECT 1 FROM ResidentAnswer LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    ResidentAnswer (\
                                        userid text NOT NULL, \
                                        id PRIMARY KEY, \
                                        ri_id, idartbdt, answer, foto, lat, lng, \
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

    insertRow(userid, ri_id, idartbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                const id = 'ra-' + now
                tx.executeSql('INSERT INTO ResidentAnswer(id, userid, ri_id, idartbdt, answer, foto, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, userid, ri_id, idartbdt, item.answer, item.foto, item.lat, item.lng, now, now],
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

    updateById(userid, ri_id, idartbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE ResidentAnswer SET answer = ?, foto = ?, lat = ?, lng = ?, updated_at = ? WHERE userid = ? AND ri_id = ? AND idartbdt = ?', [item.answer, item.foto, item.lat, item.lng, now, userid, ri_id, idartbdt],
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

    findByIdIndicator(userid, ri_id, idartbdt) {
        console.log('query' + userid + ri_id + idartbdt)
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM ResidentAnswer WHERE userid = ? AND ri_id = ? AND idartbdt = ?', [userid, ri_id, idartbdt]).then(([tx, results]) => {
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

    findByResidentId(userid, idartbdt) {
        return new Promise((resolve, reject) => {
            const residentAnswers = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM ResidentAnswer WHERE userid = ? AND idartbdt = ?', [userid, idartbdt]).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Resident ID: ${row.idartbdt}, ri: ${row.ri_id}, answer: ${row.answer}`)
                        const { id, userid, ri_id, idartbdt, answer, foto, lat, lng, created_at, updated_at } = row;
                        residentAnswers.push({
                            id, userid, ri_id, idartbdt, answer, foto, lat, lng, created_at, updated_at
                        });
                    }
                    // console.log(families);
                    resolve(residentAnswers);
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        })
    }

    totalResidentAnswer(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(id) as total FROM ResidentAnswer WHERE userid = ?', [userid]).then(([tx, results]) => {
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

    listResidentAnswer(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const residentAnswers = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM ResidentAnswer fa where userid = ? limit ? offset ?', [userid, limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Resident ID: ${row.idartbdt}, Resident Name: ${row.nama_krt}`)
                        const { id, userid, ri_id, idartbdt, answer, foto, lat, lng, created_at, updated_at } = row;
                        residentAnswers.push({
                            id, userid, ri_id, idartbdt, answer, foto, lat, lng, created_at, updated_at
                        });
                    }
                    // console.log(families);
                    resolve(residentAnswers);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    // deleteResidentAnswer(userid, ri_id, idartbdt) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM ResidentAnswer WHERE userid = ? AND ri_id = ? AND idartbdt = ?', [userid, ri_id, idartbdt]).then(([tx, results]) => {
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
    //             tx.executeSql('DELETE FROM ResidentAnswer WHERE userid = ?', [userid]).then(([tx, results]) => {
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