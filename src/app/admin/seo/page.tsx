'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart3,
  Search,
  TrendingUp,
  Eye,
  Users,
  Clock,
  Sparkles,
  Bot,
  FileText,
  Target
} from 'lucide-react';

// Mock SEO data
const mockSEOData = {
  overallScore: 87,
  keywords: 24,
  backlinks: 156,
  organicTraffic: 1240,
  rankingPages: 18,
};

const mockKeywordSuggestions = [
  {
    keyword: 'web development services',
    volume: 1200,
    difficulty: 'Medium',
    opportunity: 'High',
    cpc: '€12.50',
  },
  {
    keyword: 'ecommerce solutions',
    volume: 850,
    difficulty: 'High',
    opportunity: 'Medium',
    cpc: '€15.20',
  },
  {
    keyword: 'seo optimization company',
    volume: 680,
    difficulty: 'Medium',
    opportunity: 'High',
    cpc: '€18.75',
  },
  {
    keyword: 'mobile app development',
    volume: 950,
    difficulty: 'High',
    opportunity: 'Medium',
    cpc: '€14.30',
  },
];

const mockAISuggestions = [
  {
    type: 'meta_description',
    page: 'Homepage',
    suggestion: 'Optimize meta description to include primary keywords and call-to-action',
    impact: 'High',
  },
  {
    type: 'content',
    page: 'Services',
    suggestion: 'Add more detailed service descriptions with customer success stories',
    impact: 'Medium',
  },
  {
    type: 'technical',
    page: 'Site-wide',
    suggestion: 'Improve page load speed by optimizing images and enabling compression',
    impact: 'High',
  },
];

export default function SEODashboard() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI API call
    setTimeout(() => {
      setAiResponse(`Based on your prompt "${aiPrompt}", here are some SEO recommendations:\n\n1. **Keyword Optimization**: Consider targeting related long-tail keywords with lower competition.\n2. **Content Structure**: Create pillar content around this topic with internal linking.\n3. **User Intent**: Ensure the content matches search intent for better conversion rates.\n4. **Technical SEO**: Check page speed and mobile responsiveness for this content.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO & Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">AI-powered SEO insights and performance analytics</p>
      </div>

      {/* SEO Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'SEO Score',
            value: `${mockSEOData.overallScore}%`,
            icon: BarChart3,
            color: 'blue',
            change: '+3%',
          },
          {
            label: 'Keywords',
            value: mockSEOData.keywords,
            icon: Search,
            color: 'green',
            change: '+5',
          },
          {
            label: 'Backlinks',
            value: mockSEOData.backlinks,
            icon: TrendingUp,
            color: 'purple',
            change: '+12',
          },
          {
            label: 'Monthly Traffic',
            value: mockSEOData.organicTraffic.toLocaleString(),
            icon: Users,
            color: 'orange',
            change: '+8%',
          },
          {
            label: 'Ranking Pages',
            value: mockSEOData.rankingPages,
            icon: Target,
            color: 'red',
            change: '+2',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword Opportunities</CardTitle>
            <CardDescription>
              AI-suggested keywords with high potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockKeywordSuggestions.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{keyword.keyword}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Vol: {keyword.volume}/mo</span>
                      <span>CPC: {keyword.cpc}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          keyword.difficulty === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : keyword.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {keyword.difficulty}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Analyze</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>AI Optimization Suggestions</CardTitle>
            <CardDescription>
              Automated recommendations to improve SEO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAISuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-900">{suggestion.page}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          suggestion.impact === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {suggestion.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{suggestion.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Content Generator */}
      <Card>
        <CardHeader>
          <CardTitle>AI Content Assistant</CardTitle>
          <CardDescription>
            Generate SEO-optimized content using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Powered by OpenAI</span>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="Enter a topic or keyword for content generation..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full"
              />
              
              <Button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate SEO Content
                  </>
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">AI Suggestions:</span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Analytics</CardTitle>
            <CardDescription>Organic traffic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Traffic analytics chart</p>
                <p className="text-sm">Integration with analytics service required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Rankings</CardTitle>
            <CardDescription>Top performing keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Keyword ranking chart</p>
                <p className="text-sm">Integration with SEO tools required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}