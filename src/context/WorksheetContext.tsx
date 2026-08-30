import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WorksheetData, PrintSettings, UILanguage } from '../types/worksheet';
import { DEFAULT_SIMPLE_WORKSHEET, CHINESE_IDIOMS_WORKSHEET } from '../utils/schema';

interface WorksheetContextType {
  worksheet: WorksheetData;
  setWorksheet: React.Dispatch<React.SetStateAction<WorksheetData>>;
  uiLang: UILanguage;
  setUiLang: (lang: UILanguage) => void;
  printSettings: PrintSettings;
  setPrintSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
  showAnswersOnScreen: boolean;
  setShowAnswersOnScreen: React.Dispatch<React.SetStateAction<boolean>>;
  loadPreset: (type: 'simple' | 'chinese') => void;
  resetToDefault: () => void;
}

const defaultPrintSettings: PrintSettings = {
  fontSize: 'base',
  blankStyle: 'line',
  showBlankIndex: true,
  showWordBank: true,
  showAnswerKey: true,
  separateAnswerKeyPage: false,
  showStudentHeader: true,
  showHints: false,
};

const WorksheetContext = createContext<WorksheetContextType | undefined>(undefined);

const STORAGE_KEY_WORKSHEET = 'agy_cloze_worksheet';
const STORAGE_KEY_SETTINGS = 'agy_cloze_print_settings';
const STORAGE_KEY_LANG = 'agy_cloze_lang';

export const WorksheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worksheet, setWorksheet] = useState<WorksheetData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKSHEET);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SIMPLE_WORKSHEET;
  });

  const [uiLang, setUiLangState] = useState<UILanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'zh-TW') return saved;
    } catch {
      // fallback
    }
    return 'zh-TW';
  });

  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...defaultPrintSettings, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return defaultPrintSettings;
  });

  const [showAnswersOnScreen, setShowAnswersOnScreen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKSHEET, JSON.stringify(worksheet));
    } catch (e) {
      console.error('Failed to save worksheet to localStorage', e);
    }
  }, [worksheet]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(printSettings));
    } catch (e) {
      console.error('Failed to save print settings to localStorage', e);
    }
  }, [printSettings]);

  const setUiLang = (lang: UILanguage) => {
    setUiLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  };

  const loadPreset = (type: 'simple' | 'chinese') => {
    if (type === 'simple') {
      setWorksheet(DEFAULT_SIMPLE_WORKSHEET);
    } else if (type === 'chinese') {
      setWorksheet(CHINESE_IDIOMS_WORKSHEET);
    }
  };

  const resetToDefault = () => {
    setWorksheet(DEFAULT_SIMPLE_WORKSHEET);
    setPrintSettings(defaultPrintSettings);
    setShowAnswersOnScreen(false);
  };

  return (
    <WorksheetContext.Provider
      value={{
        worksheet,
        setWorksheet,
        uiLang,
        setUiLang,
        printSettings,
        setPrintSettings,
        showAnswersOnScreen,
        setShowAnswersOnScreen,
        loadPreset,
        resetToDefault,
      }}
    >
      {children}
    </WorksheetContext.Provider>
  );
};

export const useWorksheet = () => {
  const context = useContext(WorksheetContext);
  if (!context) {
    throw new Error('useWorksheet must be used within a WorksheetProvider');
  }
  return context;
};
