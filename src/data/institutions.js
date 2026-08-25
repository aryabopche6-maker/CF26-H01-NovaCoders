export const INITIAL_INSTITUTIONS = [
  {
    id: "hosp-a",
    name: "Hospital A (St. Jude Medical Center)",
    code: "HOSP_A",
    region: "North America - East",
    status: "online", // online, slow, offline
    dbType: "MySQL 8.0",
    latency: 240, // in ms
    lastQuery: "2 mins ago",
    datasetCount: "1.2M records",
    connectionStatus: "Healthy",
    compliance: "HIPAA / HITECH Compliant",
    schemas: [
      { table: "patients", count: "450,000", columns: ["patient_id", "disease", "age", "gender", "enrollment_date"] },
      { table: "treatments", count: "820,000", columns: ["tx_id", "patient_id", "treatment", "dosage", "start_date"] }
    ],
    fieldMapping: {
      Diagnosis: "disease",
      Treatment: "treatment",
      Age: "age",
      Gender: "gender",
      Date: "start_date"
    }
  },
  {
    id: "hosp-b",
    name: "Hospital B (Metropolitan Health Consortium)",
    code: "HOSP_B",
    region: "North America - West",
    status: "online",
    dbType: "PostgreSQL 15",
    latency: 410,
    lastQuery: "5 mins ago",
    datasetCount: "980K records",
    connectionStatus: "Healthy",
    compliance: "GDPR / HIPAA Certified",
    schemas: [
      { table: "clinical_cohort", count: "380,000", columns: ["subject_ref", "condition", "age_years", "sex"] },
      { table: "medication_log", count: "600,000", columns: ["med_id", "subject_ref", "therapy", "administered_at"] }
    ],
    fieldMapping: {
      Diagnosis: "condition",
      Treatment: "therapy",
      Age: "age_years",
      Gender: "sex",
      Date: "administered_at"
    }
  },
  {
    id: "hosp-c",
    name: "Hospital C (Valley Academic Medical)",
    code: "HOSP_C",
    region: "North America - Central",
    status: "slow", // default status
    dbType: "MySQL 8.0",
    latency: 1400,
    lastQuery: "12 mins ago",
    datasetCount: "1.5M records",
    connectionStatus: "Degraded Latency",
    compliance: "HIPAA Compliant",
    schemas: [
      { table: "patient_master", count: "610,000", columns: ["ehr_number", "diagnosis", "patient_age", "gender"] },
      { table: "pharmacy_dispense", count: "920,000", columns: ["rx_num", "ehr_number", "medication", "dispense_dt"] }
    ],
    fieldMapping: {
      Diagnosis: "diagnosis",
      Treatment: "medication",
      Age: "patient_age",
      Gender: "gender",
      Date: "dispense_dt"
    }
  }
];
