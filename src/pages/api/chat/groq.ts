import type { NextApiRequest, NextApiResponse } from 'next'
import Groq from 'groq-sdk'
import { getProductsContext, getProductTypes, searchProductByName } from './get-products-context'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Từ khóa để tìm kiếm sản phẩm
const productKeywords = ['sản phẩm', 'giá', 'mua', 'tìm', 'có', 'bán', 'hàng', 'loại', 'product', 'price', 'buy']
const shouldSearchProducts = (message: string) => {
  const lowerMessage = message.toLowerCase()
  return productKeywords.some(keyword => lowerMessage.includes(keyword))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, history = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Lấy dữ liệu sản phẩm từ MongoDB nếu câu hỏi liên quan
    let productsData = null
    let productTypesData = null
    
    if (shouldSearchProducts(message)) {
      // Nếu hỏi về loại sản phẩm
      if (message.toLowerCase().includes('loại') || message.toLowerCase().includes('danh mục') || message.toLowerCase().includes('category')) {
        productTypesData = await getProductTypes()
      }
      
      // Tìm kiếm sản phẩm cụ thể nếu có tên
      const searchMatch = message.match(/(?:tìm|có|bán|giá)\s+(.+?)(?:\s+(?:không|ko|nào|gì)|$)/i)
      if (searchMatch && searchMatch[1]) {
        productsData = await searchProductByName(searchMatch[1])
      } else {
        // Lấy danh sách sản phẩm chung
        productsData = await getProductsContext()
      }
    }

    // Tạo system prompt động dựa trên dữ liệu thực tế
    let systemContent = `Bạn là một trợ lý AI thông minh của một cửa hàng thương mại điện tử.
      
Nhiệm vụ của bạn:
- Hỗ trợ khách hàng về sản phẩm, đặt hàng, thanh toán, giao hàng
- Giải đáp thắc mắc về chính sách đổi trả, bảo hành
- Tư vấn sản phẩm phù hợp với nhu cầu khách hàng
- Giúp khách hàng tìm kiếm sản phẩm
- Hướng dẫn cách mua hàng, theo dõi đơn hàng

Nguyên tắc:
- Luôn lịch sự, thân thiện và nhiệt tình
- Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
- Sử dụng emoji phù hợp để thân thiện hơn
- Khi giới thiệu sản phẩm, luôn đề xuất link để xem chi tiết
- Ưu tiên trả lời bằng tiếng Việt trừ khi khách hàng dùng ngôn ngữ khác

Thông tin cửa hàng:
- Thời gian giao hàng: 2-5 ngày làm việc
- Chính sách đổi trả: trong vòng 7 ngày
- Hỗ trợ: 24/7
- Phương thức thanh toán: COD, Chuyển khoản, Ví điện tử`

    // Thêm thông tin loại sản phẩm nếu có
    if (productTypesData) {
      systemContent += `\n\n📋 DANH MỤC SẢN PHẨM HIỆN CÓ (${productTypesData.totalTypes} loại):\n${productTypesData.typesInfo}`
    }

    // Thêm thông tin sản phẩm nếu có
    if (productsData && productsData.productsInfo) {
      systemContent += `\n\n🛍️ DANH SÁCH SẢN PHẨM HIỆN CÓ (${productsData.totalProducts} sản phẩm):\n${productsData.productsInfo}\n\nLưu ý: Khi khách hàng hỏi về sản phẩm, hãy dựa vào danh sách này để trả lời chính xác về giá, tình trạng kho, và đưa link cụ thể.`
    }

    const systemPrompt: Message = {
      role: 'system',
      content: systemContent
    }

    // Kết hợp system prompt + lịch sử chat + tin nhắn mới
    const messages: Message[] = [
      systemPrompt,
      ...history.map((msg: any) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // Gọi Groq API với model nhanh
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Model nhanh và thông minh
      temperature: 0.7,
      max_tokens: 1024, // Tăng tokens để trả lời đầy đủ hơn
      top_p: 0.9,
      stream: false
    })

    const assistantMessage = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau! 🙏'

    // Trả về kèm metadata về sản phẩm nếu có
    const response: any = {
      message: assistantMessage,
      usage: completion.usage
    }

    if (productsData?.products && productsData.products.length > 0) {
      response.products = productsData.products.slice(0, 5) // Gửi tối đa 5 sản phẩm
    }

    return res.status(200).json(response)

  } catch (error: any) {
    console.error('Groq API Error:', error)
    
    // Xử lý lỗi cụ thể
    if (error?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' })
    }
    
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}
