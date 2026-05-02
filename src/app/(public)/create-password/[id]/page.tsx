import CreatePasswordCard from '@/components/password/CreatePasswordCard'
import passwordService from '@/modules/password/service'
import { notFound } from 'next/navigation'

const Page = async (
  props: {
    params: Promise<{ id: string }>
  }
): Promise<React.ReactNode> => {
  const params = await props.params;
  const id = params.id
  try {
    await passwordService.validatePasswordId(id)
  } catch (error) {
    notFound()
  }

  return <CreatePasswordCard id={id} />
}

export default Page
