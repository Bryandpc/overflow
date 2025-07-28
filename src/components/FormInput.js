import { Controller } from 'react-hook-form';
import Input from './Input';

const FormInput = ({
  name,
  control,
  rules,
  ...inputProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Input
          {...inputProps}
          {...field}
        />
      )}
    />
  );
};

export default FormInput;