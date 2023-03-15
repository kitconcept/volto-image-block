# kitconcept's volto-export Release Notes

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.dev-docs.plone.org/volto/developer-guidelines/contributing.html#create-a-pull-request
-->

<!-- towncrier release notes start -->

## 1.0.0 (2023-03-15)

### Breaking

- Suport for Volto 17, Node 18 and fastblurhash working in webpack5. Support for Webpack 5 means this can only work in Volto >=17 @sneridagh [#10](https://github.com/kitconcept/volto-export/pull/10)


## 0.2.0 (2023-03-14)

### Feature

- Add towncrier for changelog @sneridagh [#4](https://github.com/kitconcept/volto-export/pull/4)
- Better image loader options for Volto defaults for source sets [#5](https://github.com/kitconcept/volto-export/pull/5)
- Use dockerized add-on development @sneridagh [#9](https://github.com/kitconcept/volto-export/pull/9)

### Bugfix

- Move dataAdapter to the block config so it can also be overriden in nested blocks via blocksConfig @sneridagh [#7](https://github.com/kitconcept/volto-export/pull/7)
