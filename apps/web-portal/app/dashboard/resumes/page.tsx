"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react"

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
    setProgress(10) // Start fake progress
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate progress ticks
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 500)

      const response = await apiClient.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      clearInterval(interval)
      setProgress(100)
      setResult(response.data)
      setFile(null) // Reset file
      
    } catch (err: any) {
      console.error(err)
      setError("Failed to upload/parse resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Resume Parsing</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume (PDF)</CardTitle>
            <CardDescription>AI will extract candidate info and skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed rounded-lg p-8 bg-gray-50/50 hover:bg-gray-50 transition-colors">
               <UploadCloud className="h-10 w-10 text-muted-foreground" />
               <div className="text-center space-y-2">
                   <Label htmlFor="resume-upload" className="cursor-pointer text-blue-600 hover:underline">
                       Choose File
                   </Label>
                   <Input 
                        id="resume-upload" 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileChange}
                   />
                   <p className="text-sm text-gray-500">{file ? file.name : "No file selected"}</p>
               </div>
            </div>

            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processing with AI...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
            )}
            
            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
              {isUploading ? "Uploading..." : "Start Parsing"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
            <Card className="border-green-200 bg-green-50/30">
                <CardHeader>
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <CardTitle>Extraction Complete</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        <p className="text-lg font-medium">{result.candidate.full_name || "N/A"}</p>
                    </div>
                    <div>
                        <Label>Email</Label>
                        <p className="font-mono text-sm">{result.candidate.email || "N/A"}</p>
                    </div>
                    <div>
                        <Label>Experience</Label>
                        <p>{result.candidate.experience_years} Years (Estimated)</p>
                    </div>
                     <div>
                        <Label className="mb-2 block">Detected Skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {result.candidate.skills.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-white border rounded text-xs font-medium shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                     <div className="pt-4 border-t text-xs text-gray-400">
                        Result ID: {result.id}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
