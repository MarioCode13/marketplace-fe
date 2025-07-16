import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_CITIES } from '@/lib/graphql/queries/searchCities'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface CityOption {
  id: string
  name: string
  region: { name: string; country: { name: string } }
}

interface CityAutocompleteProps {
  value: string | undefined // cityId
  onChange: (cityId: string | undefined, cityLabel?: string) => void
  onCantFindCity?: () => void
  label?: string
  placeholder?: string
}

export default function CityAutocomplete({
  onChange,
  onCantFindCity,
  label = 'City',
  placeholder = 'Type to search cities...',
}: CityAutocompleteProps) {
  const [input, setInput] = useState('')
  const [searchCities, { data, loading }] = useLazyQuery(SEARCH_CITIES)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)
    setShowDropdown(true)
    if (val.length > 1) {
      searchCities({ variables: { query: val } })
    }
    onChange(undefined)
  }

  const handleSelect = (city: CityOption) => {
    setInput(`${city.name}, ${city.region.name}, ${city.region.country.name}`)
    setShowDropdown(false)
    onChange(
      city.id,
      `${city.name}, ${city.region.name}, ${city.region.country.name}`
    )
  }

  return (
    <div className='relative'>
      {label && (
        <label className='block mb-2 text-sm font-medium'>{label}</label>
      )}
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => input.length > 1 && setShowDropdown(true)}
        autoComplete='off'
      />
      {showDropdown && data?.searchCities?.length > 0 && (
        <div className='absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-y-auto mt-1'>
          {data.searchCities.map((city: CityOption) => (
            <div
              key={city.id}
              className='px-4 py-2 cursor-pointer hover:bg-gray-100 text-black'
              onClick={() => handleSelect(city)}
            >
              {city.name}, {city.region.name}, {city.region.country.name}
            </div>
          ))}
        </div>
      )}
      {showDropdown &&
        !loading &&
        data?.searchCities?.length === 0 &&
        input.length > 1 && (
          <div className='absolute z-10 w-full bg-white border rounded shadow mt-1 px-4 py-2 text-gray-500 flex flex-col gap-2'>
            <span>No cities found.</span>
            {onCantFindCity && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  onCantFindCity()
                  setShowDropdown(false)
                }}
                type='button'
              >
                Can&apos;t find your city?
              </Button>
            )}
          </div>
        )}
    </div>
  )
}
