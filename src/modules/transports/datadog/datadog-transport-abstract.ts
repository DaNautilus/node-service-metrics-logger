import { DatabaseType } from '../../../enums';
import { Rest } from '../../../helpers/rest';
import { IMetricsResponse } from '../../../interfaces';
import { IMetricValue } from '../../database-metrics/interfaces/metric-value.interface';
import { mongoDbDefinition } from './database-definitions/mongodb-definition';
import { rabbitMqDefinition } from './database-definitions/rabbitmq-definition';
import { redisDefinition } from './database-definitions/redis-definition';
import { DefaultHost } from './enums/default-hosts.enum';
import { IDatabaseDefinition } from './interfaces/database-definition.interface';
import { IDatadogOptions } from './interfaces/datadog-options';

export abstract class DatadogTransportAbstract {
  public rest: Rest;

  constructor(private config: IDatadogOptions) {
    const host = config.host || DefaultHost.Host;

    this.rest = new Rest({
      host: `https://${host}/api/v1`,
      query: { api_key: config.apiKey, application_key: config.appKey },
    });
  }

  public getDatabaseDefinition(databaseType: DatabaseType): IDatabaseDefinition {
    switch (databaseType) {
      case DatabaseType.Redis:
        return redisDefinition;
      case DatabaseType.Mongodb:
        return mongoDbDefinition;
      case DatabaseType.RabbitMq:
        return rabbitMqDefinition;
      default:
        return;
    }
  }

  public getTags(metrics: IMetricsResponse, metricValue?: IMetricValue): string[] {
    return [
      ...this.mapTags(metrics),
      ...(metricValue && metricValue.tags || []),
      `database-type:${metrics.databaseType}`,
      `service-name:${metrics.name}`,
      ...this.config.tags || [],
    ];
  }

  private mapTags(metrics: IMetricsResponse): string[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const tagKeys = databaseDefinition.tagMaps ? Object.keys(databaseDefinition.tagMaps) : [];
    let tags = [];

    tagKeys.forEach(tagKey => {
      const metricValues = metrics.metrics[databaseDefinition.tagMaps[tagKey]];
      tags = [...tags, ...this.getTagsFromMetricValues(tagKey, metricValues)];
    });

    return tags;
  }

  private getTagsFromMetricValues(tagKey: string, metricValues: IMetricValue[]): string[] {
    return metricValues.map(metricValue => `${tagKey}:${metricValue.value || ''}`);
  }
}
