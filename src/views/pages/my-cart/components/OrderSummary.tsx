// ** React
import { useState } from 'react'

// ** Mui
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme,
  TextField,
  Button,
  Divider,
  Alert
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Utils
import { formatNumberToLocal } from 'src/utils'

// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

// ** Translate
import { t } from 'i18next'

type TProps = {
  selectedItems: TItemOrderProduct[]
  totalAmount: number
  onProceedToCheckout: () => void
  isDisabled: boolean
}

const OrderSummary = ({ selectedItems, totalAmount, onProceedToCheckout, isDisabled }: TProps) => {
  const theme = useTheme()
  const [promoCode, setPromoCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [shippingFee] = useState(30000) // Fixed shipping fee for now

  const subtotal = totalAmount
  const finalTotal = subtotal - discountAmount + shippingFee

  const handleApplyPromoCode = () => {
    // TODO: Implement promo code logic
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscountAmount(subtotal * 0.1) // 10% discount
    } else {
      setDiscountAmount(0)
    }
  }

  return (
    <Card 
      sx={{ 
        position: 'sticky',
        top: 20,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[2]
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
          <Icon icon='mdi:shopping-cart-outline' fontSize={24} />
          Tóm tắt đơn hàng
        </Typography>

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
          {promoCode.toLowerCase() === 'welcome10' && (
            <Alert severity="success" sx={{ mt: 1, fontSize: '12px' }}>
              Mã giảm giá hợp lệ! Bạn được giảm 10%
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Order Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.secondary }}>
            Chi tiết đơn hàng
          </Typography>
          
          {/* Subtotal */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tạm tính ({selectedItems.length} sản phẩm)
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Phí vận chuyển
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatNumberToLocal(shippingFee)} VND
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Total */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          onClick={onProceedToCheckout}
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
          <Icon icon='icon-park-outline:buy' fontSize={20} style={{ marginRight: 8 }} />
          Tiến hành thanh toán
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

export default OrderSummary
