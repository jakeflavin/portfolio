import styled from "styled-components";

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  /* The home button is gone, so keep the actions on the right rather than
     letting the lone group fall to the left. */
  margin-left: auto;
`;
