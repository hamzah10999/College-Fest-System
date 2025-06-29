"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  college: string
  role: string
  registeredAt: string
  validated: boolean
}

interface RoleStats {
  role: string
  total: number
  validated: number
  percentage: number
}

export default function AnalyticsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [roleStats, setRoleStats] = useState<RoleStats[]>([])

  // Add these state variables at the top of the component
  const [totalStudents, setTotalStudents] = useState(0)
  const [validatedStudents, setValidatedStudents] = useState(0)
  const [pendingStudents, setPendingStudents] = useState(0)
  const [validationRate, setValidationRate] = useState(0)
  const [topColleges, setTopColleges] = useState<{ college: string; count: number }[]>([])
  const [recentRegistrations, setRecentRegistrations] = useState(0)

  useEffect(() => {
    // Load analytics from API
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()

      if (response.ok) {
        const { analytics } = data
        setStudents([]) // We don't need individual students for analytics
        setRoleStats(
          analytics.roleStats.map((stat: any) => ({
            role: stat.role,
            total: stat.total,
            validated: stat.validated,
            percentage: Math.round(stat.percentage),
          })),
        )

        // Set other analytics data
        setTotalStudents(analytics.totalStudents)
        setValidatedStudents(analytics.validatedStudents)
        setPendingStudents(analytics.pendingStudents)
        setValidationRate(analytics.validationRate)
        setTopColleges(analytics.topColleges)
        setRecentRegistrations(analytics.recentRegistrations)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      participant: "bg-blue-100 text-blue-800",
      volunteer: "bg-green-100 text-green-800",
      organizer: "bg-purple-100 text-purple-800",
      judge: "bg-orange-100 text-orange-800",
      sponsor: "bg-red-100 text-red-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Update the helper functions to use state instead of calculating from students array
  const getRecentRegistrations = () => recentRegistrations
  const getTopColleges = () => topColleges

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Registration and validation statistics for the college fest</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-sm text-gray-600">Total Registrations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validatedStudents}</p>
                  <p className="text-sm text-gray-600">Validated Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{pendingStudents}</p>
                  <p className="text-sm text-gray-600">Pending Validation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validationRate}%</p>
                  <p className="text-sm text-gray-600">Validation Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Role Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Registration by Role</CardTitle>
              <CardDescription>Breakdown of students by their roles in the fest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleStats.map((stat) => (
                  <div key={stat.role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(stat.role)} variant="secondary">
                          {stat.role.charAt(0).toUpperCase() + stat.role.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {stat.validated}/{stat.total} validated
                        </span>
                      </div>
                      <span className="text-sm font-medium">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {roleStats.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No registration data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Colleges */}
          <Card>
            <CardHeader>
              <CardTitle>Top Colleges</CardTitle>
              <CardDescription>Colleges with the most registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTopColleges().map((college, index) => (
                  <div key={college.college} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{college.college}</p>
                        <p className="text-sm text-gray-600">{college.count} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{college.count}</p>
                    </div>
                  </div>
                ))}
                {getTopColleges().length === 0 && (
                  <p className="text-gray-500 text-center py-4">No college data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Registration activity in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">{getRecentRegistrations()}</div>
                <p className="text-gray-600">New registrations in the last 24 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Validation Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Validation Progress</CardTitle>
              <CardDescription>Overall validation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {validatedStudents} of {totalStudents}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${validationRate}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{validationRate}%</p>
                  <p className="text-sm text-gray-600">Validation Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
