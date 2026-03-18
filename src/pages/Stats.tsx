import { useMemo } from "react";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";
import { calcMonthly, calcStreak, calcTopTags } from "../utils/stats";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Stats() {
  usePageTitle("통계 | TIL");
  const { posts } = usePosts();

  const thisMonth = useMemo(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return posts.filter((p) => p.frontmatter.date?.startsWith(key)).length;
  }, [posts]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.frontmatter.tags?.forEach((t) => s.add(t)));
    return s.size;
  }, [posts]);

  const monthly = useMemo(() => calcMonthly(posts), [posts]);
  const streak = useMemo(() => calcStreak(posts), [posts]);
  const topTags = useMemo(() => calcTopTags(posts, 10), [posts]);

  const maxCount = monthly.length > 0 ? Math.max(...monthly.map((m) => m.count)) : 1;

  return (
    <Wrap>
      <PageTitle>통계</PageTitle>

      <SummaryGrid>
        <SummaryCard>
          <CardValue>{posts.length}</CardValue>
          <CardLabel>총 포스트</CardLabel>
        </SummaryCard>
        <SummaryCard>
          <CardValue>{allTags}</CardValue>
          <CardLabel>총 태그</CardLabel>
        </SummaryCard>
        <SummaryCard>
          <CardValue>{thisMonth}</CardValue>
          <CardLabel>이번 달 작성</CardLabel>
        </SummaryCard>
        <SummaryCard>
          <CardValue>{streak.current}일</CardValue>
          <CardLabel>현재 스트릭</CardLabel>
        </SummaryCard>
        <SummaryCard>
          <CardValue>{streak.longest}일</CardValue>
          <CardLabel>최장 스트릭</CardLabel>
        </SummaryCard>
      </SummaryGrid>

      <Section>
        <SectionTitle>월별 작성 현황</SectionTitle>
        <ChartWrap>
          {monthly.map(({ month, count }) => (
            <BarCol key={month}>
              <BarLabel>{count}</BarLabel>
              <Bar $ratio={count / maxCount} />
              <MonthLabel>{month.slice(5)}</MonthLabel>
            </BarCol>
          ))}
        </ChartWrap>
      </Section>

      <Section>
        <SectionTitle>태그 Top 10</SectionTitle>
        <TagList>
          {topTags.map(({ tag, count }, i) => (
            <TagRow key={tag}>
              <TagRank>{i + 1}</TagRank>
              <TagName>#{tag}</TagName>
              <TagBar $ratio={count / (topTags[0]?.count || 1)} />
              <TagCount>{count}</TagCount>
            </TagRow>
          ))}
        </TagList>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 16px;
  text-align: center;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const CardLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtleText};
  margin-top: 4px;
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
`;

const ChartWrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 140px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const BarCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1 0 28px;
  min-width: 28px;
`;

const BarLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.subtleText};
`;

const Bar = styled.div<{ $ratio: number }>`
  width: 100%;
  height: ${({ $ratio }) => Math.max(4, Math.round($ratio * 100))}px;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 2px 2px 0 0;
  opacity: 0.7;
  transition: height 0.3s ease;
`;

const MonthLabel = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.subtleText};
  white-space: nowrap;
`;

const TagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TagRow = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr 1fr 40px;
  align-items: center;
  gap: 8px;
`;

const TagRank = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtleText};
  text-align: right;
`;

const TagName = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

const TagBar = styled.div<{ $ratio: number }>`
  height: 8px;
  width: ${({ $ratio }) => Math.max(4, Math.round($ratio * 100))}%;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 2px;
  opacity: 0.6;
`;

const TagCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtleText};
  text-align: right;
`;
