import { TableProvider } from 'context/TableContext';
import './App.css';
import GameBoard from 'components/GameBoard';
import Information from 'components/Information';
import LevelSelector from 'components/LevelSelector';
import styled from 'styled-components';

function App() {
  return (
    <TableProvider>
      <Wrap>
        <Information/>
        <GameBoard/>
        <LevelSelector/>
      </Wrap>
    </TableProvider>
  );
}

const Wrap = styled.div`
  border: 4px outset #aaa;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  /* height: 100vh; */
`;

export default App;
