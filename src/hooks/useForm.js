import { useState, useCallback } from 'react';

/**
 * Manejo de formularios con validación EN TIEMPO REAL.
 *  - validators: { campo: (valor, todosLosValores) => 'mensaje de error' | '' }
 *  - Al escribir se validan los campos ya tocados (así "confirmar contraseña"
 *    se revalida cuando cambia "contraseña").
 *  - validarTodo() se llama al enviar y marca todos los campos.
 */
export default function useForm(valoresIniciales, validators) {
  const [values, setValues] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validarCampos = useCallback(
    (nombres, valores) => {
      const nuevos = {};
      nombres.forEach((n) => {
        if (validators[n]) nuevos[n] = validators[n](valores[n], valores);
      });
      return nuevos;
    },
    [validators]
  );

  const setValue = (name, value) => {
    const valores = { ...values, [name]: value };
    const tocados = { ...touched, [name]: true };
    setValues(valores);
    setTouched(tocados);
    setErrors((prev) => ({ ...prev, ...validarCampos(Object.keys(tocados), valores) }));
  };

  /** Cambia varios campos a la vez (ej: región + comuna) sin que uno pise al otro */
  const setMany = (cambios) => {
    const valores = { ...values, ...cambios };
    const tocados = { ...touched, ...Object.fromEntries(Object.keys(cambios).map((k) => [k, true])) };
    setValues(valores);
    setTouched(tocados);
    setErrors((prev) => ({ ...prev, ...validarCampos(Object.keys(tocados), valores) }));
  };

  const handleChange = (e) => setValue(e.target.name, e.target.value);

  const validarTodo = () => {
    const todos = validarCampos(Object.keys(validators), values);
    setErrors(todos);
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    return Object.values(todos).every((m) => !m);
  };

  const reset = (nuevos = valoresIniciales) => {
    setValues(nuevos);
    setErrors({});
    setTouched({});
  };

  return { values, errors, setValue, setMany, handleChange, validarTodo, reset, setValues };
}
