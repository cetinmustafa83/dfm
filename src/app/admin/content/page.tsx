'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Globe,
  BookOpen
} from 'lucide-react';

// Mock data for content pages
const mockPages = [
  {
    id: 1,
    title: 'Homepage',
    slug: '/',
    description: 'Main landing page with company overview',
    status: 'published',
    lastUpdated: '2024-01-15',
  },
  {
    id: 2,
    title: 'About Us',
    slug: '/about',
    description: 'Company history and team information',
    status: 'published',
    lastUpdated: '2024-01-10',
  },
  {
    id: 3,
    title: 'Services',
    slug: '/services',
    description: 'Overview of services offered',
    status: 'draft',
    lastUpdated: '2024-01-12',
  },
  {
    id: 4,
    title: 'Contact',
    slug: '/contact',
    description: 'Contact information and form',
    status: 'published',
    lastUpdated: '2024-01-08',
  },
];

const mockServices = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Custom website development services',
    price: '€2,500',
    status: 'active',
  },
  {
    id: 2,
    name: 'SEO Optimization',
    description: 'Search engine optimization packages',
    price: '€1,200',
    status: 'active',
  },
  {
    id: 3,
    name: 'E-commerce Solutions',
    description: 'Online store development',
    price: '€3,800',
    status: 'inactive',
  },
];

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pages');

  const filteredPages = mockPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">Manage website pages, services, and SEO content</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pages', name: 'Pages', icon: FileText, count: mockPages.length },
            { id: 'services', name: 'Services', icon: Globe, count: mockServices.length },
            { id: 'seo', name: 'SEO Meta', icon: BookOpen, count: 0 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'pages' && filteredPages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    page.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status}
                  </span>
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
              <div className="text-sm text-gray-600">
                <p>Slug: {page.slug}</p>
                <p>Last updated: {page.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeTab === 'services' && filteredServices.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {service.price}
                  </span>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {activeTab === 'seo' && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Management</CardTitle>
              <CardDescription>
                Manage meta titles, descriptions, and Open Graph tags for all pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">SEO meta management coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  This section will include AI-powered meta tag generation and optimization
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty state */}
      {((activeTab === 'pages' && filteredPages.length === 0) ||
        (activeTab === 'services' && filteredServices.length === 0)) && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : 'Get started by creating your first content item'}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}