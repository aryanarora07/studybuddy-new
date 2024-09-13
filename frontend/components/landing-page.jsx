'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Users, BookOpen, MessageSquare, Moon, Sun } from "lucide-react";
import Link from "next/link"

export function LandingPageComponent() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    (<div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header
        className="px-4 lg:px-6 h-14 flex items-center border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <Link className="flex items-center justify-center" href="#">
          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">StudyBuddy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            href="#how-it-works">
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            href="#testimonials">
            Testimonials
          </Link>
          <Link
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            href="#faq">
            FAQ
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </Button>
        </nav>
      </header>
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
                  className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
                  Connect with like-minded students, schedule study sessions, and boost your academic performance with StudyBuddy.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                    type="email" />
                  <Button
                    type="submit"
                    className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
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
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center p-6">
                  <Calendar className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Flexible Scheduling</h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">Find study partners based on your availability and preferences.</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center p-6">
                  <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Smart Matching</h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">Get paired with students who share your academic interests and goals.</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="flex flex-col items-center p-6">
                  <MessageSquare className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">In-App Messaging</h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">Communicate easily with your study partners through our built-in chat.</p>
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
                  className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign up and tell us about your study habits, subjects, and availability.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Find Study Buddies</h3>
                <p className="text-gray-600 dark:text-gray-400">Browse potential study partners or let our algorithm match you.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Schedule Sessions</h3>
                <p className="text-gray-600 dark:text-gray-400">Set up study sessions and start collaborating to achieve your goals.</p>
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
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">"StudyBuddy helped me find the perfect study partner for my chemistry class. My grades have improved significantly!"</p>
                  <p className="font-bold text-gray-900 dark:text-white">- Sarah J., Chemistry Major</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">"I love how easy it is to schedule study sessions. The app has made my college life so much more organized."</p>
                  <p className="font-bold text-gray-900 dark:text-white">- Mike T., Business Student</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="text-gray-900 dark:text-white">Is StudyBuddy free to use?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  Yes, StudyBuddy is completely free for all students. We believe in making education accessible to everyone.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="text-gray-900 dark:text-white">How does the matching algorithm work?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  Our algorithm considers factors such as your subjects, study habits, availability, and learning goals to suggest the most compatible study partners.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="text-gray-900 dark:text-white">Can I use StudyBuddy for group study sessions?</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  StudyBuddy supports both one-on-one and group study sessions. You can create or join study groups for specific subjects or projects.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-purple-600 dark:bg-purple-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Boost Your Studies?
                </h2>
                <p
                  className="mx-auto max-w-[600px] md:text-xl text-purple-100 dark:text-purple-200">
                  Join StudyBuddy today and connect with motivated study partners to achieve your academic goals.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                    type="email" />
                  <Button
                    className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700"
                    type="submit">
                    Get Started
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <p className="text-xs text-gray-600 dark:text-gray-400">© 2023 StudyBuddy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400"
            href="#">
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400"
            href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>)
  );
}