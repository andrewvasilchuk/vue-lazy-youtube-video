export const VIDEO_ID = '4JS70KB9GS0'

export const defaultProps = {
  src: `https://www.youtube.com/embed/${VIDEO_ID}`,
}

export function getDefaultProps({ query }: { query?: string } = {}) {
  const props = { ...defaultProps }

  if (query) {
    props.src += query
  }

  return props
}
