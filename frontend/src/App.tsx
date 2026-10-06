import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Equipos } from './pages/Equipos';
import { Jugadores } from './pages/Jugadores';
import { Partidos } from './pages/Partidos';
import { Estadisticas } from './pages/Estadisticas';
import { Asistente } from './pages/Asistente';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/asistente" element={<Asistente />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
