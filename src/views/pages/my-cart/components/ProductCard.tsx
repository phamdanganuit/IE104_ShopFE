// ** React
import { useEffect, useState } from 'react'

// ** Next
import Link from 'next/link'

// ** Mui
import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  Checkbox, 
  IconButton, 
  Typography, 
  useTheme,
  Chip,
  Button
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'

// Helpers
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

//  ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Redux
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { getDetailsProductPublic } from 'src/services/product'

type TProps = {
  item: TItemOrderProduct
  selectedRows: string[]
  handleChangeCheckbox: (value: string) => void
}

interface TItemOrderProductState extends TItemOrderProduct {
  countInStock?: number
}

const ProductCard = ({ item, selectedRows, handleChangeCheckbox }: TProps) => {
  // ** State
  const [itemState, setItemState] = useState<TItemOrderProductState>(item)

  // ** Hooks
  const { user } = useAuth()
  const theme = useTheme()

  //  ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** fetch
  const fetchDetailsProduct = async (id: string) => {
    const res = await getDetailsProductPublic(id)
    const data = res.data
    if (data) {
      const discountItem = isExpiry(data.discountStartDate, data.discountEndDate) ? data.discount : 0

      setItemState({
        name: data.name,
        amount: item.amount,
        image: data.image,
        price: data.price,
        discount: discountItem,
        product: id,
        slug: data.slug,
        countInStock: data.countInStock
      })
    }
  }

  useEffect(() => {
    if (item.product) {
      fetchDetailsProduct(item.product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.product])

  useEffect(() => {
    setItemState(prev => ({ ...prev, amount: item.amount }))
  }, [item.amount])

  // ** handle
  const handleChangeAmountCart = (item: TItemOrderProduct, amount: number) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: amount,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
    })
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  const handleDeleteProductCart = (id: string) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems)
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => item.product !== id)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filteredItems })
    }
  }

  const isSelected = selectedRows.includes(itemState.product)
  const finalPrice = itemState.discount > 0 
    ? (itemState.price * (100 - itemState.discount)) / 100 
    : itemState.price

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid',
        borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Checkbox */}
          <Box sx={{ pt: 1 }}>
            <Checkbox
              disabled={!itemState?.countInStock}
              checked={isSelected}
              value={itemState.product}
              onChange={e => handleChangeCheckbox(e.target.value)}
              sx={{
                '&.Mui-checked': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Box>

          {/* Product Image */}
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }} 
            src={itemState.image} 
          />

          {/* Product Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Link 
              href={`/product/${itemState.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.4,
                  minHeight: '2.8em'
                }}
              >
                {itemState.name}
              </Typography>
            </Link>

            {/* Price Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {itemState.discount > 0 ? (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'line-through',
                      fontSize: '16px'
                    }}
                  >
                    {formatNumberToLocal(itemState.price)} VND
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      fontSize: '20px'
                    }}
                  >
                    {formatNumberToLocal(finalPrice)} VND
                  </Typography>
                  <Chip
                    label={`-${itemState.discount}%`}
                    size="small"
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  />
                </>
              ) : (
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: '20px'
                  }}
                >
                  {formatNumberToLocal(itemState.price)} VND
                </Typography>
              )}
            </Box>

            {/* Quantity Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                Số lượng:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  disabled={!itemState?.countInStock || itemState.amount <= 1}
                  onClick={() => handleChangeAmountCart(item, -1)}
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.primary,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: theme.palette.grey[200],
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[50],
                      color: theme.palette.text.disabled,
                    }
                  }}
                >
                  <Icon icon='ic:sharp-minus' fontSize={16} />
                </IconButton>
                <CustomTextField
                  disabled={!itemState?.countInStock}
                  type='number'
                  value={itemState.amount}
                  inputProps={{
                    inputMode: 'numeric',
                    min: 1,
                    style: { textAlign: 'center', width: '60px' }
                  }}
                  sx={{
                    '.MuiInputBase-input.MuiFilledInput-input': {
                      width: '60px',
                      textAlign: 'center',
                      padding: '8px 4px'
                    },
                    '.MuiInputBase-root.MuiFilledInput-root': {
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                      '&.Mui-focused': {
                        backgroundColor: `${theme.palette.background.paper} !important`,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                      }
                    },
                    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0
                    },
                    'input[type=number]': {
                      MozAppearance: 'textfield'
                    }
                  }}
                />
                <IconButton
                  disabled={!itemState?.countInStock}
                  onClick={() => handleChangeAmountCart(item, 1)}
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.primary,
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: theme.palette.grey[200],
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[50],
                      color: theme.palette.text.disabled,
                    }
                  }}
                >
                  <Icon icon='ic:round-plus' fontSize={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Delete Button */}
          <Box sx={{ pt: 1 }}>
            <IconButton 
              onClick={() => handleDeleteProductCart(itemState.product)}
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: hexToRGBA(theme.palette.error.main, 0.1),
                }
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard
