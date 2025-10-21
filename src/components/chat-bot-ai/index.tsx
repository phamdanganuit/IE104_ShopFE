import { Box, Fab, Fade, IconButton, Paper, Typography, TextField, Avatar, Chip } from '@mui/material'
import { styled, useTheme, keyframes } from '@mui/material'
import Script from 'next/script'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/components/Icon'

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
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
  width: '400px',
  height: '650px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 20px 60px rgba(0, 0, 0, 0.6)'
    : '0 20px 60px rgba(0, 0, 0, 0.15)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.08)',
  zIndex: 9999,
  animation: `${slideUp} 0.3s ease-out`,
  background: theme.palette.background.paper,
  
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 32px)',
    height: '75vh',
    bottom: '80px',
    right: '16px'
  }
}))

const ChatHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  padding: '20px 24px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderBottom: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : 'none'
}))

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '24px',
  background: theme.palette.mode === 'dark' 
    ? '#0f172a'
    : '#f8fafc',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(148, 163, 184, 0.3)'
      : 'rgba(148, 163, 184, 0.5)',
    borderRadius: '10px',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.5)'
        : 'rgba(148, 163, 184, 0.7)'
    }
  }
}))

const MessageBubble = styled(Box)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser 
    ? theme.palette.mode === 'dark'
      ? '#2563eb'
      : '#2563eb'
    : theme.palette.mode === 'dark'
      ? '#1e293b'
      : '#ffffff',
  color: isUser 
    ? '#ffffff' 
    : theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  animation: `${slideUp} 0.3s ease-out`,
  position: 'relative',
  border: isUser 
    ? 'none' 
    : theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.08)',
  
  '& .message-time': {
    fontSize: '10px',
    marginTop: '6px',
    opacity: 0.6,
    display: 'block',
    fontWeight: 500
  }
}))

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '20px 24px',
  background: theme.palette.background.paper,
  borderTop: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  gap: '12px',
  alignItems: 'center'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '28px',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : '#f1f5f9',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid transparent',
    transition: 'all 0.2s ease',
    
    '& fieldset': {
      border: 'none'
    },
    
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : '#e2e8f0',
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'transparent'
    },
    
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : '#ffffff',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    }
  },
  
  '& .MuiOutlinedInput-input': {
    padding: '12px 18px',
    fontSize: '14px'
  }
}))

const FloatingButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '64px',
  height: '64px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  color: '#fff',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 24px rgba(37, 99, 235, 0.4)'
    : '0 8px 24px rgba(37, 99, 235, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 9998,
  borderRadius: '50%',
  border: theme.palette.mode === 'dark'
    ? '2px solid rgba(255, 255, 255, 0.1)'
    : 'none',
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 32px rgba(37, 99, 235, 0.6)'
      : '0 12px 32px rgba(37, 99, 235, 0.4)',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
  },
  
  '&.has-notification': {
    animation: `${pulse} 2s infinite`
  }
}))

const NotificationBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '6px',
  right: '6px',
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: '#ef4444',
  color: '#fff',
  fontSize: '11px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid #2563eb',
  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
}))

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px',
  padding: '12px 16px',
  background: theme.palette.mode === 'dark'
    ? '#1e293b'
    : '#ffffff',
  borderRadius: '18px 18px 18px 4px',
  alignSelf: 'flex-start',
  maxWidth: '70px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.08)',
  
  '& span': {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#2563eb',
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
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(37, 99, 235, 0.1)'
    : '#eff6ff',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(37, 99, 235, 0.3)'
    : '1px solid #bfdbfe',
  color: '#2563eb',
  fontWeight: 600,
  fontSize: '13px',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  height: 'auto',
  padding: '8px 16px',
  
  '&:hover': {
    background: '#2563eb',
    color: '#fff',
    borderColor: '#2563eb',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  }
}))

const ProductCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? '#1e293b'
    : '#ffffff',
  borderRadius: '14px',
  padding: '12px',
  marginTop: '8px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid #e2e8f0',
  display: 'flex',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(37, 99, 235, 0.2)'
      : '0 4px 12px rgba(37, 99, 235, 0.15)',
    borderColor: '#2563eb'
  }
}))

const ProductImage = styled('img')({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '10px',
  flexShrink: 0
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
                  width: 48,
                  height: 48,
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Icon icon='mdi:robot-excited' fontSize={28} color='#fff' />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '16px' }}>
                  🤖 AI Support
                </Typography>
                <Typography variant='caption' sx={{ opacity: 0.95, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '12px' }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                  Trực tuyến 24/7
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                color: '#fff',
                width: 36,
                height: 36,
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Icon icon='mdi:close' fontSize={22} />
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
                          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography 
                              variant='body2' 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '14px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: theme.palette.text.primary
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography 
                                variant='body2' 
                                sx={{ 
                                  fontWeight: 700,
                                  fontSize: '15px',
                                  color: '#2563eb'
                                }}
                              >
                                {finalPrice.toLocaleString('vi-VN')}₫
                              </Typography>
                              {product.discount > 0 && (
                                <>
                                  <Typography 
                                    variant='caption' 
                                    sx={{ 
                                      textDecoration: 'line-through', 
                                      opacity: 0.5,
                                      fontSize: '12px'
                                    }}
                                  >
                                    {product.price.toLocaleString('vi-VN')}₫
                                  </Typography>
                                  <Chip 
                                    label={`-${product.discount}%`} 
                                    size='small'
                                    sx={{ 
                                      height: '20px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      background: '#fef3c7',
                                      color: '#92400e',
                                      border: 'none'
                                    }} 
                                  />
                                </>
                              )}
                            </Box>
                            <Typography 
                              variant='caption' 
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                opacity: 0.7,
                                fontSize: '12px'
                              }}
                            >
                              <Icon 
                                icon={product.countInStock > 0 ? 'mdi:check-circle' : 'mdi:close-circle'} 
                                fontSize={14}
                                color={product.countInStock > 0 ? '#10b981' : '#ef4444'}
                              />
                              {product.countInStock > 0 ? `Còn ${product.countInStock} sản phẩm` : 'Hết hàng'}
                            </Typography>
                          </Box>
                          <Icon icon='mdi:chevron-right' fontSize={20} style={{ opacity: 0.3 }} />
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
              placeholder='Nhập câu hỏi của bạn...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{
                background: '#2563eb',
                color: '#fff',
                width: 46,
                height: 46,
                '&:hover': {
                  background: '#1d4ed8',
                  transform: 'scale(1.08)'
                },
                '&:disabled': {
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#e2e8f0',
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : '#94a3b8'
                },
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Icon icon='mingcute:send-fill' fontSize={22} />
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
