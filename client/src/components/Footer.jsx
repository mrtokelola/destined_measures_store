import { Footer, FooterLinkGroup } from "flowbite-react";
import styled from "styled-components";

const FooterContainer = styled(FooterLinkGroup)`
  display: flex;
  justify-content: flex-end;
`;

const StyledFooter = styled(Footer)`
  background-color: #212529 !important;
  display: flex;
  justify-content: space-around;
  gap: 20rem;
  padding-top: 3rem;
`;

const StyledLink = styled.a`
  color: white;
  margin-right: 1rem;
  text-decoration: none;
`;

const Copyright = styled.p`
  color: white;
`;

function AppFooter() {
  return (
    <StyledFooter container>
      <Copyright>Destined Measures™</Copyright>
      <FooterContainer>
        <StyledLink as="a" href="/about">About</StyledLink>
        <StyledLink as="a" href="contact">Contact</StyledLink>
      </FooterContainer>
    </StyledFooter>
  );
}

export default AppFooter;
