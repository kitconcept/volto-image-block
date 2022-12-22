import { Img } from './components/ImageLoader';
import { imageBlockSchemaEnhancer } from './components/Blocks/Image/schema';
import { ImageBlockDataAdapter } from './components/Blocks/Image/adapter';
import ImageWidget from './components/ImageWidget/ImageWidget';

const applyConfig = (config) => {
  config.blocks.blocksConfig.image = {
    ...config.blocks.blocksConfig.image,
    schemaEnhancer: imageBlockSchemaEnhancer,
  };

  config.registerComponent({
    name: 'Img',
    component: Img,
  });

  config.registerComponent({
    name: 'dataAdapter',
    dependencies: ['Image', 'BlockData'],
    component: ImageBlockDataAdapter,
  });

  config.widgets.widget.image = ImageWidget;

  return config;
};

export default applyConfig;
