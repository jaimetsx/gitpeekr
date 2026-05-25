"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ApiResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

type Week = (ContributionDay | null)[];

function groupIntoWeeks(days: ContributionDay[]): Week[] {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: Week[] = [];
  let currentWeek: Week = new Array(7).fill(null);

  for (const day of sorted) {
    const jsDay = new Date(`${day.date}T00:00:00`).getDay();
    currentWeek[jsDay] = day;

    if (jsDay === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  }

  if (currentWeek.some(Boolean)) weeks.push(currentWeek);
  return weeks;
}

function monthLabels(weeks: Week[]) {
  const labels: { index: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, index) => {
    const firstRealDay = week.find(Boolean);
    if (!firstRealDay) return;

    const month = new Date(`${firstRealDay.date}T00:00:00`).getMonth();
    if (month !== lastMonth) {
      labels.push({
        index,
        label: new Date(`${firstRealDay.date}T00:00:00`).toLocaleString("en", {
          month: "short",
        }),
      });
      lastMonth = month;
    }
  });

  return labels;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function contributionLabel(count: number) {
  return `${count} contribution${count === 1 ? "" : "s"}`;
}

export default function ContributionHeatmap({
  username,
  data,
}: {
  username: string;
  data: ApiResponse;
}) {
  const years = useMemo(
    () =>
      Object.keys(data.total)
        .filter((y) => /^\d{4}$/.test(y))
        .sort((a, b) => Number(b) - Number(a)),
    [data.total]
  );

  const [selectedYear, setSelectedYear] = useState(years[0] ?? "");
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const [open, setOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const gridWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setHovered(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const yearDays = useMemo(
    () => data.contributions.filter((d) => d.date.startsWith(selectedYear)),
    [data.contributions, selectedYear]
  );

  const weeks = useMemo(() => groupIntoWeeks(yearDays), [yearDays]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);
  const total = data.total[selectedYear] ?? 0;

  function handleEnter(day: ContributionDay, el: HTMLButtonElement) {
    if (day.count <= 0 || !gridWrapRef.current) {
      setHovered(null);
      return;
    }

    const gridRect = gridWrapRef.current.getBoundingClientRect();
    const cellRect = el.getBoundingClientRect();

    const left = cellRect.left - gridRect.left + cellRect.width / 2;
    const top = cellRect.top - gridRect.top - 12;

    setTooltipPos({ left, top });
    setHovered(day);
  }

  return (
    <section className="contribution-wrap">
      <div className="contribution-head">
        <div>
          <span className="contribution-title">Contribution activity</span>
          <div className="contribution-total">
            {total} contributions in {selectedYear}
          </div>
        </div>

        <div className="year-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className={`year-dropdown-trigger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span>{selectedYear}</span>
            <svg
              className="year-dropdown-chevron"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                d="M4 6.5 8 10.5 12 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={`year-dropdown-menu ${open ? "is-open" : ""}`} role="listbox">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                className={`year-dropdown-item ${year === selectedYear ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedYear(year);
                  setOpen(false);
                  setHovered(null);
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-board">
          <div className="heatmap-months">
            {labels.map((item) => (
              <span
                key={`${item.label}-${item.index}`}
                className="heatmap-month"
                style={{ gridColumn: `${item.index + 1}` }}
              >
                {item.label}
              </span>
            ))}
          </div>

          <div className="heatmap-main">
            <div className="heatmap-days-labels">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="heatmap-grid-wrap" ref={gridWrapRef}>
              {hovered && (
                <div
                  className="heatmap-tooltip is-visible"
                  style={{
                    left: `${tooltipPos.left}px`,
                    top: `${tooltipPos.top}px`,
                  }}
                >
                  <strong>{contributionLabel(hovered.count)}</strong>
                  <span>{formatDate(hovered.date)}</span>
                </div>
              )}

              <div
                className="heatmap-grid"
                style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)` }}
              >
                {weeks.map((week, weekIndex) =>
                  week.map((day, dayIndex) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="heatmap-cell is-empty"
                        />
                      );
                    }

                    return (
                      <button
                        key={day.date}
                        type="button"
                        className={`heatmap-cell level-${day.level}`}
                        onMouseEnter={(e) => handleEnter(day, e.currentTarget)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={(e) => handleEnter(day, e.currentTarget)}
                        onBlur={() => setHovered(null)}
                        aria-label={`${contributionLabel(day.count)} on ${formatDate(day.date)}`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="heatmap-footer">
            <span className="heatmap-footer-note">
              Public GitHub contributions for {username}
            </span>

            <div className="heatmap-legend">
              <span>Less</span>
              <div className="heatmap-legend-scale">
                <span className="heatmap-cell level-0" />
                <span className="heatmap-cell level-1" />
                <span className="heatmap-cell level-2" />
                <span className="heatmap-cell level-3" />
                <span className="heatmap-cell level-4" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}