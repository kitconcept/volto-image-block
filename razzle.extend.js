const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modify = (config, { target, dev }, webpack) => {
  // Needed for webpack to process the `fast-blurhash` script as text and
  // load it raw
  config.module.rules.unshift({
    test: /fast-blurhash.min\.js$/,
    type: 'asset/source',
  });

  return config;
};

module.exports = {
  plugins,
  modify,
};
