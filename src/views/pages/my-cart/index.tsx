// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** Mui
import { Box, Checkbox, Typography, useTheme, Grid } from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'
import NoData from 'src/components/no-data'

// ** Translate
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

// ** Utils
import { cloneDeep } from 'src/utils'

// ** Redux
import { updateProductToCart } from 'src/stores/order-product'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Other
import { TItemOrderProduct } from 'src/types/order-product'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { ROUTE_CONFIG } from 'src/configs/route'
import ProductCard from 'src/views/pages/my-cart/components/ProductCard'
import OrderSummary from 'src/views/pages/my-cart/components/OrderSummary'

type TProps = {}

const MyCartPage: NextPage<TProps> = () => {
  // ** State
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // ** Hooks
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const memoListAllProductIds = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product)
  }, [orderItems])

  const memoItemsSelectedProduct = useMemo(() => {
    const result: TItemOrderProduct[] = []
    selectedRows.forEach(idSelected => {
      const findItem: any = orderItems.find((item: TItemOrderProduct) => item.product === idSelected)
      if (findItem) {
        result.push(findItem)
      }
    })

    return result
  }, [selectedRows, orderItems])

  const memoTotalSelectedProduct = useMemo(() => {
    const total = memoItemsSelectedProduct?.reduce((result, current: TItemOrderProduct) => {
      // Calculate final price after discount
      const finalPrice = current?.discount > 0 
        ? (current?.price * (100 - current?.discount)) / 100 
        : current?.price

      return result + finalPrice * current?.amount
    }, 0)

    return total || 0
  }, [memoItemsSelectedProduct])

  useEffect(() => {
    const productSelected = router.query.selected as string
    if (productSelected) {
      if (typeof productSelected === 'string') {
        setSelectedRows([productSelected])
      } else {
        setSelectedRows([...productSelected])
      }
    }
  }, [router.query])

  // ** Handle

  const handleChangeCheckbox = (value: string) => {
    const isChecked = selectedRows.includes(value)
    if (isChecked) {
      const filtered = selectedRows.filter(item => item !== value)
      setSelectedRows(filtered)
    } else {
      setSelectedRows([...selectedRows, value])
    }
  }

  const handleChangeCheckAll = () => {
    const isCheckedAll = memoListAllProductIds.every(id => selectedRows.includes(id))
    if (isCheckedAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(memoListAllProductIds)
    }
  }


  const handleNavigateCheckoutProduct = () => {
    const formatData = JSON.stringify(
      memoItemsSelectedProduct.map(item => ({ product: item.product, amount: item.amount }))
    )
    router.push({
      pathname: ROUTE_CONFIG.CHECKOUT_PRODUCT,
      query: {
        totalPrice: memoTotalSelectedProduct,
        productsSelected: formatData
      }
    })
  }

  return (
    <Box sx={{ p: 4 }}>
      {orderItems.length > 0 ? (
        <Fragment>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
              Giỏ hàng của bạn
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {orderItems.length} sản phẩm trong giỏ hàng
            </Typography>
          </Box>

          {/* Two Column Layout */}
          <Grid container spacing={4}>
            {/* Left Column - Product List (70%) */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Checkbox
                    checked={memoListAllProductIds.every(id => selectedRows.includes(id)) && memoListAllProductIds.length > 0}
                    onChange={handleChangeCheckAll}
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Chọn tất cả ({memoListAllProductIds.length} sản phẩm)
                  </Typography>
                </Box>
              </Box>

              {/* Product Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orderItems.map((item: TItemOrderProduct) => (
                  <ProductCard
                    key={item.product}
                    item={item}
                    selectedRows={selectedRows}
                    handleChangeCheckbox={handleChangeCheckbox}
                  />
                ))}
              </Box>
            </Grid>

            {/* Right Column - Order Summary (30%) */}
            <Grid item xs={12} lg={4}>
              <OrderSummary
                selectedItems={memoItemsSelectedProduct}
                totalAmount={memoTotalSelectedProduct}
                onProceedToCheckout={handleNavigateCheckoutProduct}
                isDisabled={!selectedRows.length || !memoItemsSelectedProduct.length}
              />
            </Grid>
          </Grid>
        </Fragment>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <Box sx={{ mb: 3 }}>
            <Icon 
              icon='mdi:cart-outline' 
              fontSize={80} 
              style={{ color: theme.palette.grey[400] }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm yêu thích!
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default MyCartPage
