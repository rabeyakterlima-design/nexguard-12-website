import React, { useState } from 'react';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OwnerMasterDashboard from './pages/OwnerMasterDashboard';
import NormalUserDashboard from './pages/NormalUserDashboard';
import ModuleDetailView from './pages/ModuleDetailView';
import AdminManagementView from './pages/AdminManagementView';
import CommercialManagementView from './pages/CommercialManagementView';
import ReportsView from './pages/ReportsView';
import AuditLogsView from './pages/AuditLogsView';
import EmergencySecurityCenter from './pages/EmergencySecurityCenter';
import AntiTheftOwnerDashboard from './pages/AntiTheftOwnerDashboard';

function DashboardContent() {
  const { currentUser, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState(
    currentUser?.role === ROLES.USER ? 'user-home' : 'overview'
  );
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // When clicking on a module from the user dashboard
  const handleOpenModule = (modId) => {
    setSelectedModuleId(modId);
  };

  const handleBackToModules = () => {
    setSelectedModuleId(null);
  };

  // Render proper content based on activeTab
  const renderView = () => {
    if (selectedModuleId) {
      return (
        <ModuleDetailView
          moduleId={selectedModuleId}
          onBack={handleBackToModules}
        />
      );
    }

    switch (activeTab) {
      case 'anti-theft':
      case 'emergency':
      case 'devices':
        return <AntiTheftOwnerDashboard />;
      case 'overview':
        return <OwnerMasterDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'user-home':
        return <NormalUserDashboard onSelectModule={handleOpenModule} />;
      case 'modules':
        return <NormalUserDashboard onSelectModule={handleOpenModule} />;
      case 'admins':
        return <AdminManagementView />;
      case 'users':
        return <AdminManagementView />;
      case 'subscriptions':
      case 'payments':
      case 'licenses':
        return <CommercialManagementView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-logs':
        return <AuditLogsView />;

      // Direct module tabs from 26 owner sections
      case 'threat-intel':
        return <ModuleDetailView moduleId="threat-intelligence" onBack={() => setActiveTab('overview')} />;
      case 'soc':
      case 'incidents':
        return <ModuleDetailView moduleId="cyber-soc" onBack={() => setActiveTab('overview')} />;
      case 'forensics':
        return <ModuleDetailView moduleId="digital-forensics" onBack={() => setActiveTab('overview')} />;
      case 'webshield':
        return <ModuleDetailView moduleId="webshield" onBack={() => setActiveTab('overview')} />;
      case 'network':
        return <ModuleDetailView moduleId="network-sentinel" onBack={() => setActiveTab('overview')} />;
      case 'vault':
        return <ModuleDetailView moduleId="vault-guardian" onBack={() => setActiveTab('overview')} />;
      case 'cloud-backup':
      case 'backup-management':
        return <ModuleDetailView moduleId="cloud-backup-guardian" onBack={() => setActiveTab('overview')} />;

      default:
        if (currentUser?.role === ROLES.USER) {
          return <NormalUserDashboard onSelectModule={handleOpenModule} />;
        }
        return <OwnerMasterDashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-nexbg text-nextext flex flex-col">
      <Header onOpenAntiTheft={() => {
        setSelectedModuleId(null);
        setActiveTab('anti-theft');
      }} />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
          setSelectedModuleId(null);
          setActiveTab(tab);
        }} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
