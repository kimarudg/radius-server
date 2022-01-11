import { codeMap } from './../../code-map.constant';
import {
  ATTR_ENUM,
  ATTR_ID,
  ATTR_MODIFIERS,
  ATTR_NAME,
  ATTR_REVERSE_ENUM,
  ATTR_TYPE,
  AUTH_END,
  AUTH_START,
  LOADED,
  NOT_LOADED,
  NO_VENDOR,
} from './../../constants';
import { Injectable } from '@nestjs/common';
import { dirname, join, normalize, resolve } from 'path';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';

@Injectable()
export class RadiusService {}
// export class RadiusService {
//   attributesMap = {};
//   vendorNameToId = {};
//   authenticator;
//   no_secret;
//   secret;
//   message;
//   decoded;
//   dictionariesState = NOT_LOADED;

//   usesRandomAuthenticator = {
//     'Access-Request': true,
//     'Status-Server': true,
//   };

//   isRequestCode = {
//     'Status-Server': true,
//   };

//   dictionaryLocations = [normalize(__dirname + 'dictionaries')];

//   InvalidSecretError(msg, decoded, constr) {
//     Error.captureStackTrace(this, constr || this);
//     this.message = msg || 'Error';
//     this.decoded = decoded;
//   }

//   addDictionary(file) {
//     this.dictionaryLocations.push(resolve(file));
//   }

//   loadDictionaries() {
//     // var self = this;

//     if (this.dictionariesState == LOADED) {
//       return;
//     }

//     this.dictionaryLocations.forEach(function (file) {
//       if (!existsSync(file)) {
//         throw new Error('Invalid dictionary location: ' + file);
//       }

//       if (statSync(file).isDirectory()) {
//         const files = readdirSync(file);
//         for (let j = 0; j < files.length; j++) {
//           this.loadDictionary(file + '/' + files[j]);
//         }
//       } else {
//         this.loadDictionary(file);
//       }
//     });

//     this.dictionariesState = LOADED;
//   }

//   loadDictionary(file, seenFiles) {
//     file = normalize(file);

//     if (seenFiles === undefined) {
//       seenFiles = {};
//     }

//     if (seenFiles[file]) {
//       return;
//     }

//     seenFiles[file] = true;

//     const includes = this._loadDictionary(readFileSync(file, 'ascii'));
//     includes.forEach(function (i) {
//       this.loadDictionary(join(dirname(file), i), seenFiles);
//     });
//   }

//   private _loadDictionary = function (content) {
//     const lines = content.split('\n');

//     let vendor = NO_VENDOR;
//     const includes = [];
//     let attr_vendor;

//     for (let i = 0; i < lines.length; i++) {
//       let line = lines[i];

//       line = line.replace(/#.*/, '').replace(/\s+/g, ' ');

//       let match = line.match(/^\s*VENDOR\s+(\S+)\s+(\d+)/);
//       if (match) {
//         this.vendorNameToId[match[1]] = match[2];
//         continue;
//       }

//       if ((match = line.match(/^\s*BEGIN-VENDOR\s+(\S+)/))) {
//         vendor = this.vendorNameToId[match[1]];
//         continue;
//       }

//       if (line.match(/^\s*END-VENDOR/)) {
//         vendor = NO_VENDOR;
//         continue;
//       }

//       const initEntry = (vendor, attrId) => {
//         if (!this.attributesMap[vendor]) {
//           this.attributesMap[vendor] = {};
//         }

//         if (!this.attributesMap[vendor][attrId]) {
//           this.attributesMap[vendor][attrId] = [null, null, null, {}, {}, {}];
//         }
//       };

//       match = line.match(
//         /^\s*(?:VENDORATTR\s+(\d+)|ATTRIBUTE)\s+(\S+)\s+(\d+)\s+(\S+)\s*(.+)?/,
//       );
//       if (match) {
//         attr_vendor = vendor;
//         if (match[1] !== undefined) {
//           attr_vendor = match[1];
//         }

//         const modifiers = {};
//         if (match[5] !== undefined) {
//           match[5]
//             .replace(/\s*/g, '')
//             .split(',')
//             .forEach(function (m) {
//               modifiers[m] = true;
//             });
//         }

//         initEntry(attr_vendor, match[3]);

//         this.attributesMap[attr_vendor][match[3]][ATTR_ID] = match[3];
//         this.attributesMap[attr_vendor][match[3]][ATTR_NAME] = match[2];
//         this.attributesMap[attr_vendor][match[3]][ATTR_TYPE] =
//           match[4].toLowerCase();
//         this.attributesMap[attr_vendor][match[3]][ATTR_MODIFIERS] = modifiers;

//         const byName = this.attributesMap[attr_vendor][match[2]];
//         if (byName !== undefined) {
//           const byIndex = this.attributesMap[attr_vendor][match[3]];
//           [ATTR_ENUM, ATTR_REVERSE_ENUM].forEach(function (field) {
//             for (const name in byName[field]) {
//               byIndex[field][name] = byName[field][name];
//             }
//           });
//         }
//         this.attributesMap[attr_vendor][match[2]] =
//           this.attributesMap[attr_vendor][match[3]];

//         continue;
//       }

//       match = line.match(
//         /^\s*(?:VENDOR)?VALUE\s+(\d+)?\s*(\S+)\s+(\S+)\s+(\d+)/,
//       );
//       if (match) {
//         attr_vendor = vendor;
//         if (match[1] !== undefined) {
//           attr_vendor = match[1];
//         }

//         initEntry(attr_vendor, match[2]);

//         this.attributesMap[attr_vendor][match[2]][ATTR_ENUM][match[4]] =
//           match[3];
//         this.attributesMap[attr_vendor][match[2]][ATTR_REVERSE_ENUM][match[3]] =
//           match[4];

//         continue;
//       }

//       if ((match = line.match(/^\s*\$INCLUDE\s+(.*)/))) {
//         includes.push(match[1]);
//       }
//     }

//     return includes;
//   };

//   unloadDictionaries() {
//     this.attributesMap = {};
//     this.vendorNameToId = {};
//     this.dictionariesState = NOT_LOADED;
//   }

//   attrNameToId(attr_name, vendor_id) {
//     return this.attribTo(attr_name, vendor_id, ATTR_ID);
//   }

//   attrIdToName(attr_name, vendor_id) {
//     return this.attribTo(attr_name, vendor_id, ATTR_NAME);
//   }

//   getVendorNameToId(vendor_name) {
//     return this.vendorNameToId[vendor_name];
//   }

//   private attribTo(attr, vendor_id, target) {
//     if (vendor_id === undefined) {
//       vendor_id = NO_VENDOR;
//     }

//     if (!this.attributesMap[vendor_id]) {
//       return;
//     }

//     const attrInfo = this.attributesMap[vendor_id][attr];
//     if (!attrInfo) {
//       return;
//     }

//     return attrInfo[target];
//   }

//   error(error_msg) {
//     let err = error_msg;
//     if (typeof error_msg === 'string') {
//       err = new Error(error_msg);
//     }

//     throw err;
//   }

//   // var reverse_code_map = {};
//   // for (var code in code_map) {
//   //   reverse_code_map[code_map[code]] = code;
//   //   if (code_map[code].match(/Request/)) {
//   //     is_request_code[code_map[code]] = true;
//   //   }
//   // }

//   decodeWithoutSecret(args) {
//     // copy args' fields without modifiying the orginal
//     const nargs = { no_secret: true };
//     for (const p in args) {
//       nargs[p] = args[p];
//     }
//     // return this.decode(nargs, this._decode);
//   }

//   decode(args) {
//     console.log('---=====>>>> Decoding');
//     console.log('---=====>>>>', this);
//     this.loadDictionaries();

//     const packet = args.packet;
//     if (!packet || packet.length < 4) {
//       this.error('decode: packet too short');
//       return;
//     }

//     const ret: any = {};

//     ret.code = codeMap[packet.readUInt8(0)];

//     if (!ret.code) {
//       this.error("decode: invalid packet code '" + packet.readUInt8(0) + "'");
//       return;
//     }

//     ret.identifier = packet.readUInt8(1);
//     ret.length = packet.readUInt16BE(2);

//     if (packet.length < ret.length) {
//       this.error('decode: incomplete packet');
//       return;
//     }

//     this.authenticator = ret.authenticator = packet.slice(AUTH_START, AUTH_END);
//     this.no_secret = args.no_secret;
//     this.secret = args.secret;

//     const attrs = packet.slice(AUTH_END, ret.length);
//     ret.attributes = {};
//     ret.raw_attributes = [];

//     try {
//       this.decodeAttributes(
//         attrs,
//         ret.attributes,
//         NO_VENDOR,
//         ret.raw_attributes,
//       );
//     } catch (err) {
//       this.error(err);
//       return;
//     }

//     if (
//       !uses_random_authenticator[ret.code] &&
//       is_request_code[ret.code] &&
//       !args.no_secret
//     ) {
//       var orig_authenticator = new Buffer(AUTH_LENGTH);
//       packet.copy(orig_authenticator, 0, AUTH_START, AUTH_END);
//       packet.fill(0, AUTH_START, AUTH_END);

//       var checksum = this.calculate_packet_checksum(packet, args.secret);
//       orig_authenticator.copy(packet, AUTH_START);

//       if (checksum.toString() != this.authenticator.toString()) {
//         this.error(
//           new Radius.InvalidSecretError(
//             'decode: authenticator mismatch (possible shared secret mismatch)',
//             ret,
//           ),
//         );
//         return;
//       }
//     }

//     if (
//       is_request_code[ret.code] &&
//       ret.attributes['Message-Authenticator'] &&
//       !args.no_secret
//     ) {
//       this._verify_request_message_authenticator(args, ret);
//     }

//     return ret;
//   }
// }
