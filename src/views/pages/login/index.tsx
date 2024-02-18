import { NextPage } from 'next'
import React, { useState } from 'react'

// Material-UI
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import CustomTextField from 'src/components/text-field'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IconButton, InputAdornment } from '@mui/material'
import IconifyIcon from 'src/components/Icon'

type TProps = {}

const LoginPage: NextPage<TProps> = () => {
  // state
  const [showPassword, setShowPassword] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email().required("Email can't be empty."),
    password: yup.string().required("Password can't be empty.")
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const onsubmit = (data: { email: string; password: string }) => {
    console.log(data)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
          <Box>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  margin='normal'
                  fullWidth
                  required
                  label='Email'
                  autoComplete='email'
                  autoFocus
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                />
              )}
              name='email'
            />
          </Box>
          <Box>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  margin='normal'
                  fullWidth
                  required
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <IconifyIcon icon='material-symbols:visibility-outline' />
                          ) : (
                            <IconifyIcon icon='ic:outline-visibility-off' />
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

          <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default LoginPage
