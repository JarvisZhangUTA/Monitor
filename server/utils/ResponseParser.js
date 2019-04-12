const StrHelper = require('./StrHelper');

module.exports = class CommandParser {
  /**
   * REQUEST
   * Length: 16
   * EXAMPLE: 01 04 00 00 00 16 71 c4
   * 
   * INFO
   * 3.1 
   * Length: 290
   * EXAMPLE: 01 04 8c 40 34 ff ff ff ff 00 42 01 00 16 05 00 01 01 38 21 73 20 62 53 43 41 36 30 4b 54 4c 2d 44 4f 2f 55 53 2d 34 38 30 00 00 00 5c 10 00 00 00 08 4b 00 ea 02 82 01 fe 00 36 14 d9 00 09 00 09 13 5d 13 47 13 51 00 14 00 14 00 15 1a 2f 00 07 03 72 00 00 03 91 00 00 02 58 02 08 01 93 00 00 10 00 20 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 ff ff ff ff ff ff ff ff ff ff 08 07 00 00 0c e4 00 28 00 0e 16 4d
   * 
   * Length: 34
   * 
   * UNKNOW
   */


  static parse( command ) {
    command = command.replace(new RegExp(' ', 'g'), '')

    switch( command.length ) {
      case 16:
        return this.parseRequestCommand( command );
      case 34:
        return this.parseResponse34Command( command );
      case 290:
        return this.parseResponse290Command( command );
      default:
        return this.parseUnknowCommand( command );
    }
  }

  static parseUnknowCommand( command ) {
    return {
      type: 'UNKNOW',
      original: command
    }
  }

  static parseResponse34Command( command ) {
    let parsed_command = {
      type: 'RESPONSE',
      original: command
    }

    parsed_command.device_address = command.substr(0, 2)
    parsed_command.function_code = command.substr(2, 2)
    parsed_command.register_count = StrHelper.str2Hex(command.substr(4, 2))[0];
    parsed_command.upv1 = StrHelper.str2Hex(command.substr(6, 2), 2)[0] * 0.1;
    parsed_command.upv2 = StrHelper.str2Hex(command.substr(8, 2), 2)[0] * 0.1;
    parsed_command.upv3 = StrHelper.str2Hex(command.substr(10, 2), 2)[0] * 0.1;
    parsed_command.lpv1 = StrHelper.str2Hex(command.substr(12, 2), 2)[0] * 0.1;
    parsed_command.lpv2 = StrHelper.str2Hex(command.substr(14, 2), 2)[0] * 0.1;
    parsed_command.lpv3 = StrHelper.str2Hex(command.substr(16, 2), 2)[0] * 0.1;

    Object.keys(parsed_command).forEach(key => {
      if (typeof(parsed_command[key]) === 'number' && (parsed_command[key] + '').indexOf('.') > 0) {
        parsed_command[key] = parsed_command[key].toFixed(2);
      }
    });

    return parsed_command;
  }

  static parseResponse290Command( command ) {
    let parsed_command = {
      type: 'RESPONSE',
      original: command
    };
    
    parsed_command.device_address = command.substr(0, 2);
    parsed_command.function_code = command.substr(2, 2);
    parsed_command.register_count = StrHelper.str2Hex(command.substr(4, 2))[0];
    parsed_command.device = StrHelper.str2Device(command.substr(6,4));
    parsed_command.lcd_bootloader = StrHelper.str2Hex(command.substr(10, 2))[0];
    parsed_command.arc_version = StrHelper.str2Hex(command.substr(12, 2))[0];
    /** 1 EMPTY HERE */
    parsed_command.arc_enable_status = command.substr(15, 1);
    parsed_command.arc_dipswitch_status = command.substr(16, 1);
    parsed_command.pv_input_config = command.substr(17, 1);
    parsed_command.register_number = StrHelper.str2Hex(command.substr(18, 4), 4)[0];
    parsed_command.pro_ver = command.substr(22, 4);
    parsed_command.minor_ver = command.substr(26, 4);
    parsed_command.sn = command.substr(30, 16);
    parsed_command.model = StrHelper.str2ASCII(command.substr(46, 40));
    parsed_command.rw_reg_sum = StrHelper.str2Hex(command.substr(86, 4), 4)[0];
    parsed_command.rw_reg_add = StrHelper.str2Hex(command.substr(90, 4), 4)[0];
    parsed_command.t_yield = StrHelper.str2Hex(command.substr(94, 8), 8)[0];
    parsed_command.d_yield = StrHelper.str2Hex(command.substr(102, 4), 4)[0] * 0.1;
    parsed_command.eff = StrHelper.str2Hex(command.substr(106, 4), 4)[0] * 0.001;
    parsed_command.pf = StrHelper.str2Hex(command.substr(110, 4), 4)[0] * 0.001;
    parsed_command.pmax = StrHelper.str2Hex(command.substr(114, 4), 4)[0] * 0.1;
    parsed_command.run_time = StrHelper.str2Hex(command.substr(118, 4), 4)[0] * 0.1;
    parsed_command.pac = StrHelper.str2Hex(command.substr(122, 4), 4)[0] * 0.1;
    parsed_command.sac = StrHelper.str2Hex(command.substr(126, 4), 4)[0] * 0.1;
    parsed_command.uab = StrHelper.str2Hex(command.substr(130, 4), 4)[0] * 0.1;
    parsed_command.ubc = StrHelper.str2Hex(command.substr(134, 4), 4)[0] * 0.1;
    parsed_command.uca = StrHelper.str2Hex(command.substr(138, 4), 4)[0] * 0.1;
    parsed_command.la = StrHelper.str2Hex(command.substr(142, 4), 4)[0] * 0.1;
    parsed_command.lb = StrHelper.str2Hex(command.substr(146, 4), 4)[0] * 0.1;
    parsed_command.lc = StrHelper.str2Hex(command.substr(150, 4), 4)[0] * 0.1;
    parsed_command.upv1 = StrHelper.str2Hex(command.substr(154, 4), 4)[0] * 0.1;
    parsed_command.lpv1 = StrHelper.str2Hex(command.substr(158, 4), 4)[0] * 0.1;
    parsed_command.upv2 = StrHelper.str2Hex(command.substr(162, 4), 4)[0] * 0.1;
    parsed_command.lpv2 = StrHelper.str2Hex(command.substr(166, 4), 4)[0] * 0.1;
    parsed_command.upv3 = StrHelper.str2Hex(command.substr(170, 4), 4)[0] * 0.1;
    parsed_command.lpv3 = StrHelper.str2Hex(command.substr(174, 4), 4)[0] * 0.1;
    parsed_command.freq = StrHelper.str2Hex(command.substr(178, 4), 4)[0] * 0.1;
    parsed_command.tmod = StrHelper.str2Hex(command.substr(182, 4), 4)[0] * 0.1;
    parsed_command.tamb = StrHelper.str2Hex(command.substr(186, 4), 4)[0] * 0.1;
    /** 4 EMPTY HERE */
    parsed_command.tcoil = StrHelper.str2Hex(command.substr(194, 4), 4)[0];
    parsed_command.mode = command.substr(198, 4);
    parsed_command.last_error_time = command.substr(202, 16);
    parsed_command.pfault = command.substr(218, 4);
    parsed_command.warn = command.substr(222, 4);
    parsed_command.fault0 = command.substr(224, 4);
    parsed_command.fault1 = command.substr(230, 4);
    parsed_command.fault2 = command.substr(234, 4);
    parsed_command.fault3 = command.substr(238, 4);
    parsed_command.fault4 = command.substr(242, 4);
    parsed_command.qac = StrHelper.str2Hex(command.substr(246, 4), 4)[0] * 0.1;
    parsed_command.pid_box_enable = StrHelper.str2Hex(command.substr(250, 4), 4)[0];
    parsed_command.pid_box_voltage = StrHelper.str2Hex(command.substr(254, 4), 4)[0];
    parsed_command.pid_box_current = StrHelper.str2Hex(command.substr(258, 4), 4)[0];
    parsed_command.pid_box_reserved = command.substr(262, 8);
    parsed_command.majer_ver = command.substr(270, 4);
    parsed_command.pv_detection = StrHelper.str2Hex(command.substr(274, 4), 4)[0];
    parsed_command.bus_capacitance = StrHelper.str2Hex(command.substr(278, 4), 4)[0];
    parsed_command.ac_capacitance = StrHelper.str2Hex(command.substr(282, 4), 4)[0];
    parsed_command.pdc = StrHelper.str2Hex(command.substr(286, 4), 4)[0] * 0.1;

    Object.keys(parsed_command).forEach(key => {
      if (typeof(parsed_command[key]) === 'number' && (parsed_command[key] + '').indexOf('.') > 0) {
        parsed_command[key] = parsed_command[key].toFixed(2);
      }
    });

    return parsed_command;
  }

  static parseRequestCommand( command ) {
    return {
      type: 'REQUEST',
      original: command
    };
  }
}