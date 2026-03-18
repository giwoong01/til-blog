import styled from "styled-components";

export const SelectInput = styled.select`
  padding: 10px 38px 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  width: 180px;
  flex: 0 0 180px;
  line-height: 1.2;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px 14px;
  background-image: ${({ theme }) =>
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='${encodeURIComponent(
      theme.colors.subtleText
    )}'><path d='M7 10l5 5 5-5'/></svg>")`};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px rgba(27, 100, 255, 0.25);
  }
  ${({ theme }) => theme.mq.sm} {
    width: 100%;
    flex: initial;
  }
`;
