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
                            this.db.executeSql('SELECT 1 FROM Family LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                                resolve()
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                this.db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS \
                                    Family (\
                                        userid TEXT NOT NULL, \
                                        idbdt TEXT NOT NULL,\
                                        nopesertapbdt,\
                                        nama_krt,\
                                        pendataan_status INTEGER DEFAULT 0,\
                                        upload_status INTEGER DEFAULT 0,\
                                        pendataan_tanggal,\
                                        kode_wilayah,\
                                        dusun,\
                                        rw,\
                                        rt,\
                                        koordinat_rumah,\
                                        foto,\
                                        jumlah_art,\
                                        uploaded_at DATETIME NULL, \
                                        PRIMARY KEY(userid, idbdt)\
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

    insertRow(userid, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT INTO Family(userid, idbdt, nopesertapbdt, nama_krt, kode_wilayah, dusun, rw, rt, pendataan_status, upload_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)', [userid, item.idbdt, item.nopesertapbdt, item.nama_krt, item.kode_wilayah, item.dusun, item.rw, item.rt],
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

    updateByIdbdt(userid, idbdt, item) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Family SET  nopesertapbdt = ?, nama_krt = ?, kode_wilayah = ?, dusun = ?, rw = ?, rt = ? WHERE userid = ? AND idbdt = ?',
                    [item.nopesertapbdt, item.nama_krt, item.kode_wilayah, item.dusun, item.rw, item.rt, userid, idbdt],
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

    updateStatusByIdbdt(userid, idbdt, status) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE Family SET  pendataan_status = ?, pendataan_tanggal = ? WHERE userid = ? AND idbdt = ?',
                    [status, now, userid, idbdt],
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

    updateUploadByIdbdt(userid, idbdt) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                const now = Date.now()
                tx.executeSql('UPDATE Family SET  uploaded_at = ? WHERE userid = ? AND idbdt = ?',
                    [now, userid, idbdt],
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

    findByIdbdt(userid, idbdt) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Family WHERE userid = ? AND idbdt = ? LIMIT 1', [userid, idbdt]).then(([tx, results]) => {
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

    _totalFamily(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(idbdt) as total FROM Family WHERE userid = ? AND nama_krt like ?', [userid, '%' + filter + '%']).then(([tx, results]) => {
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



    _listFamily(userid, filter, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const families = [];
            this.db.transaction((tx) => {
                const query = 'SELECT f.*, (select count(*) from Resident where userid = f.userid and idbdt = f.idbdt) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and idbdt = f.idbdt) as status_count FROM Family f where userid = ? and nama_krt like ? order by nama_krt, rt limit ? offset ?';
                tx.executeSql(query, [userid, '%' + filter + '%', limit, offset]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Family ID: ${row.idbdt}, Family Name: ${row.nama_krt}`)
                        const { userid, idbdt, nopesertapbdt, nama_krt, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt, koordinat_rumah, foto, jumlah_art, resident_count, status_count } = row;
                        families.push({
                            userid, idbdt, nopesertapbdt, nama_krt, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt, koordinat_rumah, foto, jumlah_art, resident_count, status_count
                        });

                    }
                    // console.log(families);
                    resolve(families);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    totalFamily(userid, filter, dusun, rw, rt) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT COUNT(idbdt) as total FROM Family WHERE userid = "'+userid+'" AND nama_krt like "%' + filter + '%" ';
            if (dusun !== '') {
                query = query + 'AND dusun = "' + dusun + '" '
            }
            if (rw !== '') {
                query = query + 'AND rw = "' + rw + '" ';
            }
            if (rt !== '') {
                query = query + 'AND rt = "' + rt + '" ';
            }
            
            this.db.transaction((tx) => {
                // tx.executeSql('SELECT COUNT(idbdt) as total FROM Family WHERE userid = ? AND nama_krt like ? AND dusun = ? AND rw = ? AND rt = ?', [userid, '%' + filter + '%', dusun, rw, rt]).then(([tx, results]) => {
                tx.executeSql(query).then(([tx, results]) => {
                    // console.log("Query completed");
                    resolve(results.rows.item(0).total)
                });
            }).then((result) => {
                resolve()
            }).catch((err) => {
                reject(err)
            });
        });
    }

    listFamily(userid, filter, dusun, rw, rt, limit, offset) {
        console.log('filter:' + filter + '|limit:' + limit + '|offset:' + offset)
        return new Promise((resolve, reject) => {
            const families = [];
            let query = 'SELECT f.*, (select count(*) from Resident where userid = f.userid and idbdt = f.idbdt) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and idbdt = f.idbdt) as status_count FROM Family f where userid = "'+userid+'" and nama_krt like "%' + filter + '%" ';
            if (dusun !== '') {
                query = query + 'AND dusun = "' + dusun + '" '
            }
            if (rw !== '') {
                query = query + 'AND rw = "' + rw + '" ';
            }
            if (rt !== '') {
                query = query + 'AND rt = "' + rt + '" ';
            }
            
            query = query + 'order by nama_krt, rt limit ' + limit + ' offset ' + offset + ' ';
            this.db.transaction((tx) => {
                // tx.executeSql('SELECT f.*, (select count(*) from Resident where userid = f.userid and idbdt = f.idbdt) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and idbdt = f.idbdt) as status_count FROM Family f where userid = ? and nama_krt like ? AND dusun = ? AND rw = ? AND rt = ? order by nama_krt, rt limit ? offset ?', [userid, '%' + filter + '%', dusun, rw, rt, limit, offset]).then(([tx, results]) => {
                tx.executeSql(query).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Family ID: ${row.idbdt}, Family Name: ${row.nama_krt}`)
                        const { userid, idbdt, nopesertapbdt, nama_krt, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt, koordinat_rumah, foto, jumlah_art, resident_count, status_count } = row;
                        families.push({
                            userid, idbdt, nopesertapbdt, nama_krt, pendataan_status, pendataan_tanggal, kode_wilayah, dusun, rw, rt, koordinat_rumah, foto, jumlah_art, resident_count, status_count
                        });
                    }
                    // console.log(families);
                    resolve(families);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                reject(err)
            });
        });
    }

    listVillages(userid, filter) {
        return new Promise((resolve) => {
            const villages = [];
            this.db.transaction((tx) => {
                // tx.executeSql('SELECT sum(pendataan_status) as status_count, count(idbdt) as family_count, dusun FROM Family f where userid = ? AND dusun like ? group by dusun order by dusun', [userid, '%' + filter + '%']).then(([tx, results]) => {
                // console.log("Query completed");
                tx.executeSql('SELECT sum(pendataan_status) as family_status_count, count(idbdt) as family_count, (select count(*) from Resident where userid = f.userid and dusun = f.dusun) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and dusun = f.dusun) as resident_status_count, dusun FROM Family f where userid = ? AND dusun like ? group by dusun order by dusun', [userid, '%' + filter + '%']).then(([tx, results]) => {

                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { family_status_count, family_count, resident_count, resident_status_count, dusun } = row;
                        villages.push({
                            family_status_count, family_count, resident_count, resident_status_count, dusun
                        });

                    }
                    // console.log(families);
                    resolve(villages);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                // reject(err)
            });
        });
    }

    listRw(userid, dusun) {
        return new Promise((resolve) => {
            const rws = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT sum(pendataan_status) as family_status_count, count(idbdt) as family_count, (select count(*) from Resident where userid = f.userid and dusun = f.dusun and rw = f.rw) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and dusun = f.dusun and rw = f.rw) as resident_status_count, dusun, rw FROM Family f WHERE userid = ? AND dusun = ?  GROUP BY rw ORDER BY rw', [userid, dusun]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { family_status_count, family_count, resident_count, resident_status_count, dusun, rw } = row;
                        rws.push({
                            family_status_count, family_count, resident_count, resident_status_count, dusun, rw
                        });

                    }
                    // console.log(families);
                    resolve(rws);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                // reject(err)
            });
        });
    }

    listRt(userid, dusun, rw) {
        return new Promise((resolve) => {
            const rts = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT sum(pendataan_status) as family_status_count, count(idbdt) as family_count, (select count(*) from Resident where userid = f.userid and dusun = f.dusun and rw = f.rw and rt = f.rt) as resident_count, (select sum(pendataan_status) from Resident where userid = f.userid and dusun = f.dusun and rw = f.rw and rt = f.rt) as resident_status_count, dusun, rw, rt FROM Family f WHERE userid = ? AND dusun = ? AND rw = ? GROUP BY rt ORDER BY rt', [userid, dusun, rw]).then(([tx, results]) => {
                    // console.log("Query completed");
                    var len = results.rows.length;

                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { family_status_count, family_count, resident_count, resident_status_count, dusun, rw, rt } = row;
                        rts.push({
                            family_status_count, family_count, resident_count, resident_status_count, dusun, rw, rt
                        });

                    }
                    // console.log(families);
                    resolve(rts);
                });
            }).then((result) => {
            }).catch((err) => {
                // console.log(err);
                // reject(err)
            });
        });
    }

    // deleteFamily(userid, id) {
    //     return new Promise((resolve, reject) => {
    //         this.db.transaction((tx) => {
    //             tx.executeSql('DELETE FROM Family WHERE userid = ? AND idbdt = ?', [userid, id]).then(([tx, results]) => {
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
    //             tx.executeSql('DELETE FROM Family WHERE userid = ?', [userid]).then(([tx, results]) => {
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