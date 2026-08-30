export interface Token {
  text: string;
  shown: boolean;
  hint?: string;
  blankId?: number | string;
}

export interface Sentence {
  id?: string;
  tokens: Token[];
  translation?: string;
  note?: string;
}

export interface Section {
  id?: string;
  title: string;
  instructions?: string;
  showWordBank?: boolean;
  sentences: Sentence[];
}

export interface WorksheetData {
  id?: string;
  title: string;
  description?: string;
  language?: 'en' | 'zh-TW' | 'mixed';
  includeAnswerKey?: boolean;
  showStudentHeader?: boolean;
  sections: Section[];
}

export interface PrintSettings {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  blankStyle: 'line' | 'box' | 'dashed';
  showBlankIndex: boolean;
  showWordBank: boolean;
  showAnswerKey: boolean;
  separateAnswerKeyPage: boolean;
  showStudentHeader: boolean;
  showHints: boolean;
}

export type UILanguage = 'zh-TW' | 'en';
