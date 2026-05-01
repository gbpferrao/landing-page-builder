import Field from "../../design-system/Field.jsx";

export function ListField({ slot, value, onChange }) {
  const textValue = Array.isArray(value) ? value.join("\n") : "";

  return (
    <Field
      as="textarea"
      label={slot.label}
      value={textValue}
      help="Um item por linha."
      onChange={(event) => {
        onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean));
      }}
    />
  );
}

export default ListField;
