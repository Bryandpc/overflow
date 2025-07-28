import { Controller } from 'react-hook-form';
import Select from './Select';

const FormSelect = ({
  name,
  control,
  rules,
  options,
  ...selectProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select
          options={options}
          {...selectProps}
          {...field}
        />
      )}
    />
  );
};

export default FormSelect;