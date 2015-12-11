# Number picker

You should run `npm install` and `bower install` console commands before runing `gulp` command.

You should run `gulp` every time you want to work on the project.

You should run `gulp server` if you want to run a demo of plugin in your browser.

Run `gulp --production` to minify and uglify scripts.

## Install

Include Angular and [numberpicker.min.js](https://raw.githubusercontent.com/WebCodium/angular-loopify-number-picker/master/dist/js/numberpicke...) or [numberpicker.js](https://raw.githubusercontent.com/WebCodium/angular-loopify-number-picker/master/dist/js/numberpicke...) in your page. You can use bower:

`bower install angular-loopify-number-picker`

Add `angular-loopify-number-picker` to your app's module dependencies:

```javascript
angular.module('someModule', ['angular-loopify-number-picker'])
```

## UI dependency(optional)
- [bootstrap](http://getbootstrap.com) (3.3.5+)

## Options

| Name | Description | Required | Default value | Possible values |
| --- | --- | --- | --- | --- |
| `value` | The current value. | Yes | undefined | Float |
| `min` | The minimum available value | No | -Infinity | Float |
| `max` | The minimum available value | No | Infinity | Float |
| `step` | The step of changing | No | 1 | Float |
| `enter` | If true then input can't change by enter | No | false | Boolean |
| `label` | Label for input | No | undefined | String |
| `percent` | If true then plugin has switch between '%' and `label` | No | false | Boolean |
| `methodRound` | Possible value is one of rounding methods in object Math (floor, ceil, round) | No | undefined | String |

### Example:

```html
<loopify-number-picker
    value="50">
</loopify-number-picker>
```

### Demo
[See demo](http://codepen.io/anon/pen/MKwQYE)

Author: yura.l@webcodium.com