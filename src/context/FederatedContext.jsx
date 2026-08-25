import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { institutionService } from '../services/institutionService';
import { queryService } from '../services/queryService';
import { auditService } from '../services/auditService';
import { schemaMappingService } from '../services/schemaMappingService';
import { useToast } from './ToastContext';

const FederatedContext = createContext(null);

export function FederatedProvider({ children }) {
  const { addToast } = useToast();

  // Platform Dashboard & Health Telemetry
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalInstitutions: 3,
    activeInstitutions: 3,
    pausedInstitutions: 0,
    totalQueries: 24,
    pendingApprovals: 2,
    totalAuditLogs: 128,
    networkCompleteness: 100,
    privacyEngineStatus: 'ACTIVE',
    minGroupSizeThreshold: 10
  });
  const [health, setHealth] = useState({ status: 'UP', database: 'UP', privacyEngine: 'UP' });

  // Institutions State
  const [institutions, setInstitutions] = useState([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);

  // Queries & History State
  const [queryHistory, setQueryHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeQueryResult, setActiveQueryResult] = useState(null);

  // Approvals State
  const [approvals, setApprovals] = useState([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Schema Mappings State
  const [schemaMappings, setSchemaMappings] = useState([]);
  const [logicalFields, setLogicalFields] = useState([]);
  const [isLoadingSchemas, setIsLoadingSchemas] = useState(false);

  // Load Dashboard Stats & Health
  const loadDashboardStats = useCallback(async () => {
    try {
      const [statsData, healthData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getHealth()
      ]);
      if (statsData) setStats(statsData);
      if (healthData) setHealth(healthData);
    } catch (error) {
      console.warn('[FederatedContext] loadDashboardStats error:', error);
    }
  }, []);

  // Load Institutions
  const loadInstitutions = useCallback(async () => {
    setIsLoadingInstitutions(true);
    try {
      const data = await institutionService.getAllInstitutions();
      setInstitutions(data || []);
    } catch (error) {
      console.warn('[FederatedContext] loadInstitutions error:', error);
    } finally {
      setIsLoadingInstitutions(false);
    }
  }, []);

  // Load Query History
  const loadQueryHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const data = await queryService.getQueryHistory();
      setQueryHistory(data || []);
    } catch (error) {
      console.warn('[FederatedContext] loadQueryHistory error:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Load Approvals
  const loadApprovals = useCallback(async () => {
    setIsLoadingApprovals(true);
    try {
      const data = await queryService.getPendingApprovals();
      setApprovals(data || []);
    } catch (error) {
      console.warn('[FederatedContext] loadApprovals error:', error);
    } finally {
      setIsLoadingApprovals(false);
    }
  }, []);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const data = await auditService.getAuditLogs();
      setAuditLogs(data || []);
    } catch (error) {
      console.warn('[FederatedContext] loadAuditLogs error:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  // Load Schema Mappings
  const loadSchemaData = useCallback(async () => {
    setIsLoadingSchemas(true);
    try {
      const [mappings, fields] = await Promise.all([
        schemaMappingService.getAllMappings(),
        schemaMappingService.getLogicalFields()
      ]);
      setSchemaMappings(mappings || []);
      setLogicalFields(fields || []);
    } catch (error) {
      console.warn('[FederatedContext] loadSchemaData error:', error);
    } finally {
      setIsLoadingSchemas(false);
    }
  }, []);

  // Action: Execute Natural Language Query
  const executeQuery = async (queryPayload) => {
    try {
      const result = await queryService.executeQuery(queryPayload);
      setActiveQueryResult(result);
      // Refresh queries and stats after execution
      loadQueryHistory();
      loadDashboardStats();
      loadAuditLogs();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Action: Process Query Approval
  const processApprovalAction = async (approvalId, action, reason) => {
    try {
      const res = await queryService.processApproval(approvalId, action, reason);
      addToast(`Approval ${approvalId} ${action.toLowerCase()}ed successfully`, 'success');
      loadApprovals();
      loadDashboardStats();
      return res;
    } catch (error) {
      addToast(error.message || 'Approval action failed', 'error');
      throw error;
    }
  };

  // Action: Update Institution Participation
  const updateInstitutionStatus = async (institutionId, status, reason) => {
    try {
      const res = await institutionService.updateParticipation(institutionId, status, reason);
      addToast(`Updated institution status to ${status}`, 'success');
      loadInstitutions();
      loadDashboardStats();
      loadAuditLogs();
      return res;
    } catch (error) {
      addToast(error.message || 'Status update failed', 'error');
      throw error;
    }
  };

  // Action: Add New Institution
  const addInstitution = async (institutionData) => {
    try {
      const res = await institutionService.createInstitution(institutionData);
      addToast(`New hospital "${res.name || institutionData.name}" added to federation!`, 'success');
      loadInstitutions();
      loadDashboardStats();
      loadAuditLogs();
      return res;
    } catch (error) {
      addToast(error.message || 'Failed to add institution', 'error');
      throw error;
    }
  };

  // Action: Update Dataset Permission
  const updateDatasetPermission = async (institutionId, datasetCode, permission) => {
    try {
      const res = await institutionService.updateDatasetPermission(institutionId, datasetCode, permission);
      addToast(`Updated ${datasetCode} permission to ${permission}`, 'success');
      loadAuditLogs();
      return res;
    } catch (error) {
      addToast(error.message || 'Permission update failed', 'error');
      throw error;
    }
  };

  // Initial Load
  useEffect(() => {
    loadDashboardStats();
    loadInstitutions();
    loadQueryHistory();
  }, [loadDashboardStats, loadInstitutions, loadQueryHistory]);

  const value = {
    // Stats & Health
    stats,
    health,
    loadDashboardStats,

    // Institutions
    institutions,
    isLoadingInstitutions,
    loadInstitutions,
    updateInstitutionStatus,
    addInstitution,
    updateDatasetPermission,

    // Queries
    queryHistory,
    isLoadingHistory,
    loadQueryHistory,
    activeQueryResult,
    setActiveQueryResult,
    executeQuery,

    // Approvals
    approvals,
    isLoadingApprovals,
    loadApprovals,
    processApprovalAction,

    // Audit Logs
    auditLogs,
    isLoadingLogs,
    loadAuditLogs,

    // Schema Mappings
    schemaMappings,
    logicalFields,
    isLoadingSchemas,
    loadSchemaData
  };

  return (
    <FederatedContext.Provider value={value}>
      {children}
    </FederatedContext.Provider>
  );
}

export function useFederated() {
  const context = useContext(FederatedContext);
  if (!context) {
    throw new Error('useFederated must be used within a FederatedProvider');
  }
  return context;
}
