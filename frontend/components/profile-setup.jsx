'use client';
import { useState, useEffect } from 'react'
import { Navbar } from './components-navbar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function ProfileSetup() {
  const [name, setName] = useState('')
  const [major, setMajor] = useState('')
  const [subjects, setSubjects] = useState([])
  const [customSubject, setCustomSubject] = useState('')
  const [availability, setAvailability] = useState([])
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [studyPreference, setStudyPreference] = useState('both')
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [profilePicture, setProfilePicture] = useState(null)
  const [progress, setProgress] = useState(0)
  const [userId, setUserId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && token) {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId, token);
    }
  }, [router]);

  const fetchUserProfile = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const profileData = response.data.profile;
      if (profileData) {
        setName(profileData.user.name || '');
        setMajor(profileData.major || '');
        setSubjects(profileData.subjects || []);
        setAvailability(profileData.availability || []);
        setLocation(profileData.location || '');
        setBio(profileData.bio || '');
        setStudyPreference(profileData.studyPreference || 'both');
        setProfileVisibility(profileData.profileVisibility);
        setProfilePicture(profileData.profilePicture || null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    calculateProgress()
  }, [name, major, subjects, availability, location, bio, studyPreference, profilePicture])

  const calculateProgress = () => {
    let completedFields = 0
    const totalFields = 8 // Total number of main fields

    if (name) completedFields++
    if (major) completedFields++
    if (subjects.length > 0) completedFields++
    if (availability.length > 0) completedFields++
    if (location) completedFields++
    if (bio) completedFields++
    if (studyPreference) completedFields++
    if (profilePicture) completedFields++

    setProgress((completedFields / totalFields) * 100)
  }

  const handleSubjectToggle = (subject) => {
    setSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject])
  }

  const handleAvailabilityToggle = (time) => {
    setAvailability(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time])
  }

  const handleAddCustomSubject = () => {
    if (customSubject && !subjects.includes(customSubject)) {
      setSubjects(prev => [...prev, customSubject])
      setCustomSubject('')
    }
  }

  const handleRemoveSubject = (subject) => {
    setSubjects(prev => prev.filter(s => s !== subject))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/profile/update', {
        userId,
        name,
        major,
        subjects,
        availability,
        location,
        bio,
        studyPreference,
        profileVisibility,
        profilePicture,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      router.push('/findpartner');
      console.log('Profile updated successfully');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

  return (
    <>
      {/* Only render the content if there's a token */}
      {localStorage.getItem('token') && (
        <>
          <Navbar />
          <div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Complete Your StudyBuddy Profile</CardTitle>
                <CardDescription className="text-center">Help us match you with the perfect study partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label>Profile Completion</Label>
                  <Progress value={progress} className="w-full mt-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{Math.round(progress)}% complete</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-picture">Profile Picture</Label>
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={profilePicture || undefined} alt="Profile picture" />
                            <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <Input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="max-w-[200px]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Select value={major} onValueChange={setMajor}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your major" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Subjects You Can Help With</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Programming', 'Calculus', 'Statistics', 'Physics', 'Chemistry', 'Biology'].map(subject => (
                            <div key={subject} className="flex items-center space-x-2">
                              <Checkbox
                                id={subject}
                                checked={subjects.includes(subject)}
                                onCheckedChange={() => handleSubjectToggle(subject)} />
                              <label
                                htmlFor={subject}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{subject}</label>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {subjects.map(subject => (
                            <Badge key={subject} variant="secondary" className="px-2 py-1">
                              {subject}
                              <button
                                onClick={() => handleRemoveSubject(subject)}
                                className="ml-2 text-gray-500 hover:text-gray-700">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Input
                            placeholder="Add custom subject"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)} />
                          <Button type="button" onClick={handleAddCustomSubject}>Add</Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Mornings', 'Afternoons', 'Evenings', 'Weekends'].map(time => (
                            <div key={time} className="flex items-center space-x-2">
                              <Checkbox
                                id={time}
                                checked={availability.includes(time)}
                                onCheckedChange={() => handleAvailabilityToggle(time)} />
                              <label
                                htmlFor={time}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{time}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, State" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us a bit about yourself and your study goals" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Study Preference</Label>
                      <RadioGroup
                        value={studyPreference}
                        onValueChange={setStudyPreference}
                        className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-person" id="in-person" />
                          <Label htmlFor="in-person">In-person</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both">Both</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="profile-visibility"
                        checked={profileVisibility}
                        onCheckedChange={setProfileVisibility} />
                      <Label htmlFor="profile-visibility">Make my profile visible to other students</Label>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                      Complete Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}