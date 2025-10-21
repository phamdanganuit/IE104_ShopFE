// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Button, CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import FallbackSpinner from 'src/components/fall-back'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Images
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync, registerAuthFacebookAsync, registerAuthGoogleAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/auth'

// ** Other
import { ROUTE_CONFIG } from 'src/configs/route'
import toast from 'react-hot-toast'
import {
  clearLocalPreTokenAuthSocial,
  getLocalPreTokenAuthSocial,
  setLocalPreTokenAuthSocial
} from 'src/helpers/storage'

type TProps = {}

type TDefaultValue = {
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: NextPage<TProps> = () => {
  // State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const prevTokenLocal = getLocalPreTokenAuthSocial()

  // ** router
  const router = useRouter()

  /// ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth)

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t } = useTranslation()

  // ** Hooks
  const { data: session, ...restsss } = useSession()
  const schema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, t('Rules_email')),
    password: yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    confirmPassword: yup
      .string()
      .required(t('Required_field'))
      .matches(PASSWORD_REG, t('Rules_password'))
      .oneOf([yup.ref('password'), ''], t('Rules_confirm_password'))
  })

  const defaultValues: TDefaultValue = {
    email: '',
    password: '',
    confirmPassword: ''
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

  const onSubmit = (data: { email: string; password: string }) => {
    if (!Object.keys(errors)?.length) {
      dispatch(registerAuthAsync({ email: data.email, password: data.password }))
    }
  }

  const handleRegisterGoogle = () => {
    signIn('google')
    clearLocalPreTokenAuthSocial()
  }

  const handleRegisterFacebook = () => {
    signIn('facebook')
    clearLocalPreTokenAuthSocial()
  }

  useEffect(() => {
    if ((session as any)?.accessToken && (session as any)?.accessToken !== prevTokenLocal) {
      if ((session as any)?.provider === 'facebook') {
        dispatch(registerAuthFacebookAsync((session as any)?.accessToken))
      } else {
        dispatch(registerAuthGoogleAsync((session as any)?.accessToken))
      }
      setLocalPreTokenAuthSocial((session as any)?.accessToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(session as any)?.accessToken])

  useEffect(() => {
    if (message) {
      if (isError) {
        toast.error(message)
        dispatch(resetInitialState())
      } else if (isSuccess) {
        toast.success(t('Sign_up_success'))
        router.push(ROUTE_CONFIG.LOGIN)
        dispatch(resetInitialState())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, message])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          padding: { xs: '20px', md: '40px' },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            filter: 'blur(50px)'
          }
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
            height: '100%',
            minWidth: '50vw',
            padding: '40px',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='register image'
            style={{
              height: 'auto',
              width: 'auto',
              maxWidth: '100%'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
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
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
              }}
            >
              <Icon icon='solar:user-plus-bold-duotone' fontSize={36} style={{ color: '#fff' }} />
            </Box>
            <Typography 
              component='h1' 
              variant='h4' 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('Register')}
            </Typography>
            <Typography variant='body2' sx={{ mb: 3, color: theme.palette.text.secondary, textAlign: 'center' }}>
              Create your account to get started
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
                      label={t('Email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_email')}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
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
                    />
                  )}
                  name='email'
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
                      label={t('Password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_password')}
                      error={Boolean(errors?.password)}
                      helperText={errors?.password?.message}
                      type={showPassword ? 'text' : 'password'}
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
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
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
                  name='password'
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
                      label={t('Confirm_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_confirm_password')}
                      error={Boolean(errors?.confirmPassword)}
                      helperText={errors?.confirmPassword?.message}
                      type={showConfirmPassword ? 'text' : 'password'}
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
                            <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? (
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
                  name='confirmPassword'
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
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${theme.palette.primary.main}60`
                  }
                }}
              >
                {t('Register')}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
                  {t('You_have_account')}
                </Typography>
                <Link
                  href='/login'
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  {t('Login')}
                </Link>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
                <Typography variant='body2' sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                  {t('Or')}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IconButton 
                  onClick={handleRegisterFacebook}
                  sx={{ 
                    width: '56px',
                    height: '56px',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    color: '#497ce2',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#497ce2',
                      backgroundColor: 'rgba(73, 124, 226, 0.08)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 16px rgba(73, 124, 226, 0.25)'
                    }
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.75rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                    ></path>
                  </svg>
                </IconButton>
                <IconButton 
                  onClick={handleRegisterGoogle}
                  sx={{ 
                    width: '56px',
                    height: '56px',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    color: theme.palette.error.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.error.main,
                      backgroundColor: `${theme.palette.error.main}15`,
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 16px ${theme.palette.error.main}40`
                    }
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.75rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                    ></path>
                  </svg>
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
