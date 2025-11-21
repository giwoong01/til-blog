import { useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { usePosts } from "../posts/usePosts";

type MonthKey = string; // YYYY-MM
const isMonthKey = (key: string) => /^\d{4}-\d{2}$/.test(key);
const ALL_KEY = "전체";

export default function Archive() {
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
      <Sidebar>
        <h2>아카이브</h2>
        <MonthList>
          <MonthItem key={ALL_KEY}>
            <MonthButton
              type="button"
              data-active={String(selected === ALL_KEY)}
              onClick={() => {
                setSelected(ALL_KEY);
                setView("list");
              }}
            >
              <span>{ALL_KEY}</span>
              <Count>{posts.length}</Count>
            </MonthButton>
          </MonthItem>
          {months.map((m) => (
            <MonthItem key={m}>
              <MonthButton
                type="button"
                data-active={String(m === selected)}
                onClick={() => setSelected(m)}
              >
                <span>{formatMonth(m)}</span>
                <Count>
                  {byMonth.find((g) => g.key === m)?.items.length || 0}
                </Count>
              </MonthButton>
            </MonthItem>
          ))}
        </MonthList>
      </Sidebar>
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
            <Calendar>
              <WeekHeader>
                {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </WeekHeader>
              <Grid>
                {Array.from({ length: Math.max(0, startDay) }).map((_, i) => (
                  <Spacer key={`s-${i}`} />
                ))}
                {Array.from({ length: daysInSelected }, (_, i) => i + 1).map(
                  (d) => {
                    const list = byDayInMonth.get(d) || [];
                    const fullDate =
                      selected && /^\d{4}-\d{2}$/.test(selected)
                        ? `${selected}-${String(d).padStart(2, "0")}`
                        : "";
                    const isActive = activeDate === fullDate;
                    return (
                      <DayCell
                        key={d}
                        type="button"
                        data-active={String(isActive)}
                        data-has={String(list.length > 0)}
                        onClick={() => setActiveDate(fullDate)}
                      >
                        <DayNum>{d}</DayNum>
                        {list.length > 0 && <Badge>{list.length}</Badge>}
                      </DayCell>
                    );
                  }
                )}
              </Grid>
            </Calendar>
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

function formatMonth(key: string): string {
  if (key === "기타") return "기타";
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (!m) return key;
  return `${m[1]}년 ${parseInt(m[2], 10)}월`;
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
const Sidebar = styled.aside`
  position: sticky;
  top: 80px;
  z-index: 2;
  align-self: start;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 12px;
  h2 {
    margin: 4px 0 8px;
    font-size: 18px;
  }
`;
const MonthList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
`;
const MonthItem = styled.li``;
const MonthButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.chip};
    font-weight: 700;
  }
`;
const Count = styled.span`
  color: ${({ theme }) => theme.colors.subtleText};
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

const Calendar = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 12px;
`;
const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: ${({ theme }) => theme.colors.subtleText};
  margin-bottom: 6px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;
const Spacer = styled.div``;
const DayCell = styled.button`
  position: relative;
  min-height: 64px;
  text-align: left;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &[data-has="true"] {
    background: ${({ theme }) => theme.colors.surface};
  }
  &[data-active="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: -2px;
  }
`;
const DayNum = styled.span`
  font-weight: 600;
`;
const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.chip};
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
