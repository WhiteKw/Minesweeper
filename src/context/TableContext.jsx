import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CELL_STATE, CLICK, GAME_STATE, LEVEL } from "../Constants";

// 테이블 초기화
// 지뢰는 심지 않고 테이블 칸 수만 초기화 해준다.
const initTable = (row, col, mine) => {
  let tableData = [];
  for (let i = 0; i < row; i++) {
    tableData.push([]);
    for (let j = 0; j < col; j++) {
      tableData[i].push({state: CELL_STATE.NORMAL});
    }
  }

  return tableData;
};

const initialState = {
  gameState: GAME_STATE.READY,
  mine: LEVEL.EASY.mine,
  flag: 0,
  col: LEVEL.EASY.col,
  row: LEVEL.EASY.row,
  timer: 0,
  opened: 0,
  tableData: initTable(10, 10, 10)
}

export const TableContext = createContext(initialState);

export const TableProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({
    tableData: state.tableData,
    mine: state.mine,
    flag: state.flag,
    col: state.col,
    row: state.row,
    timer: state.timer,
    opened: state.opened,
    gameState: state.gameState,
    dispatch
  }), [state.tableData, state.timer]);

  useEffect(() => {
    let timer;

    if (state.gameState === GAME_STATE.PLAY) {
      timer = setInterval(() => {
        dispatch({type: "INCREMENT_TIMER"});
      }, 1000);
    }

    if (state.gameState === GAME_STATE.WIN) {
      console.log("WIN!!")
    }

    return () => {
      clearInterval(timer);
    }
  }, [state.gameState]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
};

const reducer = (state, action) => {
  switch (action.type) {
    case GAME_STATE.READY:
      return {
        ...state,
        gameState: GAME_STATE.READY,
        mine: action.mine,
        flag: 0,
        col: action.col,
        row: action.row,
        timer: 0,
        tableData: initTable(action.row, action.col, action.mine)
      }
    case CLICK.LEFT: 
      let td = state.gameState === GAME_STATE.READY ? plantMine(action.row, action.col, state.row, state.col, state.mine, state.tableData) : state.tableData;
      let result = clickCell(action.row, action.col, state.row, state.col, state.mine, state.opened, td);
      return {
        ...state,
        tableData: result.tableData,
        gameState: result.gameState,
        opened: result.opened
      }
    case CLICK.RIGHT:
      let tableData = [...state.tableData];
      tableData[action.row][action.col].state = action.cellState;

      return {
        ...state,
        tableData: tableData,
        flag: state.flag + (action.cellState === CELL_STATE.FLAG || action.cellState === CELL_STATE.FLAG_MINE ? 1 : -1)
      }
    case "INCREMENT_TIMER":
      return {
        ...state,
        timer: state.timer + 1
      }
    default:
      return state
  }
};

// 게임 시작 시 지뢰 배치
// 플레이어가 처음 선택한 칸의 주변 9칸은 지뢰를 배치하지 않는다.
const plantMine = (row, col, maxRow, maxCol, mine, t) => {
  let tableData = JSON.parse(JSON.stringify(t));

  if (true) {
    let startRow = row - 1;
    let endRow = row + 1;
    let startCol = col - 1;
    let endCol = col + 1;
    let safeCell = [];

    for (let r = startRow; r <= endRow; r++) {
      if (r < 0 || r > maxRow - 1) continue;
      for (let c = startCol; c <= endCol; c++) {
        if (c < 0 || c > maxCol - 1) continue;
        safeCell.push(r * maxCol + c);
      }
    }

    let candiate = Array(maxRow * maxCol).fill().map((arr, i) => { return i; });
    candiate = candiate.filter(i => !safeCell.includes(i));
  
    const shuffle = [];
    while (candiate.length > maxRow * maxCol - mine - safeCell.length) {
      const chosen = candiate.splice(Math.floor(Math.random() * candiate.length), 1)[0];
      shuffle.push(chosen);
    }
  
    for (let i = 0; i < shuffle.length; i++) {
      const ver = Math.floor(shuffle[i] / maxCol);
      const hor = shuffle[i] % maxCol;
      tableData[ver][hor].state = CELL_STATE.MINE;
    }
  }

  return tableData;
};

// 칸 클릭
const clickCell = (_row, _col, maxRow, maxCol, mine, _opened, t) => {
  let opened = _opened;
  let tableData = JSON.parse(JSON.stringify(t));
  let result = {
    tableData: null
  }

  if (tableData[_row][_col].state === CELL_STATE.MINE) {
    result.gameState = GAME_STATE.GAME_OVER;
    result.tableData = tableData;
  } else {
    let visited = [];
    const searchMine = (row, col) => {
      visited.push(row + "," + col);

      if (tableData[row][col].state === CELL_STATE.NORMAL) {
        tableData[row][col].state = CELL_STATE.OPENED;
        opened += 1;
      }

      let startRow = row - 1;
      let endRow = row + 1;
      let startCol = col - 1;
      let endCol = col + 1;

      let mineCnt = 0;

      for (let r = startRow; r <= endRow; r++) {
        if (r < 0 || r > tableData.length - 1) continue;

        for (let c = startCol; c <= endCol; c++) {
          if (c < 0 || c > tableData[r].length - 1) continue;

          if (tableData[r][c].state === CELL_STATE.MINE) {
            mineCnt += 1;
          }
        }
      }

      if (mineCnt === 0) {
        for (let r = startRow; r <= endRow; r++) {
          if (r < 0 || r > tableData.length - 1) continue;
    
          for (let c = startCol; c <= endCol; c++) {
            if (c < 0 || c > tableData[r].length - 1) continue;
            
            if (visited.includes(r + "," + c) === false) {
              searchMine(r, c);
            }
          }
        }
      } else {
        tableData[row][col].mineCnt = mineCnt;
      }

      return tableData
    }

    result = {
      tableData:  searchMine(_row, _col),
      gameState: (opened === (maxRow * maxCol - mine)) ? GAME_STATE.WIN : GAME_STATE.PLAY,
      opened: opened
    };
  }

  return result;
};

