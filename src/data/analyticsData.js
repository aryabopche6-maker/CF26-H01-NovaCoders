export const PERFORMANCE_STATS = {
  totalQueryTime: "2.41s",
  queryPlanningTime: "0.18s",
  hospitalAExecution: "0.72s",
  hospitalBExecution: "1.10s",
  hospitalCExecution: "0.81s",
  aggregationTime: "0.05s"
};

export const LATENCY_SERIES = [
  { name: "Hospital A", latency: 240, target: 300, db: "MySQL 8.0" },
  { name: "Hospital B", latency: 410, target: 500, db: "PostgreSQL 15" },
  { name: "Hospital C", latency: 1400, target: 800, db: "MySQL 8.0" }
];

export const HOURLY_QUERY_TREND = [
  { hour: "08:00", queries: 2, avgTime: 2.1 },
  { hour: "09:00", queries: 5, avgTime: 2.3 },
  { hour: "10:00", queries: 8, avgTime: 2.4 },
  { hour: "11:00", queries: 12, avgTime: 2.2 },
  { hour: "12:00", queries: 18, avgTime: 2.5 },
  { hour: "13:00", queries: 24, avgTime: 2.41 }
];

export const CENTRALIZED_VS_FEDERATED = [
  { metric: "Data Movement", centralized: "High (100% Raw Records)", federated: "Low (Aggregate Metrics Only)" },
  { metric: "Raw Patient Records", centralized: "Centralized in Cloud", federated: "Stays Local in Hospital DB" },
  { metric: "Privacy Risk", centralized: "High (Single Point of Breach)", federated: "Low (k-Anonymity & Zero Raw Access)" },
  { metric: "Query Execution Time", centralized: "3.10 sec", federated: "2.41 sec (Parallel Local Execution)" },
  { metric: "Data Transfer Size", centralized: "GBs / TBs of Patient Data", federated: "Kilobytes (Scalar Counts)" },
  { metric: "Governance Control", centralized: "Lost by Host Institution", federated: "100% Hospital Local Control" }
];
