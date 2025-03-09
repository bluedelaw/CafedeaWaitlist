import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WaitlistConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  waitlistCount: number
}

const WaitlistConfirmation: React.FC<WaitlistConfirmationProps> = ({ isOpen, onClose, onConfirm, waitlistCount }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Joining Waitlist</DialogTitle>
          <DialogDescription>There are currently {waitlistCount} people on the waitlist.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Would you like to be added to the waitlist?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Join Waitlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WaitlistConfirmation

