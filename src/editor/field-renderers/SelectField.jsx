import Field from "../../design-system/Field.jsx";

export function SelectField({ slot, value, onChange }) {
  return (
    <Field as="select" label={slot.label} value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
      {(slot.options || []).map((option) => (
        <option key={option.value ?? option} value={option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </Field>
  );
}

export default SelectField;
