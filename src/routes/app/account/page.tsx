import { Loader2, User, Mail, Lock, Phone } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import { PageTitle } from '@/components'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { validatePhoneNum } from '@/lib'

const AccountManagement = () => {
  const { user, updateUserPassword, updateProfile, isGoogleSignIn } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const photoURL = user?.photoURL ?? ''
  const [loading, setLoading] = useState(false)
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPhoneNum, setPhoneNum] = useState(user?.phoneNumber ?? '')
  const location = useLocation()

  const handleProfileUpdate = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = validatePhoneNum(newPhoneNum)
      if (!res.isValid) {
        toast.error('Please enter valid phone number')
        return
      }

      await updateProfile({ displayName: displayName, phoneNumber: newPhoneNum })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleEmailUpdate = async () => {
    if (!user) return
    setLoading(true)
    try {
      await updateProfile({ email: email })
      toast.success('Email updated successfully!')
    } catch (error) {
      toast.error('Error updating email.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!user || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await updateUserPassword(currPassword, newPassword)
      toast.success('Password updated successfully!')
      setNewPassword('')
    } catch (error) {
      toast.error('Error updating password.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />

      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="text-primary" />
            <CardTitle>Profile Details</CardTitle>
          </div>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <Avatar className="h-16 w-16 mb-4">
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="displayName" className="text-sm font-medium mb-1 block">
                  Display Name
                </label>
                <div className="flex items-center max-w-md">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="displayName"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="text-sm font-medium mb-1 block">
                  Phone Number
                </label>
                <div className="flex items-center max-w-md">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    placeholder="Phone Number"
                    value={newPhoneNum}
                    onChange={e => setPhoneNum(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleProfileUpdate} disabled={loading} className="mt-2">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Email Address</CardTitle>
          </div>
          <CardDescription>Change your email address</CardDescription>
        </CardHeader>
        <CardContent>
          {isGoogleSignIn ? (
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-muted-foreground">Your email is managed through Google</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1 block">
                  Email Address
                </label>
                <div className="flex items-center max-w-md">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleEmailUpdate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          {isGoogleSignIn ? (
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-muted-foreground">Your password is managed through Google</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="text-sm font-medium mb-1 block">
                  Current Password
                </label>
                <div className="max-w-md">
                  <Input
                    id="currentPassword"
                    placeholder="Current Password"
                    type="password"
                    value={currPassword}
                    onChange={e => setCurrPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium mb-1 block">
                  New Password
                </label>
                <div className="max-w-md">
                  <Input
                    id="newPassword"
                    placeholder="New Password (min. 8 characters)"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handlePasswordUpdate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Password
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default AccountManagement
