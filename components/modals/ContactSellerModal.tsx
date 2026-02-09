import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'

interface ContactSellerModalProps {
  isOpen: boolean
  onClose: () => void
  sellerId?: string
  sellerEmail?: string
  listingTitle?: string
}

const ContactSellerModal = ({
  isOpen,
  onClose,
  sellerId,
  sellerEmail,
  listingTitle,
}: ContactSellerModalProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { data: meData } = useQuery(GET_ME, { skip: false })

  useEffect(() => {
    if (meData?.me) {
      const fullName = [meData.me.firstName, meData.me.lastName]
        .filter(Boolean)
        .join(' ')
      if (!name && fullName) setName(fullName)
      if (!name && meData.me.username && !fullName) setName(meData.me.username)
      if (!email && meData.me.email) setEmail(meData.me.email)
    }
    // update name/email if user data becomes available
  }, [meData, name, email])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // const userContext = useSelector((state: RootState) => state.userContext) // Not used

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sellerId && !sellerEmail) {
      setError('Seller information not available. Unable to send message.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const body: Record<string, string> = {
        subject: `Inquiry about your listing`,
        message: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        fromName: name,
      }

      if (listingTitle) body.listingTitle = listingTitle

      if (sellerId) body.sellerId = sellerId
      else if (sellerEmail) body.to = sellerEmail

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        },
      )

      if (!response.ok) throw new Error('Failed to send email')

      setSuccess('Message sent successfully!')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError('Failed to send message. Please try again. ' + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          {listingTitle && (
            <p className='text-sm text-gray-600'>
              Regarding: <strong>{listingTitle}</strong>
            </p>
          )}
          <div>
            <Label htmlFor='name'>Your Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='email'>Your Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          {success && <p className='text-green-500'>{success}</p>}
          {!sellerId && !sellerEmail && (
            <p className='text-yellow-600'>
              Seller information is not available right now.
            </p>
          )}
          <Button
            type='submit'
            variant={'contained'}
            color={'primary'}
            disabled={loading || (!sellerId && !sellerEmail)}
            className='w-full'
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactSellerModal
