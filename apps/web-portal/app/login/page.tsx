"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/useAuthStore"

// Define Schema
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
    
    // NOTE: In the backend, we use OAuth2PasswordRequestForm which expects 'username' and 'password' form-data
    // So we need to encode it as form-data or adjust the call.
    // The previous test script sent 'username' in body. Let's see how our backend auth.py handles it.
    // auth.py: login_access_token(form_data: OAuth2PasswordRequestForm = Depends())
    // This expects x-www-form-urlencoded data with 'username' and 'password'.
    
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
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Smart HR Assistant</CardTitle>
          <CardDescription className="text-center">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="text-sm text-red-500 text-center font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
