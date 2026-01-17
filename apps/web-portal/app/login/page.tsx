"use client"

export const dynamic = 'force-dynamic'

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
import { Card, CardContent } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/useAuthStore"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const formSchema = z.object({
    email: z.string().email({ message: t.login.loginFailed }),
    password: z.string().min(1, t.login.loginFailed),
  })

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
      setError(err.response?.data?.detail || t.login.loginFailed)
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
                <span className="text-2xl font-bold tracking-tight">{t.common.appName}</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
                {t.login.heroTitle} <br/>
                <span className="text-primary">{t.login.heroHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
                {t.login.heroDescription}
            </p>
        </div>

        <div className="relative z-10 space-y-6">
            <FeatureItem text={t.login.features.resume} />
            <FeatureItem text={t.login.features.policy} />
            <FeatureItem text={t.login.features.secure} />
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
            {t.landing.footer}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8 flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
        </div>

        <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight">{t.login.welcomeBack}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    {t.login.enterCredentials}
                </p>
            </div>

            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.login.email}</FormLabel>
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
                                <FormLabel>{t.login.password}</FormLabel>
                                <Link href="#" className="text-xs text-primary hover:underline">
                                    {t.login.forgotPassword}
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
                        {isLoading ? t.login.authenticating : t.login.signIn}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
                <p>{t.login.sampleAccount}: <strong>admin@example.com</strong> / <strong>1234</strong></p>
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
