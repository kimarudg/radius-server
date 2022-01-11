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
      const packet = radius.decode({ packet: msg, secret: 'secret' });
      console.log({ packet });
      const { attributes, raw_attributes } = packet;
      // for (const rawAttribute of raw_attributes) {
      //   // console.log(rawAttribute);
      //   // console.log(rawAttribute[1].toString());
      //   // console.log('---------------------------');
      // }
      const msgData = attributes['EAP-Message'];
      const msgAuthenticator = attributes['Message-Authenticator'];
      console.log({ attributes });
      console.log('===========>>>>>>>');
      console.log(msgData.toString());
      console.log(msgAuthenticator.toString());
      console.log({ rinfo });
      console.log('<<<<<<<<<==========');

      const [guid, hostname, filename, hash, requestType, value] = msg
        .toString('utf8')
        .split('\n');

      console.log(`DgramServer got message: ${msg.toString('utf8')}`);
      let serverResponse = ['00', ActivityResponseMap[ActivityResponse.ERROR]];

      if (ActivityRequestMap[+requestType] === 'CHECK_HASH') {
        console.log(
          '!!ActivityRequestMap[+requestType]',
          ActivityRequestMap[+requestType],
          ActivityRequestMap[+requestType],
        );
        const processChallenge = ProcessPermissionMap[ProcessPermission.DENY];

        // this.activityService.create({
        //   guid,
        //   hostname,
        //   filename,
        //   hash,
        //   address: rinfo.address,
        //   port: rinfo.port.toString(),
        //   from: 'CLIENT',
        //   request: ActivityRequest.CHECK_HASH,
        // });

        const findProcess = {};

        // if (findProcess) {
        //   processChallenge = ProcessPermissionMap[findProcess.permission];
        // } else {
        //   this.processRepository.insert({
        //     hash: hash.toLocaleUpperCase(),
        //     originalFilename: filename,
        //     extension: path.win32.extname(filename).toLocaleLowerCase(),
        //     permission: ProcessPermission.UNKNOWN,
        //   });
        //   processChallenge = ProcessPermissionMap[ProcessPermission.UNKNOWN];
        // }
        const res = {
          guid,
          hostname,
          filename,
          hash,
          address: rinfo.address,
          port: rinfo.port.toString(),
          from: 'SERVER',
          response: ActivityResponse[ActivityResponseMap[processChallenge]],
        };

        // this.activityService.create(res);

        serverResponse = ['00', hash.toLocaleUpperCase(), processChallenge];
      } else if (
        ActivityRequestMap[+requestType] === 'PROCESS_SET_PERMISSION'
      ) {
        const processPermissionMapped =
          ProcessPermission[ProcessPermissionMap[+value]];
        let processChallenge = ActivityResponse.PROCESS_UNKNOWN;

        if (processPermissionMapped) {
          if (processPermissionMapped === ProcessPermission.ALLOW) {
            processChallenge = ActivityResponse.PROCESS_ALLOW;
          } else {
            processChallenge = ActivityResponse.PROCESS_DENY;
          }
        } else {
          processChallenge = ActivityResponse.ERROR;
        }

        // this.activityService.create({
        //   guid,
        //   hostname,
        //   filename,
        //   hash,
        //   address: rinfo.address,
        //   port: rinfo.port.toString(),
        //   from: 'CLIENT',
        //   request: ActivityRequest.PROCESS_SET_PERMISSION,
        // });

        const findProcess = {};

        // if (findProcess) {
        //   findProcess.permission = processPermissionMapped;
        //   findProcess.save();
        // } else {
        //   this.processRepository.insert({
        //     hash: hash.toLocaleUpperCase(),
        //     originalFilename: filename,
        //     extension: path.win32.extname(filename).toLocaleLowerCase(),
        //     permission: processPermissionMapped,
        //   });
        // }

        // this.activityService.create({
        //   guid,
        //   hostname,
        //   filename,
        //   hash,
        //   address: rinfo.address,
        //   port: rinfo.port.toString(),
        //   from: 'SERVER',
        //   response: processChallenge,
        // });

        serverResponse = [
          '00',
          hash.toLocaleUpperCase(),
          ActivityResponseMap[processChallenge],
        ];
      } else if (ActivityRequestMap[+requestType] === 'ADMIN_HELP') {
        const activityAdminHelp = ActivityResponse.ADMIN_HELP_UNREGISTER;
        const adminHelpResponse =
          ActivityResponseAdminHelpMap[activityAdminHelp];

        // this.activityService.create({
        //   guid,
        //   hostname,
        //   filename,
        //   hash,
        //   address: rinfo.address,
        //   port: rinfo.port.toString(),
        //   from: 'CLIENT',
        //   request: ActivityRequest.ADMIN_HELP,
        // });

        const findProcess = {};

        if (findProcess) {
          // if (
          //   findProcess.adminHelp === ActivityResponse.ADMIN_HELP_UNREGISTER
          // ) {
          //   findProcess.adminHelp = ActivityResponse.ADMIN_HELP_START;
          //   findProcess.save();

          // adminHelpResponse =
          //   ActivityResponseAdminHelpMap[findProcess.adminHelp];
          // activityAdminHelp =
          //   ActivityResponse[ActivityResponseAdminHelpMap[adminHelpResponse]];

          // this.activityService.create({
          //   guid,
          //   hostname,
          //   filename,
          //   hash,
          //   address: rinfo.address,
          //   port: rinfo.port.toString(),
          //   from: 'SERVER',
          //   response: activityAdminHelp,
          // });

          serverResponse = ['00', hash.toLocaleUpperCase(), adminHelpResponse];
        }
      }

      const serverResponseBuffer = Buffer.from(serverResponse.join(''));
      dgramSocket.send(
        serverResponseBuffer,
        0,
        serverResponseBuffer.length,
        rinfo.port,
        rinfo.address,
      );
    });
  }
}
