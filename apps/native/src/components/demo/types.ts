// components/demo/types.ts

// Using string type for flexibility with Feather icons
export type IconName = string;

export interface Task {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  iconBg: string;
  elapsedSeconds: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ColorChoice {
  color: string;
  iconBg: string;
}

export interface IconChoiceItem {
  name: IconName;
}

// Color values for React Native (using hex colors instead of Tailwind classes)
export const PASTEL_COLOR_VALUES: Record<string, string> = {
  "yellow-200": "#fef08a",
  "cyan-200": "#a5f3fc",
  "purple-200": "#e9d5ff",
  "green-200": "#bbf7d0",
  "sky-300": "#7dd3fc",
  "rose-400": "#fb7185",
  "emerald-300": "#6ee7b7",
  "purple-300": "#d8b4fe",
};
