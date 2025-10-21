// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import React from 'react'

// ** Mui
import { Box, Button, CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { PASSWORD_REG } from 'src/configs/regex'

// ** Images
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/auth'
import { changePasswordMeAsync } from 'src/stores/auth/actions'

// ** Components
import FallbackSpinner from 'src/components/fall-back'

// ** Others
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePasswordPage: NextPage<TProps> = () => {
  // State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // ** router
  const router = useRouter()

  // ** auth
  const { logout } = useAuth()

  // ** Translate
  const { t } = useTranslation()

  /// ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorChangePassword, isSuccessChangePassword, messageChangePassword } = useSelector(
    (state: RootState) => state.auth
  )

  // ** theme
  const theme = useTheme()

  const schema = yup.object().shape({
    currentPassword: yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    newPassword: yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    confirmNewPassword: yup
      .string()
      .required(t('Required_field'))
      .matches(PASSWORD_REG, t('Rules_password'))
      .oneOf([yup.ref('newPassword'), ''], t('Rules_confirm_new_password'))
  })

  const defaultValues: TDefaultValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { currentPassword: string; newPassword: string }) => {
    if (!Object.keys(errors).length) {
      dispatch(changePasswordMeAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
    }
  }

  useEffect(() => {
    if (messageChangePassword) {
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        setTimeout(() => {
          logout()
        }, 500)
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorChangePassword, isSuccessChangePassword, messageChangePassword])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '20px', md: '40px' },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-40%',
            right: '-15%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(70px)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-35%',
            left: '-15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            filter: 'blur(60px)'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1200px',
            gap: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            display={{
              xs: 'none',
              md: 'flex'
            }}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '500px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Image
              src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
              alt='change password image'
              style={{
                height: 'auto',
                width: 'auto',
                maxWidth: '100%'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: { xs: '32px 24px', md: '48px 40px' },
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                width: { xs: '100%', sm: '450px' },
                maxWidth: '500px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <Box
                sx={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
                }}
              >
                <Icon icon='solar:key-bold-duotone' fontSize={36} style={{ color: '#fff' }} />
              </Box>
              <Typography 
                component='h1' 
                variant='h4' 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {t('Change_password')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 3, color: theme.palette.text.secondary, textAlign: 'center' }}>
                Create a new secure password for your account
              </Typography>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate style={{ width: '100%' }}>
              <Box sx={{ mt: 2, width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Current_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_password')}
                      error={Boolean(errors?.currentPassword)}
                      helperText={errors?.currentPassword?.message}
                      type={showCurrentPassword ? 'text' : 'password'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='currentPassword'
                />
              </Box>

              <Box sx={{ mt: 2, width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('New_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_new_password')}
                      error={Boolean(errors?.newPassword)}
                      helperText={errors?.newPassword?.message}
                      type={showNewPassword ? 'text' : 'password'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='newPassword'
                />
              </Box>

              <Box sx={{ mt: 2, width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Confirm_new_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_confirm_new_password')}
                      error={Boolean(errors?.confirmNewPassword)}
                      helperText={errors?.confirmNewPassword?.message}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                              {showConfirmNewPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='confirmNewPassword'
                />
              </Box>

              <Button 
                type='submit' 
                fullWidth 
                variant='contained' 
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  height: '48px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${theme.palette.primary.main}60`
                  }
                }}
              >
                {t('Change_password')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default ChangePasswordPage
