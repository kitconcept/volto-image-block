// We load the js but Webpack will load it raw, see `razzle.extend.js`
import FastBlurHashLoaderJS from '../ImageLoader/dist/fast-blurhash.min.js';

const FastBlurHashLoader = () => {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: FastBlurHashLoaderJS }}
    />
  );
};

export default FastBlurHashLoader;
