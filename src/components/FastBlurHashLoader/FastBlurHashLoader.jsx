/* eslint-disable import/no-webpack-loader-syntax */
// eslint-disable-next-line import/no-unresolved
import FastBlurHashLoaderJS from 'raw-loader!../ImageLoader/dist/fast-blurhash.min.js';

const FastBlurHashLoader = () => {
  return <script dangerouslySetInnerHTML={{ __html: FastBlurHashLoaderJS }} />;
};

export default FastBlurHashLoader;
