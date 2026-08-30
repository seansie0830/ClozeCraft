import React, { useMemo } from 'react';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';
import { StudentHeader } from './StudentHeader';
import { Printer, Eye, EyeOff, Sliders, CheckCircle } from 'lucide-react';

export const WorksheetView: React.FC = () => {
  const {
    worksheet,
    uiLang,
    printSettings,
    setPrintSettings,
    showAnswersOnScreen,
    setShowAnswersOnScreen,
  } = useWorksheet();

  // Compute blank index and answer key items
  const { sectionBlanks, allAnswers, totalBlanks } = useMemo(() => {
    let globalIndex = 1;
    const blanksBySection: { [secIndex: number]: { id: number | string; text: string; hint?: string }[] } = {};
    const answers: { index: number; text: string; hint?: string; sectionTitle: string }[] = [];

    worksheet.sections.forEach((section, secIdx) => {
      blanksBySection[secIdx] = [];
      section.sentences.forEach((sentence) => {
        sentence.tokens.forEach((token) => {
          if (!token.shown) {
            const blankNumber = token.blankId !== undefined ? token.blankId : globalIndex++;
            blanksBySection[secIdx].push({
              id: blankNumber,
              text: token.text,
              hint: token.hint,
            });
            answers.push({
              index: typeof blankNumber === 'number' ? blankNumber : globalIndex,
              text: token.text,
              hint: token.hint,
              sectionTitle: section.title,
            });
          }
        });
      });
    });

    return {
      sectionBlanks: blanksBySection,
      allAnswers: answers,
      totalBlanks: answers.length,
    };
  }, [worksheet]);

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[printSettings.fontSize];



  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6 lg:px-8">
      {/* Control Bar (Screen only) */}
      <div className="no-print max-w-4xl mx-auto bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">
              {getTranslation(uiLang, 'worksheetTitle')}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              {worksheet.sections.length} 個大題 / 共 {totalBlanks} 處填空
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle answers on screen */}
            <button
              onClick={() => setShowAnswersOnScreen(!showAnswersOnScreen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                showAnswersOnScreen
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showAnswersOnScreen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAnswersOnScreen ? getTranslation(uiLang, 'hideAnswers') : getTranslation(uiLang, 'toggleAnswers')}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{getTranslation(uiLang, 'printButton')}</span>
            </button>
          </div>
        </div>

        {/* Extended options toolbar */}
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs text-gray-700">
          {/* Font Size */}
          <div>
            <label className="block text-gray-500 font-medium mb-1">{getTranslation(uiLang, 'fontSize')}</label>
            <select
              value={printSettings.fontSize}
              onChange={(e) => setPrintSettings({ ...printSettings, fontSize: e.target.value as any })}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="sm">{getTranslation(uiLang, 'fontSmall')}</option>
              <option value="base">{getTranslation(uiLang, 'fontMedium')}</option>
              <option value="lg">{getTranslation(uiLang, 'fontLarge')}</option>
              <option value="xl">{getTranslation(uiLang, 'fontXLarge')}</option>
            </select>
          </div>

          {/* Blank Style */}
          <div>
            <label className="block text-gray-500 font-medium mb-1">{getTranslation(uiLang, 'blankStyle')}</label>
            <select
              value={printSettings.blankStyle}
              onChange={(e) => setPrintSettings({ ...printSettings, blankStyle: e.target.value as any })}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="line">{getTranslation(uiLang, 'blankStyleLine')}</option>
              <option value="box">{getTranslation(uiLang, 'blankStyleBox')}</option>
              <option value="dashed">{getTranslation(uiLang, 'blankStyleDashed')}</option>
            </select>
          </div>

          {/* Toggle Student Header */}
          <div className="flex items-center gap-1.5 pt-5">
            <input
              type="checkbox"
              id="showStudentHeader"
              checked={printSettings.showStudentHeader}
              onChange={(e) => setPrintSettings({ ...printSettings, showStudentHeader: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="showStudentHeader" className="cursor-pointer select-none">
              {getTranslation(uiLang, 'studentHeaderToggle')}
            </label>
          </div>

          {/* Toggle Blank Index */}
          <div className="flex items-center gap-1.5 pt-5">
            <input
              type="checkbox"
              id="showBlankIndex"
              checked={printSettings.showBlankIndex}
              onChange={(e) => setPrintSettings({ ...printSettings, showBlankIndex: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="showBlankIndex" className="cursor-pointer select-none">
              {getTranslation(uiLang, 'blankIndexToggle')}
            </label>
          </div>

          {/* Toggle Word Bank */}
          <div className="flex items-center gap-1.5 pt-5">
            <input
              type="checkbox"
              id="showWordBank"
              checked={printSettings.showWordBank}
              onChange={(e) => setPrintSettings({ ...printSettings, showWordBank: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="showWordBank" className="cursor-pointer select-none">
              {getTranslation(uiLang, 'wordBankToggle')}
            </label>
          </div>

          {/* Separate Answer Key Page */}
          <div className="flex items-center gap-1.5 pt-5">
            <input
              type="checkbox"
              id="separateAnswerKeyPage"
              checked={printSettings.separateAnswerKeyPage}
              onChange={(e) => setPrintSettings({ ...printSettings, separateAnswerKeyPage: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="separateAnswerKeyPage" className="cursor-pointer select-none">
              {getTranslation(uiLang, 'separateAnswerKeyPage')}
            </label>
          </div>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="worksheet-printable-area max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200 text-gray-900 print:p-0 print:border-none print:shadow-none">
        {/* Title & Description */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {worksheet.title}
          </h1>
          {worksheet.description && (
            <p className="text-sm sm:text-base text-gray-600 italic">
              {worksheet.description}
            </p>
          )}
        </div>

        {/* Student Header */}
        <StudentHeader />

        {/* Sections */}
        {worksheet.sections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {getTranslation(uiLang, 'noSections')}
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              let blankCounter = 1;
              return worksheet.sections.map((section, secIdx) => {
                // Collect hidden words for Word Bank if enabled
                const hiddenTokens = sectionBlanks[secIdx] || [];
                const wordBankList = [...new Set(hiddenTokens.map((item) => item.text))].sort();

                return (
                  <div key={section.id || secIdx} className="page-break-inside-avoid">
                    {/* Section Header */}
                    <div className="border-b border-gray-300 pb-1.5 mb-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {section.title}
                      </h2>
                      {section.instructions && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                          {section.instructions}
                        </p>
                      )}
                    </div>

                    {/* Optional Word Bank Box */}
                    {printSettings.showWordBank && (section.showWordBank ?? true) && wordBankList.length > 0 && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                          參考字庫 (Word Bank):
                        </span>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {wordBankList.map((word, wIdx) => (
                            <span
                              key={wIdx}
                              className="inline-block px-2.5 py-0.5 bg-white border border-gray-300 rounded font-medium text-gray-800 shadow-2xs"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sentences */}
                    <div className={`space-y-4 ${fontSizeClass}`}>
                      {section.sentences.map((sentence, sentIdx) => {
                        return (
                          <div key={sentence.id || sentIdx} className="leading-loose">
                            <span className="font-semibold text-gray-500 mr-2">
                              {sentIdx + 1}.
                            </span>

                            {/* Render sentence tokens */}
                            {sentence.tokens.map((token, tokIdx) => {
                              const isHidden = !token.shown;
                              const currentBlankNum = isHidden
                                ? token.blankId !== undefined
                                  ? token.blankId
                                  : blankCounter++
                                : null;

                              if (isHidden) {
                                // Blank representation
                                const blankMinLength = Math.max(token.text.length, 5);
                                return (
                                  <span
                                    key={tokIdx}
                                    className="inline-flex items-baseline mx-1 align-baseline relative"
                                  >
                                    {/* Blank Number */}
                                    {printSettings.showBlankIndex && currentBlankNum && (
                                      <span className="text-xs font-bold text-indigo-700 mr-1 print:text-black select-none">
                                        ({currentBlankNum})
                                      </span>
                                    )}

                                    {/* The Blank / Answer */}
                                    {showAnswersOnScreen ? (
                                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 print:text-black print:bg-transparent print:border-none print:underline print:underline-offset-4">
                                        {token.text}
                                      </span>
                                    ) : printSettings.blankStyle === 'box' ? (
                                      <span
                                        className="inline-block border border-gray-400 rounded px-2.5 py-0.5 text-center text-transparent select-none bg-gray-50/50 min-w-[3rem]"
                                        style={{ width: `${blankMinLength * 0.9}em` }}
                                      >
                                        {token.hint && printSettings.showHints ? (
                                          <span className="text-xs text-gray-400 select-text">{token.hint}</span>
                                        ) : (
                                          ' '
                                        )}
                                      </span>
                                    ) : printSettings.blankStyle === 'dashed' ? (
                                      <span
                                        className="inline-block border-b-2 border-dashed border-gray-600 text-center text-transparent select-none min-w-[3rem]"
                                        style={{ width: `${blankMinLength * 0.9}em` }}
                                      >
                                        {token.hint && printSettings.showHints ? (
                                          <span className="text-xs text-gray-400 select-text">{token.hint}</span>
                                        ) : (
                                          ' '
                                        )}
                                      </span>
                                    ) : (
                                      /* Standard Solid Underline */
                                      <span
                                        className="inline-block border-b-2 border-gray-800 text-center text-transparent select-none min-w-[3rem]"
                                        style={{ width: `${blankMinLength * 0.9}em` }}
                                      >
                                        {token.hint && printSettings.showHints ? (
                                          <span className="text-xs text-gray-400 select-text">{token.hint}</span>
                                        ) : (
                                          ' '
                                        )}
                                      </span>
                                    )}

                                    {/* Hint footnote if enabled */}
                                    {token.hint && !showAnswersOnScreen && printSettings.showHints && (
                                      <span className="text-2xs text-gray-400 ml-0.5">
                                        [{token.hint}]
                                      </span>
                                    )}
                                  </span>
                                );
                              }

                              // Visible continuous text token (preserves natural spaces and punctuation)
                              return (
                                <span key={tokIdx} className="text-gray-900 whitespace-pre-wrap">
                                  {token.text}
                                </span>
                              );
                            })}

                            {/* Optional translation or note */}
                            {sentence.translation && (
                              <div className="text-xs text-gray-500 mt-1 pl-5">
                                {sentence.translation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* Answer Key Section */}
        {worksheet.includeAnswerKey && printSettings.showAnswerKey && allAnswers.length > 0 && (
          <div
            className={`mt-12 pt-6 border-t-2 border-dashed border-gray-400 ${
              printSettings.separateAnswerKeyPage ? 'page-break-before' : 'page-break-inside-avoid'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600 print:text-black" />
                <span>{getTranslation(uiLang, 'answerKeyTitle')}</span>
              </h3>
              <span className="text-xs text-gray-500">
                共 {allAnswers.length} 題解答
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
              {allAnswers.map((ans, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 print:border-gray-300 print:bg-white"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 print:bg-gray-200 print:text-black">
                    {ans.index}
                  </span>
                  <span className="font-semibold text-gray-900 break-all">
                    {ans.text}
                  </span>
                  {ans.hint && (
                    <span className="text-2xs text-gray-400 truncate">
                      ({ans.hint})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
