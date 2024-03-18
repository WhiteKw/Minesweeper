import { TableContext } from "context/TableContext";
import { useContext } from "react";
import styled from "styled-components"

export default function Information() {
  const { mine, flag, timer } = useContext(TableContext);

  const lpad = (padLength, arrTxt, padString) => {
    arrTxt += "";
    while (arrTxt.length < padLength) {
      arrTxt = padString + arrTxt;
    }
    return arrTxt;
  };

  return (
    <Header>
      <Inner>
        <NumberDisplay>{mine - flag}</NumberDisplay>
        <NumberDisplay>{lpad(2, Math.floor(timer / 60), '0')}:{lpad(2, (timer % 60), '0')}</NumberDisplay>
      </Inner>
    </Header>
  )
}

const Header = styled.div`
  padding: 8px;
  background-color: gray;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 4px inset #aaa;
`;

const NumberDisplay = styled.div`
  min-width: 75px;
  padding: 4px 8px;
  text-align: right;
  font-family: "DS_DIGIB";
  font-size: 2rem;
  color: red;
  background-color: #000;
`;