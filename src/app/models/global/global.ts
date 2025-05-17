import {LocalStorageIpPortService} from '../../services/localStorageIpPort/local-storage-ip-port.service';

export const Global = {
    URL: {
      // ws_port: 3001,
      // http_port: 80,
      endpoint:LocalStorageIpPortService.readAddress(),
      socket: LocalStorageIpPortService.readAddressSocket(),
      pathToImage: 'images/products/'
    }
};
