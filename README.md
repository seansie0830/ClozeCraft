# 克漏字與填空測驗卷產生器 (Cloze & Blank-Filling Worksheet Generator)

A React + TypeScript + Vite + Tailwind CSS single page application with React Router for generating print-ready cloze & blank-filling worksheets with LLM auto-import and Traditional Chinese (繁體中文) support.
# ⚡ link
(https://28f950f6.clozecraft.pages.dev/)[https://28f950f6.clozecraft.pages.dev/]
## ✨ Features

- 🖨️ **Print-First Layout (A4 Optimized)**: Designed specifically for classroom printing with clean underlines/boxes, student header (Name, Date, Class, Score), and optional separate Answer Key page.
- 🤖 **LLM Auto-Import & Prompt Generator**: Pre-formatted prompts tailored for ChatGPT, Claude, and Gemini to convert any plain text into the standard JSON structure.
- 📋 **Standard JSON Schema**: Hierarchical `Section` > `Sentence` > `Token` (`shown: true/false`, `hint`, `blankId`).
- 🇹🇼 **Traditional Chinese (繁體中文) & English**: Full bilingual UI support with CJK typography and punctuation optimization.
- ✍️ **Interactive Practice Mode**: Secondary on-screen interactive mode with instant answer checking, score calculation, and hints.
- 💾 **Export / Import**: 1-click preset loader, JSON file upload, real-time validation, and export to `.json`.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build
```

## 📐 JSON Schema Example

```json
{
  "title": "基礎英語與中文填空測驗",
  "description": "請依據文意在空格處填入適當字詞。",
  "language": "mixed",
  "includeAnswerKey": true,
  "showStudentHeader": true,
  "sections": [
    {
      "id": "sec-1",
      "title": "Part I: Basic Sentences",
      "instructions": "Fill in the blanks with the correct words:",
      "showWordBank": true,
      "sentences": [
        {
          "id": "s1",
          "tokens": [
            { "text": "The", "shown": true },
            { "text": "sky", "shown": true },
            { "text": "is", "shown": true },
            { "text": "the", "shown": false, "hint": "article" },
            { "text": "limit", "shown": false },
            { "text": ".", "shown": true }
          ],
          "translation": "沒有極限；前景不可限量。"
        }
      ]
    }
  ]
}
```
