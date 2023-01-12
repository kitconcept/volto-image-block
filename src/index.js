import { Img } from './components/ImageLoader';
import { imageBlockSchemaEnhancer } from './components/Blocks/Image/schema';
import { ImageBlockDataAdapter } from './components/Blocks/Image/adapter';
import ImageWidget from './components/ImageWidget/ImageWidget';
import FastBlurHashLoader from './components/FastBlurHashLoader/FastBlurHashLoader';

const applyConfig = (config) => {
  config.blocks.blocksConfig.image = {
    ...config.blocks.blocksConfig.image,
    schemaEnhancer: imageBlockSchemaEnhancer,
  };

  config.registerComponent({
    name: 'Image',
    component: Img,
  });

  config.registerComponent({
    name: 'dataAdapter',
    dependencies: ['Image', 'BlockData'],
    component: ImageBlockDataAdapter,
  });

  config.widgets.widget.image = ImageWidget;

  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '',
      component: FastBlurHashLoader,
    },
  ];

  return config;
};

export default applyConfig;
