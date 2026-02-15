import React, { useRef } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { TOPIC_CUSTOM_PARAMS } from 'lib/constants';
import { FieldArrayWithId, useFormContext, Controller } from 'react-hook-form';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import { FormError } from 'components/common/Input/Input.styled';
import Input from 'components/common/Input/Input';
import IconButtonWrapper from 'components/common/Icons/IconButtonWrapper';
import CloseCircleIcon from 'components/common/Icons/CloseCircleIcon';
import * as C from 'components/Topics/shared/Form/TopicForm.styled';
import { ConfigSource } from 'generated-sources';
import InputWithOptions from 'components/common/InputWithOptions/InputWithOptions';
import { TopicFormData } from 'lib/interfaces/topic';

import * as S from './CustomParams.styled';

export interface Props {
  isDisabled: boolean;
  index: number;
  existingFields: string[];
  field: FieldArrayWithId<TopicFormData, 'customParams', 'id'>;
  remove: (index: number) => void;
}

const CustomParamField: React.FC<Props> = ({
  isDisabled,
  index,
  remove,
  existingFields,
}) => {
  const {
    formState: { errors },
    setValue,
    watch,
    trigger,
    control,
  } = useFormContext<TopicFormData>();
  const nameValue = watch(`customParams.${index}.name`);
  const prevName = useRef(nameValue);

  const options = Object.keys(TOPIC_CUSTOM_PARAMS)
    .sort()
    .map((option) => ({
      value: option,
      label: option,
      disabled: existingFields.includes(option) && option !== nameValue,
    }));

  React.useEffect(() => {
    if (nameValue !== prevName.current) {
      prevName.current = nameValue;
      if (TOPIC_CUSTOM_PARAMS[nameValue]) {
        setValue(
          `customParams.${index}.value`,
          TOPIC_CUSTOM_PARAMS[nameValue],
          {
            shouldValidate: true,
          }
        );
      }
    }
  }, [index, nameValue, setValue]);

  return (
    <C.Column>
      <div>
        <InputLabel>Custom Parameter *</InputLabel>
        <Controller
          control={control}
          name={`customParams.${index}.name`}
          render={({ field: { name, onChange, value } }) => (
            <InputWithOptions
              value={value}
              options={options}
              name={name}
              onChange={(s) => {
                onChange(s);
                trigger('customParams');
              }}
              minWidth="270px"
              placeholder="Select"
            />
          )}
        />
        <FormError>
          <ErrorMessage
            errors={errors}
            name={`customParams.${index}.name` as const}
          />
        </FormError>
      </div>
      <div>
        <InputLabel>Value *</InputLabel>
        <Input
          name={`customParams.${index}.value` as const}
          placeholder="Value"
          autoComplete="off"
          disabled={isDisabled}
        />
        <FormError>
          <ErrorMessage
            errors={errors}
            name={`customParams.${index}.value` as const}
          />
        </FormError>
      </div>

      <S.DeleteButtonWrapper>
        <IconButtonWrapper
          onClick={() => remove(index)}
          onKeyDown={(e: React.KeyboardEvent) =>
            e.code === 'Space' && remove(index)
          }
          title={`Delete customParam field ${index}`}
        >
          <CloseCircleIcon aria-hidden />
        </IconButtonWrapper>
      </S.DeleteButtonWrapper>
    </C.Column>
  );
};

export default React.memo(CustomParamField);
