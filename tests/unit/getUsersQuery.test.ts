import { describe, expect, it } from 'vitest'
import { GET_USERS } from '@/lib/graphql/queries/getUsers'

describe('GET_USERS', () => {
    it('requests trust rating and user profile fields used by the admin users table', () => {
        const querySource = GET_USERS.loc?.source.body ?? ''

        expect(querySource).toContain('trustRating')
        expect(querySource).toContain('planType')
        expect(querySource).toContain('firstName')
        expect(querySource).toContain('lastName')
    })
})
