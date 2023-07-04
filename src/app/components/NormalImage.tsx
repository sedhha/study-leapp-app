/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
interface ImageProps extends React.HTMLProps<HTMLImageElement> {}

const NormalImage = (props: ImageProps) => <img {...props} />;
export { NormalImage };
