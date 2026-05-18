const revenueSeries = [180, 210, 205, 244, 262, 255, 289, 314, 332, 348, 370, 398];
const channelSeries = [
  { label: "Referral", value: 78, color: "#1f8a8a" },
  { label: "Paid social", value: 64, color: "#eb6f5e" },
  { label: "Organic", value: 58, color: "#d6a648" },
  { label: "Email", value: 47, color: "#315f9a" },
  { label: "Partners", value: 36, color: "#5e6e8f" }
];

function setCurrentDate() {
  const dateTarget = document.getElementById("currentDate");
  if (!dateTarget) {
    return;
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  dateTarget.textContent = formattedDate;
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const endValue = Number(counter.dataset.value || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = endValue * eased;
      const rounded = Number.isInteger(endValue)
        ? Math.round(current).toLocaleString("en-US")
        : current.toFixed(1);
      counter.textContent = `${rounded}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
}

function buildRevenueChart() {
  const svg = document.getElementById("revenueChart");
  if (!svg) {
    return;
  }

  const width = 560;
  const height = 240;
  const padding = { top: 18, right: 18, bottom: 36, left: 18 };
  const maxValue = Math.max(...revenueSeries);
  const minValue = Math.min(...revenueSeries) - 30;
  const stepX = (width - padding.left - padding.right) / (revenueSeries.length - 1);

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1f8a8a" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#1f8a8a" stop-opacity="0.02" />
      </linearGradient>
    </defs>
  `;

  for (let i = 0; i < 4; i += 1) {
    const y = padding.top + ((height - padding.top - padding.bottom) / 3) * i;
    const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", String(padding.left));
    gridLine.setAttribute("x2", String(width - padding.right));
    gridLine.setAttribute("y1", String(y));
    gridLine.setAttribute("y2", String(y));
    gridLine.setAttribute("stroke", "rgba(255,255,255,0.1)");
    gridLine.setAttribute("stroke-width", "1");
    svg.appendChild(gridLine);
  }

  const points = revenueSeries.map((value, index) => {
    const x = padding.left + stepX * index;
    const y = height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom);
    return [x, y];
  });

  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint[0]} ${height - padding.bottom} L ${points[0][0]} ${height - padding.bottom} Z`;

  const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
  area.setAttribute("d", areaPath);
  area.setAttribute("fill", "url(#areaFill)");
  svg.appendChild(area);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("d", linePath);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "#7de3db");
  line.setAttribute("stroke-width", "4");
  line.setAttribute("stroke-linejoin", "round");
  line.setAttribute("stroke-linecap", "round");
  svg.appendChild(line);

  points.forEach(([x, y], index) => {
    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute("cx", String(x));
    point.setAttribute("cy", String(y));
    point.setAttribute("r", "4.5");
    point.setAttribute("fill", "#f7f3ea");
    point.setAttribute("stroke", "#7de3db");
    point.setAttribute("stroke-width", "2");
    svg.appendChild(point);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(height - 14));
    label.setAttribute("fill", "rgba(255,255,255,0.6)");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "11");
    label.textContent = `W${index + 1}`;
    svg.appendChild(label);
  });
}

function buildChannelChart() {
  const svg = document.getElementById("channelChart");
  if (!svg) {
    return;
  }

  const width = 560;
  const height = 280;
  const padding = { top: 26, right: 24, bottom: 40, left: 24 };
  const chartHeight = height - padding.top - padding.bottom;
  const gap = 18;
  const barWidth = (width - padding.left - padding.right - gap * (channelSeries.length - 1)) / channelSeries.length;
  const maxValue = 90;

  svg.innerHTML = "";

  for (let i = 0; i < 5; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(padding.left));
    line.setAttribute("x2", String(width - padding.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "rgba(23,32,51,0.08)");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  }

  channelSeries.forEach((entry, index) => {
    const barHeight = (entry.value / maxValue) * chartHeight;
    const x = padding.left + index * (barWidth + gap);
    const y = padding.top + (chartHeight - barHeight);

    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", String(x));
    bar.setAttribute("y", String(y));
    bar.setAttribute("width", String(barWidth));
    bar.setAttribute("height", String(barHeight));
    bar.setAttribute("rx", "18");
    bar.setAttribute("fill", entry.color);
    bar.setAttribute("opacity", "0.92");
    svg.appendChild(bar);

    const cap = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    cap.setAttribute("x", String(x));
    cap.setAttribute("y", String(y + 12));
    cap.setAttribute("width", String(barWidth));
    cap.setAttribute("height", String(Math.max(barHeight - 12, 0)));
    cap.setAttribute("rx", "18");
    cap.setAttribute("fill", "rgba(255,255,255,0.16)");
    svg.appendChild(cap);

    const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
    value.setAttribute("x", String(x + barWidth / 2));
    value.setAttribute("y", String(y - 12));
    value.setAttribute("text-anchor", "middle");
    value.setAttribute("font-size", "14");
    value.setAttribute("font-weight", "700");
    value.setAttribute("fill", "#172033");
    value.textContent = `${entry.value}%`;
    svg.appendChild(value);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(x + barWidth / 2));
    label.setAttribute("y", String(height - 12));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "13");
    label.setAttribute("fill", "#627085");
    label.textContent = entry.label;
    svg.appendChild(label);
  });
}

setCurrentDate();
animateCounters();
buildRevenueChart();
buildChannelChart();
