// ** Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** Mui
import {
  Box,
  Typography,
  useTheme,
  Grid
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'
import NoData from 'src/components/no-data'
import ModalAddAddress from 'src/views/pages/checkout-product/components/ModalAddAddress'
import Spinner from 'src/components/spinner'
import ModalWarning from 'src/views/pages/checkout-product/components/ModalWarning'
import ShippingAddressCard from 'src/views/pages/checkout-product/components/ShippingAddressCard'
import DeliveryMethodCard from 'src/views/pages/checkout-product/components/DeliveryMethodCard'
import PaymentMethodCard from 'src/views/pages/checkout-product/components/PaymentMethodCard'
import CheckoutOrderSummary from 'src/views/pages/checkout-product/components/CheckoutOrderSummary'

// ** Translate
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

// ** Utils
import { formatNumberToLocal, toFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { createOrderProductAsync } from 'src/stores/order-product/actions'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Other
import { TItemOrderProduct } from 'src/types/order-product'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'

// ** Services
import { getAllPaymentTypes } from 'src/services/payment-type'
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { getAllCities } from 'src/services/city'
import { ROUTE_CONFIG } from 'src/configs/route'
import { createURLpaymentVNPay } from 'src/services/payment'
import { PAYMENT_TYPES } from 'src/configs/payment'

type TProps = {}

const CheckoutProductPage: NextPage<TProps> = () => {
  // State
  const [optionPayments, setOptionPayments] = useState<{ label: string; value: string; type: string }[]>([])
  const [optionDeliveries, setOptionDeliveries] = useState<{ label: string; value: string; price: string }[]>([])
  const [paymentSelected, setPaymentSelected] = useState('')
  const [deliverySelected, setDeliverySelected] = useState('')
  const [openAddress, setOpenAddress] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [openWarning, setOpenWarning] = useState(false)

  // ** Hooks
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const PAYMENT_DATA = PAYMENT_TYPES()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorCreate, isSuccessCreate, messageErrorCreate, orderItems } = useSelector(
    (state: RootState) => state.orderProduct
  )

  const handleFormatDataProduct = (items: any) => {
    const objectMap: Record<string, TItemOrderProduct> = {}
    orderItems.forEach((order: any) => {
      objectMap[order.product] = order
    })

    return items.map((item: any) => {
      return {
        ...objectMap[item.product],
        amount: item.amount
      }
    })
  }

  const memoQueryProduct = useMemo(() => {
    const result = {
      totalPrice: 0,
      productsSelected: []
    }
    const data: any = router.query
    if (data) {
      result.totalPrice = data.totalPrice || 0
      result.productsSelected = data.productsSelected ? handleFormatDataProduct(JSON.parse(data.productsSelected)) : []
    }

    return result
  }, [router.query, orderItems])

  useEffect(() => {
    const data: any = router.query
    if (!data?.productsSelected) {
      setOpenWarning(true)
    }
  }, [router.query])

  const memoAddressDefault = useMemo(() => {
    const findAddress = user?.addresses?.find(item => item.isDefault)

    return findAddress
  }, [user?.addresses])

  const memoNameCity = useMemo(() => {
    const findCity = optionCities.find(item => item.value === memoAddressDefault?.city)

    return findCity?.label
  }, [memoAddressDefault, optionCities])

  const memoPriceShipping = useMemo(() => {
    const findItemPrice = optionDeliveries?.find(item => item.value === deliverySelected)

    return findItemPrice ? +findItemPrice?.price : 0
  }, [deliverySelected])

  // ** Handle
  const onChangeDelivery = (value: string) => {
    setDeliverySelected(value)
  }

  const onChangePayment = (value: string) => {
    setPaymentSelected(value)
  }

  const handlePaymentVNPay = async (data: { orderId: string; totalPrice: number }) => {
    setLoading(true)
    await createURLpaymentVNPay({
      totalPrice: data.totalPrice,
      orderId: data?.orderId,
      language: i18n.language === 'vi' ? 'vn' : i18n.language
    }).then(res => {
      if (res?.data) {
        window.open(res?.data, '_blank')
      }
      setLoading(false)
    })
  }

  const handlePaymentTypeOrder = (type: string, data: { orderId: string; totalPrice: number }) => {
    switch (type) {
      case PAYMENT_DATA.VN_PAYMENT.value: {
        handlePaymentVNPay(data)
        break
      }
      default:
        break
    }
  }

  const handleOrderProduct = () => {
    const totalPrice = memoPriceShipping + Number(memoQueryProduct.totalPrice)
    if (!memoAddressDefault) {
      setOpenAddress(true)

      return
    }
    dispatch(
      createOrderProductAsync({
        orderItems: memoQueryProduct.productsSelected as TItemOrderProduct[],
        itemsPrice: +memoQueryProduct.totalPrice,
        paymentMethod: paymentSelected,
        deliveryMethod: deliverySelected,
        user: user ? user?._id : '',
        fullName: memoAddressDefault
          ? toFullName(
              memoAddressDefault?.lastName,
              memoAddressDefault?.middleName,
              memoAddressDefault?.firstName,
              i18n.language
            )
          : '',
        address: memoAddressDefault ? memoAddressDefault.address : '',
        city: memoAddressDefault ? memoAddressDefault.city : '',
        phone: memoAddressDefault ? memoAddressDefault.phoneNumber : '',
        shippingPrice: memoPriceShipping,
        totalPrice: totalPrice
      })
    ).then(res => {
      const idPaymentMethod = res?.payload?.data?.paymentMethod
      const orderId = res?.payload?.data?._id
      const totalPrice = res?.payload?.data?.totalPrice
      const findPayment = optionPayments.find(item => item.value === idPaymentMethod)
      if (findPayment) {
        handlePaymentTypeOrder(findPayment.type, { totalPrice, orderId })
      }
    })
  }

  // ** Fetch API
  const handleGetListPaymentMethod = async () => {
    setLoading(true)
    await getAllPaymentTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        console.log(res)

        if (res.data) {
          setOptionPayments(
            res?.data?.paymentTypes?.map((item: { name: string; _id: string; type: string }) => ({
              label: item.name,
              value: item._id,
              type: item.type
            }))
          )
          setPaymentSelected(res?.data?.paymentTypes?.[0]?._id)
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.cities
        if (data) {
          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const handleGetListDeliveryMethod = async () => {
    setLoading(true)
    await getAllDeliveryTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        if (res.data) {
          setOptionDeliveries(
            res?.data?.deliveryTypes?.map((item: { name: string; _id: string; price: string }) => ({
              label: item.name,
              value: item._id,
              price: item.price
            }))
          )
          setLoading(false)
          setDeliverySelected(res?.data?.deliveryTypes?.[0]?._id)
        }
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleGetListPaymentMethod()
    fetchAllCities()
    handleGetListDeliveryMethod()
  }, [])

  const handleChangeAmountCart = (items: TItemOrderProduct[]) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const objectMap: Record<string, number> = {}
    items.forEach((item: any) => {
      objectMap[item.product] = -item.amount
    })
    const listOrderItems: TItemOrderProduct[] = []
    orderItems.forEach((order: TItemOrderProduct) => {
      if (objectMap[order.product]) {
        listOrderItems.push({
          ...order,
          amount: order.amount + objectMap[order.product]
        })
      } else {
        listOrderItems.push(order)
      }
    })
    const filterListOrder = listOrderItems.filter((item: TItemOrderProduct) => item.amount)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filterListOrder
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filterListOrder })
    }
  }

  useEffect(() => {
    if (isSuccessCreate) {
      Swal.fire({
        title: t('Congraturation!'),
        text: t('Order_product_success'),
        icon: 'success',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main}, 0.78)`
      }).then(result => {
        if (result.isConfirmed) {
          router.push(ROUTE_CONFIG.MY_ORDER)
        }
      })
      handleChangeAmountCart(memoQueryProduct.productsSelected)

      dispatch(resetInitialState())
    } else if (isErrorCreate && messageErrorCreate) {
      toast.error(t('Order_product_error'))
      Swal.fire({
        title: t('Opps!'),
        text: t('Order_product_error'),
        icon: 'error',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main}, 0.78)`

        // title: t('Congraturation!'),
        // text: t('Order_product_success'),
        // icon: 'success',
        // confirmButtonText: t('Confirm'),
        // background: theme.palette.background.paper,
        // color: `rgba(${theme.palette.customColors.main}, 0.78)`
      })

      // .then(() => {
        // router.push(ROUTE_CONFIG.MY_ORDER)
      // })
      dispatch(resetInitialState())
    }
  }, [isSuccessCreate, isErrorCreate, messageErrorCreate])

  return (
    <>
      {loading || (isLoading && <Spinner />)}
      <ModalWarning open={openWarning} onClose={() => setOpenAddress(false)} />
      <ModalAddAddress open={openAddress} onClose={() => setOpenAddress(false)} />
      
      <Box sx={{ p: 4 }}>
        {memoQueryProduct?.productsSelected?.length > 0 ? (
          <Fragment>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                Thanh toán
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hoàn tất đơn hàng của bạn
              </Typography>
            </Box>

            {/* Two Column Layout */}
            <Grid container spacing={4}>
              {/* Left Column - Checkout Details (60-65%) */}
              <Grid item xs={12} lg={7}>
                {/* Shipping Address */}
                <ShippingAddressCard onOpenAddressModal={() => setOpenAddress(true)} />

                {/* Delivery Method */}
                <DeliveryMethodCard
                  deliveryOptions={optionDeliveries}
                  selectedDelivery={deliverySelected}
                  onDeliveryChange={onChangeDelivery}
                />

                {/* Payment Method */}
                <PaymentMethodCard
                  paymentOptions={optionPayments}
                  selectedPayment={paymentSelected}
                  onPaymentChange={onChangePayment}
                />
              </Grid>

              {/* Right Column - Order Summary (35-40%) */}
              <Grid item xs={12} lg={5}>
                <CheckoutOrderSummary
                  products={memoQueryProduct.productsSelected}
                  subtotal={Number(memoQueryProduct.totalPrice)}
                  shippingFee={memoPriceShipping}
                  onPlaceOrder={handleOrderProduct}
                  isDisabled={!memoAddressDefault || !paymentSelected || !deliverySelected}
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
              Không có sản phẩm để thanh toán
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}

export default CheckoutProductPage
