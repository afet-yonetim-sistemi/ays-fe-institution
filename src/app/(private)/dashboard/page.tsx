'use client'
import PrivateRoute from '@/app/hocs/isAuth'

const Page = (): JSX.Element => {
  return (
    <PrivateRoute>
      <div></div>
    </PrivateRoute>
  )
}
export default Page
