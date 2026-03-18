import { useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { usePosts } from "../posts/usePosts";
import { usePageTitle } from "../hooks/usePageTitle";
import { ALL_KEY, isMonthKey, formatMonth } from "../utils/archive";
import ArchiveSidebar from "../components/archive/ArchiveSidebar";
import ArchiveCalendar from "../components/archive/ArchiveCalendar";

type MonthKey = string; // YYYY-MM

export default function Archive() {
  usePageTitle("Archive | TIL");
  const { posts } = usePosts();

  const byMonth = useMemo(() => {
    const map = new Map<MonthKey, { key: MonthKey; items: typeof posts }>();
    for (const p of posts) {
      const d = p.frontmatter.date;
      const key =
        d && /^\d{4}-\d{2}-\d{2}$/.test(d)
          ? (d.slice(0, 7) as MonthKey)
          : "기타";
      if (!map.has(key)) map.set(key, { key, items: [] });
      map.get(key)!.items.push(p);
    }
    const arr = Array.from(map.values());

    arr.sort((a, b) => {
      const am = isMonthKey(a.key);
      const bm = isMonthKey(b.key);
      if (am && bm) return b.key.localeCompare(a.key);
      if (am) return -1;
      if (bm) return 1;
      return b.key.localeCompare(a.key);
    });
    for (const g of arr) {
      g.items.sort((a, b) => {
        const ad = a.frontmatter.date
          ? new Date(a.frontmatter.date).getTime()
          : 0;
        const bd = b.frontmatter.date
          ? new Date(b.frontmatter.date).getTime()
          : 0;
        return bd - ad;
      });
    }
    return arr;
  }, [posts]);

  const [selected, setSelected] = useState<string>(ALL_KEY);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const months = byMonth.map((g) => g.key);
  const current = byMonth.find((g) => g.key === selected) || byMonth[0];
  const monthOnly = months.filter(isMonthKey);

  const [year, month] = (selected || "").split("-").map((v) => parseInt(v, 10));
  const startDay =
    isNaN(year) || isNaN(month) ? 0 : new Date(year, month - 1, 1).getDay();
  const daysInSelected =
    isNaN(year) || isNaN(month) ? 0 : new Date(year, month, 0).getDate();

  const byDayInMonth = useMemo(() => {
    const m = new Map<number, (typeof posts)[number][]>();
    if (!current) return m;
    for (const p of current.items) {
      const d = p.frontmatter.date;
      if (!d) continue;
      if (!d.startsWith(selected)) continue;
      const dayNum = parseInt(d.slice(8, 10), 10);
      if (!m.has(dayNum)) m.set(dayNum, []);
      m.get(dayNum)!.push(p);
    }
    return m;
  }, [current, selected]);

  const goPrevMonth = () => {
    if (!isMonthKey(selected)) return;
    const idx = monthOnly.indexOf(selected);
    if (idx >= 0 && idx + 1 < monthOnly.length) {
      setSelected(monthOnly[idx + 1]);
      setActiveDate(null);
    }
  };
  const goNextMonth = () => {
    if (!isMonthKey(selected)) return;
    const idx = monthOnly.indexOf(selected);
    if (idx > 0) {
      setSelected(monthOnly[idx - 1]);
      setActiveDate(null);
    }
  };

  return (
    <Wrap>
      <ArchiveSidebar
        months={months}
        byMonth={byMonth}
        totalPosts={posts.length}
        selected={selected}
        onSelect={setSelected}
        onSelectAll={() => {
          setSelected(ALL_KEY);
          setView("list");
        }}
      />
      <Main>
        <MainHeader>
          <Title>
            {selected === ALL_KEY ? ALL_KEY : formatMonth(current?.key || "")}
          </Title>
          <HeaderRight>
            <NavButtons>
              <NavBtn
                type="button"
                onClick={goPrevMonth}
                disabled={
                  !isMonthKey(selected) ||
                  monthOnly.indexOf(selected) === monthOnly.length - 1 ||
                  monthOnly.length === 0
                }
              >
                이전 달
              </NavBtn>
              <NavBtn
                type="button"
                onClick={goNextMonth}
                disabled={
                  !isMonthKey(selected) ||
                  monthOnly.indexOf(selected) <= 0 ||
                  monthOnly.length === 0
                }
              >
                다음 달
              </NavBtn>
            </NavButtons>
            <ViewToggle role="tablist" aria-label="보기 전환">
              <ToggleBtn
                role="tab"
                aria-selected={view === "list"}
                data-active={String(view === "list")}
                type="button"
                onClick={() => setView("list")}
              >
                목록
              </ToggleBtn>
              <ToggleBtn
                role="tab"
                aria-selected={view === "calendar"}
                data-active={String(view === "calendar")}
                type="button"
                onClick={() => {
                  if (!isMonthKey(selected)) {
                    const firstMonth = monthOnly[0];
                    if (firstMonth) setSelected(firstMonth);
                  }
                  setView("calendar");
                }}
              >
                캘린더
              </ToggleBtn>
            </ViewToggle>
          </HeaderRight>
        </MainHeader>

        {view === "list" && selected === ALL_KEY && (
          <PostList>
            {posts.map((p) => (
              <li key={p.slug}>
                <Card to={`/til/${p.slug}`}>
                  <small>{p.frontmatter.date}</small>
                  <h3>{p.frontmatter.title}</h3>
                  <p>{p.frontmatter.description}</p>
                </Card>
              </li>
            ))}
          </PostList>
        )}

        {view === "list" && selected !== ALL_KEY && (
          <PostList>
            {(current?.items || []).map((p) => (
              <li key={p.slug}>
                <Card to={`/til/${p.slug}`}>
                  <small>{p.frontmatter.date}</small>
                  <h3>{p.frontmatter.title}</h3>
                  <p>{p.frontmatter.description}</p>
                </Card>
              </li>
            ))}
          </PostList>
        )}

        {view === "calendar" && (
          <>
            <ArchiveCalendar
              startDay={startDay}
              daysInSelected={daysInSelected}
              byDayInMonth={byDayInMonth}
              selected={selected}
              activeDate={activeDate}
              onDayClick={setActiveDate}
            />
            {activeDate && (
              <DayList>
                <h3>{activeDate}의 글</h3>
                <ul>
                  {(current?.items || [])
                    .filter((p) => p.frontmatter.date?.startsWith(activeDate))
                    .map((p) => (
                      <li key={p.slug}>
                        <Card to={`/til/${p.slug}`}>
                          <small>{p.frontmatter.date}</small>
                          <h3>{p.frontmatter.title}</h3>
                          <p>{p.frontmatter.description}</p>
                        </Card>
                      </li>
                    ))}
                </ul>
              </DayList>
            )}
          </>
        )}
      </Main>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  align-items: start;
  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 1fr;
  }
`;
const Main = styled.section`
  min-width: 0;
`;
const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;
const Card = styled(Link)`
  display: block;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  h3 {
    margin: 6px 0;
    font-size: 16px;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.subtleText};
  }
`;

const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mq.sm} {
    flex-direction: column;
    align-items: stretch;
  }
`;
const Title = styled.h2`
  margin: 0;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  ${({ theme }) => theme.mq.sm} {
    justify-content: space-between;
  }
`;
const NavButtons = styled.div`
  display: inline-flex;
  gap: 6px;
`;
const NavBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
const ViewToggle = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`;
const ToggleBtn = styled.button`
  padding: 6px 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.chip};
    font-weight: 700;
  }
`;
const DayList = styled.section`
  margin-top: 12px;
  h3 {
    margin: 0 0 8px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }
`;
