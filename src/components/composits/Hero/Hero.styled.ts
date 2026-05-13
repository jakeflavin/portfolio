import styled from "styled-components";

export const HeroContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
  backdrop-filter: blur(${({ theme }) => theme.blur?.lg ?? "24px"});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur?.lg ?? "24px"});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;
