import styled from "styled-components";
import { profile } from "../profile";

export default function About() {
  return (
    <Wrap>
      <Title>소개</Title>
      <Card>
        <Row>
          <Label>이름</Label>
          <Value>{profile.name}</Value>
        </Row>
        {profile.github && (
          <Row>
            <Label>GitHub</Label>
            <ValueLink href={profile.github} target="_blank" rel="noreferrer">
              {profile.github}
            </ValueLink>
          </Row>
        )}
        {profile.email && (
          <Row>
            <Label>이메일</Label>
            <ValueLink href={`mailto:${profile.email}`}>
              {profile.email}
            </ValueLink>
          </Row>
        )}
      </Card>
      <Now>
        <h2>Now</h2>
        <p>공부하고 있는 내용을 TIL로 남기고 있습니다.</p>
      </Now>
    </Wrap>
  );
}

const Wrap = styled.div``;
const Title = styled.h1`
  margin-top: 0;
`;
const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 16px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  align-items: center;
  & + & {
    margin-top: 8px;
  }
  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr;
  }
`;
const Label = styled.div`
  color: ${({ theme }) => theme.colors.subtleText};
`;
const Value = styled.div``;
const ValueLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
`;
const Now = styled.section`
  margin-top: 16px;
`;
