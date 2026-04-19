import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import './Button.css';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; download?: undefined };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { children, variant = 'primary', size = 'md', fullWidth = false, ...rest } = props;
  const className = `btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`.trim();
  if ('href' in rest && rest.href) {
    return <a className={className} {...rest}>{children}</a>;
  }
  return <button className={className} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
