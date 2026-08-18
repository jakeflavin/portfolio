import styled from "styled-components";

export const HeroContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;
