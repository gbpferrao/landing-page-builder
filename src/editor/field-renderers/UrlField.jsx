import TextField from "./TextField.jsx";

export function UrlField(props) {
  return <TextField {...props} type={props.slot.type === "email" ? "email" : "url"} />;
}

export default UrlField;
