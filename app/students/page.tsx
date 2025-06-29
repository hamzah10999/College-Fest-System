"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, QrCode, CheckCircle, XCircle } from "lucide-react"
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    // Load students from API
    fetchStudents()
  }, [])

  useEffect(() => {
    // Filter students based on search term and role
    fetchStudents()
  }, [searchTerm, roleFilter])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (roleFilter !== "all") params.append("role", roleFilter)

      const response = await fetch(`/api/students?${params}`)
      const data = await response.json()

      if (response.ok) {
        setStudents(data.students)
        setFilteredStudents(data.students)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registered Students</h1>
          <p className="text-gray-600">View all registered students and their QR codes</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, ID, or college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="judge">Judge</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <p className="text-sm text-gray-600">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{students.filter((s) => s.validated).length}</div>
              <p className="text-sm text-gray-600">Validated</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{students.filter((s) => !s.validated).length}</div>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{new Set(students.map((s) => s.role)).size}</div>
              <p className="text-sm text-gray-600">Unique Roles</p>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription className="font-mono text-sm">{student.id}</CardDescription>
                  </div>
                  {student.validated ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge className={getRoleBadgeColor(student.role)}>
                    {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">College:</span> {student.college}
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span> {student.email}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span> {student.phone}
                  </p>
                  <p>
                    <span className="text-gray-600">Registered:</span>{" "}
                    {new Date(student.registeredAt).toLocaleDateString()}
                  </p>
                </div>

                <Link href={`/students/${student.id}`}>
                  <Button className="w-full" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    View QR Code
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">No students found matching your criteria</p>
              <Link href="/register">
                <Button className="mt-4">Register New Student</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
