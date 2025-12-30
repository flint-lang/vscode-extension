# flint-language-server README

This is the `flint-lsp`, extension to provide syntax highlighting and language server support for the [Flint](https://github.com/flint-lang/flintc) programming language.

## Features

Syntax highlighting works without any further setup. If you want the `fls` to work properly too, you need to follow the installation instructions [here](https://flint-lang.github.io/v0.3.0-core/user_guide/setup/3_fls_setup.html).

- Proper syntax highlighting of the `Flint` language
- LSP support with suggestions of all keywords and builtin types of Flint

## Missing Features

- There is no goto-definition or hover info yet in the LSP
- The LSP does not provide context-sensitive suggestions yet
- The LSP only updates when saving a file, not while writing it

## Known Issues

- The LSP may crash on very incorrect source code, as it is not robust enough to handle "proper" malformed source code

## Release Notes

- [0.3.0]:
  - Added support for the LSP on Windows, it now works properly there too
  - Added support for the `as` keyword for import aliasing
  - Added support for the `type` keyword for type aliasing
- [0.2.2]:
  - Added the `extern` and `export` keywords
  - Updated the color theme of the extension
  - Added file tree icons for `.ft` files to show the Flint logo
  - Added LSP support for the extension
- [0.2.0]:
  - Removed the `Opt` type and the `None` and `Some` literals
  - Added the `none` literal
  - Added the `anyerror` builtin type
  - Fixed incorrect highlighting of numbers containing `_`s as separators, like `1_234_567`
  - Fixed highlighting of identifiers, constants and types to be much more consistent and reliable in it's highlighting
  - Added optional type highlighting (`T?`)
  - Added tuple-access highlighting (`$0`, `$1`, ...)
  - Added optional operator highlighting (`!.` and `?.`)
  - Added variant-related operator highlighting (`!(T)` and `?(T)`)
  - Completely overhauled the color theme
- [0.1.0]: Initial and very incomplete release of the extension
