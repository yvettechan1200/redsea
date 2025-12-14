export enum Stance {
  MASK = 'MASK', // Gray
  THORN = 'THORN', // Red
  VOID = 'VOID', // Blue
}

export interface Option {
  text: string;
  stance: Stance;
  nextDialogId?: string; // Optional branching, usually linear
}

export interface Dialog {
  id: string;
  npcText: string;
  options: Option[];
}

export interface ConditionalText {
  text: string;
  threshold: {
    stat: Stance; // Which score to check
    value: number; // Minimum value required
  };
}

export interface Hotspot {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  // REPLACED: description: string;
  baseDescriptions: string[]; // Pool for random selection
  conditionalDescriptions?: ConditionalText[]; // High priority overrides based on stats
}

export interface LevelData {
  id: number;
  title: string;
  themeColor: string;
  npcName: string;
  npcPosition: { x: number; y: number; w: number; h: number }; // Percentage
  dialogs: Dialog[];
  hotspots: Hotspot[];
}

export enum GamePhase {
  START,
  PLAYING,
  ENDING_BAD,
  ENDING_TRUE,
  ENDING_NEUTRAL
}

export interface GameState {
  currentLevelIndex: number;
  currentDialogIndex: number;
  phase: GamePhase;
  history: Stance[];
  isDialogueOpen: boolean;
  isLevelComplete: boolean;
  isTransitioning: boolean;
}