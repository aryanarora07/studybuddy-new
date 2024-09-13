'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Change this import
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MessageCircle, Star } from "lucide-react";
import { Navbar } from './components-navbar';
import { VirtualStudyRoomComponent } from './virtual-study-room'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function PartnerDiscovery() {
  const router = useRouter() // Add this line
  const [studyPartners, setStudyPartners] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMajor, setSelectedMajor] = useState('all')
  // Remove the minRating state
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return // Add this line to prevent further execution
    }

    const fetchStudyPartners = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/study-partners', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStudyPartners(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching study partners:', error);
        setError('Failed to fetch study partners. Please try again later.');
        setLoading(false);
      }
    }

    fetchStudyPartners();
  }, [router]) // Add router to the dependency array

  const filteredPartners = studyPartners.filter(partner => 
    partner.user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedMajor === 'all' || partner.major === selectedMajor) &&
    (!onlineOnly || partner.isOnline)
  )

  const handleConnect = (partner) => {
    setSelectedPartner(partner)
  }

  return (
    <>
      {/* Only render the content if there's a token */}
      {localStorage.getItem('token') && (
        <>
          <Navbar />
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-6xl mx-auto space-y-8">
              <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Study Partners</h1>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <MessageCircle className="mr-2 h-4 w-4" /> My Connections
                </Button>
              </header>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Input
                        placeholder="Search by name or subject"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full" />
                    </div>
                    <div>
                      <Select onValueChange={setSelectedMajor} defaultValue="all"> 
                        <SelectTrigger>
                          <SelectValue placeholder="Select Major" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Majors</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="online-mode" checked={onlineOnly} onCheckedChange={setOnlineOnly} />
                      <label htmlFor="online-mode" className="text-sm font-medium">
                        Online Only
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartners.map(partner => (
                    <Card key={partner.id}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={partner.profilePicture || `/placeholder.svg?height=40&width=40`} alt={partner.user.name} />
                          <AvatarFallback>{partner.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{partner.user.name}</CardTitle>
                          <CardDescription>{partner.major}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {partner.subjects.map(subject => (
                            <Badge key={subject} variant="secondary">{subject}</Badge>
                          ))}
                        </div>
                        <div
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{partner.availability.join(', ')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{partner.location}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => handleConnect(partner)}
                            >
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Virtual Study Room with {partner.user.name}</DialogTitle>
                            </DialogHeader>
                            <VirtualStudyRoomComponent partnerName={partner.user.name} />
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Study Session Planner</CardTitle>
                  <CardDescription>Plan your upcoming study sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList>
                      <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                      <TabsTrigger value="past">Past Sessions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
                      <div className="space-y-4">
                        <div
                          className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-semibold">Algorithms Study Group</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">with Alice and Bob</p>
                            </div>
                          </div>
                          <Badge>Tomorrow, 3 PM</Badge>
                        </div>
                        <div
                          className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-semibold">Physics Problem Solving</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">with Carol</p>
                            </div>
                          </div>
                          <Badge>Friday, 5 PM</Badge>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="past">
                      <div className="space-y-4">
                        <div
                          className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-60">
                          <div className="flex items-center space-x-4">
                            <Calendar className="h-6 w-6 text-purple-600" />
                            <div>
                              <h3 className="font-semibold">Calculus Review</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">with David</p>
                            </div>
                          </div>
                          <Badge variant="outline">Last Week</Badge>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              {error && <div className="text-red-500">{error}</div>}
            </div>
          </div>
        </>
      )}
    </>
  );
}