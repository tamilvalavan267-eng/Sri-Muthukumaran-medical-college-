/**
 * Sri Muthukumaran Medical College
 * Lightweight Retina Canvas / SVG Charting Engine
 * Zero external dependencies, pure vanilla JS, reactive to dark mode & themes
 */

const SMMC_Charts = {
  // Line & Area Chart for Student Performance
  renderPerformanceChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Scale for crisp high DPI screens
    canvas.width = (rect.width || 600) * dpr;
    canvas.height = (rect.height || 260) * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width || 600;
    const height = rect.height || 260;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0F52BA';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#0D9488';

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 30, bottom: 40, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw horizontal grid lines & labels
    const steps = 4;
    const minVal = 50;
    const maxVal = 100;

    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= steps; i++) {
      const val = Math.round(minVal + (maxVal - minVal) * (i / steps));
      const y = padding.top + chartH - (i / steps) * chartH;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText(`${val}%`, padding.left - 10, y);
    }

    const labels = data.labels || ["IA 1 (Jul)", "IA 2 (Aug)", "Model Exam (Sep)", "Final Pred (Oct)"];
    const series1 = data.scores || [85, 88, 92, 95]; // General Medicine
    const series2 = data.scores2 || [82, 84, 88, 91]; // Pediatrics

    const stepX = chartW / (labels.length - 1);

    // Draw X Axis Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((label, i) => {
      const x = padding.left + i * stepX;
      ctx.fillStyle = textColor;
      ctx.fillText(label, x, height - padding.bottom + 12);
    });

    // Helper to draw smooth series
    const drawSeries = (series, strokeColor, fillColor) => {
      const points = series.map((val, i) => {
        const x = padding.left + i * stepX;
        const normalized = (val - minVal) / (maxVal - minVal);
        const y = padding.top + chartH - normalized * chartH;
        return { x, y, val };
      });

      // Fill area under curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw point markers
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#111a2e' : '#ffffff';
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Point value tooltip/tag
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${p.val}%`, p.x, p.y - 12);
      });
    };

    // Draw Medicine (Primary) & Surgery (Secondary)
    drawSeries(series1, primaryColor, 'rgba(15, 82, 186, 0.15)');
    drawSeries(series2, secondaryColor, 'rgba(13, 148, 136, 0.12)');
  },

  // Donut / Pie Chart for Fees or Attendance
  renderDonutChart(canvasId, segments, centerText) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    const size = Math.min(rect.width || 220, rect.height || 220);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.42;
    const innerRadius = size * 0.28;

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let currentAngle = -Math.PI / 2;

    segments.forEach(seg => {
      const sliceAngle = (seg.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = seg.color;
      ctx.fill();
      currentAngle += sliceAngle;
    });

    // Center text
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.fillText(centerText.value || '', centerX, centerY - 6);

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(centerText.label || '', centerX, centerY + 14);
  },

  // Bar Chart for Department Enrollment or Admin Stats
  renderBarChart(canvasId, items) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = (rect.width || 500) * dpr;
    canvas.height = (rect.height || 240) * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width || 500;
    const height = rect.height || 240;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0F52BA';

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...items.map(i => i.value), 100);
    const barWidth = Math.min(chartW / items.length * 0.55, 45);
    const stepX = chartW / items.length;

    // Draw baseline
    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    items.forEach((item, i) => {
      const x = padding.left + i * stepX + (stepX - barWidth) / 2;
      const barH = (item.value / maxVal) * chartH;
      const y = height - padding.bottom - barH;

      // Draw Bar
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
      ctx.lineTo(x + barWidth, height - padding.bottom);
      ctx.lineTo(x, height - padding.bottom);
      ctx.closePath();

      ctx.fillStyle = item.color || primaryColor;
      ctx.fill();

      // Top value text
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 6);

      // Bottom label
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText(item.label, x + barWidth / 2, height - padding.bottom + 16);
    });
  }
};

window.SMMC_Charts = SMMC_Charts;

// Auto-redraw charts when window resizes or theme updates
window.addEventListener('resize', () => {
  window.dispatchEvent(new CustomEvent('redrawCharts'));
});

window.addEventListener('themeChanged', () => {
  window.dispatchEvent(new CustomEvent('redrawCharts'));
});
