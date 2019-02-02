import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: ${props => props.theme.primary || 'darkcyan'};
  color: white;
  font-size: 2rem;
`;
const HeaderContent = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 1rem;
  box-sizing: border-box;
`;

export default function Header({ children }) {
  return (
    <HeaderContainer>
      <HeaderContent>{children}</HeaderContent>
    </HeaderContainer>
  );
}
