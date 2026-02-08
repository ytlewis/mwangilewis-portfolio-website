/**
 * Performance Monitor Component
 * Displays real-time performance metrics and analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getAnalytics, PerformanceMetrics } from '@/lib/analytics';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [score, setScore] = useState<number>(0);
  const [meetsTarget, setMeetsTarget] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const analytics = getAnalytics();
    
    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const latest = analytics.getLatestMetrics();
      if (latest) {
        setMetrics(latest);
        setScore(analytics.getPerformanceScore());
        setMeetsTarget(analytics.meetsLoadTimeTarget());
      }
    }, 2000);

    // Initial load
    const latest = analytics.getLatestMetrics();
    if (latest) {
      setMetrics(latest);
      setScore(analytics.getPerformanceScore());
      setMeetsTarget(analytics.meetsLoadTimeTarget());
    }

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricColor = (value: number, threshold: number, inverse: boolean = false): string => {
    const isGood = inverse ? value > threshold : value < threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const formatTime = (ms: number | undefined): string => {
    if (ms === undefined) return 'N/A';
    return `${Math.round(ms)}ms`;
  };

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Monitor
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Loading performance metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Monitor
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Performance Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Performance Score
          </span>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 90 ? 'bg-green-600' : score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* 3-Second Target */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            3-Second Load Target
          </span>
          <span className={`font-semibold ${meetsTarget ? 'text-green-600' : 'text-red-600'}`}>
            {meetsTarget ? '✓ Met' : '✗ Not Met'}
          </span>
        </div>
        {metrics.loadComplete && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Current: {formatTime(metrics.loadComplete)}
          </p>
        )}
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">LCP</div>
          <div className={`text-lg font-semibold ${getMetricColor(metrics.LCP || 0, 2500)}`}>
            {formatTime(metrics.LCP)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Target: &lt;2.5s</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">FID</div>
          <div className={`text-lg font-semibold ${getMetricColor(metrics.FID || 0, 100)}`}>
            {formatTime(metrics.FID)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Target: &lt;100ms</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">CLS</div>
          <div className={`text-lg font-semibold ${getMetricColor(metrics.CLS || 0, 0.1)}`}>
            {metrics.CLS?.toFixed(3) || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Target: &lt;0.1</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">TTFB</div>
          <div className={`text-lg font-semibold ${getMetricColor(metrics.TTFB || 0, 800)}`}>
            {formatTime(metrics.TTFB)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Target: &lt;800ms</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Additional Metrics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">FCP:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(metrics.FCP)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">DOM Content Loaded:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(metrics.domContentLoaded)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Resource Load Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(metrics.resourceLoadTime)}
              </span>
            </div>
            {metrics.connectionType && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.connectionType}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                const analytics = getAnalytics();
                const exported = analytics.exportMetrics();
                console.log('Exported Metrics:', exported);
                alert('Metrics exported to console');
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Export Metrics
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-500">
          <p className="mb-1">
            <strong>LCP:</strong> Largest Contentful Paint - Time to render largest content
          </p>
          <p className="mb-1">
            <strong>FID:</strong> First Input Delay - Time from first interaction to response
          </p>
          <p className="mb-1">
            <strong>CLS:</strong> Cumulative Layout Shift - Visual stability score
          </p>
          <p>
            <strong>TTFB:</strong> Time to First Byte - Server response time
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
