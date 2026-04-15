'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface FAQItem {
  category: string
  question: string
  answer: string
}

export function HelpFAQ({ faqItems }: { faqItems: FAQItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...new Set(faqItems.map((item) => item.category))]

  const filteredItems =
    selectedCategory === 'All'
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory)

  return (
    <>
      {/* Category Filter */}
      <section>
        <h2 className='text-xl font-semibold mb-4'>Browse by Category</h2>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setExpandedIndex(null)
              }}
              variant={
                selectedCategory === category ? 'contained' : 'outlined'
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* FAQ Items */}
      <section>
        <div className='space-y-3'>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className='border rounded-lg overflow-hidden'
            >
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className='w-full flex items-center justify-between p-4   transition-colors'
              >
                <h3 className='text-lg font-medium text-foreground text-left'>
                  {item.question}
                </h3>
                <span
                  className={`ml-4 flex-shrink-0 transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
              {expandedIndex === index && (
                <div className='px-4 py-3  border-t'>
                  <p className='text-foreground leading-relaxed'>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
