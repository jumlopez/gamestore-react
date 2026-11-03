import { Form } from 'react-bootstrap';

/** Átomo: etiqueta + control + ayuda + mensaje de error. Sirve para input, textarea y select. */
export default function FormField({
  id, label, error, help, as, children, className = '', ...controlProps
}) {
  return (
    <Form.Group className={`mb-3 ${className}`} controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as={as} isInvalid={!!error} name={id} {...controlProps}>
        {children}
      </Form.Control>
      {help && !error && <Form.Text muted>{help}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
