import { CELL_STATE, CLICK, GAME_STATE } from "Constants";
import { TableContext } from "context/TableContext";
import { useContext } from "react";
import styled from "styled-components";

export default function GameBoard() {
  const { tableData } = useContext(TableContext);

  return (
    <Main>
      <StyledTable>
        <tbody>
          {tableData.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((col, j) => {
                  return (
                    <Td key={j} row={i} col={j}/>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Main>
  );
}

const Main = styled.div`
  padding: 8px;
  background-color: gray;
`;

function Td({row, col}) {
  const { tableData, dispatch, gameState, mine, flag } = useContext(TableContext);

  const onLeftClick = (e) => {
    if (gameState === GAME_STATE.GAME_OVER || gameState === GAME_STATE.WIN) return;

    let params = {
      type: CLICK.LEFT,
      row: row,
      col: col
    };

    switch (tableData[row][col].state) {
      case CELL_STATE.NORMAL:
      case CELL_STATE.MINE:
        dispatch(params);
        break;
      default:
        break;
    }
  };

  const onRightClick = (e) => {
    e.preventDefault();
    if (gameState !== GAME_STATE.PLAY) return;

    let params = {
      type: CLICK.RIGHT,
      row: row,
      col: col
    };

    switch (tableData[row][col].state) {
      case CELL_STATE.OPENED:
        break;
      case CELL_STATE.NORMAL:
        if (mine === flag) break;
        dispatch({
          ...params,
          cellState: CELL_STATE.FLAG,
        });
        break;
      case CELL_STATE.FLAG:
        dispatch({
          ...params,
          cellState: CELL_STATE.NORMAL,
        });
        break;
      case CELL_STATE.MINE:
        if (mine === flag) break;
        dispatch({
          ...params,
          cellState: CELL_STATE.FLAG_MINE,
        });
        break;
      case CELL_STATE.FLAG_MINE:
        dispatch({
          ...params,
          cellState: CELL_STATE.MINE,
        });
        break;
      default:
        break;
    }
  }

  return (
    <StyledTd
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      className={gameState === GAME_STATE.GAME_OVER ? "disabled" : ""}
    >
      <div
        className={`
          ${(tableData[row][col].state === CELL_STATE.FLAG || tableData[row][col].state === CELL_STATE.FLAG_MINE) ? "flag" : ""}
          ${gameState === GAME_STATE.GAME_OVER && tableData[row][col].state === CELL_STATE.MINE ? "mine" : ""}
          ${tableData[row][col].state === CELL_STATE.OPENED ? "opened" : ""}
          ${tableData[row][col].mineCnt && ["one", "two", "three", "four", "five", "six", "seven", "eight"][tableData[row][col].mineCnt - 1]}
        `}
      >
        {tableData[row][col].mineCnt}
      </div>
    </StyledTd>
  );
}

const StyledTable = styled.table`
  min-width: 350px;
  border-spacing: 0px;
  border: 4px inset #aaa;
  background-color: gray;
`;

const StyledTd = styled.td`
  white-space: nowrap;
  border: 2px outset #aaa;
  &.disabled {
    pointer-events: none;
  }
  &>div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1/1;
    min-width: 15px;
    font-size: 15px;
    line-height: 15px;
  }
  &>div.flag {
    background-color: yellow;
  }
  &>div.mine {
    background-color: red;
  }
  &:has(div.opened) {
    border: 1px inset #8f8c8c;
    background-color: #6c6c6c;
  }
  &>div.one {
    color: blue
  }
  &>div.two {
    color: greenyellow
  }
  &>div.three {
    color: red
  }
  &>div.four {
    color: darkblue
  }
  &>div.five {
    color: brown
  }
  &>div.six {
    color: aqua
  }
  &>div.seven {
    color: black
  }
  &>div.eight {
    color: lightgray
  }
  &:active {
    border: 1px inset #8f8c8c;
    background-color: darkgray;
  }
`;