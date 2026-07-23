import React, { useMemo } from 'react';

// Timezone-safe local date formatter
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * GitHub-style activity heatmap for the last ~365 days.
 * Cells are light green if the date exists in the history object.
 */
export default function Heatmap({ history = {} }) {
  const { weeks, monthLabels, totalDays, currentStreak, longestStreak } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build 52 weeks + remainder of current week (going back ~365 days)
    const totalCells = 371; // 53 weeks × 7
    const endDay = new Date(today);
    const startDay = new Date(today);
    startDay.setDate(startDay.getDate() - totalCells + 1);

    // Align to Sunday
    const startDow = startDay.getDay();
    startDay.setDate(startDay.getDate() - startDow);

    const weeks = [];
    let currentWeek = [];
    const monthLabelsMap = {};
    const current = new Date(startDay);

    while (current <= endDay || currentWeek.length > 0) {
      const dateStr = toLocalDateStr(current);
      const isInRange = current <= endDay;
      const isFuture = current > today;

      currentWeek.push({
        date: dateStr,
        active: isInRange && !isFuture && !!history[dateStr],
        isFuture,
        isToday: dateStr === toLocalDateStr(today),
        month: current.getMonth(),
        isInRange,
      });

      // Track month labels at the start of each month
      if (current.getDate() <= 7 && current.getDay() === 0) {
        const weekIndex = weeks.length;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthLabelsMap[weekIndex] = monthNames[current.getMonth()];
      }

      current.setDate(current.getDate() + 1);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      if (current > endDay && currentWeek.length === 0) break;
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Calculate stats
    const historyDates = Object.keys(history).sort();
    const totalDays = historyDates.length;

    // Current streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    while (true) {
      const ds = toLocalDateStr(checkDate);
      if (history[ds]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = new Set(historyDates);
    if (historyDates.length > 0) {
      const first = new Date(historyDates[0]);
      const last = new Date(historyDates[historyDates.length - 1]);
      const d = new Date(first);
      while (d <= last) {
        if (allDates.has(toLocalDateStr(d))) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
        d.setDate(d.getDate() + 1);
      }
    }

    return { weeks, monthLabels: monthLabelsMap, totalDays, currentStreak, longestStreak };
  }, [history]);

  const cellSize = 13;
  const gap = 3;
  const dayLabelWidth = 28;

  return (
    <div className="heatmap-container">
      {/* Stats bar */}
      <div className="heatmap-stats">
        <div className="heatmap-stat">
          <span className="heatmap-stat-value">{totalDays}</span>
          <span className="heatmap-stat-label">Total Days</span>
        </div>
        <div className="heatmap-stat">
          <span className="heatmap-stat-value heatmap-stat-streak">{currentStreak}</span>
          <span className="heatmap-stat-label">Current Streak</span>
        </div>
        <div className="heatmap-stat">
          <span className="heatmap-stat-value">{longestStreak}</span>
          <span className="heatmap-stat-label">Longest Streak</span>
        </div>
      </div>

      {/* Grid */}
      <div className="heatmap-scroll">
        <svg
          viewBox={`0 0 ${dayLabelWidth + weeks.length * (cellSize + gap) + 10} ${7 * (cellSize + gap) + 30}`}
          style={{ width: '100%', height: 'auto', minWidth: '800px' }}
          className="heatmap-svg"
        >
          {/* Month labels */}
          {Object.entries(monthLabels).map(([weekIdx, label]) => (
            <text
              key={weekIdx}
              x={dayLabelWidth + parseInt(weekIdx) * (cellSize + gap)}
              y={10}
              className="heatmap-month-label"
            >
              {label}
            </text>
          ))}

          {/* Day labels */}
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
            <text
              key={i}
              x={0}
              y={20 + i * (cellSize + gap) + cellSize / 2 + 4}
              className="heatmap-day-label"
            >
              {label}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.isInRange) return null;
              return (
                <rect
                  key={day.date}
                  x={dayLabelWidth + wi * (cellSize + gap)}
                  y={20 + di * (cellSize + gap)}
                  width={cellSize}
                  height={cellSize}
                  rx={3}
                  className={`heatmap-cell ${day.active ? 'heatmap-cell-active' : ''} ${day.isToday ? 'heatmap-cell-today' : ''} ${day.isFuture ? 'heatmap-cell-future' : ''}`}
                >
                  <title>{day.date}{day.active ? ' ✓' : ''}{day.isToday ? ' (Today)' : ''}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-text">Less</span>
        <div className="heatmap-legend-cell heatmap-cell" />
        <div className="heatmap-legend-cell heatmap-cell-active" />
        <span className="heatmap-legend-text">More</span>
      </div>
    </div>
  );
}
