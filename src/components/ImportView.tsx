import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorksheet } from '../context/WorksheetContext';
import { getTranslation } from '../i18n/translations';
import { generateLLMPrompt } from '../utils/llmPrompt';
import {
  validateWorksheetJson,
  DEFAULT_SIMPLE_WORKSHEET,
  SCIENCE_SUBJECT_WORKSHEET,
  CHINESE_IDIOMS_WORKSHEET,
} from '../utils/schema';
import type { WorksheetData } from '../types/worksheet';
import {
  Sparkles,
  Copy,
  Check,
  Upload,
  Download,
  FileCode,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Lightbulb,
  ClipboardPaste,
  Trash2,
  Wand2,
} from 'lucide-react';

export const ImportView: React.FC = () => {
  const { setWorksheet, uiLang } = useWorksheet();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');

  // Prompt generator states - default empty unless manually triggered
  const [customInstructions, setCustomInstructions] = useState('');
  const [rawText, setRawText] = useState('');
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [showWordBank, setShowWordBank] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [promptClipboardMsg, setPromptClipboardMsg] = useState<string | null>(null);

  // JSON Import states - default empty unless manually triggered
  const [jsonText, setJsonText] = useState('');
  const [jsonClipboardMsg, setJsonClipboardMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick prompt instructions presets
  const promptPresets = [
    {
      id: 'general',
      label: getTranslation(uiLang, 'presetGeneral'),
      text: '請根據提供的教材內容製作概念填空題，挑選關鍵字詞、名詞或專有名詞進行挖空。',
    },
    {
      id: 'science',
      label: getTranslation(uiLang, 'presetScience'),
      text: '請針對自然科學/理化教材出題，挖空重點包含核心定律、實驗現象、化學式、物理量與公式。',
    },
    {
      id: 'cloze',
      label: getTranslation(uiLang, 'presetCloze'),
      text: '請製作語文克漏字測驗，挖空重點包含重要單字、片語、成語與語意關鍵詞。',
    },
    {
      id: 'math',
      label: getTranslation(uiLang, 'presetMath'),
      text: '請針對數理題目進行挖空，挖空重點包含公式名稱、關鍵步驟、定義及最終計算數值。',
    },
  ];

  // Generate dynamic prompt
  const generatedPrompt = useMemo(() => {
    return generateLLMPrompt({
      customInstructions,
      rawText,
      includeAnswerKey,
      showWordBank,
      promptLang: uiLang,
    });
  }, [customInstructions, rawText, includeAnswerKey, showWordBank, uiLang]);

  // Validate JSON
  const validation = useMemo(() => {
    if (!jsonText.trim()) {
      return { valid: false, errors: [], empty: true };
    }
    try {
      const parsed = JSON.parse(jsonText);
      const res = validateWorksheetJson(parsed);
      return { ...res, empty: false };
    } catch (e: any) {
      return {
        valid: false,
        empty: false,
        errors: [{ path: 'JSON Syntax', message: e.message || 'Invalid JSON syntax' }],
      };
    }
  }, [jsonText]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Clipboard read for Prompt Tab raw text
  const handlePasteRawTextFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
        setPromptClipboardMsg(getTranslation(uiLang, 'readClipboardSuccess'));
        setTimeout(() => setPromptClipboardMsg(null), 2500);
      }
    } catch {
      setPromptClipboardMsg(getTranslation(uiLang, 'readClipboardError'));
      setTimeout(() => setPromptClipboardMsg(null), 3500);
    }
  };

  // Clipboard read for JSON Tab
  const handlePasteJsonFromClipboard = async () => {
    try {
      let text = await navigator.clipboard.readText();
      if (text) {
        // Strip markdown code block if user copied ```json ... ```
        text = text.trim();
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        try {
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          setJsonText(formatted);
          setJsonClipboardMsg({ type: 'success', text: getTranslation(uiLang, 'readClipboardSuccess') });
        } catch {
          // Paste as raw text anyway so user can inspect
          setJsonText(text);
          setJsonClipboardMsg({ type: 'success', text: getTranslation(uiLang, 'readClipboardSuccess') });
        }
        setTimeout(() => setJsonClipboardMsg(null), 3000);
      }
    } catch {
      setJsonClipboardMsg({ type: 'error', text: getTranslation(uiLang, 'readClipboardError') });
      setTimeout(() => setJsonClipboardMsg(null), 4000);
    }
  };

  const handleFormatJson = () => {
    if (!jsonText.trim()) return;
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  const handleApplyPreset = (preset: WorksheetData) => {
    const formatted = JSON.stringify(preset, null, 2);
    setJsonText(formatted);
    setWorksheet(preset);
  };

  const handleLoadSampleContent = () => {
    setCustomInstructions('請針對自然科學與跨學科內容製作概念填空題，挖空核心專有名詞與公式。');
    setRawText(
      `1. 綠色植物行光合作用需要葉綠體，並吸收二氧化碳與水，釋出氧氣。\n2. 牛頓第二運動定律公式為 F = ma，其中 F 為外力，m 為質量，a 為加速度。\n3. The sky is the limit.\n4. 做事情必須腳踏實地，不可心存僥倖。`
    );
  };

  const handleClearPrompt = () => {
    setCustomInstructions('');
    setRawText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
        try {
          const parsed = JSON.parse(content);
          const val = validateWorksheetJson(parsed);
          if (val.valid) {
            setWorksheet(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    if (!jsonText.trim()) return;
    try {
      const parsed = JSON.parse(jsonText);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parsed, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${parsed.title || 'worksheet'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleImportAndProceed = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const val = validateWorksheetJson(parsed);
      if (val.valid) {
        setWorksheet(parsed);
        navigate('/');
      }
    } catch (e) {
      console.error('Import failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tab Switcher */}
        <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-gray-200 flex gap-2">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{getTranslation(uiLang, 'importTabPrompt')}</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>{getTranslation(uiLang, 'importTabJson')}</span>
          </button>
        </div>

        {/* TAB 1: LLM PROMPT GENERATOR */}
        {activeTab === 'prompt' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>{getTranslation(uiLang, 'promptTitle')}</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTranslation(uiLang, 'promptDesc')}
                  </p>
                </div>

                {/* Manual sample trigger & clear */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleContent}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{getTranslation(uiLang, 'loadSampleText')}</span>
                  </button>

                  {(customInstructions || rawText) && (
                    <button
                      type="button"
                      onClick={handleClearPrompt}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                      title={getTranslation(uiLang, 'clearText')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{getTranslation(uiLang, 'clearText')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tokenization Concept Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{getTranslation(uiLang, 'tokenizationNote')}</span>
              </div>

              {/* Custom Prompt Instructions */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-gray-700">
                    {getTranslation(uiLang, 'customInstructionsLabel')}
                  </label>
                  <span className="text-2xs text-gray-500">
                    {getTranslation(uiLang, 'quickPromptPresets')}
                  </span>
                </div>

                {/* Quick Presets Pills */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {promptPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCustomInstructions(p.text)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-medium text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  placeholder="輸入您的自訂出題要求（留空則使用預設泛用指令）..."
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAnswerKey}
                    onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>包含解答卷 ("includeAnswerKey": true)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showWordBank}
                    onChange={(e) => setShowWordBank(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>包含參考字庫 ("showWordBank": true)</span>
                </label>
              </div>

              {/* Raw Text Input Box with Clipboard Paste Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    {getTranslation(uiLang, 'inputTextLabel')}
                  </label>

                  <div className="flex items-center gap-2">
                    {promptClipboardMsg && (
                      <span className="text-2xs text-indigo-600 font-medium animate-fade-in">
                        {promptClipboardMsg}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handlePasteRawTextFromClipboard}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>{getTranslation(uiLang, 'pasteFromClipboard')}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={getTranslation(uiLang, 'inputTextPlaceholder')}
                  className="w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Output Prompt & Copy Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    組合後的 LLM 提示詞預覽 (Ready-to-use Prompt)
                  </span>

                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? getTranslation(uiLang, 'copiedSuccess') : getTranslation(uiLang, 'copyPromptBtn')}</span>
                  </button>
                </div>

                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-72 border border-gray-800 leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>

              {/* Instructions */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  使用流程教學：
                </p>
                <ol className="list-decimal list-inside space-y-1 text-indigo-800 pl-1">
                  <li>點擊上方 <strong>「{getTranslation(uiLang, 'copyPromptBtn')}」</strong>。</li>
                  <li>貼給 ChatGPT、Claude 或 Gemini 送出。</li>
                  <li>複製 LLM 回覆的 JSON 代碼。</li>
                  <li>切換至上方 <strong>「{getTranslation(uiLang, 'importTabJson')}」</strong> 點擊「從剪貼簿讀取貼上」並匯入。</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JSON IMPORTER */}
        {activeTab === 'json' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-indigo-600" />
                    <span>{getTranslation(uiLang, 'jsonImportTitle')}</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTranslation(uiLang, 'jsonImportDesc')}
                  </p>
                </div>

                {/* Quick actions: Read Clipboard, Upload, Export */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handlePasteJsonFromClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>{getTranslation(uiLang, 'pasteFromClipboard')}</span>
                  </button>

                  <label className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                    <span>{getTranslation(uiLang, 'uploadJsonFile')}</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {jsonText.trim() && (
                    <button
                      onClick={handleExportJson}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>{getTranslation(uiLang, 'exportBtn')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Clipboard Notification */}
              {jsonClipboardMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
                    jsonClipboardMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {jsonClipboardMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{jsonClipboardMsg.text}</span>
                </div>
              )}

              {/* Manual Sample Presets Trigger Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApplyPreset(DEFAULT_SIMPLE_WORKSHEET)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
                  >
                    ⚡ {getTranslation(uiLang, 'loadPresetSimple')}
                  </button>

                  <button
                    onClick={() => handleApplyPreset(SCIENCE_SUBJECT_WORKSHEET)}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold border border-purple-200 transition-colors cursor-pointer"
                  >
                    ⚡ {getTranslation(uiLang, 'loadPresetScience')}
                  </button>

                  <button
                    onClick={() => handleApplyPreset(CHINESE_IDIOMS_WORKSHEET)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
                  >
                    ⚡ {getTranslation(uiLang, 'loadPresetChinese')}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {jsonText.trim() && (
                    <>
                      <button
                        onClick={handleFormatJson}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium transition-colors cursor-pointer"
                      >
                        {getTranslation(uiLang, 'formatJson')}
                      </button>
                      <button
                        onClick={() => setJsonText('')}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {getTranslation(uiLang, 'clearText')}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* JSON Editor Area */}
              <div>
                <textarea
                  rows={13}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={getTranslation(uiLang, 'jsonPlaceholder')}
                  className="w-full font-mono text-xs bg-gray-900 text-emerald-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-800 leading-relaxed placeholder:text-gray-600"
                  spellCheck={false}
                />
              </div>

              {/* Validation Diagnostics Feedback */}
              {jsonText.trim() && (
                <div>
                  {validation.valid ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{getTranslation(uiLang, 'validationSuccess')}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{getTranslation(uiLang, 'validationError')}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pl-2 font-mono text-2xs text-rose-700">
                        {validation.errors?.map((err, i) => (
                          <li key={i}>
                            [{err.path}] {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Final Import Button */}
              <div className="pt-2">
                <button
                  disabled={!validation.valid}
                  onClick={handleImportAndProceed}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    validation.valid
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>{getTranslation(uiLang, 'importBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
