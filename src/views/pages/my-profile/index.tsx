// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import React from 'react'

// ** Mui
import { Avatar, Box, Button, FormHelperText, Grid, IconButton, InputLabel, useTheme } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG } from 'src/configs/regex'

// ** Translate
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

// ** services
import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

// ** Utils
import { convertBase64, separationFullName, toFullName } from 'src/utils'

// ** Redux
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** component
import FallbackSpinner from 'src/components/fall-back'

// ** Other
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  phoneNumber: string
  role: string
  fullName: string
}

const MyProfilePage: NextPage<TProps> = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // ** Hooks
  const { i18n } = useTranslation()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdateMe, messageUpdateMe, isSuccessUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const schema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().notRequired(),
    phoneNumber: yup.string().required(t('Required_field')).min(9, 'The phone number is min 9 number'),
    role: isDisabledRole ? yup.string().notRequired() : yup.string().required(t('Required_field')),
    city: yup.string().notRequired(),
    address: yup.string().notRequired()
  })

  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    city: '',
    phoneNumber: '',
    role: '',
    fullName: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // fetch api
  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setIsDisabledRole(!data?.role?.permissions?.length)
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
          })
          setAvatar(data?.avatar)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.roles
        if (data) {
          setOptionRoles(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
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

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n.language])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }
      dispatch(resetInitialState())
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
  }, [])

  const onSubmit = (data: any) => {
    const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language)
    dispatch(
      updateAuthMeAsync({
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        avatar,
        address: data.address,
        city: data.city
      })
    )
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  return (
    <>
      {loading || (isLoading && <Spinner />)}
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: '20px',
          padding: { xs: 3, md: 5 },
          boxShadow: theme.shadows[1]
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: '16px',
            padding: 4,
            marginBottom: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(40px)'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            <Icon icon='solar:user-circle-bold-duotone' fontSize={40} />
            <Box>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
                {t('My_profile') || 'Thông tin cá nhân'}
              </h2>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                {t('Manage your profile') || 'Quản lý thông tin hồ sơ của bạn'}
              </p>
            </Box>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
          <Grid container spacing={4}>
            {/* Avatar Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '16px',
                  padding: 4,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {/* Avatar */}
                  <Box sx={{ position: 'relative' }}>
                    {avatar && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          zIndex: 2,
                          backgroundColor: theme.palette.error.main,
                          color: 'white',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            backgroundColor: theme.palette.error.dark
                          }
                        }}
                        onClick={() => setAvatar('')}
                      >
                        <Icon icon='solar:trash-bin-minimalistic-bold' fontSize={18} />
                      </IconButton>
                    )}
                    {avatar ? (
                      <Avatar
                        src={avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          border: `4px solid ${theme.palette.primary.main}`,
                          boxShadow: theme.shadows[6]
                        }}
                      >
                        <Icon icon='solar:user-bold' fontSize={80} />
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          border: `4px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.action.hover
                        }}
                      >
                        <Icon icon='solar:user-bold' fontSize={80} style={{ color: theme.palette.text.secondary }} />
                      </Avatar>
                    )}
                  </Box>

                  {/* Upload Button */}
                  <Box sx={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
                      {t('Profile picture') || 'Ảnh đại diện'}
                    </h3>
                    <p
                      style={{
                        margin: '0 0 16px 0',
                        color: theme.palette.text.secondary,
                        fontSize: '14px'
                      }}
                    >
                      {t('Upload avatar desc') ||
                        'Tải lên ảnh đại diện của bạn. Định dạng JPG hoặc PNG, tối đa 5MB'}
                    </p>
                    <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png']
                      }}
                    >
                      <Button
                        variant='contained'
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          padding: '10px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Icon icon='solar:camera-bold' fontSize={20} />
                        {avatar ? t('Change avatar') || 'Đổi ảnh' : t('Upload avatar') || 'Tải ảnh lên'}
                      </Button>
                    </WrapperFileUpload>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '16px',
                  padding: 4,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Icon icon='solar:shield-user-bold-duotone' fontSize={28} style={{ color: theme.palette.primary.main }} />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                    {t('Account information') || 'Thông tin tài khoản'}
                  </h3>
                </Box>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          required
                          fullWidth
                          disabled
                          label={t('Email')}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('Enter your email')}
                          error={Boolean(errors?.email)}
                          helperText={errors?.email?.message}
                        />
                      )}
                      name='email'
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {!isDisabledRole && (
                      <Controller
                        control={control}
                        rules={{
                          required: true
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <div>
                            <label
                              style={{
                                fontSize: '13px',
                                marginBottom: '4px',
                                display: 'block',
                                color: errors?.role
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              {t('Role')} <span style={{ color: theme.palette.error.main }}>*</span>
                            </label>
                            <CustomSelect
                              fullWidth
                              disabled
                              onChange={onChange}
                              options={optionRoles}
                              error={Boolean(errors?.role)}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter your role')}
                            />
                            {errors?.role?.message && (
                              <FormHelperText
                                sx={{
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {errors?.role?.message}
                              </FormHelperText>
                            )}
                          </div>
                        )}
                        name='role'
                      />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '16px',
                  padding: 4,
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Icon
                    icon='solar:user-id-bold-duotone'
                    fontSize={28}
                    style={{ color: theme.palette.primary.main }}
                  />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                    {t('Personal information') || 'Thông tin cá nhân'}
                  </h3>
                </Box>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          fullWidth
                          label={t('Full_name')}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('Enter your full name')}
                          error={Boolean(errors?.fullName)}
                          helperText={errors?.fullName?.message}
                        />
                      )}
                      name='fullName'
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          required
                          fullWidth
                          label={t('Phone number')}
                          onChange={e => {
                            const numValue = e.target.value.replace(/\D/g, '')
                            onChange(numValue)
                          }}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            minLength: 8
                          }}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('Enter your phone')}
                          error={Boolean(errors?.phoneNumber)}
                          helperText={errors?.phoneNumber?.message}
                        />
                      )}
                      name='phoneNumber'
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      name='address'
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CustomTextField
                          fullWidth
                          label={t('Address')}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('Enter your address')}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='city'
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box>
                          <InputLabel
                            sx={{
                              fontSize: '13px',
                              marginBottom: '4px',
                              display: 'block',
                              color: errors?.city
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {t('City')}
                          </InputLabel>
                          <CustomSelect
                            fullWidth
                            onChange={onChange}
                            options={optionCities}
                            error={Boolean(errors?.city)}
                            onBlur={onBlur}
                            value={value}
                            placeholder={t('Enter_your_city')}
                          />
                          {errors?.city?.message && (
                            <FormHelperText
                              sx={{
                                color: errors?.city
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              {errors?.city?.message}
                            </FormHelperText>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  pt: 2
                }}
              >
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 32px'
                  }}
                  onClick={() => {
                    fetchGetAuthMe()
                  }}
                >
                  {t('Cancel') || 'Hủy'}
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 32px',
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Icon icon='solar:diskette-bold' fontSize={20} style={{ marginRight: '8px' }} />
                  {t('Update') || 'Cập nhật'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default MyProfilePage
