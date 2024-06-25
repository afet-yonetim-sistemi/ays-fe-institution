'use client'
import PrivateRoute from '@/app/hocs/isAuth'

const Page = () => {
  return (
    <PrivateRoute>
      <div></div>
    </PrivateRoute>
  )
}
export default Page
