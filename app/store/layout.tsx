import { Container } from '@/components/ui/Container'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Container>{children}</Container>
}
