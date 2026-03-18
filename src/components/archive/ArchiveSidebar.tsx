import styled from "styled-components";
import { ALL_KEY, formatMonth } from "../../utils/archive";

type ArchiveSidebarProps = {
  months: string[];
  byMonth: Array<{ key: string; items: unknown[] }>;
  totalPosts: number;
  selected: string;
  onSelect: (key: string) => void;
  onSelectAll: () => void;
};

export default function ArchiveSidebar({
  months,
  byMonth,
  totalPosts,
  selected,
  onSelect,
  onSelectAll,
}: ArchiveSidebarProps) {
  return (
    <Sidebar>
      <h2>아카이브</h2>
      <MonthList>
        <MonthItem key={ALL_KEY}>
          <MonthButton
            type="button"
            data-active={String(selected === ALL_KEY)}
            onClick={onSelectAll}
          >
            <span>{ALL_KEY}</span>
            <Count>{totalPosts}</Count>
          </MonthButton>
        </MonthItem>
        {months.map((m) => (
          <MonthItem key={m}>
            <MonthButton
              type="button"
              data-active={String(m === selected)}
              onClick={() => onSelect(m)}
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
  );
}

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
