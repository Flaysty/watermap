declare module '*.ttf'
declare module '*.woff'
declare module '*.png'
declare module '*.svg'

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
