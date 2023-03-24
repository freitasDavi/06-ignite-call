import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Header } from '../styles'
import { ConnectBox, ConnectItem } from './styles'

export default function Register() {
  const session = useSession()

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => signIn('google')}
          >
            {session.status === 'authenticated' ? (
              <>Conectado</>
            ) : (
              <>
                Conectar
                <ArrowRight />
              </>
            )}
            {/* Conectar */}
          </Button>
        </ConnectItem>
        <Button type="submit">
          Próximo passso <ArrowRight />{' '}
        </Button>
      </ConnectBox>
    </Container>
  )
}
