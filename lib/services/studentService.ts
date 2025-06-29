import { getDatabase } from "@/lib/mongodb"
import type { Student, CreateStudentData, ValidationScan } from "@/lib/models/Student"

export class StudentService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<Student>("students")
  }

  private static async getScansCollection() {
    const db = await getDatabase()
    return db.collection<ValidationScan>("validation_scans")
  }

  static generateUniqueId(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `FEST-${timestamp}-${random}`
  }

  static async createStudent(data: CreateStudentData): Promise<Student> {
    const collection = await this.getCollection()

    // Check if email already exists
    const existingStudent = await collection.findOne({ email: data.email })
    if (existingStudent) {
      throw new Error("Student with this email already exists")
    }

    const student: Student = {
      id: this.generateUniqueId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      college: data.college,
      role: data.role,
      registeredAt: new Date(),
      validated: false,
    }

    const result = await collection.insertOne(student)
    return { ...student, _id: result.insertedId }
  }

  static async getAllStudents(): Promise<Student[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ registeredAt: -1 }).toArray()
  }

  static async getStudentById(id: string): Promise<Student | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ id })
  }

  static async getStudentByEmail(email: string): Promise<Student | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ email })
  }

  static async validateStudent(
    studentId: string,
    method: "qr" | "manual" = "manual",
  ): Promise<{ success: boolean; student?: Student; message: string }> {
    const collection = await this.getCollection()
    const scansCollection = await this.getScansCollection()

    const student = await collection.findOne({ id: studentId })

    if (!student) {
      return {
        success: false,
        message: "Student ID not found in the system",
      }
    }

    if (student.validated) {
      return {
        success: false,
        student,
        message: "Student has already been validated",
      }
    }

    // Update student validation status
    const updatedStudent = await collection.findOneAndUpdate(
      { id: studentId },
      {
        $set: {
          validated: true,
          validatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    // Record the validation scan
    await scansCollection.insertOne({
      studentId,
      scannedAt: new Date(),
      method,
    })

    return {
      success: true,
      student: updatedStudent.value!,
      message: "Student validated successfully!",
    }
  }

  static async getRecentScans(limit = 10): Promise<(ValidationScan & { student: Student })[]> {
    const scansCollection = await this.getScansCollection()
    const collection = await this.getCollection()

    const recentScans = await scansCollection.find({}).sort({ scannedAt: -1 }).limit(limit).toArray()

    // Get student details for each scan
    const scansWithStudents = await Promise.all(
      recentScans.map(async (scan) => {
        const student = await collection.findOne({ id: scan.studentId })
        return { ...scan, student: student! }
      }),
    )

    return scansWithStudents.filter((scan) => scan.student) // Filter out any scans without valid students
  }

  static async getAnalytics() {
    const collection = await this.getCollection()

    const totalStudents = await collection.countDocuments()
    const validatedStudents = await collection.countDocuments({ validated: true })

    // Get role statistics
    const roleStats = await collection
      .aggregate([
        {
          $group: {
            _id: "$role",
            total: { $sum: 1 },
            validated: { $sum: { $cond: ["$validated", 1, 0] } },
          },
        },
        {
          $project: {
            role: "$_id",
            total: 1,
            validated: 1,
            percentage: {
              $cond: [{ $eq: ["$total", 0] }, 0, { $multiply: [{ $divide: ["$validated", "$total"] }, 100] }],
            },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray()

    // Get top colleges
    const topColleges = await collection
      .aggregate([
        {
          $group: {
            _id: "$college",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            college: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray()

    // Get recent registrations (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentRegistrations = await collection.countDocuments({
      registeredAt: { $gte: last24Hours },
    })

    return {
      totalStudents,
      validatedStudents,
      pendingStudents: totalStudents - validatedStudents,
      validationRate: totalStudents > 0 ? Math.round((validatedStudents / totalStudents) * 100) : 0,
      roleStats,
      topColleges,
      recentRegistrations,
    }
  }

  static async searchStudents(query: string, role?: string): Promise<Student[]> {
    const collection = await this.getCollection()

    const searchFilter: any = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { id: { $regex: query, $options: "i" } },
        { college: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }

    if (role && role !== "all") {
      searchFilter.role = role
    }

    return await collection.find(searchFilter).sort({ registeredAt: -1 }).toArray()
  }
}
