interface ChartItem {
  label: string;
  value: number;
}

interface DashboardChartProps {
  items: ChartItem[];
  type?: "donut" | "bar";
}

const DOT_CLASSES = ["d0", "d1", "d2", "d3", "d0", "d1"];
const DONUT_COLORS = ["#3caf68", "#2f80d9", "#f29b2e", "#8050d3", "#3caf68", "#2f80d9"];

export default function DashboardChart({ items, type = "bar" }: DashboardChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...items.map((i) => i.value), 1);

  if (type === "donut") {
    let cursor = 0;
    const stops = items.map((item, i) => {
      const start = (cursor / total) * 100;
      cursor += item.value;
      const end = (cursor / total) * 100;
      return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${start}% ${end}%`;
    });

    return (
      <div className="donut-layout">
        <div className="donut" style={{ background: `conic-gradient(${stops.join(", ")})` }}>
          <div className="donut-hole">{total}</div>
        </div>
        <div className="legend">
          {items.map((item, i) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.label}>
                <span className={"dot " + DOT_CLASSES[i % DOT_CLASSES.length]} />
                <strong>{item.label}</strong>
                <span>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bar-chart">
      {items.map((item) => {
        const percent = Math.round((item.value / max) * 100);
        return (
          <div key={item.label} className="bar-row">
            <span>{item.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: percent + "%" }} />
            </div>
            <span>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}
