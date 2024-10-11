// ** Import Next
import { NextPage } from 'next'

// ** Config
import { PERMISSIONS } from 'src/configs/permission'

// ** views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>User</h1>
}

Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Index