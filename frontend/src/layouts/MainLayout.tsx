import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Globe, MessageCircle } from 'lucide-react';
import { AssistantWidget } from '../components/AssistantWidget';
import { useAssistant } from '../context/AssistantContext';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { openAssistant } = useAssistant();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Equipos', path: '/equipos' },
    { label: 'Jugadores', path: '/jugadores' },
    { label: 'Partidos', path: '/partidos' },
    { label: 'Estadísticas', path: '/estadisticas' },
  ];

  return (
    <div className="worldcup-background flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Globe className="w-8 h-8 text-blue-500" />
            <div className="text-left">
              <p className="text-sm text-slate-400">WORLD CUP</p>
              <p className="text-lg font-bold text-white">DATA HUB</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-800 space-y-2">
            <button
              onClick={openAssistant}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Asistente IA
            </button>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
            >
              API Docs
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-xl font-bold text-white">Copa Mundial FIFA 2018</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Assistant Widget */}
      <AssistantWidget />
    </div>
  );
}
