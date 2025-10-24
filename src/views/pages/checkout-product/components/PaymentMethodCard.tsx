// ** React
import { useState } from 'react'

// ** Mui
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme 
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TPaymentOption = {
  label: string
  value: string
  type: string
}

type TProps = {
  paymentOptions: TPaymentOption[]
  selectedPayment: string
  onPaymentChange: (value: string) => void
}

const PaymentMethodCard = ({ paymentOptions, selectedPayment, onPaymentChange }: TProps) => {
  const theme = useTheme()

  const getPaymentIcon = (type: string, label: string) => {
    const lowerType = type.toLowerCase()
    const lowerLabel = label.toLowerCase()
    
    if (lowerType.includes('vnpay') || lowerLabel.includes('vnpay')) {
      return 'simple-icons:vnpay'
    } else if (lowerType.includes('cod') || lowerLabel.includes('cod') || lowerLabel.includes('nhận hàng')) {
      return 'mdi:cash-multiple'
    } else if (lowerType.includes('bank') || lowerLabel.includes('bank')) {
      return 'mdi:bank'
    } else if (lowerType.includes('card') || lowerLabel.includes('card')) {
      return 'mdi:credit-card'
    }
    return 'mdi:wallet'
  }

  const getPaymentDescription = (type: string, label: string) => {
    const lowerType = type.toLowerCase()
    const lowerLabel = label.toLowerCase()
    
    if (lowerType.includes('vnpay') || lowerLabel.includes('vnpay')) {
      return 'Thanh toán qua VNPay - An toàn và tiện lợi'
    } else if (lowerType.includes('cod') || lowerLabel.includes('cod') || lowerLabel.includes('nhận hàng')) {
      return 'Thanh toán khi nhận hàng - Không cần thẻ'
    } else if (lowerType.includes('bank') || lowerLabel.includes('bank')) {
      return 'Chuyển khoản ngân hàng'
    } else if (lowerType.includes('card') || lowerLabel.includes('card')) {
      return 'Thanh toán bằng thẻ tín dụng/ghi nợ'
    }
    return 'Phương thức thanh toán khác'
  }

  const getPaymentColor = (type: string) => {
    const lowerType = type.toLowerCase()
    
    if (lowerType.includes('vnpay')) {
      return theme.palette.info.main
    } else if (lowerType.includes('cod')) {
      return theme.palette.warning.main
    } else if (lowerType.includes('bank')) {
      return theme.palette.success.main
    } else if (lowerType.includes('card')) {
      return theme.palette.error.main
    }
    return theme.palette.primary.main
  }

  return (
    <Card 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1]
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: hexToRGBA(theme.palette.info.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon icon='mdi:credit-card-outline' fontSize={20} style={{ color: theme.palette.info.main }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Phương thức thanh toán
          </Typography>
        </Box>

        {/* Payment Options */}
        <RadioGroup
          value={selectedPayment}
          onChange={(e) => onPaymentChange(e.target.value)}
          sx={{ gap: 2 }}
        >
          {paymentOptions.map((option) => {
            const paymentColor = getPaymentColor(option.type)
            return (
              <Card
                key={option.value}
                sx={{
                  border: selectedPayment === option.value 
                    ? `2px solid ${paymentColor}` 
                    : `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: selectedPayment === option.value 
                    ? hexToRGBA(paymentColor, 0.05)
                    : theme.palette.background.paper,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: paymentColor,
                    backgroundColor: hexToRGBA(paymentColor, 0.02),
                  }
                }}
                onClick={() => onPaymentChange(option.value)}
              >
                <CardContent sx={{ p: 2 }}>
                  <FormControlLabel
                    value={option.value}
                    control={
                      <Radio 
                        sx={{
                          color: paymentColor,
                          '&.Mui-checked': {
                            color: paymentColor,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: hexToRGBA(paymentColor, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon 
                            icon={getPaymentIcon(option.type, option.label)} 
                            fontSize={20} 
                            style={{ color: paymentColor }} 
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getPaymentDescription(option.type, option.label)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </CardContent>
              </Card>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export default PaymentMethodCard
