'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

// Mock analytics data
const mockAnalytics = {
  totalVisitors: 12450,
  uniqueVisitors: 8560,
  pageViews: 28760,
  bounceRate: '32%',
  avgSessionDuration: '3m 45s',
  conversionRate: '4.2%',
};

const mockTrafficSources = [
  { source: 'Organic Search', visitors: 6240, percentage: 50, color: 'bg-blue-500' },
  { source: 'Direct', visitors: 3120, percentage: 25, color: 'bg-green-500' },
  { source: 'Social Media', visitors: 1872, percentage: 15, color: 'bg-purple-500' },
  { source: 'Referral', visitors: 1248, percentage: 10, color: 'bg-orange-500' },
];

const mockTopPages = [
  { page: '/', visitors: 3120, bounceRate: '28%', duration: '4m 12s' },
  { page: '/services', visitors: 1872, bounceRate: '35%', duration: '3m 45s' },
  { page: '/about', visitors: 1248, bounceRate: '22%', duration: '5m 30s' },
  { page: '/contact', visitors: 936, bounceRate: '45%', duration: '2m 15s' },
  { page: '/blog', visitors: 624, bounceRate: '38%', duration: '6m 10s' },
];

const mockGeographicData = [
  { country: 'United States', visitors: 4980, percentage: 40 },
  { country: 'Germany', visitors: 3735, percentage: 30 },
  { country: 'United Kingdom', visitors: 2490, percentage: 20 },
  { country: 'Canada', visitors: 1245, percentage: 10 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive website performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Visitors',
            value: mockAnalytics.totalVisitors.toLocaleString(),
            icon: Users,
            color: 'blue',
            change: '+12%',
          },
          {
            label: 'Unique Visitors',
            value: mockAnalytics.uniqueVisitors.toLocaleString(),
            icon: Eye,
            color: 'green',
            change: '+8%',
          },
          {
            label: 'Page Views',
            value: mockAnalytics.pageViews.toLocaleString(),
            icon: MousePointer,
            color: 'purple',
            change: '+15%',
          },
          {
            label: 'Bounce Rate',
            value: mockAnalytics.bounceRate,
            icon: TrendingUp,
            color: 'orange',
            change: '-3%',
          },
          {
            label: 'Avg. Duration',
            value: mockAnalytics.avgSessionDuration,
            icon: Clock,
            color: 'red',
            change: '+45s',
          },
          {
            label: 'Conversion Rate',
            value: mockAnalytics.conversionRate,
            icon: TrendingUp,
            color: 'teal',
            change: '+0.8%',
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-sm ${
                      metric.change.startsWith('+') || metric.change.startsWith('-3%') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-gray-600">
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${source.color} transition-all duration-300`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Visitor locations by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGeographicData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{data.country}</span>
                  <div className="text-right">
                    <div className="font-semibold">{data.visitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{data.percentage}% of total</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <CardDescription>Most visited pages with engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Page</th>
                  <th className="text-left py-3 px-4 font-medium">Visitors</th>
                  <th className="text-left py-3 px-4 font-medium">Bounce Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Avg. Duration</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTopPages.map((page, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{page.page}</td>
                    <td className="py-4 px-4">{page.visitors.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parseInt(page.bounceRate) > 40 
                          ? 'bg-red-100 text-red-800'
                          : parseInt(page.bounceRate) > 30
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {page.bounceRate}
                      </span>
                    </td>
                    <td className="py-4 px-4">{page.duration}</td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm">Analyze</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
            <CardDescription>30-day traffic overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Visitor trends chart</p>
                <p className="text-sm">Integration with analytics service required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey and conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>Conversion funnel visualization</p>
                <p className="text-sm">Integration with analytics service required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}