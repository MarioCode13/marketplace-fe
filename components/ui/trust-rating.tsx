import { Star, Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Badge } from './badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface TrustRatingProps {
  overallScore: number
  totalReviews: number
  positiveReviews: number
  trustLevel: string
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TrustRating({
  overallScore,
  totalReviews,
  positiveReviews,
  trustLevel,
  showDetails = false,
  size = 'md',
}: TrustRatingProps) {
  const starRating = overallScore / 20 // Convert 0-100 to 0-5 stars
  const positivePercentage =
    totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'VERY_GOOD':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'GOOD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAIR':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'POOR':
      case 'VERY_POOR':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrustIcon = (level: string) => {
    switch (level) {
      case 'EXCELLENT':
      case 'VERY_GOOD':
        return <Shield className='w-4 h-4' />
      case 'GOOD':
        return <CheckCircle className='w-4 h-4' />
      case 'FAIR':
        return <AlertCircle className='w-4 h-4' />
      case 'POOR':
      case 'VERY_POOR':
        return <XCircle className='w-4 h-4' />
      default:
        return <Shield className='w-4 h-4' />
    }
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <TooltipProvider>
      <div className='flex items-center gap-2'>
        {/* Star Rating */}
        <div className='flex items-center gap-1'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= starRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className={`ml-1 font-medium ${sizeClasses[size]}`}>
            {starRating.toFixed(1)}
          </span>
        </div>

        {/* Trust Level Badge */}
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant='outline'
              className={`flex items-center gap-1 ${getTrustLevelColor(
                trustLevel
              )} ${sizeClasses[size]}`}
            >
              {getTrustIcon(trustLevel)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-center'>
              <p className='font-medium'>
                Trust Score: {overallScore.toFixed(1)}/100
              </p>
              <p className='text-sm text-gray-600'>
                {totalReviews} reviews ({positivePercentage.toFixed(0)}%
                positive)
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Review Count */}
        {showDetails && totalReviews > 0 && (
          <span className={`text-gray-600 ${sizeClasses[size]}`}>
            ({totalReviews} reviews)
          </span>
        )}
      </div>
    </TooltipProvider>
  )
}
