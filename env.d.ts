/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

declare module '*.PNG' {
  const src: string
  export default src
}

declare module '*.JPG' {
  const src: string
  export default src
}

// Side-effect CSS imports from vuetify
declare module 'vuetify/styles'
