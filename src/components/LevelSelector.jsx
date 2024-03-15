import { GAME_STATE, LEVEL } from "Constants";
import { TableContext } from "context/TableContext";
import { useContext } from "react";
import styled from "styled-components";

export default function LevelSelector() {
  const { dispatch } = useContext(TableContext);

  return (
    <Footer>
      <ButtonGroup>
        <Button onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.EASY})}>EASY</Button>
        <Button onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.NORMAL})}>NORMAL</Button>
        <Button onClick={() => dispatch({type: GAME_STATE.READY, ...LEVEL.HARD})}>HARD</Button>
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
  &:active {
    border: 4px inset #aaa;
  }
`