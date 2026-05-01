import Field from "../../design-system/Field.jsx";

export function TextField({ slot, value, onChange, type = "text" }) {
  return (
    <Field
      type={type}
      label={slot.label}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default TextField;
