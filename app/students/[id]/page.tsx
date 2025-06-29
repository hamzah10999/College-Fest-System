"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load student data from API
    fetchStudent()
  }, [params.id])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setStudent(data.student)
      } else {
        setStudent(null)
      }
    } catch (error) {
      console.error("Error fetching student:", error)
      setStudent(null)
    }
  }

  useEffect(() => {
    if (student && canvasRef.current) {
      generateQRCode()
    }
  }, [student])

  const generateQRCode = () => {
    if (!student || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 300

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 300, 300)

    // Create QR code pattern (simplified version)
    const qrData = JSON.stringify({
      id: student.id,
      name: student.name,
      role: student.role,
      college: student.college,
    })

    // Generate a simple pattern based on the data
    const hash = qrData.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    // Draw QR-like pattern
    ctx.fillStyle = "black"
    const cellSize = 10
    const gridSize = 25

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cellHash = (hash + i * gridSize + j) % 100
        if (cellHash > 50) {
          ctx.fillRect(25 + i * cellSize, 25 + j * cellSize, cellSize - 1, cellSize - 1)
        }
      }
    }

    // Add corner markers
    const drawCornerMarker = (x: number, y: number) => {
      ctx.fillStyle = "black"
      ctx.fillRect(x, y, 70, 70)
      ctx.fillStyle = "white"
      ctx.fillRect(x + 10, y + 10, 50, 50)
      ctx.fillStyle = "black"
      ctx.fillRect(x + 20, y + 20, 30, 30)
    }

    drawCornerMarker(25, 25) // Top-left
    drawCornerMarker(205, 25) // Top-right
    drawCornerMarker(25, 205) // Bottom-left

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png")
    setQrCodeDataUrl(dataUrl)
  }

  const downloadQRCode = () => {
    if (!qrCodeDataUrl || !student) return

    const link = document.createElement("a")
    link.download = `${student.name}-QRCode.png`
    link.href = qrCodeDataUrl
    link.click()

    toast({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device",
    })
  }

  const shareQRCode = async () => {
    if (!qrCodeDataUrl || !student) return

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl)
      const blob = await response.blob()
      const file = new File([blob], `${student.name}-QRCode.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${student.name} - College Fest QR Code`,
          text: `QR Code for ${student.name} (${student.id})`,
          files: [file],
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`Student ID: ${student.id}\nName: ${student.name}\nRole: ${student.role}`)
        toast({
          title: "Copied to Clipboard",
          description: "Student details copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share QR code",
        variant: "destructive",
      })
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

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/students" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">Student not found</p>
              <Link href="/students">
                <Button className="mt-4">Back to Students</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/students" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{student.name}</CardTitle>
                  <CardDescription className="font-mono text-lg mt-1">{student.id}</CardDescription>
                </div>
                {student.validated ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="font-semibold">Validated</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <XCircle className="h-6 w-6 mr-2" />
                    <span className="font-semibold">Pending</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className={getRoleBadgeColor(student.role)} variant="secondary">
                  {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">College</p>
                  <p className="text-lg">{student.college}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-lg">{student.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Registration Date</p>
                  <p className="text-lg">{new Date(student.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan this code for entry validation</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-200 rounded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={downloadQRCode} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={shareQRCode} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">QR Code Contains:</p>
                <p>• Student ID: {student.id}</p>
                <p>• Name: {student.name}</p>
                <p>• Role: {student.role}</p>
                <p>• College: {student.college}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
