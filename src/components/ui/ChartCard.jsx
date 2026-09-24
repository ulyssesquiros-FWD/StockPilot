import React from 'react';
import Card from './Card';

export default function ChartCard({
  title,
  subtitle,
  children,
  actions,
  height = 300,
  className = ''
}) {
  return (
    <Card title={title} subtitle={subtitle} actions={actions} className={`chart-card ${className}`}>
      <div style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
        {children}
      </div>
    </Card>
  );
}
