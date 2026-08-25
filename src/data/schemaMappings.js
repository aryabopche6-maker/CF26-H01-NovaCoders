export const SCHEMA_MAPPING_RULES = [
  {
    logicalField: "Diagnosis",
    logicalDataType: "VARCHAR (ICD-10)",
    description: "Primary clinical diagnosis code or normalized condition description",
    mappings: {
      HOSP_A: { table: "patients", column: "disease", nativeType: "VARCHAR(255)", sample: "Diabetes Mellitus Type 2" },
      HOSP_B: { table: "clinical_cohort", column: "condition", nativeType: "TEXT", sample: "E11.9 - Type 2 Diabetes" },
      HOSP_C: { table: "patient_master", column: "diagnosis", nativeType: "VARCHAR(100)", sample: "Diabetes (Type II)" }
    }
  },
  {
    logicalField: "Treatment",
    logicalDataType: "VARCHAR (RxNorm)",
    description: "Pharmaceutical agent, biologic therapy, or clinical procedure",
    mappings: {
      HOSP_A: { table: "treatments", column: "treatment", nativeType: "VARCHAR(120)", sample: "Insulin Human Regular" },
      HOSP_B: { table: "medication_log", column: "therapy", nativeType: "VARCHAR(200)", sample: "Insulin Glargine 100u/ml" },
      HOSP_C: { table: "pharmacy_dispense", column: "medication", nativeType: "VARCHAR(150)", sample: "Insulin Lispro" }
    }
  },
  {
    logicalField: "Age",
    logicalDataType: "INTEGER",
    description: "Calculated patient age in years at the time of query evaluation",
    mappings: {
      HOSP_A: { table: "patients", column: "age", nativeType: "INT", sample: "54" },
      HOSP_B: { table: "clinical_cohort", column: "age_years", nativeType: "NUMERIC(3,0)", sample: "61" },
      HOSP_C: { table: "patient_master", column: "patient_age", nativeType: "SMALLINT", sample: "48" }
    }
  },
  {
    logicalField: "Gender",
    logicalDataType: "ENUM ('M', 'F', 'OTHER')",
    description: "Administrative gender representation",
    mappings: {
      HOSP_A: { table: "patients", column: "gender", nativeType: "CHAR(1)", sample: "M" },
      HOSP_B: { table: "clinical_cohort", column: "sex", nativeType: "VARCHAR(10)", sample: "Female" },
      HOSP_C: { table: "patient_master", column: "gender", nativeType: "VARCHAR(2)", sample: "M" }
    }
  },
  {
    logicalField: "Treatment Date",
    logicalDataType: "TIMESTAMP",
    description: "Timestamp when therapy was initiated or medication dispensed",
    mappings: {
      HOSP_A: { table: "treatments", column: "start_date", nativeType: "DATETIME", sample: "2025-11-14 08:30:00" },
      HOSP_B: { table: "medication_log", column: "administered_at", nativeType: "TIMESTAMPTZ", sample: "2025-12-01 14:15:00+00" },
      HOSP_C: { table: "pharmacy_dispense", column: "dispense_dt", nativeType: "TIMESTAMP", sample: "2026-01-10 11:00:00" }
    }
  }
];
