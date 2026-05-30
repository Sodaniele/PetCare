import React, { useState } from 'react';
import type { WeightRecord } from '../context/PetContext';

interface WeightChartProps {
  data: WeightRecord[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex-center" style={{ height: '100%', color: 'var(--text-tertiary)', fontSize: '13px' }}>
        No hay datos de peso disponibles.
      </div>
    );
  }

  // Dimension settings
  const width = 360;
  const height = 140;
  const paddingX = 35;
  const paddingY = 20;

  // Find min/max values
  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights) * 0.95; // 5% cushion below
  const maxWeight = Math.max(...weights) * 1.05; // 5% cushion above
  const weightRange = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight;

  // Calculate coordinates
  const points = data.map((record, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (data.length - 1 || 1);
    const y = height - paddingY - ((record.weight - minWeight) * (height - 2 * paddingY)) / weightRange;
    return { x, y, weight: record.weight, date: record.date };
  });

  // Create SVG path string
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Draw smooth curves (cubic bezier) instead of straight lines
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  // Create filled gradient path
  let areaD = '';
  if (points.length > 0) {
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  return (
    <div className="weight-chart-container" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          {/* Main Area Fill Gradient */}
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
          </linearGradient>

          {/* Stroke Line Gradient */}
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* Grid lines (horizontal) */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = paddingY + ratio * (height - 2 * paddingY);
          const weightLabel = (maxWeight - ratio * weightRange).toFixed(1);
          return (
            <g key={index} opacity="0.15">
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="var(--text-secondary)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingX - 8} 
                y={y + 4} 
                fill="var(--text-primary)" 
                fontSize="10" 
                textAnchor="end" 
                fontWeight="500"
              >
                {weightLabel}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaD && <path d={areaD} fill="url(#chartGrad)" />}

        {/* Stroke line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Points */}
        {points.map((pt, idx) => (
          <g key={idx}>
            {/* Larger transparent hover targets */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="14"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint({ index: idx, x: pt.x, y: pt.y })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {/* Visual dots */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.index === idx ? '6' : '4'}
              fill="var(--card)"
              stroke={hoveredPoint?.index === idx ? 'var(--accent)' : 'var(--primary)'}
              strokeWidth="2.5"
              style={{ transition: 'r 0.15s ease, stroke 0.15s ease' }}
            />
          </g>
        ))}

        {/* Bottom date labels */}
        {points.map((pt, idx) => {
          // Only show first, middle, last to prevent overlap in mobile
          if (idx === 0 || idx === points.length - 1 || (points.length > 2 && idx === Math.floor(points.length / 2))) {
            return (
              <text
                key={idx}
                x={pt.x}
                y={height - 4}
                fill="var(--text-secondary)"
                fontSize="9"
                textAnchor="middle"
                fontWeight="600"
                opacity="0.8"
              >
                {pt.date}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Floating Info Tooltip */}
      {hoveredPoint !== null && (
        <div
          className="card-premium"
          style={{
            position: 'absolute',
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100 - 45}%`,
            transform: 'translateX(-50%)',
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            animation: 'scaleIn 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {data[hoveredPoint.index].weight} kg
          </span>
          <span style={{ fontSize: '8px', fontWeight: 500, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
            {data[hoveredPoint.index].date}
          </span>
        </div>
      )}
    </div>
  );
};
