import VerifyEmailClient from './VerifyEmailClient'

type SearchParams = Record<string, string | string[] | undefined>

export default function Page({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const getParam = (key: string) => {
    const val = searchParams?.[key]
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
