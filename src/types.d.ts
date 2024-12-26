import { Control, FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form';

declare module '@/shared/ui/form-field' {
  export interface FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  > {
    control?: Control<TFieldValues>;
    name: TName;
    render: ({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactElement;
  }
}
