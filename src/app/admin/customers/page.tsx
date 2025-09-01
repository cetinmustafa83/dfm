'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

// Mock data for customers
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    status: 'active',
    joinedDate: '2024-01-15',
    projects: 3,
    totalSpent: '€15,200',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Creative Agency LLC',
    status: 'active',
    joinedDate: '2024-01-10',
    projects: 2,
    totalSpent: '€8,700',
    lastActive: '1 day ago',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Startup Ventures',
    status: 'inactive',
    joinedDate: '2023-12-20',
    projects: 1,
    totalSpent: '€3,500',
    lastActive: '2 weeks ago',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Global Enterprises',
    status: 'active',
    joinedDate: '2024-01-05',
    projects: 4,
    totalSpent: '€22,100',
    lastActive: '5 hours ago',
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1 (555) 876-5432',
    company: 'Local Business Co.',
    status: 'pending',
    joinedDate: '2024-01-18',
    projects: 0,
    totalSpent: '€0',
    lastActive: 'Just now',
  },
];

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Active', color: 'green', icon: CheckCircle },
      inactive: { label: 'Inactive', color: 'gray', icon: XCircle },
      pending: { label: 'Pending', color: 'orange', icon: Calendar },
    };
    
    const { label, color, icon: Icon } = config[status as keyof typeof config] || config.inactive;
    
    return (
      <Badge 
        className={`flex items-center space-x-1 bg-${color}-100 text-${color}-800`}
      >
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-2">Manage all customer accounts and permissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: mockCustomers.length, color: 'gray' },
          { 
            label: 'Active', 
            value: mockCustomers.filter(c => c.status === 'active').length,
            color: 'green' 
          },
          { 
            label: 'Inactive', 
            value: mockCustomers.filter(c => c.status === 'inactive').length,
            color: 'gray' 
          },
          { 
            label: 'Pending', 
            value: mockCustomers.filter(c => c.status === 'pending').length,
            color: 'orange' 
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <Users className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-80">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customer(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Projects</th>
                  <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">Joined {customer.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{customer.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{customer.projects}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-green-600">{customer.totalSpent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{customer.lastActive}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'No customers match your search criteria'
                  : 'Get started by adding your first customer'}
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}