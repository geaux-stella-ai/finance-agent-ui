'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import apiClient from '@/lib/api-client'

export default function SignInPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)

            const response = await apiClient.post('/api/v1/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })

            if (response.status !== 200) {
                throw new Error('Invalid credentials')
            }

            localStorage.setItem('token', response.data.access_token)

            toast({
                title: "Success",
                description: "Successfully signed in",
            })

            router.push('/projects')
        } catch (error) {
            console.error('Sign in failed:', error)
            toast({
                title: "Error",
                description: "Invalid email or password",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background/80">
            <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{' '}
                        <Link href="/auth/signup" className="text-primary hover:underline">
                            create a new account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-brand text-white hover:bg-brand/90"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </div>
        </div>
    )
} 