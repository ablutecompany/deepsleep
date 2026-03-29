import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { InsightDetail } from './pages/InsightDetail';
import { Tonight } from './pages/Tonight';
import { Patterns } from './pages/Patterns';
import { Profile } from './pages/Profile';
import { Control } from './pages/Control';

import { Auth } from './pages/Auth';
import { ProcessHome } from './pages/ProcessHome';
import { Phase1Entry } from './pages/Phase1Entry';
import { Phase1Progress } from './pages/Phase1Progress';
import { ActiveSession } from './pages/ActiveSession';
import { Phase2Entry } from './pages/Phase2Entry';
import { Phase2Questions } from './pages/Phase2Questions';
import { Phase2Context } from './pages/Phase2Context';
import { Phase2Proposals } from './pages/Phase2Proposals';
import { Phase3Home } from './pages/Phase3Home';

import { Phase2StoreProvider } from './store/Phase2ContextStore';
import { Phase3StoreProvider } from './store/Phase3ContextStore';

export default function App() {
  return (
    <Phase2StoreProvider>
      <Phase3StoreProvider>
        <BrowserRouter>
        <div className="app-container">
          <main className="main-content">
            <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/process_home" element={<ProcessHome />} />
            
            <Route path="/phase1_entry" element={<Phase1Entry />} />
            <Route path="/phase1_home" element={<Home />} />
            <Route path="/phase1_progress" element={<Phase1Progress />} />
            <Route path="/tonight" element={<Tonight />} />
            <Route path="/active_session" element={<ActiveSession />} />
            
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/settings" element={<Control />} />
            <Route path="/insight" element={<InsightDetail />} />
            
            <Route path="/phase2/entry" element={<Phase2Entry />} />
            <Route path="/phase2/questions" element={<Phase2Questions />} />
            <Route path="/phase2/context" element={<Phase2Context />} />
            <Route path="/phase2/proposals" element={<Phase2Proposals />} />
            
            <Route path="/phase3_home" element={<Phase3Home />} />
          </Routes>
        </main>
        {/* <BottomNav /> - Temporarily hidden during guided flow testing if wanted, but left here for global structure */}
        <BottomNav />
      </div>
    </BrowserRouter>
    </Phase3StoreProvider>
  </Phase2StoreProvider>
  );
}
