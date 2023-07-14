# kitconcept's volto-export Release Notes

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.dev-docs.plone.org/volto/developer-guidelines/contributing.html#create-a-pull-request
-->

<!-- towncrier release notes start -->

## 1.0.2 (2023-07-14)

### Bugfix

- Support block data with missing image_scales, after image upload @reebalazs [#16](https://github.com/kitconcept/volto-export/pull/16)
- Fix upload image preview in edit mode @sneridagh [#17](https://github.com/kitconcept/volto-export/pull/17)


## 1.0.1 (2023-06-08)

### Bugfix

- Fix hydration warning in console. @sneridagh [#11](https://github.com/kitconcept/volto-export/pull/11)
- Remove project-specific code in Caption component. @davisagli [#13](https://github.com/kitconcept/volto-export/pull/13)


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
