import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          const imageLabel =
            images.length > 1
              ? `${productTitle} - imagen ${index + 1}`
              : productTitle

          return (
            <Container
              key={image.id}
              className="relative aspect-[4/5] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index === 0}
                  className="absolute inset-0 rounded-rounded object-cover"
                  alt={imageLabel}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
