import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

declare module 'next' {
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
      div: any;
      nav: any;
      header: any;
      button: any;
      span: any;
      a: any;
      img: any;
    }
  }
} 