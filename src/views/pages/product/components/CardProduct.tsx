// ** React
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

// ** Mui
import { styled, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box, Button, Rating } from '@mui/material'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

/// ** Components
import Icon from 'src/components/Icon'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// ** Others
import { ROUTE_CONFIG } from 'src/configs/route'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Storage
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { likeProductAsync, unLikeProductAsync } from 'src/stores/product/actions'

interface TCardProduct {
  item: TProduct
}

const StyleCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[2],
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
    '& .product-image': {
      transform: 'scale(1.08)'
    },
    '& .product-overlay': {
      opacity: 1
    }
  },
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: theme.palette.background.paper
  }
}))

const CardProduct = (props: TCardProduct) => {
  // ** Props
  const { item } = props

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem = isExpiry(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item)
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: item._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  const handleToggleLikeProduct = (id: string, isLiked: boolean) => {
    if (user?._id) {
      if (isLiked) {
        dispatch(unLikeProductAsync({ productId: id }))
      } else {
        dispatch(likeProductAsync({ productId: id }))
      }
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const memoIsExpiry = useMemo(() => {
    return isExpiry(item.discountStartDate, item.discountEndDate)
  }, [item])

  return (
    <StyleCard sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Discount Badge */}
      {item.discount > 0 && memoIsExpiry && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            backgroundColor: theme.palette.error.main,
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: theme.shadows[4],
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Icon icon='mdi:fire' fontSize={18} />
          -{item.discount}%
        </Box>
      )}

      {/* Out of Stock Badge */}
      {item.countInStock === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '12px',
            backdropFilter: 'blur(10px)'
          }}
        >
          {t('Out_of_stock')}
        </Box>
      )}

      {/* Like Button Overlay */}
      <IconButton
        onClick={() => handleToggleLikeProduct(item._id, Boolean(user && item?.likedBy?.includes(user._id)))}
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s'
        }}
      >
        {user && item?.likedBy?.includes(user._id) ? (
          <Icon icon='mdi:heart' style={{ color: theme.palette.error.main, fontSize: '24px' }} />
        ) : (
          <Icon icon='tabler:heart' style={{ color: theme.palette.text.secondary, fontSize: '24px' }} />
        )}
      </IconButton>

      {/* Product Image */}
      <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
        <CardMedia
          component='img'
          image={item.image}
          alt={item.name}
          className='product-image'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '16px'
          }}
        />
      </Box>

      <CardContent sx={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Product Name */}
        <Typography
          onClick={() => handleNavigateDetails(item.slug)}
          variant='h6'
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkitLineClamp': '2',
            '-webkitBoxOrient': 'vertical',
            minHeight: '48px',
            mb: 2,
            fontSize: '16px',
            lineHeight: 1.5,
            transition: 'color 0.2s',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
        >
          {item.name}
        </Typography>

        {/* Price Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant='h5'
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: '20px'
              }}
            >
              {item.discount > 0 && memoIsExpiry
                ? formatNumberToLocal((item.price * (100 - item.discount)) / 100)
                : formatNumberToLocal(item.price)}{' '}
              ₫
            </Typography>
          </Box>
          {item.discount > 0 && memoIsExpiry && (
            <Typography
              variant='body2'
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'line-through',
                fontSize: '14px'
              }}
            >
              {formatNumberToLocal(item.price)} ₫
            </Typography>
          )}
        </Box>

        {/* Stock Info */}
        {item.countInStock > 0 ? (
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.success.main,
              mb: 1,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Icon icon='mdi:check-circle' fontSize={16} />
            {t('Still')} {item.countInStock} {t('product_in_stock')}
          </Typography>
        ) : (
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.error.main,
              mb: 1,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Icon icon='mdi:close-circle' fontSize={16} />
            {t('Out_of_stock')}
          </Typography>
        )}

        {/* Sold Info */}
        {item.sold > 0 && (
          <Typography variant='body2' sx={{ color: theme.palette.text.secondary, mb: 1.5, fontSize: '13px' }}>
            {t('Sold_product')}: <strong>{item.sold}</strong>
          </Typography>
        )}

        {/* Stats Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {item?.location?.name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon icon='carbon:location' fontSize={16} style={{ color: theme.palette.text.secondary }} />
              <Typography variant='caption' sx={{ color: theme.palette.text.secondary, fontSize: '12px' }}>
                {item?.location?.name}
              </Typography>
            </Box>
          )}
          {item?.views > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon icon='mdi:eye-outline' fontSize={16} style={{ color: theme.palette.text.secondary }} />
              <Typography variant='caption' sx={{ color: theme.palette.text.secondary, fontSize: '12px' }}>
                {item?.views}
              </Typography>
            </Box>
          )}
          {!!item?.likedBy?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon icon='mdi:heart-outline' fontSize={16} style={{ color: theme.palette.text.secondary }} />
              <Typography variant='caption' sx={{ color: theme.palette.text.secondary, fontSize: '12px' }}>
                {item?.likedBy?.length}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Rating Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating name='read-only' size='small' value={item?.averageRating || 0} precision={0.5} readOnly />
          <Typography variant='caption' sx={{ color: theme.palette.text.secondary }}>
            {item.totalReviews > 0 ? `(${item.totalReviews})` : `(${t('not_review')})`}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
          <Button
            variant='outlined'
            fullWidth
            sx={{
              height: 42,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              },
              transition: 'all 0.2s'
            }}
            disabled={item.countInStock < 1}
            onClick={() => handleUpdateProductToCart(item)}
            startIcon={<Icon icon='solar:cart-plus-bold' fontSize={20} />}
          >
            {t('Add_to_cart')}
          </Button>
          <Button
            variant='contained'
            fullWidth
            sx={{
              height: 42,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              boxShadow: theme.shadows[4],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              },
              transition: 'all 0.2s'
            }}
            disabled={item.countInStock < 1}
            onClick={() => handleBuyProductToCart(item)}
            startIcon={<Icon icon='solar:cart-check-bold' fontSize={20} />}
          >
            {t('Buy_now')}
          </Button>
        </Box>
      </CardContent>
    </StyleCard>
  )
}

export default CardProduct
