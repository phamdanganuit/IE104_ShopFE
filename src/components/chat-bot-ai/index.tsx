import { Box, Fab, Fade, IconButton, Paper, Typography, TextField, Avatar, Chip } from '@mui/material'
import { styled, useTheme, keyframes } from '@mui/material'
import Script from 'next/script'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/components/Icon'

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
  }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: '100px',
  right: '24px',
  width: '380px',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.palette.divider}`,
  zIndex: 9999,
  animation: `${slideUp} 0.3s ease-out`,
  
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 48px)',
    height: '70vh',
    bottom: '90px',
    right: '24px'
  }
}))

const ChatHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  padding: '20px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
  }
}))

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '10px',
    '&:hover': {
      background: theme.palette.primary.dark
    }
  }
}))

const MessageBubble = styled(Box)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  maxWidth: '75%',
  padding: '12px 16px',
  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser 
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isUser ? '#fff' : theme.palette.text.primary,
  boxShadow: isUser 
    ? `0 4px 12px ${theme.palette.primary.main}40`
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  animation: `${slideUp} 0.3s ease-out`,
  position: 'relative',
  border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
  
  '& .message-time': {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.7,
    display: 'block'
  }
}))

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  background: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    transition: 'all 0.3s ease',
    
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
    },
    
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.default,
      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`
    }
  }
}))

const FloatingButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '64px',
  height: '64px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: '#fff',
  boxShadow: `0 8px 24px ${theme.palette.primary.main}60`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 9998,
  borderRadius: '50%',
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: `0 12px 32px ${theme.palette.primary.main}80`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
  },
  
  '&.has-notification': {
    animation: `${pulse} 2s infinite`
  }
}))

const NotificationBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  background: theme.palette.error.main,
  color: '#fff',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.palette.background.default}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
}))

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '4px',
  padding: '12px 16px',
  background: theme.palette.background.paper,
  borderRadius: '20px 20px 20px 4px',
  alignSelf: 'flex-start',
  maxWidth: '75px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
  
  '& span': {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: theme.palette.primary.main,
    animation: 'typing 1.4s infinite',
    
    '&:nth-of-type(2)': {
      animationDelay: '0.2s'
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s'
    }
  },
  
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
      opacity: 0.5
    },
    '30%': {
      transform: 'translateY(-10px)',
      opacity: 1
    }
  }
}))

const QuickReply = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  background: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  
  '&:hover': {
    background: theme.palette.primary.main,
    color: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
  }
}))

const ProductCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '12px',
  padding: '12px',
  marginTop: '8px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
    borderColor: theme.palette.primary.main
  }
}))

const ProductImage = styled('img')({
  width: '60px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '8px'
})

interface Message {
  text: string
  isUser: boolean
  time: string
  products?: any[] // Thêm field để lưu sản phẩm gợi ý
}

const ChatBotAI = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: t('Welcome to our support! How can I help you today?') || 'Chào bạn! Tôi có thể giúp gì cho bạn?',
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasNotification, setHasNotification] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    'Sản phẩm bán chạy',
    'Chính sách đổi trả',
    'Hỗ trợ đặt hàng',
    'Thời gian giao hàng'
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Gọi Groq API
      const response = await fetch('/api/chat/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.slice(-6) // Gửi 6 tin nhắn gần nhất để tiết kiệm tokens
        })
      })

      const data = await response.json()

      setIsTyping(false)

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      const botMessage: Message = {
        text: data.message,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: data.products || [] // Lưu sản phẩm gợi ý nếu có
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error: any) {
      setIsTyping(false)
      console.error('Chat error:', error)
      
      // Hiển thị thông báo lỗi thân thiện
      const errorMessage: Message = {
        text: error.message === 'Invalid API key' 
          ? 'Xin lỗi, dịch vụ chatbot chưa được cấu hình. Vui lòng liên hệ quản trị viên! 🔧'
          : 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 😔',
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
  }

  const handleViewProduct = (slug: string) => {
    window.open(`/product/${slug}`, '_blank')
  }

  const handleOpen = () => {
    setIsOpen(true)
    setHasNotification(false)
  }

  return (
    <>
      <Script src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'></Script>
      
      {isOpen && (
        <ChatContainer elevation={8}>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <Icon icon='mdi:robot-excited' fontSize={24} />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  💬 {t('Support')}
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#4ade80',
                      boxShadow: '0 0 8px #4ade80'
                    }}
                  />
                  Online 24/7
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                color: '#fff',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Icon icon='mdi:close' fontSize={24} />
            </IconButton>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((message, index) => (
              <Box key={index}>
                <MessageBubble isUser={message.isUser}>
                  <Typography variant='body2' sx={{ lineHeight: 1.5 }}>
                    {message.text}
                  </Typography>
                  <Typography className='message-time' variant='caption'>
                    {message.time}
                  </Typography>
                </MessageBubble>
                
                {/* Hiển thị sản phẩm gợi ý nếu có */}
                {!message.isUser && message.products && message.products.length > 0 && (
                  <Box sx={{ maxWidth: '75%', mt: 1 }}>
                    {message.products.slice(0, 3).map((product: any) => {
                      const finalPrice = product.price - (product.price * product.discount / 100)
                      
                      return (
                        <ProductCard key={product._id} onClick={() => handleViewProduct(product.slug)}>
                          <ProductImage 
                            src={product.image || '/images/placeholder-product.png'} 
                            alt={product.name}
                            onError={(e: any) => {
                              e.target.src = '/images/placeholder-product.png'
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant='body2' 
                              sx={{ 
                                fontWeight: 600, 
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Typography variant='caption' color='primary' sx={{ fontWeight: 700 }}>
                              {finalPrice.toLocaleString('vi-VN')}₫
                            </Typography>
                            {product.discount > 0 && (
                              <Typography 
                                variant='caption' 
                                sx={{ 
                                  ml: 1, 
                                  textDecoration: 'line-through', 
                                  opacity: 0.6 
                                }}
                              >
                                {product.price.toLocaleString('vi-VN')}₫
                              </Typography>
                            )}
                            <Typography variant='caption' sx={{ display: 'block', opacity: 0.7 }}>
                              {product.countInStock > 0 ? `Còn ${product.countInStock} sp` : 'Hết hàng'}
                            </Typography>
                          </Box>
                        </ProductCard>
                      )
                    })}
                    {message.products.length > 3 && (
                      <Typography 
                        variant='caption' 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 1, 
                          opacity: 0.7 
                        }}
                      >
                        Và {message.products.length - 3} sản phẩm khác...
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
            
            {isTyping && (
              <TypingIndicator>
                <span />
                <span />
                <span />
              </TypingIndicator>
            )}

            {messages.length <= 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {quickReplies.map((reply, index) => (
                  <QuickReply
                    key={index}
                    label={reply}
                    onClick={() => handleQuickReply(reply)}
                  />
                ))}
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <StyledTextField
              fullWidth
              size='small'
              placeholder='Nhập tin nhắn...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                width: 44,
                height: 44,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'scale(1.05)'
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Icon icon='material-symbols:send' fontSize={20} />
            </IconButton>
          </InputContainer>
        </ChatContainer>
      )}

      <FloatingButton
        onClick={handleOpen}
        className={hasNotification ? 'has-notification' : ''}
      >
        {hasNotification && <NotificationBadge>1</NotificationBadge>}
        <Icon icon='mdi:robot-excited' fontSize={32} />
      </FloatingButton>
    </>
  )
}

export default ChatBotAI
