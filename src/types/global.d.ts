import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { LinkProps } from 'next/link';
import { ImageProps } from 'next/image';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      nav: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      header: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      button: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      a: DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      svg: DetailedHTMLProps<HTMLAttributes<SVGElement>, SVGElement>;
      path: DetailedHTMLProps<HTMLAttributes<SVGPathElement>, SVGPathElement>;
      img: DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    }
  }

  interface CustomLinkProps extends LinkProps {
    className?: string;
    children: ReactNode;
    onClick?: () => void;
  }

  interface CustomImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    className?: string;
  }
} 