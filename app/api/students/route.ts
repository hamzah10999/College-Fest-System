import { type NextRequest, NextResponse } from "next/server"
import { StudentService } from "@/lib/services/studentService"
import type { CreateStudentData } from "@/lib/models/Student"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const role = searchParams.get("role")

    let students
    if (search) {
      students = await StudentService.searchStudents(search, role || undefined)
    } else if (role && role !== "all") {
      students = await StudentService.searchStudents("", role)
    } else {
      students = await StudentService.getAllStudents()
    }

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStudentData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.college || !body.role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["participant", "volunteer", "organizer", "judge", "sponsor"]
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const student = await StudentService.createStudent(body)
    return NextResponse.json({ student }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating student:", error)

    if (error.message === "Student with this email already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
