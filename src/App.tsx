import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorksheetProvider } from './context/WorksheetContext';
import { Header } from './components/Header';
import { WorksheetView } from './components/WorksheetView';
import { InteractiveTest } from './components/InteractiveTest';
import { ImportView } from './components/ImportView';
import { SchemaView } from './components/SchemaView';

export const App: React.FC = () => {
  return (
    <WorksheetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans selection:bg-indigo-500 selection:text-white">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<WorksheetView />} />
              <Route path="/practice" element={<InteractiveTest />} />
              <Route path="/import" element={<ImportView />} />
              <Route path="/schema" element={<SchemaView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WorksheetProvider>
  );
};

export default App;
