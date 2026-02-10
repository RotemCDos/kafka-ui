import { SelectOption } from 'components/common/Select/Select';
import {
  KafkaAclOperationEnum,
  KafkaAclPermissionEnum,
  KafkaAclResourceType,
} from 'generated-sources';
import { RadioOption } from 'components/common/Radio/types';

import { FormValues } from './types';

function toOptionsArray<T extends string>(
  list: T[],
  unknown: T
): SelectOption<T>[] {
  return list.reduce<SelectOption<T>[]>((acc, cur) => {
    if (cur !== unknown) {
      acc.push({ label: cur, value: cur });
    }

    return acc;
  }, []);
}

export const resourceTypes = toOptionsArray(
  Object.values(KafkaAclResourceType).filter(
    (key) =>
      key !== ('DELEGATION_TOKEN' as any) &&
      key !== ('USER' as any)
  ),
  KafkaAclResourceType.UNKNOWN
);

export const operations = toOptionsArray(
  Object.values(KafkaAclOperationEnum).filter(
    (key) =>
      key !== ('ALL' as any) &&
      key !== ('DELETE' as any) &&
      key !== ('ALTER' as any) &&
      key !== ('CLUSTER_ACTION' as any) &&
      key !== ('ALTER_CONFIGS' as any) &&
      key !== ('DESCRIBE_TOKENS' as any) &&
      key !== ('CREATE_TOKENS' as any)
  ),
  KafkaAclOperationEnum.UNKNOWN
);

export const permissions: RadioOption[] = [
  {
    value: KafkaAclPermissionEnum.ALLOW,
    itemType: 'green',
  },
  {
    value: KafkaAclPermissionEnum.DENY,
    itemType: 'red',
  },
];

export const defaultValues: Partial<FormValues> = {
  resourceType: resourceTypes[0].value as KafkaAclResourceType,
  operation: operations[0].value as KafkaAclOperationEnum,
};
