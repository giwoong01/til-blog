import styled from "styled-components";
import { Link } from "react-router-dom";

export const List = styled.ul`
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  ${({ theme }) => theme.mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const CardLink = styled(Link)`
  display: block;
  padding: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

export const CardTitle = styled.h3`
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
  min-height: calc(1.4em * 2);
`;

export const CardDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.subtleText};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
  min-height: calc(1.5em * 2);
`;

export const CardDate = styled.p`
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.subtleText};
  font-size: 12px;
`;
