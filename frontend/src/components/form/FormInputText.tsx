import { SxProps, TextField, Theme } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputTextProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  type?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  sx?: SxProps<Theme>;
}
const FormInputText = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type,
  variant = 'outlined',
  sx,
  ...rest
}: FormInputTextProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        type={type}
        label={label}
        variant={variant}
        error={!!error}
        color={'primary'}
        helperText={error ? error.message : ''}
        sx={{ ...sx }}
        {...rest}
      />
    )}
  />
);

export default FormInputText;
