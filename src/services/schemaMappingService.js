import apiClient from './apiClient';

export const schemaMappingService = {
  getAllMappings: async () => {
    try {
      const data = await apiClient.get('/schema-mappings');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('[schemaMappingService] getAllMappings fallback:', error.message);
      return [
        {
          id: 1,
          logicalField: 'condition',
          institutionId: 1,
          institutionName: 'Hospital A (St. Jude)',
          localTable: 'patients',
          localColumn: 'disease',
          nativeType: 'VARCHAR(255)',
          confidenceScore: 98,
          status: 'MAPPED'
        },
        {
          id: 2,
          logicalField: 'treatment',
          institutionId: 1,
          institutionName: 'Hospital A (St. Jude)',
          localTable: 'treatments',
          localColumn: 'treatment',
          nativeType: 'VARCHAR(255)',
          confidenceScore: 99,
          status: 'MAPPED'
        },
        {
          id: 3,
          logicalField: 'patient_age',
          institutionId: 1,
          institutionName: 'Hospital A (St. Jude)',
          localTable: 'patients',
          localColumn: 'patient_age',
          nativeType: 'INT',
          confidenceScore: 98,
          status: 'MAPPED'
        },
        {
          id: 4,
          logicalField: 'condition',
          institutionId: 2,
          institutionName: 'Hospital B (Metropolitan)',
          localTable: 'clinical_cohort',
          localColumn: 'condition',
          nativeType: 'TEXT',
          confidenceScore: 97,
          status: 'MAPPED'
        },
        {
          id: 5,
          logicalField: 'treatment',
          institutionId: 2,
          institutionName: 'Hospital B (Metropolitan)',
          localTable: 'medication_log',
          localColumn: 'therapy',
          nativeType: 'VARCHAR(150)',
          confidenceScore: 93,
          status: 'MAPPED'
        },
        {
          id: 6,
          logicalField: 'patient_age',
          institutionId: 2,
          institutionName: 'Hospital B (Metropolitan)',
          localTable: 'clinical_cohort',
          localColumn: 'age_years',
          nativeType: 'NUMERIC(3,0)',
          confidenceScore: 96,
          status: 'MAPPED'
        },
        {
          id: 7,
          logicalField: 'condition',
          institutionId: 3,
          institutionName: 'Hospital C (Valley Academic)',
          localTable: 'patient_master',
          localColumn: 'diagnosis',
          nativeType: 'VARCHAR(200)',
          confidenceScore: 94,
          status: 'MAPPED'
        },
        {
          id: 8,
          logicalField: 'treatment',
          institutionId: 3,
          institutionName: 'Hospital C (Valley Academic)',
          localTable: 'pharmacy_dispense',
          localColumn: 'medication',
          nativeType: 'VARCHAR(255)',
          confidenceScore: 96,
          status: 'MAPPED'
        },
        {
          id: 9,
          logicalField: 'patient_age',
          institutionId: 3,
          institutionName: 'Hospital C (Valley Academic)',
          localTable: 'patient_master',
          localColumn: 'patient_age',
          nativeType: 'INT',
          confidenceScore: 99,
          status: 'MAPPED'
        }
      ];
    }
  },

  getLogicalFields: async () => {
    try {
      const data = await apiClient.get('/schema-mappings/logical-fields');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('[schemaMappingService] getLogicalFields fallback:', error.message);
      return [
        { id: 1, fieldName: 'patient_age', displayName: 'Patient Age', dataType: 'INTEGER', description: 'Standardized integer age of patient in years at time of diagnosis.' },
        { id: 2, fieldName: 'condition', displayName: 'Clinical Condition / Diagnosis', dataType: 'STRING (ICD-10)', description: 'Primary clinical condition or disease diagnosis code.' },
        { id: 3, fieldName: 'treatment', displayName: 'Medication / Therapy', dataType: 'STRING (RxNorm)', description: 'Prescribed medication, drug therapy, or procedure.' }
      ];
    }
  },

  getMappingsByInstitution: async (institutionId) => {
    try {
      const data = await apiClient.get(`/schema-mappings/institution/${institutionId}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('[schemaMappingService] getMappingsByInstitution fallback:', error.message);
      const all = await schemaMappingService.getAllMappings();
      return all.filter(m => String(m.institutionId) === String(institutionId));
    }
  }
};
