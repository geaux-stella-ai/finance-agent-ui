'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { useToast } from '@/components/ui/use-toast'

export default function SignUpPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        company: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
            const { data } = await apiClient.post('/api/v1/users/register', formData)

            // Show success message
            toast({
                title: "Account created successfully",
                description: "Please sign in to continue",
            })

            // Redirect to sign in page
            router.push('/auth/signin')
        } catch (error) {
            console.error('Registration failed:', error)
            toast({
                title: "Registration failed",
                description: "Please try again",
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
                    <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <Label htmlFor="company">Company name</Label>
                            <Input
                                id="company"
                                name="company"
                                type="text"
                                value={formData.company}
                                onChange={handleChange}
                                className="mt-1"
                                placeholder="Enter your company name (optional)"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-brand text-white hover:bg-brand/90"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </div>
        </div>
    )
} 