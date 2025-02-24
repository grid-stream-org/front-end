import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context'
import { auth } from '@/lib/firebase'

const AccountManagement: React.FC = () => {
  const { updateProfile } = useAuth()
  const user = auth.currentUser
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleProfileUpdate = async () => {
    if (!user) return
    setLoading(true)
    try {
      console.log(`${JSON.stringify(user.providerData[0].providerId)}`)
      await updateProfile({ displayName: displayName })
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
      //await updateEmail(user, email)
      toast.success('Email updated successfully!')
    } catch (error) {
      toast.error('Error updating email.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!user || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      //await updatePassword(user, newPassword)
      toast.success('Password updated successfully!')
      setNewPassword('')
    } catch (error) {
      toast.error('Error updating password.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    //await signOut(auth)
    window.location.href = '/login'
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Account Management</h1>

      <Card className="shadow-md bg-card">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={photoURL} alt={displayName} />
              <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Input
                placeholder="Display Name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
              <Input
                placeholder="Photo URL"
                value={photoURL}
                onChange={e => setPhotoURL(e.target.value)}
                className="mt-2"
              />
              <Button onClick={handleProfileUpdate} disabled={loading} className="mt-3">
                {loading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md bg-card">
        <CardHeader>
          <CardTitle>Update Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user!.providerData[0].providerId == 'google.com' ? (
            <h1>Signed in through Google</h1>
          ) : (
            <div>
              <Input
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button onClick={handleEmailUpdate} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Update Email'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md bg-card">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Button onClick={handlePasswordUpdate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </Button>
        </CardContent>
      </Card>

      <div className="text-right">
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default AccountManagement
