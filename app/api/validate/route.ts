import { type NextRequest, NextResponse } from "next/server"
import { StudentService } from "@/lib/services/studentService"

export async function POST(request: NextRequest) {
  try {
    const { studentId, method = "manual" } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const result = await StudentService.validateStudent(studentId, method)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error validating student:", error)
    return NextResponse.json({ error: "Failed to validate student" }, { status: 500 })
  }
}
