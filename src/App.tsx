import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { InsightDetail } from './pages/InsightDetail';
import { Tonight } from './pages/Tonight';
import { Patterns } from './pages/Patterns';
import { Profile } from './pages/Profile';
import { Control } from './pages/Control';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/control" element={<Control />} />
            <Route path="/insight" element={<InsightDetail />} />
            <Route path="/tonight" element={<Tonight />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
