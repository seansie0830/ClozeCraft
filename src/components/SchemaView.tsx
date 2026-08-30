import React, { useState } from 'react';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';
import { WORKSHEET_JSON_SCHEMA } from '../utils/schema';
import { Code2, Copy, Check, Layers, Lightbulb } from 'lucide-react';

export const SchemaView: React.FC = () => {
  const { uiLang } = useWorksheet();
  const [copied, setCopied] = useState(false);

  const schemaString = JSON.stringify(WORKSHEET_JSON_SCHEMA, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schemaString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-indigo-600" />
                <span>{getTranslation(uiLang, 'schemaTitle')}</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getTranslation(uiLang, 'schemaDesc')}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? getTranslation(uiLang, 'copiedSuccess') : getTranslation(uiLang, 'copySchemaBtn')}</span>
            </button>
          </div>
        </div>

        {/* Universal Tokenization Rule Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-2 text-amber-950">
          <h2 className="text-base font-bold flex items-center gap-2 text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>通用連續字串 Token 化原則（跨學科通用）</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            系統<strong>不需要進行複雜的逐字/斷詞分詞</strong>。連續未挖空的題目文字直接合併為單一 Token（<code>"shown": true</code>），包含標點符號與前後空格。只有學生需要作答填寫的詞句、數值或專有名詞才獨立為挖空 Token（<code>"shown": false</code>）。
          </p>
          <div className="p-3 bg-white/80 rounded-xl font-mono text-xs text-gray-800 border border-amber-200">
            <code>
              {`// 範例：牛頓第二運動定律公式為 F = ma
[
  { "text": "牛頓第二運動定律公式為 F = ", "shown": true },
  { "text": "ma", "shown": false, "hint": "公式" },
  { "text": "，其中 F 代表外力，m 代表質量。", "shown": true }
]`}
            </code>
          </div>
        </div>

        {/* Visual Architecture Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>階層架構圖解 (Hierarchy Tree)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold inline-block">
                1. Section (大題)
              </span>
              <p className="text-gray-700 font-medium">代表測驗卷的大題分組：</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 font-mono">
                <li>title: 大題名稱</li>
                <li>instructions: 作答指引</li>
                <li>showWordBank: 字庫顯示</li>
                <li>sentences: [ ... ]</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold inline-block">
                2. Sentence (句子)
              </span>
              <p className="text-gray-700 font-medium">代表題目中的單一題目句：</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 font-mono">
                <li>tokens: [ ... ] (詞彙陣列)</li>
                <li>translation: 參考翻譯/解析</li>
                <li>note: 補充筆記</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold inline-block">
                3. Token (文字片段/填空)
              </span>
              <p className="text-gray-700 font-medium">代表最小的顯示片段或挖空格：</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 font-mono">
                <li>text: 題目文字或挖空解答</li>
                <li>shown: true (顯示) / false (挖空)</li>
                <li>hint: (選填) 提示文字</li>
                <li>blankId: (選填) 自訂題號</li>
              </ul>
            </div>
          </div>
        </div>

        {/* JSON Schema Code Block */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-800 text-emerald-300">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-mono">
            <span>JSON Schema (Draft 2020-12)</span>
          </div>
          <pre className="font-mono text-xs overflow-x-auto leading-relaxed">
            {schemaString}
          </pre>
        </div>
      </div>
    </div>
  );
};
