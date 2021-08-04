import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "jersus.v-1.3.db";
const database_version = "1.3";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {
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
                            this.db.executeSql('SELECT 1 FROM Resident LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    Resident (\
                                        userid TEXT NOT NULL, \
                                        idbdt TEXT NOT NULL,\
                                        idartbdt TEXT NOT NULL,\
                                        nama, \
                                        nik, \
                                        nokk, \
                                        tmplahir, \
                                        tgllahir, \
                                        jnskel, \
                                        pendataan_status INTEGER DEFAULT 0, \
                                        upload_status INTEGER DEFAULT 0,\
                                        pendataan_tanggal, \
                                        kode_wilayah, \
                                        dusun, \
                                        rw, \
                                        rt, \
                                        uploaded_at DATETIME NULL, \
                                        PRIMARY KEY(userid, idartbdt)\
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
    totalResident(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(idartbdt) as total FROM Resident WHERE userid = ? AND nama like ?', [userid, '%' + filter + '%']).then(([tx, results]) => {
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

    listResident(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const residents = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Resident where userid = ? and nama like ? limit ? offset ?', [userid, '%' + filter + '%', limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Resident ID: ${row.idartbdt}, Resident Name: ${row.nama}`)
                        const { userid, idartbdt, idbdt, nama, nik, nokk, tmplahir, tgllahir, jnskel, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt} = row;
                        residents.push({
                            userid, idartbdt, idbdt, nama, nik, nokk, tmplahir, tgllahir, jnskel, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt
                        });
                    }
                    resolve(residents);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listFamilyMember(userid, idbdt) {
        return new Promise((resolve, reject) => {
            const residents = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Resident where userid = ? and idbdt = ? ', [userid, idbdt]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Resident ID: ${row.idartbdt}, Resident Name: ${row.nama}`)
                        const { userid, idartbdt, idbdt, nama, nik, nokk, tmplahir, tgllahir, jnskel, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt } = row;
                        residents.push({
                            userid, idartbdt, idbdt, nama, nik, nokk, tmplahir, tgllahir, jnskel, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt
                        });
                    }
                    resolve(residents);
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
                tx.executeSql('INSERT INTO Resident(userid, idartbdt, idbdt, nama, nik, nokk, tmplahir, tgllahir, jnskel, kode_wilayah, dusun, rw, rt, pendataan_status, upload_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)', [userid, item.idartbdt, item.idbdt, item.nama, item.nik, item.nokk, item.tmplahir, item.tgllahir, item.jnskel, item.kode_wilayah, item.dusun, item.rw, item.rt],
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

    updateByIdartbdt(userid, idartbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Resident SET idbdt = ?, nama = ?, nik = ?, nokk = ?, tmplahir = ?, tgllahir = ?, jnskel = ?, kode_wilayah = ?, dusun = ?, rw = ?, rt = ? WHERE userid = ? AND idartbdt = ?',
                    [item.idbdt, item.nama, item.nik, item.nokk, item.tmplahir, item.tgllahir, item.jnskel, item.kode_wilayah, item.dusun, item.rw, item.rt, userid, idartbdt],
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

    updateStatusByIdartbdt(userid, idartbdt, status) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE Resident SET pendataan_status = ?, pendataan_tanggal = ? WHERE userid = ? AND idartbdt = ?',
                    [status, now, userid, idartbdt],
                    (tx, results) => {
                        console.log(results)
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

    updateUploadByIdartbdt(userid, idartbdt) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE Resident SET uploaded_at = ? WHERE userid = ? AND idartbdt = ?',
                    [now, userid, idartbdt],
                    (tx, results) => {
                        console.log(results)
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
    listVillages(userid, filter) {
        return new Promise((resolve, reject) => {
            const villages = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT sum(pendataan_status) as status_count, count(idartbdt) as resident_count, dusun FROM Resident where userid = ? AND dusun like ? group by dusun order by dusun', [userid, '%' + filter + '%']).then(([tx, results]) => {
                    // console.log("Query completed");
                     var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const {status_count, family_count, dusun} = row;
                        const family_done = resident_count = resident_done = 0;
                        villages.push({
                            status_count, family_count, family_done, resident_count, resident_done, dusun
                        });
                        
                    }
                    // console.log(families);
                    resolve(villages);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listRw(userid, dusun) {
        return new Promise((resolve, reject) => {
            const rws = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT dusun, rw FROM Resident WHERE userid = ? AND dusun = ?  GROUP BY rw ORDER BY rw', [userid, dusun]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const {rw, dusun} = row;
                        const family_done = resident_count = resident_done = 0;
                        rws.push({
                            family_done, resident_count, resident_done, dusun, rw
                        });
                        
                    }
                    // console.log(families);
                    resolve(rws);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listRt(userid, dusun, rw) {
        return new Promise((resolve, reject) => {
            const rts = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT dusun, rw, rt FROM Resident WHERE userid = ? AND dusun = ? AND rw = ? GROUP BY rt ORDER BY rt', [userid, dusun, rw]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { dusun, rw, rt } = row;
                        const family_done = resident_count = resident_done = 0;
                        rts.push({
                            family_done, resident_count, resident_done, dusun, rw, rt
                        });
                        
                    }
                    // console.log(families);
                    resolve(rts);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    // listByIdbdt(userid, idbdt) {
    //     return new Promise((resolve, reject) => {
    //         const members = [];
    //         this.db.transaction((tx) => {
    //             tx.executeSql('SELECT * FROM Resident WHERE userid = ? AND idbdt = ?', [userid, idbdt]).then(([tx, results]) => {
    //                 var len = results.rows.length;
    //                 for (let i = 0; i < len; i++) {
    //                     let row = results.rows.item(i);
    //                     const { userid, idartbdt, idbdt, nama, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt } = row;
    //                     members.push({
    //                         userid, idartbdt, idbdt, nama, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt
    //                     });
    //                 }
    //                 resolve(members);
    //             });
    //         }).then((result) => {

    //         }).catch((err) => {
    //             // console.log(err);
    //             reject(err)
    //         });
    //     })
    // }

    findByIdartbdt(userid, idartbdt) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Resident WHERE userid = ? AND idartbdt = ? LIMIT 1', [userid, idartbdt]).then(([tx, results]) => {
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

    // deleteResident(userid, id) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM Resident WHERE userid = ? AND idartbdt = ?', [userid, id]).then(([tx, results]) => {
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
    //             tx.executeSql('DELETE FROM Resident WHERE userid = ?', [userid]).then(([tx, results]) => {
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