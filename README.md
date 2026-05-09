# Twitter Emoji (Twemoji)

A simple library that provides standard Unicode [emoji](http://en.wikipedia.org/wiki/Emoji) support across all platforms.

**Twemoji v17.0** adheres to the [Unicode 17.0 spec](https://unicode.org/versions/Unicode17.0.0/) and supports the [Emoji 17.0 spec](https://www.unicode.org/reports/tr51/tr51-29.html). _We do not support custom emoji._

The Twemoji library offers support for all Unicode-defined emoji which are recommended for general interchange (RGI).

## Usage

### CDN Support

Default CDN support is provided via [jsDelivr](https://www.jsdelivr.com/).

Use the following in the `<head>` tag of your HTML document(s):

```html
<script src="https://cdn.jsdelivr.net/gh/suprstarrd/twemoji-mutant@latest/dist/twemoji.min.js" crossorigin="anonymous"></script>
```

This guarantees that you will always use the latest version of the library.

If, instead, you'd like to include the latest version explicitly, you can add the following tag:
```html
<script src="https://cdn.jsdelivr.net/gh/suprstarrd/twemoji-mutant@17.0.3+m1/dist/twemoji.min.js" crossorigin="anonymous"></script>
```

## API

Following are all the methods exposed in the `twemoji` namespace.

### twemoji.parse( ... ) V1

This is the main parsing utility and has 3 overloads per parsing type.

Although there are two kinds of parsing supported by this utility, we recommend you use [DOM parsing](https://github.com/jdecked/twemoji#dom-parsing), explained below. Each type of parsing accepts a callback to generate an image source or an options object with parsing info.

The second kind of parsing is string parsing, explained in the legacy documentation [here](LEGACY.md#string-parsing). This is unrecommended because this method does not sanitize the string or otherwise prevent malicious code from being executed; such sanitization is out of scope.

#### DOM parsing

If the first argument to `twemoji.parse` is an `HTMLElement`, generated image tags will replace emoji that are **inside `#text` nodes only** without compromising surrounding nodes or listeners, and completely avoiding the usage of `innerHTML`.

If security is a major concern, this parsing can be considered the safest option but with a slight performance penalty due to DOM operations that are inevitably *costly*.

```js
var div = document.createElement('div');
div.textContent = 'I \u2764\uFE0F emoji!';
document.body.appendChild(div);

twemoji.parse(document.body);

var img = div.querySelector('img');

// note the div is preserved
img.parentNode === div; // true

img.src;        // https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/2764.png
img.alt;        // \u2764\uFE0F
img.className;  // emoji
img.draggable;  // false

```

All other overloads described for `string` are available in exactly the same way for DOM parsing.

### Object as parameter

Here's the list of properties accepted by the optional object that can be passed to the `parse` function.

```js
  {
    callback: Function,   // default the common replacer
    attributes: Function, // default returns {}
    base: string,         // default jsDelivr
    ext: string,          // default ".png"
    className: string,    // default "emoji"
    size: string|number,  // default "72x72"
    folder: string        // in case it's specified
                          // it replaces .size info, if any
  }
```

#### callback

The function to invoke in order to generate image `src`(s).

By default it is a function like the following one:

```js
function imageSourceGenerator(icon, options) {
  return ''.concat(
    options.base, // by default jsDelivr
    options.size, // by default "72x72" string
    '/',
    icon,         // the found emoji as code point
    options.ext   // by default ".png"
  );
}
```

#### base

The default url is the same as `twemoji.base`, so if you modify the former, it will reflect as default for all parsed strings or nodes.

#### ext

The default image extension is the same as `twemoji.ext` which is `".png"`.

If you modify the former, it will reflect as default for all parsed strings or nodes.

#### className

The default `class` for each generated image is `emoji`. It is possible to specify a different one through this property.

##### size

The default asset size is the same as `twemoji.size` which is `"72x72"`.

If you modify the former, it will reflect as default for all parsed strings or nodes.

#### folder

In case you don't want to specify a size for the image. It is possible to choose a folder, as in the case of SVG emoji.

```js
twemoji.parse(genericNode, {
  folder: 'svg',
  ext: '.svg'
});
```

This will generate urls such `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/2764.svg` instead of using a specific size based image.

## Utilities

Basic utilities / helpers to convert code points to JavaScript surrogates and vice versa.

### twemoji.convert.fromCodePoint()

For a given HEX codepoint, returns UTF-16 surrogate pairs.

```js
twemoji.convert.fromCodePoint('1f1e8');
 // "\ud83c\udde8"
```

### twemoji.convert.toCodePoint()

For given UTF-16 surrogate pairs, returns the equivalent HEX codepoint.

```js
 twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
 // "1f1e8-1f1f3"

 twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
 // "1f1e8~1f1f3"
```

## Tips

### Inline Styles

If you'd like to size the emoji according to the surrounding text, you can add the following CSS to your stylesheet:

```css
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
```

This will make sure emoji derive their width and height from the `font-size` of the text they're shown with. It also adds just a little bit of space before and after each emoji, and pulls them upwards a little bit for better optical alignment.

### UTF-8 Character Set

To properly support emoji, the document character set must be set to UTF-8. This can be done by including the following meta tag in the document `<head>`

```html
<meta charset="utf-8">
```

### Exclude Characters (V1)

To exclude certain characters from being replaced by twemoji.js, call twemoji.parse() with a callback, returning false for the specific unicode icon. For example:

```js
twemoji.parse(document.body, {
    callback: function(icon, options, variant) {
        switch ( icon ) {
            case 'a9':      // © copyright
            case 'ae':      // ® registered trademark
            case '2122':    // ™ trademark
                return false;
        }
        return ''.concat(options.base, options.size, '/', icon, options.ext);
    }
});
```

## Legacy API (V1)

If you're still using our V1 API, you can read our legacy documentation [here](LEGACY.md).

## Contributing

The contributing documentation can be found [here](CONTRIBUTING.md).

## Attribution
### HTML
```html
<div about="#ms-emoji" typeof="cc:Work" xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a href="https://mutant.tech/"><span property="dc:title">Mutant Standard emoji</span></a> © 2019, 2020, 2022, 2023, 2024 by <a property="cc:attributionName" rel="cc:attributionURL" href="https://nocturne.works/">Caius Nocturne</a> is licensed under the <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</a> license. To view a copy of this license, visit <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">https://creativecommons.org/licenses/by-nc-sa/4.0/</a>. <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NonCommercial" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="ShareAlike" style="max-width: 1em;max-height:1em;margin-left: .2em;"></a></div> <div about="#twemoji" typeof="cc:Work" xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a href="https://github.com/jdecked/twemoji"><span property="dc:title">Twemoji</span></a> © 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 by <a property="cc:attributionName" rel="cc:attributionURL" href="https://about.x.com/">Twitter, Inc.</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://about.x.com/">X Corp.</a>, Jason Sofonia, <a property="cc:attributionName" rel="cc:attributionURL" href="https://macaw.social/@jdecked">Justine De Caires</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://bryanhaggerty.com/">Bryan Haggerty</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://github.com/n8downs">Nathan Downs</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://github.com/twuttke">Tom Wuttke</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://webreflection.medium.com/">Andrea Giammarchi</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://moc.co/">Joen Asmussen</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://mkaz.blog/">Marcus Kazmierczak</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://www.kevinvqdam.com/">Kevin VQ Dam</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://www.gicatam.com/">Gica Tam</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://benolsonsketches.artstation.com/">Ben Olson</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://parsatajik.com">Parsa Tajik</a>, <a property="cc:attributionName" rel="cc:attributionURL" href="https://www.striedinger.co">Hugo Striedinger</a>, and <a property="cc:attributionName" rel="cc:attributionURL" href="https://github.com/jdecked/twemoji/graphs/contributors">other contributors</a> is licensed under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> license. To view a copy of this license, visit <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">https://creativecommons.org/licenses/by/4.0/</a>. <a rel="license" href="https://creativecommons.org/licenses/by/4.0/"><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution" style="max-width: 1em;max-height:1em;margin-left: .2em;"></a>.</div>
```

### Markdown
```markdown
[Mutant Standard emoji](https://mutant.tech/) © 2019, 2020, 2022, 2023, 2024 by [Caius Nocturne](https://nocturne.works/) is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/) license. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/. [Twemoji](https://github.com/jdecked/twemoji) © 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 by [Twitter, Inc.](https://about.x.com/), [X Corp.](https://about.x.com/), Jason Sofonia, [Justine De Caires](https://macaw.social/@jdecked), [Bryan Haggerty](https://bryanhaggerty.com/), [Nathan Downs](https://github.com/n8downs), [Tom Wuttke](https://github.com/twuttke), [Andrea Giammarchi](https://webreflection.medium.com/), [Joen Asmussen](https://moc.co/), [Marcus Kazmierczak](https://mkaz.blog/), [Kevin VQ Dam](https://www.kevinvqdam.com/), [Gica Tam](https://www.gicatam.com/), [Ben Olson](https://benolsonsketches.artstation.com/), [Parsa Tajik](https://parsatajik.com), [Hugo Striedinger](https://www.striedinger.co), and [other contributors](https://github.com/jdecked/twemoji/graphs/contributors) is licensed under the [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) license. To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/.
```

[Mutant Standard emoji](https://mutant.tech/) © 2019, 2020, 2022, 2023, 2024 by [Caius Nocturne](https://nocturne.works/) is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/) license. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/. [Twemoji](https://github.com/jdecked/twemoji) © 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 by [Twitter, Inc.](https://about.x.com/), [X Corp.](https://about.x.com/), Jason Sofonia, [Justine De Caires](https://macaw.social/@jdecked), [Bryan Haggerty](https://bryanhaggerty.com/), [Nathan Downs](https://github.com/n8downs), [Tom Wuttke](https://github.com/twuttke), [Andrea Giammarchi](https://webreflection.medium.com/), [Joen Asmussen](https://moc.co/), [Marcus Kazmierczak](https://mkaz.blog/), [Kevin VQ Dam](https://www.kevinvqdam.com/), [Gica Tam](https://www.gicatam.com/), [Ben Olson](https://benolsonsketches.artstation.com/), [Parsa Tajik](https://parsatajik.com), [Hugo Striedinger](https://www.striedinger.co), and [other contributors](https://github.com/jdecked/twemoji/graphs/contributors) is licensed under the [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) license. To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/.

## Community Projects

* [Twemoji Cheatsheet](https://twemoji-cheatsheet.vercel.app) by [@ShahriarKh](https://github.com/ShahriarKh): An easy-to-use cheatsheet for exploring, copying and downloading emojis!
* [Twemoji Amazing](https://github.com/SebastianAigner/twemoji-amazing) by [@SebastianAigner](https://github.com/SebastianAigner): Use Twemoji using CSS classes (like [Font Awesome](http://fortawesome.github.io/Font-Awesome/)).
* [Twemoji Ruby](https://github.com/jollygoodcode/twemoji) by [@JollyGoodCode](https://twitter.com/jollygoodcode): Use Twemoji in Ruby.
* [Twemoji Utils](https://github.com/gustavwilliam/twemoji-utils) by [@gustavwilliam](https://github.com/gustavwilliam): Utilities for finding and downloading Twemoji source files.
* [Twemoji for Pencil](https://github.com/nathanielw/Twemoji-for-Pencil) by [@Nathanielnw](https://twitter.com/nathanielnw): Use Twemoji in Pencil.
* [FrwTwemoji - Twemoji in dotnet](http://github.frenchw.net/FrwTwemoji/) by [@FrenchW](https://twitter.com/frenchw): Use Twemoji in any dotnet project (C#, asp.net ...).
* [Emojiawesome - Twemoji for Yellow](https://github.com/datenstrom/yellow-extensions/tree/master/source/emojiawesome) by [@datenstrom](https://github.com/datenstrom/): Use Twemoji on your website.
* [EmojiPanel for Twitter](https://github.com/danbovey/EmojiPanel) by [@danielbovey](https://twitter.com/danielbovey/status/749580050274582528): Insert Twemoji into your tweets on twitter.com.
* [Twitter Color Emoji font](https://github.com/eosrei/twemoji-color-font) by [@bderickson](https://twitter.com/bderickson): Use Twemoji as your system default font on Linux & OS X.
* [Emojica](https://github.com/xoudini/emojica) by [@xoudini](https://twitter.com/xoudini): An iOS framework allowing you to replace all standard emoji in strings with Twemoji.
* [gwt-twemoji](https://github.com/phpmonkeys-de/gwt-twemoji) by [@nbartels](https://github.com/nbartels): Use Twemoji in GWT
* [JavaFXEmojiTextFlow](https://github.com/pavlobu/emoji-text-flow-javafx) by [@pavlobu](https://github.com/pavlobu): A JavaFX library allowing you to replace all standard emoji in extended EmojiTextFlow with Twemoji.
* [Vue Twemoji Picker](https://github.com/kevinfaguiar/vue-twemoji-picker) by [@kevinfaguiar](https://github.com/kevinfaguiar): A fast plug-n-play Twemoji Picker (+textarea for Twemoji rendering) for Vue.
* [EmojiOnRoku](https://github.com/KasperGam/EmojiOnRoku) by [@KasperGam](https://github.com/KasperGam): Use Twemoji on Roku!
* [LaTeX Twemoji](https://gitlab.com/rossel.jost/latex-twemojis) by [@rossel.jost](https://gitlab.com/rossel.jost): Use Twemoji in LaTeX.
* [PHP Twemoji](https://github.com/Astrotomic/php-twemoji) by [@Astrotomic](https://github.com/Astrotomic): Use twemoji within your PHP website project's by replacing standard Emoji with twemoji urls.
* [Custom Twemoji API](https://github.com/custom-twemoji/custom-twemoji-api) by [@blakegearin](https://github.com/blakegearin): An API for fetching Twemoji faces and creating Twemoji face mashups.

## Committers and Contributors

* Justine De Caires (ex-Twitter)
* Jason Sofonia (ex-Twitter)
* Bryan Haggerty (ex-Twitter)
* Nathan Downs (ex-Twitter)
* Tom Wuttke (ex-Twitter)
* Andrea Giammarchi (ex-Twitter)
* Joen Asmussen (WordPress)
* Marcus Kazmierczak (WordPress)
* Kevin VQ Dam (ex-Discord)
* Gica Tam (Discord)
* Ben Olson (Discord)

The goal of this project is to simply provide emoji for everyone. We definitely welcome improvements and fixes, but we may not merge every pull request suggested by the community due to the simple nature of the project.

The rules for contributing are available in the [`CONTRIBUTING.md`](CONTRIBUTING.md) file.

Thank you to all of our [contributors](https://github.com/jdecked/twemoji/graphs/contributors).

## License

See the [LICENSE](LICENSE) and [LICENSE-GRAPHICS](LICENSE-GRAPHICS) files for full license texts.

Code licensed under the MIT License: <http://opensource.org/licenses/MIT>

Graphics licensed under CC-BY 4.0: <https://creativecommons.org/licenses/by/4.0/>
