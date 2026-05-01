import Field from "../../design-system/Field.jsx";

export function TextAreaField({ slot, value, onChange }) {
  return (
    <Field
      as="textarea"
      label={slot.label}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default TextAreaField;
