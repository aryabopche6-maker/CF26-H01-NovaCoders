export const MOCK_PRESET_QUERIES = [
  {
    id: "preset-1",
    title: "Diabetic Patients on Insulin (>40 y/o)",
    query: "How many diabetic patients above 40 received insulin treatment?",
    condition: "Diabetes",
    treatment: "Insulin",
    minAge: 40,
    maxAge: 120,
    gender: "ALL",
    aggregation: "COUNT",
    expectedResults: {
      HOSP_A: 120,
      HOSP_B: 85,
      HOSP_C: 95,
      total: 300
    }
  },
  {
    id: "preset-2",
    title: "Hypertension Patients on ACE Inhibitors",
    query: "Count patients diagnosed with Hypertension receiving Lisinopril therapy between ages 30 and 65.",
    condition: "Hypertension",
    treatment: "Lisinopril",
    minAge: 30,
    maxAge: 65,
    gender: "ALL",
    aggregation: "COUNT",
    expectedResults: {
      HOSP_A: 210,
      HOSP_B: 145,
      HOSP_C: 180,
      total: 535
    }
  },
  {
    id: "preset-3",
    title: "Asthma Cohort with Biologic Therapy",
    query: "How many severe Asthma patients received Dupilumab treatment across all sites?",
    condition: "Asthma",
    treatment: "Dupilumab",
    minAge: 18,
    maxAge: 85,
    gender: "ALL",
    aggregation: "COUNT",
    expectedResults: {
      HOSP_A: 42,
      HOSP_B: 38,
      HOSP_C: 54,
      total: 134
    }
  }
];

export const INITIAL_QUERY_HISTORY = [
  {
    id: "Q-1024",
    rawQuery: "How many diabetic patients above 40 received insulin treatment?",
    condition: "Diabetes",
    treatment: "Insulin",
    age: "> 40",
    institutions: 3,
    totalResult: 300,
    status: "Completed",
    completeness: 100,
    privacyRisk: "LOW",
    executionTime: 2.41,
    date: "2026-08-23T12:45:00Z",
    breakdown: [
      { id: "hosp-a", name: "Hospital A", count: 120, time: 720, status: "Completed" },
      { id: "hosp-b", name: "Hospital B", count: 85, time: 1100, status: "Completed" },
      { id: "hosp-c", name: "Hospital C", count: 95, time: 810, status: "Completed" }
    ]
  },
  {
    id: "Q-1023",
    rawQuery: "Count patients with Oncology diagnosis above 50 with Immunotherapy",
    condition: "Cancer",
    treatment: "Immunotherapy",
    age: "> 50",
    institutions: 3,
    totalResult: 184,
    status: "Completed",
    completeness: 100,
    privacyRisk: "LOW",
    executionTime: 2.18,
    date: "2026-08-23T11:15:00Z",
    breakdown: [
      { id: "hosp-a", name: "Hospital A", count: 76, time: 640, status: "Completed" },
      { id: "hosp-b", name: "Hospital B", count: 52, time: 980, status: "Completed" },
      { id: "hosp-c", name: "Hospital C", count: 56, time: 790, status: "Completed" }
    ]
  },
  {
    id: "Q-1022",
    rawQuery: "Heart Disease patients receiving Statins",
    condition: "Heart Disease",
    treatment: "Statin",
    age: "All",
    institutions: 2,
    totalResult: 205,
    status: "Partial",
    completeness: 66,
    privacyRisk: "LOW",
    executionTime: 3.10,
    date: "2026-08-23T09:30:00Z",
    breakdown: [
      { id: "hosp-a", name: "Hospital A", count: 120, time: 690, status: "Completed" },
      { id: "hosp-b", name: "Hospital B", count: 85, time: 1050, status: "Completed" },
      { id: "hosp-c", name: "Hospital C", count: 0, time: 0, status: "Failed" }
    ]
  },
  {
    id: "Q-1021",
    rawQuery: "Rheumatoid Arthritis cohort with Biologics",
    condition: "Rheumatoid Arthritis",
    treatment: "Biologics",
    age: "> 18",
    institutions: 3,
    totalResult: 142,
    status: "Completed",
    completeness: 100,
    privacyRisk: "LOW",
    executionTime: 2.55,
    date: "2026-08-22T16:20:00Z",
    breakdown: [
      { id: "hosp-a", name: "Hospital A", count: 58, time: 800, status: "Completed" },
      { id: "hosp-b", name: "Hospital B", count: 41, time: 1200, status: "Completed" },
      { id: "hosp-c", name: "Hospital C", count: 43, time: 850, status: "Completed" }
    ]
  }
];
