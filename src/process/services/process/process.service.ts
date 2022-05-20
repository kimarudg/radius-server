import { Injectable } from '@nestjs/common';
import {
  ProcessPermission,
  ProcessPermissionMap,
} from '../../interfaces/process.interface';
import {
  ActivityRequest,
  ActivityRequestMap,
  ActivityResponse,
  ActivityResponseAdminHelpMap,
  ActivityResponseMap,
} from '../../interfaces/activity.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const radius = require('radius');

@Injectable()
export class ProcessService {
  onMessage(dgramSocket: any) {
    // console.log('onMessage Init with policy:', this.defaultPolicy);

    dgramSocket.on('message', async (msg, rinfo) => {
      const packet = radius.decode({ packet: msg, secret: 'cisco21' });
      console.log('=====================================================');
      console.log({ packet });
      console.log('----------------------------------------------c');
      const { attributes, raw_attributes } = packet;
      const msgData = attributes['EAP-Message'];
      const msgAuthenticator = attributes['Message-Authenticator'];
      const [guid, hostname, filename, hash, requestType, value] = msg
        .toString('utf8')
        .split('\n');

      const response = radius.encode_response({
        packet,
        code: 'Access-Accept',
        secret: 'cisco21',
      });

      console.log('--->> Response sent');

      dgramSocket.send(response, 0, response.length, rinfo.port, rinfo.address);
    });
  }
}
