import { DetailedHTMLProps, HTMLAttributes, SVGProps } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
      nav: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      header: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      button: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
      a: DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
      main: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      svg: SVGProps<SVGSVGElement>
      path: SVGProps<SVGPathElement>
    }
  }
} 