import PouchDB from 'pouchdb-browser';

export function initializePatientDB(patientId) {
  return new PouchDB(`patient_${patientId}`);
}

export function syncPatientDB(db, remoteUrl) {
  return db.sync(remoteUrl, {
    live: true,
    retry: true
  });
}

export function storeHealthRecord(db, record) {
  return db.post({
    ...record,
    type: 'healthRecord',
    createdAt: new Date().toISOString()
  });
}

export function getHealthRecords(db) {
  return db.allDocs({
    include_docs: true,
    startkey: 'healthRecord_',
    endkey: 'healthRecord_\uffff'
  }).then(result => result.rows.map(row => row.doc));
}
