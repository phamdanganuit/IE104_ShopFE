// ** React
import { useMemo } from 'react'

// ** Mui
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  useTheme 
} from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Utils
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Translate
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

type TProps = {
  onOpenAddressModal: () => void
}

const ShippingAddressCard = ({ onOpenAddressModal }: TProps) => {
  const theme = useTheme()
  const { user } = useAuth()
  const { i18n } = useTranslation()

  const memoAddressDefault = useMemo(() => {
    const findAddress = user?.addresses?.find(item => item.isDefault)
    return findAddress
  }, [user?.addresses])

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
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon icon='carbon:location' fontSize={20} style={{ color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Địa chỉ giao hàng
          </Typography>
        </Box>

        {/* Address Content */}
        {user && user?.addresses?.length > 0 && memoAddressDefault ? (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
                {toFullName(
                  memoAddressDefault?.lastName || '',
                  memoAddressDefault?.middleName || '',
                  memoAddressDefault?.firstName || '',
                  i18n.language
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                📞 {memoAddressDefault?.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📍 {memoAddressDefault?.address}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={onOpenAddressModal}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.05),
                  borderColor: theme.palette.primary.dark,
                }
              }}
            >
              <Icon icon='mdi:pencil-outline' fontSize={16} style={{ marginRight: 8 }} />
              Thay đổi địa chỉ
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bạn chưa có địa chỉ giao hàng
            </Typography>
            <Button
              variant="contained"
              onClick={onOpenAddressModal}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              <Icon icon='mdi:plus' fontSize={16} style={{ marginRight: 8 }} />
              Thêm địa chỉ
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ShippingAddressCard
