export type Block = {
  mine: boolean;
  flagged: boolean;
  opened: boolean;
  neighborMinesCount: number;
  blownUp?: boolean;
};

export type Matrix = Array<Array<Block>>;

export type Coordinates = {
  x: number;
  y: number;
};

export type BoardSettings = {
  width: number;
  height: number;
  count: number;
};

export type TimerRef =
  | undefined
  | {
      start(): void;
      stop(): void;
      reset(): void;
    };
