'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DollarSign, TrendingUp, Calendar, Activity, BarChart3, RefreshCw, TrendingDown, Zap, Award } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Helper function to format numbers (removes decimals, adds K for thousands)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return Math.round(num).toString();
};

// ----------------------
// StatCard Component - Enhanced for mobile responsiveness
// ----------------------
const StatCard: React.FC<{
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  gradient?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ title, value, prefix = '', suffix = '', gradient = 'from-blue-600 to-blue-700', icon, trend }) => {
  return (
    <div className="group relative bg-white rounded-lg p-4 sm:p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Subtle Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* Responsive icon and trend layout */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={`w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
            <div className="scale-75 sm:scale-100">
              {icon}
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded-md text-xs font-semibold ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-[10px] sm:text-xs">{Math.abs(trend).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1 sm:mb-2">{title}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
          {prefix}{suffix === '%' ? value.toFixed(0) : formatNumber(value)}{suffix}
        </h2>
      </div>
    </div>
  );
};

// ----------------------
// Main Analytics Page - Fully Responsive
// ----------------------
export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch sales data from /api/reports
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setSalesData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // ----------------------
  // Calculations
  // ----------------------
  const totalSales = salesData.reduce((acc, cur) => acc + cur.totalSales, 0);
  const totalProfit = salesData.reduce((acc, cur) => acc + cur.totalProfit, 0);
  const avgSales = salesData.length ? totalSales / salesData.length : 0;
  const profitMargin = totalSales ? (totalProfit / totalSales) * 100 : 0;

  // Calculate trends (compare last day with average)
  const lastDaySales = salesData.length > 0 ? salesData[salesData.length - 1].totalSales : 0;
  const salesTrend = avgSales > 0 ? ((lastDaySales - avgSales) / avgSales) * 100 : 0;

  // Find best performing day
  const bestDay = salesData.reduce((max, day) => day.totalSales > max.totalSales ? day : max, salesData[0] || { totalSales: 0 });

  // ----------------------
  // Chart Data
  // ----------------------
  const chartData = {
    labels: salesData.map(d => d._id),
    datasets: [
      {
        label: 'Total Sales (Rs)',
        data: salesData.map(d => d.totalSales),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
      {
        label: 'Total Profit (Rs)',
        data: salesData.map(d => d.totalProfit),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 13,
            weight: 600,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600,
        },
        bodyFont: {
          size: 12,
        },
        borderColor: '#fff',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': Rs. ';
            }
            label += formatNumber(context.parsed.y);
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
            weight: 600,
          },
          callback: function(value: any) {
            return 'Rs. ' + formatNumber(value);
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: 600,
          },
        },
      },
    },
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main container - responsive padding */}
      <div className="relative z-10 max-w-[1600px] mx-auto p-3 sm:p-4 md:p-5">
        {/* Premium Header - Responsive layout */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-lg shadow-2xl mb-4 sm:mb-6 overflow-hidden border-b-4 border-amber-500">
          <div className="relative p-4 sm:p-5 md:p-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
            </div>
            
            {/* Responsive header layout: stacked on mobile, horizontal on tablet+ */}
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                {/* Logo - scaled for mobile */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-4 border-amber-400">
                    <img 
                      src="/logo.png" 
                      alt="Habib Dukan Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-red-700">د</div>';
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Brand Text - centered on mobile, left-aligned on tablet+ */}
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide" style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-sm sm:text-base md:text-lg font-semibold tracking-wider">HABIB DUKAN - Analytics Dashboard</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" strokeWidth={2.5} />
                    <p className="text-amber-100 text-xs sm:text-sm font-medium">Real-time Business Intelligence</p>
                  </div>
                </div>
              </div>

              {/* Refresh Button - full width on mobile, auto on tablet+ */}
              <button
                onClick={fetchSalesData}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-900 text-sm sm:text-base font-bold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-900 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards - Responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard 
            title="Total Sales" 
            value={totalSales} 
            prefix="Rs " 
            gradient="from-red-600 to-red-700" 
            icon={<DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />}
            trend={salesTrend}
            color="red"
          />
          <StatCard 
            title="Total Profit" 
            value={totalProfit} 
            prefix="Rs " 
            gradient="from-green-600 to-green-700" 
            icon={<TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />}
            color="green"
          />
          <StatCard 
            title="Daily Average" 
            value={avgSales} 
            prefix="Rs " 
            gradient="from-purple-600 to-purple-700" 
            icon={<Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />}
            color="purple"
          />
          <StatCard 
            title="Profit Margin" 
            value={profitMargin} 
            suffix="%" 
            gradient="from-amber-600 to-amber-700" 
            icon={<Activity className="w-6 h-6 text-white" strokeWidth={2.5} />}
            color="amber"
          />
        </div>

        {/* Chart and Best Day Grid - Stacked on mobile/tablet, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-6">
          {/* Line Chart - Full width on mobile/tablet, 2 cols on desktop */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Performance Trend</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Last 7 Days Analysis</p>
              </div>
            </div>
            {loading ? (
              <div className="py-12 sm:py-16 flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-semibold text-sm sm:text-base">Loading chart...</p>
              </div>
            ) : salesData.length === 0 ? (
              <div className="py-12 sm:py-16 text-center">
                <BarChart3 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">No data available</p>
              </div>
            ) : (
              <div className="h-64 sm:h-72 md:h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>

          {/* Best Performing Day Card */}
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-lg shadow-xl p-5 sm:p-6 text-white relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full opacity-10 -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white bg-opacity-30 backdrop-blur-md rounded-lg flex items-center justify-center shadow-md shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 text-xs font-bold uppercase tracking-wider">Best Day</p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{bestDay?._id || 'N/A'}</h3>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white border-opacity-20">
                  <p className="text-gray-900 text-xs font-bold uppercase tracking-wide mb-1">Sales</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">Rs {formatNumber(bestDay?.totalSales || 0)}</p>
                </div>
                <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white border-opacity-20">
                  <p className="text-gray-900 text-xs font-bold uppercase tracking-wide mb-1">Profit</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">Rs {formatNumber(bestDay?.totalProfit || 0)}</p>
                </div>
                <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white border-opacity-20">
                  <p className="text-gray-900 text-xs font-bold uppercase tracking-wide mb-1">Margin</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {bestDay?.totalSales ? ((bestDay.totalProfit / bestDay.totalSales) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Sales Table - Fully responsive with horizontal scroll on mobile */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 border-b-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daily Breakdown</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Detailed sales report</p>
              </div>
            </div>
          </div>

          {/* Table with horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                  <th className="text-left p-3 sm:p-4 font-semibold uppercase tracking-wider text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Date</span>
                      <span className="sm:hidden">Date</span>
                    </div>
                  </th>
                  <th className="text-right p-3 sm:p-4 font-semibold uppercase tracking-wider text-xs sm:text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span>Sales</span>
                    </div>
                  </th>
                  <th className="text-right p-3 sm:p-4 font-semibold uppercase tracking-wider text-xs sm:text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span>Profit</span>
                    </div>
                  </th>
                  <th className="text-center p-3 sm:p-4 font-semibold uppercase tracking-wider text-xs sm:text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span>Margin</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-semibold text-sm sm:text-base">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : salesData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 sm:py-16">
                      <div className="flex flex-col items-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-semibold text-base sm:text-lg">No sales data</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">Start making sales to see reports</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  salesData.map((r, index) => {
                    const margin = r.totalSales ? ((r.totalProfit / r.totalSales) * 100) : 0;
                    return (
                      <tr 
                        key={r._id} 
                        className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" strokeWidth={2} />
                            </div>
                            <span className="font-semibold text-sm sm:text-base text-gray-900 whitespace-nowrap">{r._id}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-right">
                          <span className="font-bold text-base sm:text-lg text-gray-900 whitespace-nowrap">Rs {formatNumber(r.totalSales)}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-right">
                          <span className="inline-block bg-green-100 text-green-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-sm sm:text-base whitespace-nowrap">
                            Rs {formatNumber(r.totalProfit)}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-sm sm:text-base whitespace-nowrap ${
                            margin >= 30 ? 'bg-green-100 text-green-700' :
                            margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {margin.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer - Responsive layout */}
          {!loading && salesData.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 border-t-2 border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  <span className="font-semibold text-sm sm:text-base">Showing {salesData.length} days</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Updated: {new Date().toLocaleString('en-PK')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}