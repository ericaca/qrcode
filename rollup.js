const rollup = require('rollup');

function unique(array) {
  var cache = {};

  array.forEach(function(item) {
    if (cache[item]) return;

    cache[item] = true;
  });

  return Object.keys(cache);
}

const I18N = {
  COMMON: ['QRBase.UnknownMode']
}

I18N.ENCODE = unique(I18N.COMMON.concat([
    'QRBase.UnknownMode',
    'QREncode.InvalidChar4Alphanumeric',
    'QREncode.InvalidChar4Numeric',
    'QREncode.UnsupportedECI',
    'QREncode.TextTooLong4TargetVersion',
    'QREncode.TextTooLong4AllVersion'
]));
I18N.DECODE = unique(I18N.COMMON.concat([
  // DECODE
]));
I18N.ALL = unique(I18N.ENCODE.concat(I18N.DECODE))

function isI18N(id) {
  return /[/\\]i18n[/\\]/i.test(id);
}

function build(entry, dest, i18n) {
  rollup.rollup({
    legacy: true,
    entry: entry,
    plugins: [{
      name: 'i18n',
      transform: function transform(code, id) {
        if (isI18N(id)) {
          var lang = {};
          var code = JSON.parse(code);

          i18n.forEach(function(key) {
            lang[key] = code[key] || `Locales error: ${ key } no localization.`;
          });

          code = JSON
            .stringify(lang, null, 2)
            .replace(/'/g, '\\\'')
            .replace(/([^\\])"/g, '$1\'');

          return `export default ${ code }`;
        }
      }
    }]
  }).then(function(bundle) {
    bundle.write({
      dest: dest,
      format: 'umd',
      indent: true,
      useStrict: true,
      moduleId: 'qrcode',
      moduleName: 'QRCode'
    });

    console.log(`  Build ${dest} success!`);
  }).catch(function(error) {
    console.log(error);
  });
}

build('src/index.js', 'dist/qrcode.all.js', I18N.ALL);
build('src/encode.js', 'dist/qrcode.encode.js', I18N.ENCODE);
build('src/decode.js', 'dist/qrcode.decode.js', I18N.DECODE);
