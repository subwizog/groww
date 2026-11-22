import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import TabBar from './components/TabBar';
import NightlyCheckinSheet from './components/NightlyCheckinSheet';

import HomeScreen from './screens/HomeScreen';
import BudgetScreen from './screens/BudgetScreen';
import InsightsScreen from './screens/InsightsScreen';
import SplitScreen from './screens/SplitScreen';
import AddScreen from './screens/AddScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const { activeTab } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Pocket Money';
      case 'budget':
        return 'Budget';
      case 'insights':
        return 'Insights';
      case 'split':
        return 'Split';
      case 'add':
        return 'Add Payment';
      case 'settings':
        return 'Settings';
      default:
        return 'Pocket Money';
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'budget':
        return <BudgetScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'split':
        return <SplitScreen />;
      case 'add':
        return <AddScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container">
      {/* Decorative glass background shapes */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Sticky header with Title 1 & Settings toggle */}
      <Header title={getTitle()} />

      {/* Active Screen */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderScreen()}
      </main>

      {/* Floating glass tab bar */}
      <TabBar />

      {/* Nightly check-in bottom sheet modal */}
      <NightlyCheckinSheet />
    </div>
  );
}
