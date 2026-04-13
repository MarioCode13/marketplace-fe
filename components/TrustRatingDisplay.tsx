'use client'

import React from 'react'
import { TrustRating, TrustLevel } from '@/lib/graphql/types/trust'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Star, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface TrustRatingDisplayProps {
  trustRating: TrustRating
  showDetails?: boolean
  compact?: boolean
}

const getTrustLevelColor = (trustLevel: TrustLevel) => {
  switch (trustLevel) {
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

const getTrustLevelIcon = (trustLevel: TrustLevel) => {
  switch (trustLevel) {
    case 'EXCELLENT':
    case 'VERY_GOOD':
      return <Shield className='w-4 h-4' />
    case 'GOOD':
      return <CheckCircle className='w-4 h-4' />
    case 'FAIR':
    case 'POOR':
    case 'VERY_POOR':
      return <AlertCircle className='w-4 h-4' />
    default:
      return <Shield className='w-4 h-4' />
  }
}

export const TrustRatingDisplay: React.FC<TrustRatingDisplayProps> = ({
  trustRating,
  showDetails = false,
  compact = false,
}) => {
  const trustLevelColor = getTrustLevelColor(
    trustRating.trustLevel as TrustLevel,
  )
  const trustLevelIcon = getTrustLevelIcon(trustRating.trustLevel as TrustLevel)

  if (compact) {
    return (
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1'>
          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium'>
            {trustRating.starRating.toFixed(1)}
          </span>
        </div>
        <Badge
          variant='outline'
          className={`text-xs ${trustLevelColor}`}
        >
          {trustLevelIcon}
        </Badge>
      </div>
    )
  }

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Shield className='w-5 h-5' />
          Trust Rating
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Overall Score */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1 text-sm font-medium'>
              <span>Overall Score</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type='button'
                    className='inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted'
                    aria-label='Overall score info'
                  >
                    <Info className='h-4 w-4' />
                  </button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>
                    The overall trust score combines verification,
                    profile completion, reviews, and transaction history.
                    Improving any of these areas raises your overall rating.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                <span className='font-semibold'>
                  {trustRating.starRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <Progress
            value={trustRating.overallScore}
            className='h-2'
          />
        </div>

        {showDetails && (
          <div className='space-y-3'>
              {/* Document Score */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span>Verification</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted'
                          aria-label='Verification info'
                        >
                          <Info className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>
                          This score reflects identity verification via
                          Omnicheck our 3rd party provider. Paid account
                          required to access full verification features.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className='text-sm font-medium'>
                    {trustRating.verificationScore.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={trustRating.verificationScore}
                  className='h-1'
                />
              </div>

              {/* Profile Score */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span>Profile Completion</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='inline-flex h-5 w-5 items-center justify-center rounded-full  text-muted-foreground transition-colors hover:bg-muted'
                          aria-label='Profile completion info'
                        >
                          <Info className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>
                          This score grows as you complete your profile. Add a
                          photo, contact info, etc.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className='text-sm font-medium'>
                    {trustRating.profileScore.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={trustRating.profileScore}
                  className='h-1'
                />
              </div>

              {/* Review Score */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span>Reviews</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='inline-flex h-5 w-5 items-center justify-center text-muted-foreground transition-colors hover:bg-muted'
                          aria-label='Reviews info'
                        >
                          <Info className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>
                          This score is based on buyer feedback. Encourage
                          reviews and keep ratings high.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className='text-sm font-medium'>
                    {trustRating.reviewScore.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={trustRating.reviewScore}
                  className='h-1'
                />
              </div>

              {/* Transaction Score */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-1 text-sm'>
                    <span>Transaction History</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='inline-flex h-5 w-5 items-center justify-center text-muted-foreground transition-colors hover:bg-muted'
                          aria-label='Transaction history info'
                        >
                          <Info className='h-4 w-4' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>
                          This score reflects successful past trades. Keep
                          orders reliable and avoid disputes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className='text-sm font-medium'>
                    {trustRating.transactionScore.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={trustRating.transactionScore}
                  className='h-1'
                />
              </div>
            </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 pt-4 '>
          <div className='text-center'>
            <div className='text-lg font-semibold'>
              {trustRating.totalReviews}
            </div>
            <div className='text-xs text-muted-foreground'>Total Reviews</div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-semibold text-success'>
              {trustRating.totalReviews > 0
                ? Math.round(
                    (trustRating.positiveReviews / trustRating.totalReviews) *
                      100,
                  )
                : 0}
              %
            </div>
            <div className='text-xs text-muted-foreground'>Positive</div>
          </div>
        </div>

        <div className='text-xs text-muted-foreground text-center'>
          Last updated:{' '}
          {new Date(trustRating.lastCalculated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
