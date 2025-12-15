import CreatePasswordCard from '@/components/password/CreatePasswordCard'
import passwordService from '@/modules/password/service'
import { notFound } from 'next/navigation'

const Page = async ({
  params,
}: {
  params: { id: string }
}): Promise<JSX.Element | undefined> => {
  const id = params.id
  try {
    await passwordService.validatePasswordId(id)
    return <CreatePasswordCard id={id} />
  } catch (error) {
    notFound()
  }
}

export default Page
