import type { WorksheetData } from '../types/worksheet';

export const WORKSHEET_JSON_SCHEMA = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WorksheetData",
  "type": "object",
  "required": ["title", "sections"],
  "properties": {
    "title": {
      "type": "string",
      "description": "Worksheet main title / 測驗卷標題"
    },
    "description": {
      "type": "string",
      "description": "General instructions or subtitle / 測驗說明或指引"
    },
    "language": {
      "type": "string",
      "description": "Content language or subject / 語言或學科領域"
    },
    "includeAnswerKey": {
      "type": "boolean",
      "description": "Whether to generate and display the Answer Key / 是否包含解答卷"
    },
    "showStudentHeader": {
      "type": "boolean",
      "description": "Whether to render student name/date/class header / 是否顯示學生資訊欄"
    },
    "sections": {
      "type": "array",
      "description": "List of sections in the worksheet / 各測驗大題",
      "items": {
        "type": "object",
        "required": ["title", "sentences"],
        "properties": {
          "id": { "type": "string" },
          "title": {
            "type": "string",
            "description": "Section title e.g. '第一部分：概念填空' / 大題名稱"
          },
          "instructions": {
            "type": "string",
            "description": "Specific directions for this section / 本題作答指引"
          },
          "showWordBank": {
            "type": "boolean",
            "description": "Whether to display word bank / 是否顯示參考字庫"
          },
          "sentences": {
            "type": "array",
            "description": "List of sentences under this section / 句子列表",
            "items": {
              "type": "object",
              "required": ["tokens"],
              "properties": {
                "id": { "type": "string" },
                "translation": {
                  "type": "string",
                  "description": "Optional translation or explanation / 翻譯或解析"
                },
                "note": {
                  "type": "string",
                  "description": "Optional notes / 補充註記"
                },
                "tokens": {
                  "type": "array",
                  "description": "Array of tokens: continuous non-blank text as single token (shown: true), blanks as individual tokens (shown: false) / 連續未挖空文字為單一 token，挖空者為獨立 token",
                  "items": {
                    "type": "object",
                    "required": ["text", "shown"],
                    "properties": {
                      "text": {
                        "type": "string",
                        "description": "Text content / 文字內容"
                      },
                      "shown": {
                        "type": "boolean",
                        "description": "true = visible text, false = blank to fill / true為顯示文字，false為挖空題目"
                      },
                      "hint": {
                        "type": "string",
                        "description": "Optional hint / 提示"
                      },
                      "blankId": {
                        "type": ["number", "string"],
                        "description": "Optional custom blank index / 自訂空格題號"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const DEFAULT_SIMPLE_WORKSHEET: WorksheetData = {
  title: "基礎填空測驗範例 (Basic Blank-Filling Exercise)",
  description: "請依據文意，在各題底線空格內填入最適當的字詞或數值。",
  language: "mixed",
  includeAnswerKey: true,
  showStudentHeader: true,
  sections: [
    {
      id: "sec-1",
      title: "Part I: Basic English Sentences (基礎英語填空)",
      instructions: "Fill in each blank with the correct word.",
      showWordBank: true,
      sentences: [
        {
          id: "s1",
          tokens: [
            { text: "The sky is ", shown: true },
            { text: "the", shown: false, hint: "冠詞" },
            { text: " limit.", shown: true }
          ],
          translation: "沒有極限；前景不可限量。"
        },
        {
          id: "s2",
          tokens: [
            { text: "The apple is ", shown: true },
            { text: "red", shown: false, hint: "顏色" },
            { text: " and sweet.", shown: true }
          ],
          translation: "這顆蘋果又紅又甜。"
        },
        {
          id: "s3",
          tokens: [
            { text: "Practice makes ", shown: true },
            { text: "perfect", shown: false, hint: "完美" },
            { text: ".", shown: true }
          ],
          translation: "熟能生巧。"
        }
      ]
    },
    {
      id: "sec-2",
      title: "第二部分：生活常識與跨學科填空",
      instructions: "請在下方各題空格中填入正確的字詞或答案。",
      showWordBank: true,
      sentences: [
        {
          id: "s4",
          tokens: [
            { text: "太陽從", shown: true },
            { text: "東方", shown: false, hint: "方位" },
            { text: "升起，從", shown: true },
            { text: "西方", shown: false, hint: "方位" },
            { text: "落下。", shown: true }
          ]
        },
        {
          id: "s5",
          tokens: [
            { text: "植物進行光合作用的主要場所是細胞中的", shown: true },
            { text: "葉綠體", shown: false, hint: "細胞構造" },
            { text: "，能將光能轉換為化學能。", shown: true }
          ]
        }
      ]
    }
  ]
};

export const SCIENCE_SUBJECT_WORKSHEET: WorksheetData = {
  title: "國中自然與理化科概念填空測驗",
  description: "請閱讀題目敘述，於各空格處填入正確的專有名詞、化學式或物理量。",
  language: "zh-TW",
  includeAnswerKey: true,
  showStudentHeader: true,
  sections: [
    {
      id: "sec-sci-1",
      title: "第一大題：生物與生命現象",
      instructions: "請根據生物學原理填寫正確答案：",
      showWordBank: true,
      sentences: [
        {
          id: "sci-1",
          tokens: [
            { text: "人體主要的呼吸器官是", shown: true },
            { text: "肺臟", shown: false, hint: "器官" },
            { text: "，其內部由無數微小的", shown: true },
            { text: "肺泡", shown: false, hint: "微細構造" },
            { text: "組成，能增加氣體交換的表面積。", shown: true }
          ]
        },
        {
          id: "sci-2",
          tokens: [
            { text: "綠色植物行光合作用需要吸收", shown: true },
            { text: "二氧化碳", shown: false },
            { text: "與水，並釋放出", shown: true },
            { text: "氧氣", shown: false },
            { text: "。", shown: true }
          ]
        }
      ]
    },
    {
      id: "sec-sci-2",
      title: "第二大題：物理與力學定律",
      instructions: "請根據物理學運動定律填空：",
      showWordBank: true,
      sentences: [
        {
          id: "sci-3",
          tokens: [
            { text: "牛頓第二運動定律公式為 F = ", shown: true },
            { text: "ma", shown: false, hint: "公式" },
            { text: "，其中 F 代表外力，m 代表質量，a 代表", shown: true },
            { text: "加速度", shown: false },
            { text: "。", shown: true }
          ]
        },
        {
          id: "sci-4",
          tokens: [
            { text: "當物體所受合力為零時，靜止者恆靜止，運動者恆作", shown: true },
            { text: "等速度直線", shown: false, hint: "運動狀態" },
            { text: "運動，此現象稱為", shown: true },
            { text: "慣性定律", shown: false },
            { text: "。", shown: true }
          ]
        }
      ]
    }
  ]
};

export const CHINESE_IDIOMS_WORKSHEET: WorksheetData = {
  title: "繁體中文經典成語與閱讀理解測驗",
  description: "請閱讀文句，並在空格處填入最適當的成語或字詞。",
  language: "zh-TW",
  includeAnswerKey: true,
  showStudentHeader: true,
  sections: [
    {
      id: "sec-idioms",
      title: "第一大題：經典成語克漏字",
      instructions: "請根據前後文意，填入缺失的成語關鍵字。",
      showWordBank: true,
      sentences: [
        {
          id: "s-id1",
          tokens: [
            { text: "做事情必須", shown: true },
            { text: "腳踏實地", shown: false, hint: "認真踏實" },
            { text: "，不可心存僥倖、好高騖遠。", shown: true }
          ]
        },
        {
          id: "s-id2",
          tokens: [
            { text: "只要大家", shown: true },
            { text: "齊心協力", shown: false, hint: "眾人同心" },
            { text: "，任何困難都能", shown: true },
            { text: "迎刃而解", shown: false, hint: "順利解決" },
            { text: "。", shown: true }
          ]
        },
        {
          id: "s-id3",
          tokens: [
            { text: "讀書應該要", shown: true },
            { text: "溫故知新", shown: false, hint: "溫習舊知以得新悟" },
            { text: "，才能不斷提升自己的學問。", shown: true }
          ]
        }
      ]
    }
  ]
};

export interface ValidationError {
  path: string;
  message: string;
}

export function validateWorksheetJson(data: any): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: [{ path: 'root', message: 'Root must be a valid JSON Object.' }] };
  }

  if (!data.title || typeof data.title !== 'string') {
    errors.push({ path: 'title', message: 'Missing or invalid string "title".' });
  }

  if (!Array.isArray(data.sections)) {
    errors.push({ path: 'sections', message: '"sections" must be an array.' });
  } else {
    if (data.sections.length === 0) {
      errors.push({ path: 'sections', message: '"sections" array should contain at least one section.' });
    }

    data.sections.forEach((section: any, secIdx: number) => {
      const secPath = `sections[${secIdx}]`;
      if (!section || typeof section !== 'object') {
        errors.push({ path: secPath, message: 'Section must be an object.' });
        return;
      }

      if (!section.title || typeof section.title !== 'string') {
        errors.push({ path: `${secPath}.title`, message: 'Section requires a string "title".' });
      }

      if (!Array.isArray(section.sentences)) {
        errors.push({ path: `${secPath}.sentences`, message: 'Section "sentences" must be an array.' });
      } else {
        section.sentences.forEach((sentence: any, sentIdx: number) => {
          const sentPath = `${secPath}.sentences[${sentIdx}]`;
          if (!sentence || typeof sentence !== 'object') {
            errors.push({ path: sentPath, message: 'Sentence must be an object.' });
            return;
          }

          if (!Array.isArray(sentence.tokens)) {
            errors.push({ path: `${sentPath}.tokens`, message: 'Sentence "tokens" must be an array.' });
          } else {
            if (sentence.tokens.length === 0) {
              errors.push({ path: `${sentPath}.tokens`, message: 'Tokens array cannot be empty.' });
            }

            sentence.tokens.forEach((token: any, tokIdx: number) => {
              const tokPath = `${sentPath}.tokens[${tokIdx}]`;
              if (!token || typeof token !== 'object') {
                errors.push({ path: tokPath, message: 'Token must be an object.' });
                return;
              }

              if (typeof token.text !== 'string') {
                errors.push({ path: `${tokPath}.text`, message: 'Token "text" must be a string.' });
              }

              if (typeof token.shown !== 'boolean') {
                errors.push({ path: `${tokPath}.shown`, message: 'Token "shown" must be a boolean (true or false).' });
              }
            });
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
