import React, { useState, useMemo } from 'react';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';
import { CheckCircle2, RotateCcw, Eye, HelpCircle, Award, Sparkles } from 'lucide-react';

export const InteractiveTest: React.FC = () => {
  const { worksheet, uiLang } = useWorksheet();

  // User input answers map: { [blankKey: string]: string }
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [revealedBlanks, setRevealedBlanks] = useState<{ [key: string]: boolean }>({});
  const [isChecked, setIsChecked] = useState(false);

  // Index all blanks
  const { blankList, totalBlanks } = useMemo(() => {
    let globalIndex = 1;
    const list: { key: string; index: number; target: string; hint?: string }[] = [];

    worksheet.sections.forEach((section, secIdx) => {
      section.sentences.forEach((sentence, sentIdx) => {
        sentence.tokens.forEach((token, tokIdx) => {
          if (!token.shown) {
            const key = `${secIdx}-${sentIdx}-${tokIdx}`;
            list.push({
              key,
              index: globalIndex++,
              target: token.text,
              hint: token.hint,
            });
          }
        });
      });
    });

    return { blankList: list, totalBlanks: list.length };
  }, [worksheet]);

  // Compute score
  const { correctCount, percentage } = useMemo(() => {
    if (!isChecked) return { correctCount: 0, percentage: 0 };
    let correct = 0;
    blankList.forEach((b) => {
      const input = (userAnswers[b.key] || '').trim().toLowerCase();
      const target = b.target.trim().toLowerCase();
      if (input === target) {
        correct++;
      }
    });
    const pct = totalBlanks > 0 ? Math.round((correct / totalBlanks) * 100) : 0;
    return { correctCount: correct, percentage: pct };
  }, [isChecked, userAnswers, blankList, totalBlanks]);

  const handleInputChange = (key: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [key]: val }));
    setIsChecked(false);
  };

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setRevealedBlanks({});
    setIsChecked(false);
  };

  const handleRevealAll = () => {
    const allRevealed: { [key: string]: boolean } = {};
    blankList.forEach((b) => {
      allRevealed[b.key] = true;
    });
    setRevealedBlanks(allRevealed);
  };

  const toggleSingleReveal = (key: string) => {
    setRevealedBlanks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span>{getTranslation(uiLang, 'interactiveTitle')}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {getTranslation(uiLang, 'interactiveDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCheck}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{getTranslation(uiLang, 'checkAnswers')}</span>
            </button>

            <button
              onClick={handleRevealAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-sm font-medium transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{getTranslation(uiLang, 'revealAll')}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{getTranslation(uiLang, 'resetPractice')}</span>
            </button>
          </div>
        </div>

        {/* Score Banner when checked */}
        {isChecked && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-6 flex items-center gap-4 text-indigo-950 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {getTranslation(uiLang, 'scoreResult')
                  .replace('{total}', String(totalBlanks))
                  .replace('{correct}', String(correctCount))
                  .replace('{percentage}', String(percentage))}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-700 mt-0.5">
                {percentage === 100 ? '太棒了！全部答對！🎉' : '繼續加油！檢查答錯的題目並多加練習。'}
              </p>
            </div>
          </div>
        )}

        {/* Worksheet Questions in Interactive Mode */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-200 space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">{worksheet.title}</h2>
            {worksheet.description && (
              <p className="text-sm text-gray-600 mt-1">{worksheet.description}</p>
            )}
          </div>

          {worksheet.sections.map((section, secIdx) => (
            <div key={section.id || secIdx} className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                {section.instructions && (
                  <p className="text-xs text-gray-500 mt-0.5">{section.instructions}</p>
                )}
              </div>

              <div className="space-y-4">
                {section.sentences.map((sentence, sentIdx) => (
                  <div key={sentence.id || sentIdx} className="text-base leading-loose">
                    <span className="font-semibold text-gray-400 mr-2">{sentIdx + 1}.</span>

                    {sentence.tokens.map((token, tokIdx) => {
                      const key = `${secIdx}-${sentIdx}-${tokIdx}`;
                      const isHidden = !token.shown;

                      if (isHidden) {
                        const userVal = userAnswers[key] || '';
                        const isRevealed = revealedBlanks[key];
                        const isCorrect = isChecked && userVal.trim().toLowerCase() === token.text.trim().toLowerCase();
                        const isWrong = isChecked && !isCorrect;

                        return (
                          <span key={tokIdx} className="inline-flex items-center mx-1 align-middle relative group">
                            <input
                              type="text"
                              value={userVal}
                              placeholder={token.hint ? `[${token.hint}]` : ''}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              className={`px-2.5 py-1 text-sm font-semibold rounded-lg border text-center transition-all min-w-[5rem] max-w-[10rem] outline-none ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                  : isWrong
                                  ? 'bg-rose-50 border-rose-500 text-rose-800'
                                  : 'bg-indigo-50/40 border-indigo-200 focus:bg-white focus:border-indigo-600 text-gray-900'
                              }`}
                            />

                            {/* Small click to reveal button */}
                            <button
                              type="button"
                              onClick={() => toggleSingleReveal(key)}
                              title={token.hint ? `提示: ${token.hint}` : '點擊查看答案'}
                              className="ml-1 text-gray-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>

                            {/* Revealed popup or answer tag */}
                            {(isRevealed || isWrong) && (
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap px-2 py-0.5 rounded bg-gray-900 text-white text-xs font-medium shadow-md">
                                {token.text}
                              </span>
                            )}
                          </span>
                        );
                      }

                      return (
                        <span key={tokIdx} className="text-gray-900 whitespace-pre-wrap">
                          {token.text}
                        </span>
                      );
                    })}

                    {sentence.translation && (
                      <div className="text-xs text-gray-500 pl-6 mt-1">
                        {sentence.translation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
