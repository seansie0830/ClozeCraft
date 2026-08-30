import React from 'react';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';

export const StudentHeader: React.FC = () => {
  const { uiLang, printSettings } = useWorksheet();

  if (!printSettings.showStudentHeader) return null;

  return (
    <div className="border-b-2 border-gray-800 pb-3 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium text-gray-800">
        <div className="flex items-end">
          <span className="shrink-0">{getTranslation(uiLang, 'classField')}</span>
          <span className="inline-block flex-1 border-b border-gray-400 min-h-[1.5rem] ml-1"></span>
        </div>
        <div className="flex items-end">
          <span className="shrink-0">{getTranslation(uiLang, 'nameField')}</span>
          <span className="inline-block flex-1 border-b border-gray-400 min-h-[1.5rem] ml-1"></span>
        </div>
        <div className="flex items-end">
          <span className="shrink-0">{getTranslation(uiLang, 'dateField')}</span>
          <span className="inline-block flex-1 border-b border-gray-400 min-h-[1.5rem] ml-1"></span>
        </div>
        <div className="flex items-end">
          <span className="shrink-0">{getTranslation(uiLang, 'scoreField')}</span>
          <span className="inline-block flex-1 border-b border-gray-400 min-h-[1.5rem] ml-1"></span>
        </div>
      </div>
    </div>
  );
};
