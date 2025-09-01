'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Briefcase, FileText, TrendingUp, Activity } from 'lucide-react';

const stats = [
  {
    title: 'Total Projects',
    value: '24',
    description: '+12% from last month',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    title: 'Active Customers',
    value: '156',
    description: '+8% from last month',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Content Pages',
    value: '42',
    description: '+5% from last month',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    title: 'SEO Score',
    value: '87%',
    description: '+3% from last week',
    icon: BarChart3,
    color: 'bg-orange-500',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'project',
    title: 'New project created',
    description: 'E-commerce website for Client XYZ',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'customer',
    title: 'Customer registered',
    description: 'John Doe signed up for services',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'content',
    title: 'Page updated',
    description: 'Homepage SEO meta updated',
    time: '6 hours ago',
  },
  {
    id: 4,
    type: 'seo',
    title: 'SEO report generated',
    description: 'Monthly performance analysis complete',
    time: '1 day ago',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Briefcase className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-900">New Project</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-900">Add Customer</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <FileText className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-900">Create Page</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-orange-900">SEO Report</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Website traffic and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Analytics chart will be displayed here</p>
              <p className="text-sm">Integration with analytics service required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}