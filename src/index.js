import QRBase from './base';
import Encode from './encode';
import Decode from './decode';

export default {
  MODE: QRBase.MODE,
  Encode: Encode.Encode,
  Decode: Decode.Decode,
  catch: QRBase.setErrorThrow,
  ECLEVEL: QRBase.ERROR_CORRECTION_LEVEL,
  locale: function() {
    return QRBase.i18n.locale.apply(QRBase.i18n, arguments);
  }
}
