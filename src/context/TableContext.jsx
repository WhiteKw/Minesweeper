import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { CELL_STATE, CLICK, GAME_STATE, LEVEL } from "../Constants";

const initTable = (row, col, mine) => {
  let tableData = Array.from(Array(row), () => Array(col).fill(CELL_STATE.NORMAL));

  const candiate = Array(row * col).fill().map((arr, i) => {
    return i;
  });

  const shuffle = [];
  while (candiate.length > row * col - mine) {
    const chosen = candiate.splice(Math.floor(Math.random() * candiate.length), 1)[0];
    shuffle.push(chosen);
  }

  for (let i = 0; i < shuffle.length; i++) {
    const ver = Math.floor(shuffle[i] / col);
    const hor = shuffle[i] % col;
    tableData[ver][hor] = CELL_STATE.MINE;
  }

  return tableData;
};

const initialState = {
  pause: true,
  mine: LEVEL.EASY.mine,
  timer: 0,
  tableData: initTable(10, 10, 10)
}

export const TableContext = createContext(initialState);

export const TableProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({
    tableData: state.tableData,
    mine: state.mine,
    timer: state.timer,
    dispatch
  }), [state.tableData, state.timer]);

  useEffect(() => {
    let timer;

    if (!state.pause) {
      timer = setInterval(() => {
        dispatch({type: "INCREMENT_TIMER"});
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    }
  }, [state.pause]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
};

const reducer = (state, action) => {
  switch (action.type) {
    case GAME_STATE.READY:
      return {
        ...state,
        pause: true,
        mine: action.mine,
        timer: 0,
        tableData: initTable(action.row, action.col, action.mine)
      }
    case GAME_STATE.START:
      return {
        ...state,
        timer: 0,
        pause: false
      }
    case CLICK.LEFT: 
      let result = clickCell(action.row, action.col, state.tableData);
      return {
        ...state,
        tableData: result.tableData,
        pause: result.gameover
      }
    case CLICK.RIGHT:
      let tableData = [...state.tableData];
      tableData[action.row][action.col] = action.cellState;
      return {
        ...state,
        tableData: tableData
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



const clickCell = (_row, _col, t) => {
  let tableData = JSON.parse(JSON.stringify(t));
  let result = {
    gameover: false,
    tableData: null
  }

  if (tableData[_row][_col] === CELL_STATE.MINE) {
    result.gameover = true;
    result.tableData = tableData;
  } else {

    let visited = [];
    const searchMine = (row, col) => {
      visited.push(row + "," + col);
      tableData[row][col] = CELL_STATE.OPENED;

      let startRow = row - 1;
      let endRow = row + 1;
      let startCol = col - 1;
      let endCol = col + 1;

      let mineCnt = 0;

      for (let r = startRow; r <= endRow; r++) {
        if (r < 0 || r > tableData.length - 1) continue;

        for (let c = startCol; c <= endCol; c++) {
          if (c < 0 || c > tableData[r].length - 1) continue;

          if (tableData[r][c] === CELL_STATE.MINE) {
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
      }

      return tableData
    }

    result = {
      gameover: false,
      tableData:  searchMine(_row, _col)
    };
  }

  return result;
};

