# Cloze 與填空學習單產生器

一個使用 **React + TypeScript + Vite + Tailwind CSS** 開發的單頁應用程式（SPA），搭配 **React Router**，用於產生適合列印的克漏字與填空學習單，支援 **LLM 自動匯入**以及**繁體中文（Traditional Chinese）**。

⚡ **連結：** https://7385a338.clozecraft.pages.dev/

## ✨ 功能特色

### 🖨️ 列印優先版面（A4 最佳化）

專為課堂列印設計，提供：

* 清晰的底線／方框填空格式
* 學生資訊欄位：姓名、日期、班級、分數
* 可選擇是否產生獨立的答案頁

### 🤖 LLM 自動匯入與提示詞產生器

提供預先格式化的提示詞，可搭配：

* ChatGPT
* Claude
* Gemini

將任何純文字內容轉換成標準 JSON 結構。

### 📋 標準 JSON Schema

採用階層式資料結構：

**Section（段落） → Sentence（句子） → Token（文字單元）**

每個 Token 可設定：

* `shown`：是否顯示
* `hint`：提示
* `blankId`：填空編號

### 🇹🇼 繁體中文與英文

完整支援雙語介面，並針對 **CJK（中日韓文字）** 提供：

* 中文字體排版最佳化
* 標點符號最佳化
* 繁體中文（繁體中文）與英文雙語 UI

### ✍️ 互動練習模式

提供次要的螢幕互動練習模式，支援：

* 即時答案檢查
* 自動計算分數
* 提供提示

### 💾 匯出／匯入

提供完整的資料管理功能：

* 一鍵載入預設範例
* 上傳 JSON 檔案
* 即時資料驗證
* 匯出為 `.json` 檔案

## 🚀 快速開始

### 安裝相依套件

```bash
pnpm install
```

### 啟動開發伺服器

```bash
pnpm dev
```

### 建置正式版本

```bash
pnpm build
```

## 📐 JSON Schema 範例

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
            {
              "text": "The",
              "shown": true
            },
            {
              "text": "sky",
              "shown": true
            },
            {
              "text": "is",
              "shown": true
            },
            {
              "text": "the",
              "shown": false,
              "hint": "article"
            },
            {
              "text": "limit",
              "shown": false
            },
            {
              "text": ".",
              "shown": true
            }
          ],
          "translation": "沒有極限；前景不可限量。"
        }
      ]
    }
  ]
}
```
