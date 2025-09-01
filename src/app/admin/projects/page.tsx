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
  Briefcase,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  PauseCircle
} from 'lucide-react';

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: 'E-commerce Website',
    client: 'Client XYZ',
    description: 'Full-stack e-commerce platform with payment integration',
    status: 'in-progress',
    progress: 65,
    deadline: '2024-02-15',
    budget: '€12,500',
    team: ['John Doe', 'Jane Smith'],
  },
  {
    id: 2,
    name: 'Corporate Branding',
    client: 'ABC Corporation',
    description: 'Complete brand identity and marketing materials',
    status: 'completed',
    progress: 100,
    deadline: '2024-01-20',
    budget: '€8,200',
    team: ['Mike Johnson'],
  },
  {
    id: 3,
    name: 'Mobile App Development',
    client: 'Tech Startup Inc.',
    description: 'iOS and Android fitness tracking application',
    status: 'on-hold',
    progress: 30,
    deadline: '2024-03-10',
    budget: '€18,000',
    team: ['Sarah Wilson', 'Tom Brown', 'Lisa Chen'],
  },
  {
    id: 4,
    name: 'SEO Optimization',
    client: 'Local Business',
    description: 'Search engine optimization for service-based business',
    status: 'in-progress',
    progress: 45,
    deadline: '2024-02-28',
    budget: '€3,500',
    team: ['David Lee'],
  },
];

const statusConfig = {
  'in-progress': { label: 'In Progress', color: 'blue', icon: Clock },
  'completed': { label: 'Completed', color: 'green', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'orange', icon: PauseCircle },
  'cancelled': { label: 'Cancelled', color: 'red', icon: AlertCircle },
};

export default function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600 mt-2">Track and manage all client projects</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: mockProjects.length, color: 'gray' },
          { 
            label: 'In Progress', 
            value: mockProjects.filter(p => p.status === 'in-progress').length,
            color: 'blue' 
          },
          { 
            label: 'Completed', 
            value: mockProjects.filter(p => p.status === 'completed').length,
            color: 'green' 
          },
          { 
            label: 'On Hold', 
            value: mockProjects.filter(p => p.status === 'on-hold').length,
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
                  <Briefcase className={`h-6 w-6 text-${stat.color}-600`} />
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
              placeholder="Search projects..."
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
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig];
          const StatusIcon = status?.icon || Clock;
          
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge 
                        variant={project.status as any}
                        className={`flex items-center space-x-1 ${
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status?.label}</span>
                      </Badge>
                    </div>
                    
                    <CardDescription className="mb-3">
                      {project.description}
                    </CardDescription>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{project.client}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {project.deadline}</span>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {project.budget}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Team members */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Team:</span>
                  <div className="flex -space-x-2">
                    {project.team.map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        title={member}
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No projects match your search criteria'
                : 'Get started by creating your first project'}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}