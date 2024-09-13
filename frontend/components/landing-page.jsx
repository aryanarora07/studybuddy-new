'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Calendar, MessageCircle, Users, Bell, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LandingPageComponent() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const response = await fetch('http://localhost:4000/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()

        if (data.isLoggedIn) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setUser(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleAuthClick = () => {
    router.push('/auth')
  }

  const handlePartnerClick = (e) => {
    e.preventDefault()
    if (user) {
      router.push('/findpartner')
    } else {
      router.push('/auth')
    }
  }

  return (
    (<div className="flex flex-col min-h-screen">
      <nav
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">StudyBuddy</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/findpartner"
                  onClick={handlePartnerClick}
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Find Partners
                </a>
                <Link
                  href="/sessions"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Study Sessions
                </Link>
                <Link
                  href="/resources"
                  className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Resources
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isLoading ? (
                <div>Loading...</div>
              ) : user ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        <Avatar>
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign up / Sign in
                </Button>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white">
                  Find Your Perfect Study Partner
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Connect with like-minded students, schedule study sessions, and boost your academic performance with StudyBuddy.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Flexible Scheduling</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Find study partners based on your availability and preferences.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Users className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Smart Matching</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Get paired with students who share your academic interests and goals.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <MessageCircle className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">In-App Messaging</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">Communicate easily with your study partners through our built-in chat.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Create Your Profile</h3>
                <p className="text-gray-500 dark:text-gray-400">Sign up and tell us about your study habits, subjects, and availability.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Find Study Buddies</h3>
                <p className="text-gray-500 dark:text-gray-400">Browse potential study partners or let our algorithm match you.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Schedule Sessions</h3>
                <p className="text-gray-500 dark:text-gray-400">Set up study sessions and start collaborating to achieve your goals.</p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white">What Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">"StudyBuddy helped me find the perfect study partner for my chemistry class. My grades have improved significantly!"</p>
                  <p className="font-bold text-gray-900 dark:text-white">- Sarah J., Chemistry Major</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">"I love how easy it is to schedule study sessions. The app has made my college life so much more organized."</p>
                  <p className="font-bold text-gray-900 dark:text-white">- Mike T., Business Student</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 StudyBuddy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            href="#">
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>)
  );
}