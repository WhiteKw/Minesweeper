import { CELL_STATE, CLICK, GAME_STATE } from "Constants";
import { TableContext } from "context/TableContext";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

export default function GameBoard() {

  const { tableData, dispatch } = useContext(TableContext);

  useEffect(() => {
    console.log(tableData)
  }, [tableData])

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
`

function Td({row, col}) {
  const { tableData, dispatch, pause } = useContext(TableContext);

  const onLeftClick = (e) => {
    if (pause) return;

    let params = {
      type: CLICK.LEFT,
      row: row,
      col: col
    };

    switch (tableData[row][col]) {
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
    // if (pause) return;

    let params = {
      type: CLICK.RIGHT,
      row: row,
      col: col
    };

    switch (tableData[row][col]) {
      case CELL_STATE.OPENED:
        break;
      case CELL_STATE.NORMAL:
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
    >
      <div
        className={`
          ${(tableData[row][col] === CELL_STATE.FLAG || tableData[row][col] === CELL_STATE.FLAG_MINE) ? "flag" : ""}
          ${tableData[row][col] === CELL_STATE.MINE ? "mine" : ""}
          ${tableData[row][col] === CELL_STATE.OPENED ? "opened" : ""}
        `}
      />
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
  &>div {
    width: 100%;
    aspect-ratio: 1/1;
    min-width: 15px;
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
  &:active {
    border: 1px inset #8f8c8c;
    background-color: darkgray;
  }
`;