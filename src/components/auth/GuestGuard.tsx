// ** Next
import { useRouter } from 'next/router'

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Config
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  // ** router
  const router = useRouter()

  // ** auth
  const authContext = useAuth()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (window.localStorage.getItem(ACCESS_TOKEN) && window.localStorage.getItem(USER_DATA)) {
      router.replace('/')
    }
  }, [router.route])

  if (authContext.loading || (!authContext.loading && authContext.user !== null)) {
    return fallback
  }

  return <>{children}</>

  // ** kiểm tra xem người dùng có là khách hay không. Nếu người dùng đã xác thực, nó sẽ điều hướng đến trang chính. Nếu người dùng chưa xác thực, nó sẽ hiển thị các thành phần con. Điều này đảm bảo rằng chỉ có người dùng chưa xác thực mới được phép truy cập vào các nội dung bên trong GuestGuard.
}

export default GuestGuard
