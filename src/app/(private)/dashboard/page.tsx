'use client'
import PrivateRoute from '@/app/hocs/isAuth'

const Page = () => {
  return(
      <PrivateRoute>
      <div>Dashboard Page</div>
  </PrivateRoute>
  )
}
export default Page
