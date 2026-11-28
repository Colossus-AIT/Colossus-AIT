import manifest from '@/content/media.json';

interface ImageVariant {
  src: string;
  width: number;
  height: number;
}

export function imageProps(original: string, sizes?: string) {
  const variants = (manifest as Record<string, ImageVariant[]>)[original];
  if (!variants?.length) return { src: original };

  const { src, width, height } = variants[0];
  return {
    src,
    width,
    height,
    decoding: 'async' as const,
    ...(sizes && variants.length > 1 && {
      srcSet: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
      sizes,
    }),
  };
}
