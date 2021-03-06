declare module 'cfenv' {
  interface IAppEnvOptions {
    name?: string;
    vcap?: {},
    vcapFile?: string;
  }

  export interface IRedisCredentials {
    host: string;
    port: number;
    master_port: number;
    slave_ports: number[];
    password: string;
  }

  export interface IMongodbCredentials {
    database_uri: string;
    host?: string;
    ports?: string[];
    username?: string;
    password?: string;
    database?: string;
    uri?: string;
    replica_set?: string;
  }

  export interface IRabbitMqCredentials {
    uri: string;
    uris: string[];
    vhost:string;
    username:string;
    ssl: boolean;
    password: string;
    hostname: string;
    hostnames: string[];
    port: number;
    amqp_port: number;
    mqtt_port: number;
    stomp_port: number;
    management_port: number;
    http_api_uri: string;
    http_api_uris: string[];
  }

  export type TCredentials = IMongodbCredentials | IRedisCredentials | IRabbitMqCredentials;

  export interface IService<> {
    label: string;
    provider: string;
    plan: string;
    name: string;
    tags: string[];
    instance_name: string;
    binding_name: string;
    credentials: TCredentials;
    syslog_drain_url: string;
    volume_mounts: string[];
    [x: string]: any
  }

  export interface IApp {
    application_id: string;
    application_name: string;
    application_uris: string[];
    application_version: string;
    cf_api: string;
    host: string;
    limits: number;
    name: string;
    organization_id: string;
    organization_name: string;
    process_id: string;
    process_type: string;
    space_id: string;
    space_name: string;
    start: string;
    started_at: string;
    started_at_timestamp: string;
    state_timestamp: string;
    uris: string[];
    version: string;
  }

  export interface IAppEnv {
    app: IApp;
    getServices(): IService[];
    getServiceCreds(serviceName: RegExp | string): TCredentials;
  }

  export function getAppEnv(option?: IAppEnvOptions): IAppEnv;
}
