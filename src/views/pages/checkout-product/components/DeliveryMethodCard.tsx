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
import { formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TDeliveryOption = {
  label: string
  value: string
  price: string
}

type TProps = {
  deliveryOptions: TDeliveryOption[]
  selectedDelivery: string
  onDeliveryChange: (value: string) => void
}

const DeliveryMethodCard = ({ deliveryOptions, selectedDelivery, onDeliveryChange }: TProps) => {
  const theme = useTheme()

  const getDeliveryIcon = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('nhanh') || lowerLabel.includes('express')) {
      return 'mdi:truck-fast'
    } else if (lowerLabel.includes('tiết kiệm') || lowerLabel.includes('standard')) {
      return 'mdi:truck-delivery'
    } else if (lowerLabel.includes('shopee')) {
      return 'simple-icons:shopee'
    }
    return 'mdi:truck'
  }

  const getDeliveryTime = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('nhanh') || lowerLabel.includes('express')) {
      return '1-2 ngày'
    } else if (lowerLabel.includes('tiết kiệm') || lowerLabel.includes('standard')) {
      return '3-5 ngày'
    } else if (lowerLabel.includes('shopee')) {
      return '2-4 ngày'
    }
    return '3-7 ngày'
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
              backgroundColor: hexToRGBA(theme.palette.success.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon icon='mdi:truck-delivery' fontSize={20} style={{ color: theme.palette.success.main }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Phương thức vận chuyển
          </Typography>
        </Box>

        {/* Delivery Options */}
        <RadioGroup
          value={selectedDelivery}
          onChange={(e) => onDeliveryChange(e.target.value)}
          sx={{ gap: 2 }}
        >
          {deliveryOptions.map((option) => (
            <Card
              key={option.value}
              sx={{
                border: selectedDelivery === option.value 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: selectedDelivery === option.value 
                  ? hexToRGBA(theme.palette.primary.main, 0.05)
                  : theme.palette.background.paper,
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.02),
                }
              }}
              onClick={() => onDeliveryChange(option.value)}
            >
              <CardContent sx={{ p: 2 }}>
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio 
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: hexToRGBA(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon 
                          icon={getDeliveryIcon(option.label)} 
                          fontSize={16} 
                          style={{ color: theme.palette.primary.main }} 
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          ⏱️ Thời gian: {getDeliveryTime(option.label)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                          💰 Phí vận chuyển: {formatNumberToLocal(+option.price)} VND
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ margin: 0, width: '100%' }}
                />
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export default DeliveryMethodCard
