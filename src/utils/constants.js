export const APP_NAME = "FederateHealth";
export const APP_TAGLINE = "Clinical Data Fabric";

export const USER_ROLES = {
  RESEARCHER: "researcher",
  ADMIN: "admin"
};

export const MOCK_USERS = [
  {
    email: "researcher@demo.com",
    name: "Dr. Sarah Lin",
    role: USER_ROLES.RESEARCHER,
    title: "Senior Clinical Researcher",
    organization: "Global Health Institute",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
  },
  {
    email: "admin@demo.com",
    name: "Marcus Vance",
    role: USER_ROLES.ADMIN,
    title: "System Administrator",
    organization: "FederateHealth Core Node",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  }
];

export const DEMO_QUERY_TEXT = "How many diabetic patients above 40 received insulin treatment?";

export const QUERY_STAGES = [
  { id: 'nl_parsed', name: 'AI Query Understanding', icon: 'BrainCircuit', desc: 'Parsing natural language into structured parameters' },
  { id: 'auth_check', name: 'Authorization Check', icon: 'ShieldCheck', desc: 'Verifying researcher permissions & dataset tokens' },
  { id: 'privacy_check', name: 'Privacy Risk Check', icon: 'Lock', desc: 'Evaluating minimum group size k-anonymity (k>=10)' },
  { id: 'planner', name: 'Query Planning', icon: 'GitMerge', desc: 'Decomposing logical AST into local sub-queries' },
  { id: 'schema_map', name: 'Schema Mapping', icon: 'TableProperties', desc: 'Translating logical fields to heterogeneous SQL schemas' },
  { id: 'executing', name: 'Federated Execution', icon: 'Server', desc: 'Dispatching encrypted sub-queries to remote hospitals' },
  { id: 'aggregating', name: 'Results Aggregation', icon: 'Layers', desc: 'Combining local COUNT results securely' },
  { id: 'completed', name: 'Validation & Provenance', icon: 'CheckCircle2', desc: 'Generating lineage tree & AI insights' }
];

export const TOOLTIPS = {
  FEDERATED_QUERY: "A query executed across multiple independent data sources without centralizing or moving underlying patient records.",
  SCHEMA_MAPPING: "Automatic translation of a unified clinical domain model into heterogeneous local database column schemas.",
  DATA_PROVENANCE: "Cryptographically verifiable audit log detailing exact source contributions and processing history.",
  PRIVACY_RISK: "Mathematical differential privacy and k-anonymity audit ensuring raw patient records are never accessible.",
  COMPLETENESS: "Percentage of active participating institutions that successfully returned valid local computed metrics.",
  LOCAL_COMPUTATION: "Data processing performed entirely inside the hospital firewall; only summary metrics leave the facility.",
  AGGREGATE_RESULT: "Final scalar result (e.g. COUNT, AVG) synthesized from site-level computations."
};
