import axios from 'axios'

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'https://ie104-be.onrender.com'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  discount: number
  countInStock: number
  description?: string
  type?: {
    name: string
  }
  sold?: number
  averageRating?: number
}

export async function getProductsContext(query?: string) {
  try {
    // Lấy danh sách sản phẩm từ backend
    const params: any = {
      limit: 20, // Lấy 20 sản phẩm để tiết kiệm context
      page: 1,
      order: 'created desc'
    }

    // Nếu có query, tìm kiếm sản phẩm theo tên
    if (query) {
      params.search = query
    }

    const response = await axios.get(`${API_HOST}/api/products/public`, { params })

    if (!response.data?.data?.products) {
      return null
    }

    const products: Product[] = response.data.data.products

    // Format dữ liệu sản phẩm thành text cho AI
    const productsInfo = products.map((product, index) => {
      const finalPrice = product.price - (product.price * product.discount / 100)
      
      return `${index + 1}. ${product.name}
   - Giá: ${product.price.toLocaleString('vi-VN')}₫ ${product.discount > 0 ? `(Giảm ${product.discount}% → ${finalPrice.toLocaleString('vi-VN')}₫)` : ''}
   - Loại: ${product.type?.name || 'Chưa phân loại'}
   - Tình trạng: ${product.countInStock > 0 ? `Còn ${product.countInStock} sản phẩm` : 'Hết hàng'}
   - Đã bán: ${product.sold || 0} sản phẩm
   - Đánh giá: ${product.averageRating ? `${product.averageRating}/5 ⭐` : 'Chưa có đánh giá'}
   - Link: /product/${product.slug}`
    }).join('\n\n')

    return {
      totalProducts: response.data.data.totalCount || products.length,
      productsInfo,
      products
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return null
  }
}

export async function getProductTypes() {
  try {
    const response = await axios.get(`${API_HOST}/api/product-types`)
    
    if (!response.data?.data?.productTypes) {
      return null
    }

    const types = response.data.data.productTypes
    const typesInfo = types.map((type: any, index: number) => 
      `${index + 1}. ${type.name}`
    ).join('\n')

    return {
      totalTypes: types.length,
      typesInfo,
      types
    }
  } catch (error) {
    console.error('Error fetching product types:', error)
    return null
  }
}

export async function searchProductByName(name: string) {
  return getProductsContext(name)
}
