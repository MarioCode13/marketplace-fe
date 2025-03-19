'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const ContactSellerModal = ({
  isOpen,
  onClose,
  sellerEmail,
}: {
  isOpen: boolean
  onClose: () => void
  sellerEmail: string
}) => {
  const [message, setMessage] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')

  const handleSend = () => {
    console.log('Sending email:', { buyerEmail, message })
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            type='email'
            placeholder='Your email'
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
          />
          <Textarea
            placeholder='Write your message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSend}
            className='w-full'
            variant='secondary'
          >
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ContactSellerModal
