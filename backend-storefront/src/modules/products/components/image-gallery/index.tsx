"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import Image from "next/image"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle: string
}

const navButtonClassName =
  "absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-black/60 text-lg leading-none text-white transition-opacity hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:pointer-events-none disabled:opacity-0"

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const validImages = useMemo(
    () => images.filter((image) => !!image.url),
    [images]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainImageSize, setMainImageSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const thumbListRef = useRef<HTMLDivElement>(null)
  const thumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [canScrollThumbsDown, setCanScrollThumbsDown] = useState(false)

  const imageCount = validImages.length
  const hasMultiple = imageCount > 1
  const safeIndex = imageCount > 0 ? Math.min(selectedIndex, imageCount - 1) : 0
  const activeImage = validImages[safeIndex]

  useEffect(() => {
    setSelectedIndex(0)
  }, [images])

  useEffect(() => {
    setMainImageSize(null)
  }, [activeImage?.url])

  const updateThumbScrollState = useCallback(() => {
    const list = thumbListRef.current
    if (!list) {
      setCanScrollThumbsDown(false)
      return
    }

    const remaining = list.scrollHeight - list.scrollTop - list.clientHeight
    setCanScrollThumbsDown(remaining > 8)
  }, [])

  useEffect(() => {
    updateThumbScrollState()
    const list = thumbListRef.current
    if (!list) {
      return
    }

    list.addEventListener("scroll", updateThumbScrollState, { passive: true })
    window.addEventListener("resize", updateThumbScrollState)

    return () => {
      list.removeEventListener("scroll", updateThumbScrollState)
      window.removeEventListener("resize", updateThumbScrollState)
    }
  }, [imageCount, updateThumbScrollState])

  useEffect(() => {
    const button = thumbButtonRefs.current[safeIndex]
    button?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [safeIndex])

  const goToPrevious = () => {
    if (!hasMultiple) {
      return
    }
    setSelectedIndex((current) =>
      current === 0 ? imageCount - 1 : current - 1
    )
  }

  const goToNext = () => {
    if (!hasMultiple) {
      return
    }
    setSelectedIndex((current) =>
      current === imageCount - 1 ? 0 : current + 1
    )
  }

  const scrollThumbnailsDown = () => {
    thumbListRef.current?.scrollBy({ top: 88, behavior: "smooth" })
  }

  if (!activeImage?.url) {
    return null
  }

  const imageLabel =
    imageCount > 1
      ? `${productTitle} - imagen ${safeIndex + 1} de ${imageCount}`
      : productTitle

  const renderThumbnail = (image: HttpTypes.StoreProductImage, index: number) => {
    const isActive = index === safeIndex
    const thumbLabel = `${productTitle}, miniatura ${index + 1} de ${imageCount}`

    return (
      <button
        key={image.id}
        ref={(node) => {
          thumbButtonRefs.current[index] = node
        }}
        type="button"
        aria-label={thumbLabel}
        aria-current={isActive ? "true" : undefined}
        onClick={() => setSelectedIndex(index)}
        className={clx(
          "relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 bg-brand-card p-1 transition-colors",
          isActive
            ? "border-brand-text"
            : "border-transparent hover:border-gray-200"
        )}
      >
        <Image
          src={image.url!}
          alt=""
          aria-hidden
          fill
          className="object-contain"
          sizes="72px"
        />
      </button>
    )
  }

  return (
    <section
      aria-label={`Galería de imágenes de ${productTitle}`}
      className="relative flex h-full min-h-0 w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-4"
    >
      {hasMultiple && (
        <div className="relative hidden shrink-0 flex-col justify-center md:flex md:h-full md:min-h-0">
          <div
            ref={thumbListRef}
            className="flex max-h-[min(32rem,70vh)] flex-col gap-2 overflow-y-auto pr-0.5 md:max-h-full [scrollbar-width:thin]"
          >
            {validImages.map((image, index) => renderThumbnail(image, index))}
          </div>
          {canScrollThumbsDown && (
            <button
              type="button"
              aria-label="Desplazar miniaturas hacia abajo"
              onClick={scrollThumbnailsDown}
              className="mt-2 flex h-8 w-[4.5rem] items-center justify-center rounded-full border border-gray-200 bg-brand-card text-brand-text shadow-sm transition-colors hover:border-brand-accent hover:text-brand-accent"
            >
              <ChevronDown size="20" />
            </button>
          )}
        </div>
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col md:h-full">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="relative inline-block max-h-full max-w-full">
          <Image
            key={activeImage.id}
            src={activeImage.url}
            priority={safeIndex === 0}
            loading={safeIndex === 0 ? undefined : "eager"}
            alt={imageLabel}
            width={mainImageSize?.width ?? 800}
            height={mainImageSize?.height ?? 800}
            onLoad={(event) => {
              const img = event.currentTarget
              if (
                img.naturalWidth > 0 &&
                img.naturalHeight > 0 &&
                (mainImageSize?.width !== img.naturalWidth ||
                  mainImageSize?.height !== img.naturalHeight)
              ) {
                setMainImageSize({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                })
              }
            }}
            className="block h-auto w-auto max-h-[min(80vh,900px)] max-w-full rounded-2xl lg:max-h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 640px"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={goToPrevious}
                className={clx(navButtonClassName, "left-2 md:left-4")}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                aria-label="Imagen siguiente"
                onClick={goToNext}
                className={clx(navButtonClassName, "right-2 md:right-4")}
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          )}
          </div>
        </div>

        {hasMultiple && (
          <div className="mt-3 w-full overflow-x-auto pb-1 md:hidden [scrollbar-width:thin]">
            <div className="flex w-fit min-w-full justify-center gap-2">
              {validImages.map((image, index) => renderThumbnail(image, index))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ImageGallery
