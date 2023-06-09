import styled from 'styled-components';

const NavListWrapper = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;

  & li a {
    display: block;
    text-decoration: none;
    position: relative;
    color: inherit;
  }

  & li a::after {
    content: '';
    position: absolute;
    width: 0%;
    height: 1px;
    display: block;
    transition: all 0.4s ease;
    bottom: -30%;
  }

  & li a:hover::after {
    width: 100%;
    height: 1px;
    background-color: ${props => props.theme.hover};
  }
`;

export default NavListWrapper;
