import Field from "../../design-system/Field.jsx";

export function ObjectField({ slot, value, onChange }) {
  const textValue = JSON.stringify(value ?? {}, null, 2);

  return (
    <Field
      as="textarea"
      label={slot.label}
      value={textValue}
      help="Edite este objeto como JSON valido."
      onChange={(event) => {
        try {
          onChange(JSON.parse(event.target.value || "{}"));
        } catch {
          // Keep the last valid object while the user is typing invalid JSON.
        }
      }}
    />
  );
}

export default ObjectField;
