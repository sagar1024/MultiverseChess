export type Color = "white" | "black";

export interface Board {
  id: string;
  fen: string;
  parentId?: string;
  children: string[];
  result: 'in_progress' | 'white_won' | 'black_won' | 'draw';
  createdBy?: Color;
  moveHistory?: string[];
}
