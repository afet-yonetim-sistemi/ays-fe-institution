import passwordService from '@/modules/password/service'
import { notFound } from 'next/navigation'
import CreatePasswordCard from '@/components/password/CreatePasswordCard'

const Page = async ({ params }: { params: { id: string } }) => {
  const id = params.id
  try {
    await passwordService.validatePasswordId(id)
    return <CreatePasswordCard token={id} />
  } catch (error) {
    notFound()
  }
}

export default Page
