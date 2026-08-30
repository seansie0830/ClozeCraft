import type { UILanguage } from '../types/worksheet';

export interface PromptOptions {
  customInstructions: string;
  rawText: string;
  subjectCategory?: string;
  includeAnswerKey: boolean;
  showWordBank: boolean;
  promptLang: UILanguage;
}

export const DEFAULT_PROMPT_INSTRUCTIONS = {
  'zh-TW': `請根據提供的教材、文章或題目內容，製作填空測驗題（克漏字）。挑選核心概念、關鍵字詞、重要數值或專有名詞作為填空。`,
  'en': `Generate a blank-filling worksheet based on the provided material or questions. Select core concepts, keywords, terms, or values as fill-in-the-blank items.`
};

export function generateLLMPrompt(options: PromptOptions): string {
  const {
    customInstructions,
    rawText,
    includeAnswerKey,
    showWordBank,
    promptLang,
  } = options;

  const instructions = customInstructions.trim() || DEFAULT_PROMPT_INSTRUCTIONS[promptLang];

  if (promptLang === 'zh-TW') {
    return `你是一位專業的命題與出題助理。請根據以下的要求與教材內容，產出標準的填空題/克漏字 JSON 格式資料。

【出題要求】
${instructions}

【Token 拆分與填空規則（重要）】
1. 階層結構：Section（大題） > Sentence（句子） > Token（文字片段/填空）。
2. **連續未挖空的文字直接合併為一個 Token**（"shown": true），包含標點符號與前後空格，不需要逐字分詞。
3. **只有需要學生填答的答案關鍵詞/數字/詞語才獨立為一個 Token**（"shown": false）。
4. 欄位定義：
   - "shown": false 代表該項目為填空挖空處；"shown": true 代表顯示給學生看的題目原文。
   - "hint": (選填) 提示文字、單元重點或詞性說明。
   - "includeAnswerKey": ${includeAnswerKey ? 'true' : 'false'}
   - "showWordBank": ${showWordBank ? 'true' : 'false'}

【標準 JSON Schema 格式範例】
\`\`\`json
{
  "title": "測驗卷標題（例如：國中自然科單元測驗 / 基礎概念填空）",
  "description": "請在空格內填入最適當的答案。",
  "includeAnswerKey": ${includeAnswerKey},
  "showStudentHeader": true,
  "sections": [
    {
      "id": "sec-1",
      "title": "第一部分：概念填空",
      "instructions": "請填入正確的專有名詞或數值：",
      "showWordBank": ${showWordBank},
      "sentences": [
        {
          "id": "s1",
          "tokens": [
            { "text": "綠色植物進行光合作用的主要場所是細胞內的", "shown": true },
            { "text": "葉綠體", "shown": false, "hint": "細胞構造" },
            { "text": "，過程中會吸收二氧化碳並釋放出", "shown": true },
            { "text": "氧氣", "shown": false },
            { "text": "。", "shown": true }
          ]
        },
        {
          "id": "s2",
          "tokens": [
            { "text": "The sky is ", "shown": true },
            { "text": "the", "shown": false },
            { "text": " limit.", "shown": true }
          ]
        }
      ]
    }
  ]
}
\`\`\`

【請根據以下內容直接輸出純 JSON，不需包含任何額外解說】：
${rawText.trim() ? rawText : `1. The sky is the limit.\n2. 綠色植物行光合作用需要葉綠體，並釋出氧氣。\n3. 牛頓第二運動定律公式為 F = ma。`}`;
  }

  // English Prompt version
  return `You are a professional test creator. Please generate a standardized Blank-Filling Worksheet JSON based on the instructions and source text provided below.

[Instructions]
${instructions}

[Tokenization & Masking Rules (IMPORTANT)]
1. Hierarchical Structure: Section > Sentence > Token.
2. **Continuous non-blank text should be grouped into a single Token** ("shown": true), including punctuation marks and natural spacing. No granular word-by-word tokenization is required!
3. **Only the words, terms, numbers, or expressions that students must fill in should be separate blank Tokens** ("shown": false).
4. Properties:
   - "shown": false means a hidden blank; "shown": true means visible text.
   - "hint": (optional) brief clue or category.
   - "includeAnswerKey": ${includeAnswerKey ? 'true' : 'false'}
   - "showWordBank": ${showWordBank ? 'true' : 'false'}

[Target JSON Schema Example]
\`\`\`json
{
  "title": "Worksheet Title",
  "description": "Fill in each blank with the correct answer.",
  "includeAnswerKey": ${includeAnswerKey},
  "showStudentHeader": true,
  "sections": [
    {
      "id": "sec-1",
      "title": "Section 1: Core Concepts",
      "instructions": "Fill in the missing terms:",
      "showWordBank": ${showWordBank},
      "sentences": [
        {
          "id": "s1",
          "tokens": [
            { "text": "Photosynthesis mainly takes place in the plant's ", "shown": true },
            { "text": "chloroplasts", "shown": false, "hint": "cell organelle" },
            { "text": ", absorbing CO2 and releasing ", "shown": true },
            { "text": "oxygen", "shown": false },
            { "text": ".", "shown": true }
          ]
        },
        {
          "id": "s2",
          "tokens": [
            { "text": "The sky is ", "shown": true },
            { "text": "the", "shown": false },
            { "text": " limit.", "shown": true }
          ]
        }
      ]
    }
  ]
}
\`\`\`

[Input Content (Return ONLY the JSON without conversational markdown wrapper or extra comments)]:
${rawText.trim() ? rawText : `1. The sky is the limit.\n2. Photosynthesis takes place in chloroplasts and releases oxygen.\n3. Newton's second law is F = ma.`}`;
}
