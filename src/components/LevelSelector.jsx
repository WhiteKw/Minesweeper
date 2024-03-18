import { GAME_STATE, LEVEL } from "Constants";
import { TableContext } from "context/TableContext";
import { useContext } from "react";
import styled from "styled-components";

export default function LevelSelector() {
  const { dispatch, gameState } = useContext(TableContext);

  return (
    <Footer>
      <ButtonGroup>
        <Button className={gameState === GAME_STATE.PLAY ? "disabled" : ""} onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.EASY})}>EASY</Button>
        <Button className={gameState === GAME_STATE.PLAY ? "disabled" : ""} onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.NORMAL})}>NORMAL</Button>
        <Button className={gameState === GAME_STATE.PLAY ? "disabled" : ""}onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.HARD})}>HARD</Button>
        {/* <Button>CUSTOM</Button>     */}
      </ButtonGroup>
    </Footer>
  );
}

const Footer = styled.div`
  display: flex;
  background-color: gray;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 16px;
  padding: 1rem;
`

const Button = styled.div`
  padding: 10px;
  border: 4px outset #aaa;
  cursor: pointer;
  background-color: gray;
  &.disabled {
    pointer-events: none;
    border: 4px inset #aaa;
  }
  &:active {
    border: 4px inset #aaa;
  }
`