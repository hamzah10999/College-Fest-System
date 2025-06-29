import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, QrCode, Shield, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">College Fest Token System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automated student registration and validation system with unique QR codes for seamless fest management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Register</CardTitle>
              <CardDescription>Sign up for the fest and get your unique token</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full">Register Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <QrCode className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>QR Codes</CardTitle>
              <CardDescription>View and download your QR code for entry</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/students">
                <Button variant="outline" className="w-full bg-transparent">
                  View Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Validate</CardTitle>
              <CardDescription>Scan QR codes to validate student entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/validate">
                <Button variant="outline" className="w-full bg-transparent">
                  Validate Entry
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View registration and validation statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analytics">
                <Button variant="outline" className="w-full bg-transparent">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Fill out the registration form with your details and select your role in the fest
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get QR Code</h3>
              <p className="text-gray-600">Receive a unique QR code containing your student ID and role information</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Validate Entry</h3>
              <p className="text-gray-600">Show your QR code at the entrance for quick validation and entry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
