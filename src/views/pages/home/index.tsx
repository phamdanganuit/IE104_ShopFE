// ** Next
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, Typography, useTheme, Tab, Tabs, TabsProps, IconButton } from '@mui/material'

// ** Redux

// ** Components
import Spinner from 'src/components/spinner'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import InputSearch from 'src/components/input-search'
import Icon from 'src/components/Icon'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Services
import { getAllProductTypes } from 'src/services/product-type'
import { getAllCities } from 'src/services/city'
import { getAllProductsPublic } from 'src/services/product'

// ** Utils
import { formatFilter } from 'src/utils'
import { TProduct } from 'src/types/product'
import { styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/product'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import CustomSelect from 'src/components/custom-select'
import CardSkeleton from 'src/views/pages/product/components/CardSkeleton'
import { useRouter } from 'next/router'
import { keyframes } from '@mui/system'

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const CustomPagination = dynamic(() => import('src/components/custom-pagination'))
const FilterProduct = dynamic(() => import('src/views/pages/product/components/FilterProduct'))
const NoData = dynamic(() => import('src/components/no-data'))
const ChatBotAI = dynamic(() => import('src/components/chat-bot-ai'), { ssr: false })

interface TOptions {
  label: string
  value: string
}

type TProps = {
  products: TProduct[]
  totalCount: number
  productTypesServer: TOptions[]
  paramsServer: {
    limit: number
    page: number
    order: string
    productType: string
  }
}

interface TProductPublicState {
  data: TProduct[]
  total: number
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px 12px 0 0',
    padding: '8px 16px',
    boxShadow: theme.shadows[2]
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px',
    minHeight: '48px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
      borderRadius: '8px'
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiTabs-indicator': {
    height: '3px',
    borderRadius: '3px 3px 0 0',
    backgroundColor: theme.palette.primary.main
  }
}))

const StyledSearchBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '32px',
  boxShadow: theme.shadows[4]
}))

const HomePage: NextPage<TProps> = props => {
  // ** Translate
  const { t } = useTranslation()

  // ** Props
  const { products, totalCount, paramsServer, productTypesServer } = props

  // State
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [productTypeSelected, setProductTypeSelected] = useState('')
  const [reviewSelected, setReviewSelected] = useState('')
  const [locationSelected, setLocationSelected] = useState('')

  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // Banner carousel state
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const bannerImages = [
    '/images/banner-home.jpg',
    '/images/banner-2.jpg',
    '/images/banner-3.jpg'
    // Thêm các banner khác tại đây
  ]

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (!firstRender.current) {
      firstRender.current = true
    }
    setProductTypeSelected(newValue)
  }

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length)
  }

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentBannerIndex(index)
  }

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [productsPublic, setProductsPublic] = useState<TProductPublicState>({
    data: [],
    total: 0
  })

  // ** Ref
  const firstRender = useRef<boolean>(false)
  const isServerRendered = useRef<boolean>(false)

  // ** Redux
  const {
    isSuccessLike,
    isErrorLike,
    isErrorUnLike,
    typeError,
    isSuccessUnLike,
    messageErrorLike,
    messageErrorUnLike,
    isLoading
  } = useSelector((state: RootState) => state.product)
  const dispatch: AppDispatch = useDispatch()

  // ** theme
  const theme = useTheme()
  const router = useRouter()

  // fetch api
  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    await getAllProductsPublic(query).then(res => {
      if (res?.data) {
        setLoading(false)
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount
        })
      }
    })
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
    if (!firstRender.current) {
      firstRender.current = true
    }
  }

  const handleFilterProduct = (value: string, type: string) => {
    switch (type) {
      case 'review': {
        setReviewSelected(value)
        if (!firstRender.current) {
          firstRender.current = true
        }
        break
      }
      case 'location': {
        setLocationSelected(value)
        if (!firstRender.current) {
          firstRender.current = true
        }
        break
      }
    }
  }

  const handleResetFilter = () => {
    setLocationSelected('')
    setReviewSelected('')
  }

  // ** fetch api
  const fetchAllTypes = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.productTypes
        if (data) {
          setOptionTypes(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
          setProductTypeSelected(data?.[0]?._id)
          firstRender.current = true
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
          console.log('🚀 ~ fetchAllCities ~ data:', data)

          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllCities()

    // fetchAllTypes()
  }, [])

  // Auto-play banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length)
    }, 5000) // Chuyển banner sau mỗi 5 giây

    return () => clearInterval(interval)
  }, [bannerImages.length])

  useEffect(() => {
    if (!isServerRendered.current && paramsServer && !!productTypesServer.length) {
      setPage(paramsServer.page)
      setPageSize(paramsServer.limit)
      setSortBy(paramsServer.order)
      if (paramsServer.productType) {
        setProductTypeSelected(paramsServer.productType)
      }
      setProductsPublic({
        data: products,
        total: totalCount
      })
      setOptionTypes(productTypesServer)
      isServerRendered.current = true
    }
  }, [paramsServer, products, totalCount, productTypesServer])

  useEffect(() => {
    if (isServerRendered.current && firstRender.current) {
      handleGetListProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    if (isServerRendered.current && firstRender.current) {
      setFilterBy({ productType: productTypeSelected, minStar: reviewSelected, productLocation: locationSelected })
    }
  }, [productTypeSelected, reviewSelected, locationSelected])

  useEffect(() => {
    if (isSuccessLike) {
      toast.success(t('Like_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
    } else if (isErrorLike && messageErrorLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Like_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessLike, isErrorLike, messageErrorLike, typeError])

  useEffect(() => {
    if (isSuccessUnLike) {
      toast.success(t('Unlike_product_success'))
      dispatch(resetInitialState())
      handleGetListProducts()
    } else if (isErrorUnLike && messageErrorUnLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Unlike_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUnLike, isErrorUnLike, messageErrorUnLike, typeError])

  return (
    <>
      {loading && <Spinner />}
      <ChatBotAI />
      <Box
        sx={{
          height: '100%',
          width: '100%',
          backgroundColor: 'background.default'
        }}
      >
        {/* Hero Banner Carousel Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: theme.shadows[8],
            position: 'relative',
            overflow: 'hidden',
            height: { xs: '200px', sm: '250px', md: '300px', lg: '350px' }
          }}
        >
          {/* Decorative Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(60px)',
              zIndex: 1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              filter: 'blur(50px)',
              zIndex: 1
            }}
          />

          {/* Banner Images Carousel */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {bannerImages.map((image, index) => (
              <Box
                key={index}
                component='img'
                src={image}
                alt={`Banner ${index + 1}`}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  objectPosition: 'center',
                  opacity: currentBannerIndex === index ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: 2,
                  imageRendering: 'crisp-edges'
                }}
                onError={(e: any) => {
                  // Fallback if image not found
                  e.target.style.display = 'none'
                }}
              />
            ))}
          </Box>

          {/* Previous Button */}
          <IconButton
            onClick={handlePrevBanner}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              width: { xs: 36, md: 48 },
              height: { xs: 36, md: 48 },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)'
              },
              transition: 'all 0.3s'
            }}
          >
            <Icon icon='solar:alt-arrow-left-bold' fontSize={24} style={{ color: theme.palette.primary.main }} />
          </IconButton>

          {/* Next Button */}
          <IconButton
            onClick={handleNextBanner}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              width: { xs: 36, md: 48 },
              height: { xs: 36, md: 48 },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)'
              },
              transition: 'all 0.3s'
            }}
          >
            <Icon icon='solar:alt-arrow-right-bold' fontSize={24} style={{ color: theme.palette.primary.main }} />
          </IconButton>

          {/* Dots Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1.5,
              zIndex: 3
            }}
          >
            {bannerImages.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: currentBannerIndex === index ? 32 : 10,
                  height: 10,
                  borderRadius: '5px',
                  backgroundColor: currentBannerIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: currentBannerIndex === index ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  '&:hover': {
                    backgroundColor: 'white',
                    transform: 'scale(1.2)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Category Tabs */}
        <StyledTabs
          value={productTypeSelected}
          onChange={handleChange}
          aria-label='product categories'
          variant='scrollable'
          scrollButtons='auto'
        >
          {optionTypes.map(opt => {
            return <Tab key={opt.value} value={opt.value} label={opt.label} />
          })}
        </StyledTabs>

        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 4,
            mb: 2,
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '300px' } }}>
              <CustomSelect
                fullWidth
                onChange={e => {
                  if (!firstRender.current) {
                    firstRender.current = true
                  }
                  setSortBy(e.target.value as string)
                }}
                value={sortBy}
                options={[
                  {
                    label: t('Sort_best_sold'),
                    value: 'sold desc'
                  },
                  {
                    label: t('Sort_new_create'),
                    value: 'createdAt desc'
                  },
                  {
                    label: t('Sort_high_view'),
                    value: 'views desc'
                  },
                  {
                    label: t('Sort_high_like'),
                    value: 'totalLikes desc'
                  }
                ]}
                placeholder={t('Sort_by')}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '300px' } }}>
              <InputSearch
                placeholder={t('Search_name_product')}
                value={searchBy}
                onChange={(value: string) => {
                  if (!firstRender.current) {
                    firstRender.current = true
                  }
                  setSearchBy(value)
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            height: '100%',
            width: '100%',
            mt: 4,
            mb: 8
          }}
        >
          <Grid
            container
            spacing={{
              md: 4,
              xs: 3
            }}
          >
            <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
              <Box
                sx={{
                  width: '100%',
                  position: 'sticky',
                  top: 20,
                  alignSelf: 'flex-start'
                }}
              >
                <FilterProduct
                  locationSelected={locationSelected}
                  reviewSelected={reviewSelected}
                  handleReset={handleResetFilter}
                  optionCities={optionCities}
                  handleFilterProduct={handleFilterProduct}
                />
              </Box>
            </Grid>
            <Grid item md={9} xs={12}>
              {loading ? (
                <Grid
                  container
                  spacing={{
                    md: 4,
                    xs: 3
                  }}
                >
                  {Array.from({ length: 6 }).map((_, index) => {
                    return (
                      <Grid item key={index} md={4} sm={6} xs={12}>
                        <CardSkeleton />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={{
                    md: 4,
                    xs: 3
                  }}
                >
                  {productsPublic?.data?.length > 0 ? (
                    <>
                      {productsPublic?.data?.map((item: TProduct) => {
                        return (
                          <Grid item key={item._id} md={4} sm={6} xs={12}>
                            <CardProduct item={item} />
                          </Grid>
                        )
                      })}
                    </>
                  ) : (
                    <Box sx={{ width: '100%', mt: 10 }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('No_product')} />
                    </Box>
                  )}
                </Grid>
              )}
              {totalCount > 0 && (
                <Box mt={6}>
                  <CustomPagination
                    onChangePagination={handleOnchangePagination}
                    pageSizeOptions={PAGE_SIZE_OPTION}
                    pageSize={pageSize}
                    page={page}
                    rowLength={productsPublic.total}
                    isHideShowed
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default HomePage
