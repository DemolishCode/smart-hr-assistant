"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, CheckCircle, AlertCircle, FileText } from "lucide-react"

interface ParsingResult {
  id: string
  candidate: {
    full_name: string
    email: string
    skills: string[]
    experience_years: number
  }
}

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ParsingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(10)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 500)

      const response = await apiClient.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      clearInterval(interval)
      setProgress(100)
      setResult(response.data)
      setFile(null)
      
    } catch (err: any) {
      console.error(err)
      setError("อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">วิเคราะห์ Resume</h1>
        <p className="text-muted-foreground mt-1">อัปโหลดไฟล์ Resume (PDF) เพื่อให้ AI ดึงข้อมูลและทักษะโดยอัตโนมัติ</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                อัปโหลดไฟล์
            </CardTitle>
            <CardDescription>รองรับไฟล์ PDF เท่านั้น</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
               <FileText className="h-10 w-10 text-muted-foreground" />
               <div className="text-center space-y-2">
                   <Label htmlFor="resume-upload" className="cursor-pointer text-primary hover:underline font-medium">
                       เลือกไฟล์
                   </Label>
                   <Input 
                        id="resume-upload" 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileChange}
                   />
                   <p className="text-sm text-muted-foreground">{file ? file.name : "ยังไม่ได้เลือกไฟล์"}</p>
               </div>
            </div>

            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>กำลังประมวลผลด้วย AI...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
            )}
            
            {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
              {isUploading ? "กำลังอัปโหลด..." : "เริ่มวิเคราะห์"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
            <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader>
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <CardTitle>วิเคราะห์สำเร็จ</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-muted-foreground">ชื่อ-นามสกุล</Label>
                        <p className="text-lg font-medium">{result.candidate.full_name || "ไม่พบข้อมูล"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">อีเมล</Label>
                        <p className="font-mono text-sm">{result.candidate.email || "ไม่พบข้อมูล"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">ประสบการณ์ทำงาน</Label>
                        <p>{result.candidate.experience_years} ปี (ประมาณการ)</p>
                    </div>
                     <div>
                        <Label className="text-muted-foreground mb-2 block">ทักษะที่พบ</Label>
                        <div className="flex flex-wrap gap-2">
                            {result.candidate.skills.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-background border rounded text-xs font-medium shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                     <div className="pt-4 border-t text-xs text-muted-foreground">
                        รหัสผลลัพธ์: {result.id}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
