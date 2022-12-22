const FastBlurHashLoader = () => {
  // Inline code to fast load blurhashes
  let inlineJs = '';
  if (__SERVER__) {
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(
      __dirname,
      '..',
      'ImageLoader',
      'dist',
      'fast-blurhash.min.js',
    );
    inlineJs = '/** BLURHASH FAST LOADING **/' + fs.readFileSync(filePath);
  }

  return __SERVER__ ? (
    <script dangerouslySetInnerHTML={{ __html: inlineJs }} />
  ) : null;
};

export default FastBlurHashLoader;
