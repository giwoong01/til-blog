import styled from "styled-components";

type ArchiveCalendarProps = {
  startDay: number;
  daysInSelected: number;
  byDayInMonth: Map<number, unknown[]>;
  selected: string;
  activeDate: string | null;
  onDayClick: (fullDate: string) => void;
};

export default function ArchiveCalendar({
  startDay,
  daysInSelected,
  byDayInMonth,
  selected,
  activeDate,
  onDayClick,
}: ArchiveCalendarProps) {
  return (
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
        {Array.from({ length: daysInSelected }, (_, i) => i + 1).map((d) => {
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
              onClick={() => onDayClick(fullDate)}
            >
              <DayNum>{d}</DayNum>
              {list.length > 0 && <Badge>{list.length}</Badge>}
            </DayCell>
          );
        })}
      </Grid>
    </Calendar>
  );
}

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
