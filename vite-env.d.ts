import 'vite'
import type { ViteReactSSGOptions } from 'vite-react-ssg'

declare module 'vite' {
  interface UserConfig {
    ssgOptions?: ViteReactSSGOptions
  }
}
