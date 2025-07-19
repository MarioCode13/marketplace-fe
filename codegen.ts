import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql',
  documents: '**/*.{ts,tsx}',
  generates: {
    'lib/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        scalars: {
          ID: 'string',
          DateTime: 'string',
          Date: 'string',
          Time: 'string',
          Decimal: 'number',
          BigDecimal: 'number'
        }
      }
    },
    'lib/graphql/schema.json': {
      plugins: ['introspection']
    }
  },
  ignoreNoDocuments: true
}

export default config 