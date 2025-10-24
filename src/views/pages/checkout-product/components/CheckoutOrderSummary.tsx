// ** React
import { useState } from 'react'

// ** Mui
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Divider,
  Avatar,
  useTheme 
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Utils
import { formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

type TProps = {
  products: TItemOrderProduct[]
  subtotal: number
  shippingFee: number
  discountAmount?: number
  onPlaceOrder: () => void
  isDisabled: boolean
}

const CheckoutOrderSummary = ({ 
  products, 
  subtotal, 
  shippingFee, 
  discountAmount = 0, 
  onPlaceOrder, 
  isDisabled 
}: TProps) => {
  const theme = useTheme()
  const [promoCode, setPromoCode] = useState('')

  const finalTotal = subtotal - discountAmount + shippingFee

  const handleApplyPromoCode = () => {
    // TODO: Implement promo code logic
    console.log('Apply promo code:', promoCode)
  }

  return (
    <Card 
      sx={{ 
        position: 'sticky',
        top: 20,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[4]
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Icon icon='mdi:shopping-checkout' fontSize={24} />
          Tóm tắt đơn hàng
        </Typography>

        {/* Order Review - Products */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.secondary }}>
            Đánh giá đơn hàng ({products.length} sản phẩm)
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {products.map((product) => {
              const finalPrice = product.discount > 0 
                ? (product.price * (100 - product.discount)) / 100 
                : product.price

              return (
                <Box 
                  key={product.product}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Avatar 
                    src={product.image} 
                    sx={{ 
                      width: 60, 
                      height: 60,
                      borderRadius: 1
                    }} 
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.3
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Số lượng: {product.amount}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {product.discount > 0 ? (
                      <>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textDecoration: 'line-through',
                            color: theme.palette.text.secondary,
                            fontSize: '12px'
                          }}
                        >
                          {formatNumberToLocal(product.price)} VND
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.primary.main
                          }}
                        >
                          {formatNumberToLocal(finalPrice)} VND
                        </Typography>
                      </>
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.primary.main
                        }}
                      >
                        {formatNumberToLocal(product.price)} VND
                      </Typography>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Promo Code Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.secondary }}>
            Mã giảm giá
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập mã giảm giá"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim()}
              sx={{
                borderRadius: 1,
                px: 2,
                minWidth: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.secondary }}>
            Tổng kết
          </Typography>
          
          {/* Subtotal */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tạm tính
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatNumberToLocal(subtotal)} VND
            </Typography>
          </Box>

          {/* Discount */}
          {discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="success.main">
                Giảm giá
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight={500}>
                -{formatNumberToLocal(discountAmount)} VND
              </Typography>
            </Box>
          )}

          {/* Shipping */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Phí vận chuyển
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatNumberToLocal(shippingFee)} VND
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Tổng cộng
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                fontSize: '24px'
              }}
            >
              {formatNumberToLocal(finalTotal)} VND
            </Typography>
          </Box>
        </Box>

        {/* CTA Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={isDisabled}
          onClick={onPlaceOrder}
          sx={{
            height: 56,
            borderRadius: 2,
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: theme.shadows[4],
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: theme.shadows[8],
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: theme.palette.grey[300],
              color: theme.palette.grey[500],
              boxShadow: 'none',
              transform: 'none',
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Icon icon='mdi:shopping-checkout' fontSize={20} style={{ marginRight: 8 }} />
          Đặt hàng ngay
        </Button>

        {/* Security Notice */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Icon icon='mdi:shield-check-outline' fontSize={14} />
            Thanh toán an toàn và bảo mật
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CheckoutOrderSummary
