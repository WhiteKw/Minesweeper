export const GAME_STATE = {
  READY: "READY",
  PLAY: "PLAY",
  GAME_OVER: "GAME_OVER",
  WIN: "WIN"
};

export const CELL_STATE = {
  OPENED: 0,
  NORMAL: -1,
  FLAG: -2,
  MINE: -3,
  FLAG_MINE: -4
};

export const LEVEL = {
  EASY: { row: 10, col: 10, mine: 10 },
  NORMAL: { row: 16, col: 16, mine: 40 },
  HARD: { row: 16, col: 30, mine: 99 },
};

export const CLICK = {
  LEFT: "CLICK_LEFT",
  RIGHT: "CLICK_RIGHT"
};