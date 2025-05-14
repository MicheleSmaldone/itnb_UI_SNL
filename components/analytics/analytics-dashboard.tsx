"use client"

import { useState } from "react"
import { 
  Download, 
  Users, 
  MessageSquare,
  PieChart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Add mock data for query categories
const queryCategoryData = [
  { category: 'Technology', value: 35, color: '#1e3fec' },
  { category: 'Marketing', value: 25, color: '#75a6ff' },
  { category: 'Research', value: 20, color: '#a3c7ff' },
  { category: 'Admin', value: 12, color: '#02133A' },
  { category: 'Leads/Clients', value: 8, color: '#1d34cc' }
]

// Mock data - replace with real data in production
const usageData = [
  { name: 'Mon', queries: 400, responses: 350 },
  { name: 'Tue', queries: 300, responses: 270 },
  { name: 'Wed', queries: 500, responses: 450 },
  { name: 'Thu', queries: 280, responses: 250 },
  { name: 'Fri', queries: 600, responses: 540 },
  { name: 'Sat', queries: 150, responses: 140 },
  { name: 'Sun', queries: 200, responses: 180 },
]

const responseTimeData = [
  { name: 'Mon', time: 1.2 },
  { name: 'Tue', time: 1.1 },
  { name: 'Wed', time: 1.4 },
  { name: 'Thu', time: 1.3 },
  { name: 'Fri', time: 1.5 },
  { name: 'Sat', time: 1.0 },
  { name: 'Sun', time: 1.2 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [showPieChart, setShowPieChart] = useState(true)

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting data in ${format} format`)
  }

  // Calculate max values for scaling
  const maxQueries = Math.max(...usageData.map(d => d.queries))
  const maxTime = Math.max(...responseTimeData.map(d => d.time))

  // Calculate total queries for percentage
  const totalQueries = queryCategoryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-full overflow-y-auto bg-white rounded-xl border border-gray-200">
      <div className="min-w-[768px] p-6 space-y-6">
        {/* Fixed Header with Export Options */}
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Analytics Dashboard</h2>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#75a6ff] hover:bg-[#1e3fec]/10 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#75a6ff] hover:bg-[#1e3fec]/10 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              Export Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#75a6ff] hover:bg-[#1e3fec]/10 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#1e3fec]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
              <CardTitle className="text-sm font-medium text-gray-500">Total Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#1e3fec]" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-gray-900">23,456</div>
              <p className="text-xs text-gray-500">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Query Categories Pie Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-white">
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#1e3fec]" />
                  Query Categories
                </CardTitle>
                <button
                  onClick={() => setShowPieChart(!showPieChart)}
                  className="text-sm text-[#75a6ff] hover:text-[#1e3fec] transition-colors"
                >
                  {showPieChart ? 'Show List' : 'Show Chart'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              {showPieChart ? (
                <div className="flex items-start">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {queryCategoryData.reduce((elements, item, index, array) => {
                        const percentage = (item.value / totalQueries) * 100
                        const previousPercentages = array
                          .slice(0, index)
                          .reduce((sum, prev) => sum + (prev.value / totalQueries) * 100, 0)
                        
                        // Calculate the SVG arc path
                        const startAngle = (previousPercentages / 100) * Math.PI * 2
                        const endAngle = ((previousPercentages + percentage) / 100) * Math.PI * 2
                        
                        const x1 = 50 + 40 * Math.cos(startAngle)
                        const y1 = 50 + 40 * Math.sin(startAngle)
                        const x2 = 50 + 40 * Math.cos(endAngle)
                        const y2 = 50 + 40 * Math.sin(endAngle)
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0
                        
                        const pathData = `
                          M 50 50
                          L ${x1} ${y1}
                          A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                          Z
                        `
                        
                        elements.push(
                          <path
                            key={item.category}
                            d={pathData}
                            fill={item.color}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        )
                        
                        return elements
                      }, [] as JSX.Element[])}
                    </svg>
                  </div>
                  
                  <div className="ml-6 flex-1 grid grid-cols-1 gap-3">
                    {queryCategoryData.map((item) => (
                      <div key={item.category} className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {item.category}
                          <span className="ml-1 text-gray-400">
                            ({Math.round((item.value / totalQueries) * 100)}%)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {queryCategoryData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {item.value} queries
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((item.value / totalQueries) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Metrics */}
          <Card className="bg-white">
            <CardHeader className="bg-white">
              <CardTitle>Usage Metrics</CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-2">
                {usageData.map((data, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{data.name}</span>
                      <span className="text-gray-900">{data.queries} queries</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-[#1e3fec]"
                        style={{ width: `${(data.queries / maxQueries) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 