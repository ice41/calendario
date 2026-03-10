import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EmployeeList } from './components/EmployeeList';
import { CalendarView } from './components/CalendarView';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './store/AuthContext';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'calendar'>('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
      {activeTab === 'employees' && <EmployeeList />}
      {activeTab === 'calendar' && <CalendarView />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
