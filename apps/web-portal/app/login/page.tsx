"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/useAuthStore"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowRight, Bot, CheckCircle2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    
    const formData = new URLSearchParams()
    formData.append('username', values.email)
    formData.append('password', values.password)

    try {
      const response = await apiClient.post("/auth/login", formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      const { access_token } = response.data
      await login(access_token)
      
      router.push("/dashboard")
      
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side - Hero/Info */}
      <div className="hidden lg:flex w-1/2 bg-sidebar text-sidebar-foreground p-12 flex-col justify-between border-r border-sidebar-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                    H
                </div>
                <span className="text-2xl font-bold tracking-tight">Smart HR</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
                Manage your workforce with <br/>
                <span className="text-primary">Artificial Intelligence</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
                Experience the next generation of HR management. Automated resume parsing, intelligent policy chat, and seamless employee data management.
            </p>
        </div>

        <div className="relative z-10 space-y-6">
            <FeatureItem text="AI-Powered Resume Analysis" />
            <FeatureItem text="Instant Policy Answers (RAG)" />
            <FeatureItem text="Secure Employee Database" />
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
            © 2024 Smart HR Assistant. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8">
            <ModeToggle />
        </div>

        <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Enter your credentials to access your account
                </p>
            </div>

            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    {/* <CardTitle className="text-2xl">Login</CardTitle> */}
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="name@example.com" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link href="#" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center">
                        {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
                        {isLoading ? "Authenticating..." : "Sign In"}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    </form>
                </Form>
                </CardContent>
                {/* <CardFooter className="flex justify-center border-t p-4">
                    <p className="text-xs text-muted-foreground">
                        Don't have an account? <Link href="#" className="underline text-primary">Contact Admin</Link>
                    </p>
                </CardFooter> */}
            </Card>

            <div className="text-center text-xs text-muted-foreground">
                <p>Default Admin: <strong>admin@example.com</strong> / <strong>1234</strong></p>
            </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="font-medium">{text}</span>
        </div>
    )
}
