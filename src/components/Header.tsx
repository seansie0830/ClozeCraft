import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';
import { Printer, FileText, Globe, Sparkles, CheckCircle2, FileEdit } from 'lucide-react';

export const Header: React.FC = () => {
  const { uiLang, setUiLang } = useWorksheet();
  const location = useLocation();

  const navItems = [
    { path: '/', label: getTranslation(uiLang, 'navWorksheet'), icon: FileText },
    { path: '/practice', label: getTranslation(uiLang, 'navInteractive'), icon: CheckCircle2 },
    { path: '/import', label: getTranslation(uiLang, 'navImport'), icon: Sparkles },
  ];

  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <Link to="/" className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                {getTranslation(uiLang, 'appName')}
              </Link>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Lang switch & Quick Print */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setUiLang(uiLang === 'zh-TW' ? 'en' : 'zh-TW')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              title="Switch Language / 切換語言"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>{uiLang === 'zh-TW' ? 'English' : '繁體中文'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              title="Print"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline-block text-xs">{getTranslation(uiLang, 'printButton')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
