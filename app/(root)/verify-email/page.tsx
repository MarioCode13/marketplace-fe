import VerifyEmailClient from './VerifyEmailClient'

type SearchParams = { [key: string]: string | string[] | undefined }
type NextSearchParams = Promise<SearchParams> | undefined

export default async function Page({
  searchParams,
}: {
  searchParams?: NextSearchParams
}) {
  const params = (await searchParams) || ({} as SearchParams)

  const getParam = (key: string) => {
    const val = params?.[key]
    if (Array.isArray(val)) return val[0]
    return val ?? null
  }

  return (
    // Render client component and pass the initial params as props
    <VerifyEmailClient
      initialSuccess={getParam('success')}
      initialMessage={getParam('message')}
      initialError={getParam('error')}
    />
  )
}
