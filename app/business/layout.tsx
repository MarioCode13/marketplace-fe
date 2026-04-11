import { Container } from '@/components/ui/Container'

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Container>{children}</Container>
}
