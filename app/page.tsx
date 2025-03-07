"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Copy, Check, MessageSquare, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import { generateResponse, generateIcebreaker } from "@/app/actions"

export default function RizzCoach() {
  const [chatHistory, setChatHistory] = useState("")
  const [tone, setTone] = useState("Confident")
  const [datingApp, setDatingApp] = useState("Tinder")
  const [response, setResponse] = useState("")
  const [responseError, setResponseError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [profileDetails, setProfileDetails] = useState("")
  const [icebreakerTone, setIcebreakerTone] = useState("Playful")
  const [icebreakerDatingApp, setIcebreakerDatingApp] = useState("Tinder")
  const [icebreaker, setIcebreaker] = useState("")
  const [icebreakerError, setIcebreakerError] = useState("")
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(false)
  const [icebreakerCopied, setIcebreakerCopied] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isApiKeyValid, setIsApiKeyValid] = useState(true)

  // Load usage count from localStorage on component mount
  useEffect(() => {
    const storedCount = localStorage.getItem("rizzUsageCount")
    if (storedCount) {
      setUsageCount(Number.parseInt(storedCount, 10))
    }
  }, [])

  // Save usage count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rizzUsageCount", usageCount.toString())
  }, [usageCount])

  const handleSubmit = async () => {
    setIsGenerating(true)
    setResponseError("")
    try {
      const result = await generateResponse(chatHistory, tone, datingApp)
      if (result.success && result.text) {
        setResponse(result.text)
        setUsageCount((prev) => prev + 1)
        setIsApiKeyValid(true)
      } else {
        setResponseError(result.error || "Failed to generate response")
        if (result.error?.includes("API key")) {
          setIsApiKeyValid(false)
        }
      }
    } catch (error: any) {
      console.error("Error generating response:", error)
      setResponseError(error.message || "An unexpected error occurred")
      if (error.message?.includes("API key")) {
        setIsApiKeyValid(false)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleIcebreakerSubmit = async () => {
    setIsGeneratingIcebreaker(true)
    setIcebreakerError("")
    try {
      const result = await generateIcebreaker(profileDetails, icebreakerTone, icebreakerDatingApp)
      if (result.success && result.text) {
        setIcebreaker(result.text)
        setUsageCount((prev) => prev + 1)
        setIsApiKeyValid(true)
      } else {
        setIcebreakerError(result.error || "Failed to generate icebreaker")
        if (result.error?.includes("API key")) {
          setIsApiKeyValid(false)
        }
      }
    } catch (error: any) {
      console.error("Error generating icebreaker:", error)
      setIcebreakerError(error.message || "An unexpected error occurred")
      if (error.message?.includes("API key")) {
        setIsApiKeyValid(false)
      }
    } finally {
      setIsGeneratingIcebreaker(false)
    }
  }

  const copyIcebreakerToClipboard = () => {
    navigator.clipboard.writeText(icebreaker)
    setIcebreakerCopied(true)
    setTimeout(() => setIcebreakerCopied(false), 2000)
  }

  const resetUsageCount = () => {
    setUsageCount(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">AI Rizz Coach 💘</h1>
          <p className="text-gray-600">Flirt Smarter. Impress Faster. Get AI-Generated Dating Responses in Seconds!</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Powered by Google Gemini
          </div>
        </header>

        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            You've generated <span className="font-semibold text-purple-700">{usageCount}</span> responses today
            {usageCount >= 5 && (
              <span className="ml-2 text-pink-600">• Consider upgrading to Premium for unlimited responses</span>
            )}
            <button
              onClick={resetUsageCount}
              className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
              aria-label="Reset usage count"
            >
              Reset
            </button>
          </p>
        </div>

        {!isApiKeyValid && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700">API Key Issue</AlertTitle>
            <AlertDescription className="text-amber-600">
              There seems to be an issue with your Google Generative AI API key. Please check that it's correctly set up
              in your environment variables.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat Response</TabsTrigger>
            <TabsTrigger value="icebreaker">Icebreaker Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="border-purple-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <MessageSquare className="h-5 w-5" />
                  Chat Response Generator
                </CardTitle>
                <CardDescription>Paste your conversation and get the perfect flirty reply</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {responseError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{responseError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dating-app">Dating App</Label>
                  <Select value={datingApp} onValueChange={setDatingApp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dating app" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tinder">Tinder</SelectItem>
                      <SelectItem value="Bumble">Bumble</SelectItem>
                      <SelectItem value="Hinge">Hinge</SelectItem>
                      <SelectItem value="OkCupid">OkCupid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Response Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confident">Confident</SelectItem>
                      <SelectItem value="Funny">Funny</SelectItem>
                      <SelectItem value="Mysterious">Mysterious</SelectItem>
                      <SelectItem value="Playful">Playful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chat-history">Conversation History</Label>
                  <Textarea
                    id="chat-history"
                    placeholder="Paste your conversation here... (e.g. Them: Hey, I see you love hiking! Any favorite trails?)"
                    className="min-h-[150px]"
                    value={chatHistory}
                    onChange={(e) => setChatHistory(e.target.value)}
                  />
                </div>

                {response && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        {tone} Response
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-800">{response}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleSubmit}
                  disabled={isGenerating || !chatHistory.trim()}
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Rizz Response
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="icebreaker">
            <Card className="border-purple-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <MessageSquare className="h-5 w-5" />
                  Icebreaker Generator
                </CardTitle>
                <CardDescription>Generate a unique opener based on profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {icebreakerError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{icebreakerError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="profile-details">Profile Details</Label>
                  <Textarea
                    id="profile-details"
                    placeholder="Enter details from their profile (e.g. Loves hiking, has a dog named Max, works as a teacher)"
                    className="min-h-[150px]"
                    value={profileDetails}
                    onChange={(e) => setProfileDetails(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dating-app-icebreaker">Dating App</Label>
                    <Select value={icebreakerDatingApp} onValueChange={setIcebreakerDatingApp}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dating app" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tinder">Tinder</SelectItem>
                        <SelectItem value="Bumble">Bumble</SelectItem>
                        <SelectItem value="Hinge">Hinge</SelectItem>
                        <SelectItem value="OkCupid">OkCupid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone-icebreaker">Tone</Label>
                    <Select value={icebreakerTone} onValueChange={setIcebreakerTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confident">Confident</SelectItem>
                        <SelectItem value="Funny">Funny</SelectItem>
                        <SelectItem value="Mysterious">Mysterious</SelectItem>
                        <SelectItem value="Playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {icebreaker && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        {icebreakerTone} Icebreaker
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={copyIcebreakerToClipboard} className="h-8 w-8 p-0">
                        {icebreakerCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-800">{icebreaker}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleIcebreakerSubmit}
                  disabled={isGeneratingIcebreaker || !profileDetails.trim()}
                >
                  {isGeneratingIcebreaker ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Icebreaker
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">🔥 Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h3 className="font-medium text-purple-700">AI-Powered Suggestions</h3>
              <p className="text-sm text-gray-600">Get the perfect reply instantly</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h3 className="font-medium text-purple-700">Multiple Flirty Styles</h3>
              <p className="text-sm text-gray-600">Choose from 4 different tones</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h3 className="font-medium text-purple-700">No Sign-up Required</h3>
              <p className="text-sm text-gray-600">Just paste chat & get a response</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">💎 Premium Features</h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg shadow-sm border border-purple-200">
            <h3 className="font-medium text-purple-800 text-lg mb-2">Upgrade to Premium</h3>
            <p className="text-gray-700 mb-4">Get unlimited AI-generated responses, voice messages, and more!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-purple-700">Unlimited Messages</h4>
                <p className="text-sm text-gray-600">No daily limits</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-purple-700">Voice Messages</h4>
                <p className="text-sm text-gray-600">AI-generated audio flirting</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="font-medium text-purple-700">Priority Support</h4>
                <p className="text-sm text-gray-600">Get help when you need it</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Upgrade for $5/month
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

