module.exports = class StrHelper {
  static str2Hex(str, gap = 2) {
    var str = str.replace( new RegExp(' ', 'g'), '' );
    var result = [];
    for( var i = 0; i < str.length; i += gap ) {
      result.push( parseInt(str.substr(i, gap), 16) );
    }
    return result;
  }

  static str2Device(str) {
    str = str.replace( new RegExp(' ', 'g'), '' );

    switch( str ) {
      case '4031':
        str = '20KW_inverter';
        break;
      case '4032':
        str = '60KW_inverter_old_MCU';
        break;
      case '4033':
        str = 'energy_storage_inverter';
        break;
      case '4034':
        str = '60KW_inverter_new_MCU';
        break;
      case '4035':
        str = '100KW_125KW_1500V_inverter'
        break;
      default:
        str = 'UNKNOW';
        break;
    }

    return str;
  }

  /** HEX STRING TO ASCII */
  static str2ASCII(str) {
    var res = '';
    for (var i = 0; (i < str.length && str.substr(i, 2) !== '00'); i += 2)
        res += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    return res;
  }

  static makeId(len) {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

}