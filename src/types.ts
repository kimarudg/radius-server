const sharedTypes = {
  AsyncDatabaseConnection: Symbol('AsyncDatabaseConnection'),
  CurrentUser: Symbol('CurrentUser'),
  EntityManager: Symbol('EntityManager'),
  IFixtures: Symbol('IFixtures'),
  QueryRunner: Symbol('QueryRunner'),
  WinstonTransport: Symbol('WinstonTransport'),
};

const serviceTypes = {
  MailService: Symbol('MailService'),
  UserService: Symbol('UserService'),
  AuthService: Symbol('AuthService'),
  LoggerService: Symbol('LoggerService'),
};

const repositoryTypes = {
  JobRepository: Symbol('JobRepository'),
  FileRepository: Symbol('FileRepository'),
};
const ERROR_CODES = {
  InvalidParameterError: 422,
  PermissionError: 401,
  ResourceNotFoundError: 404,
};

const TYPES = {
  ...sharedTypes,
  ...serviceTypes,
  ...repositoryTypes,
  ERROR_CODES,
};
export { TYPES };
