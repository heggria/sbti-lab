export async function exportToImage(
  element: HTMLElement,
  filename = 'sbti-result.png',
  scale = 2,
): Promise<void> {
  const width = element.offsetWidth
  const height = element.offsetHeight

  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')!

  ctx.scale(scale, scale)

  const style = getComputedStyle(element)
  const bgColor = style.backgroundColor || '#0a0a0f'

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(createSVGElement(element))
  const img = new Image()
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob failed'))
            return
          }
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = filename
          link.click()
          URL.revokeObjectURL(link.href)
          URL.revokeObjectURL(url)
          resolve()
        }, 'image/png')
      } catch (e) {
        URL.revokeObjectURL(url)
        reject(e)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }
    img.src = url
  })
}

function createSVGElement(el: HTMLElement): SVGElement {
  const width = el.offsetWidth
  const height = el.offsetHeight
  const clone = el.cloneNode(true) as HTMLElement

  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  foreignObject.setAttribute('width', String(width))
  foreignObject.setAttribute('height', String(height))

  const style = document.createElement('style')
  const allStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
  style.textContent = allStyles
    .map((s) => (s.tagName === 'STYLE' ? s.textContent : ''))
    .join('\n')
  foreignObject.appendChild(style)
  foreignObject.appendChild(clone)

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.appendChild(foreignObject)

  return svg
}
