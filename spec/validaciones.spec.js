import {
  validarRequerido, validarLargo, validarCorreo, validarRun, validarContrasena,
  validarEnteroNoNegativo, validarPrecio, formatearPrecio,
} from '../src/utils/validaciones.js';

describe('validaciones', () => {
  describe('validarRequerido', () => {
    it('rechaza vacío y solo espacios', () => {
      expect(validarRequerido('')).toBeFalse();
      expect(validarRequerido('   ')).toBeFalse();
    });
    it('acepta texto', () => expect(validarRequerido('hola')).toBeTrue());
  });

  describe('validarLargo', () => {
    it('respeta mínimo y máximo', () => {
      expect(validarLargo('abc', 3, 5)).toBeTrue();
      expect(validarLargo('ab', 3, 5)).toBeFalse();
      expect(validarLargo('abcdef', 3, 5)).toBeFalse();
    });
    it('permite límites nulos', () => {
      expect(validarLargo('abc', null, null)).toBeTrue();
    });
  });

  describe('validarCorreo', () => {
    it('acepta los dominios permitidos', () => {
      expect(validarCorreo('a@duoc.cl')).toBeTrue();
      expect(validarCorreo('a@profesor.duoc.cl')).toBeTrue();
      expect(validarCorreo('a@gmail.com')).toBeTrue();
    });
    it('rechaza otros dominios y formatos inválidos', () => {
      expect(validarCorreo('a@hotmail.com')).toBeFalse();
      expect(validarCorreo('sin-arroba')).toBeFalse();
      expect(validarCorreo('a@duoc')).toBeFalse();
    });
  });

  describe('validarRun', () => {
    it('acepta RUN con dígito verificador correcto', () => {
      expect(validarRun('190110222')).toBeTrue();
      expect(validarRun('123456785')).toBeTrue();
      expect(validarRun('111111111')).toBeTrue();
    });
    it('acepta dígito verificador K', () => {
      expect(validarRun('10000013K')).toBeTrue();
      expect(validarRun('10000013k')).toBeTrue();
    });
    it('el ejemplo de la pauta (19011022K) NO es un RUN real: su DV correcto es 2', () => {
      expect(validarRun('19011022K')).toBeFalse();
    });
    it('rechaza dígito verificador incorrecto', () => {
      expect(validarRun('190110220')).toBeFalse();
    });
    it('rechaza puntos, guion y largo incorrecto', () => {
      expect(validarRun('19.011.022-K')).toBeFalse();
      expect(validarRun('123')).toBeFalse();
    });
  });

  describe('validarContrasena', () => {
    it('exige entre 4 y 10 caracteres', () => {
      expect(validarContrasena('abc')).toBeFalse();
      expect(validarContrasena('abcd')).toBeTrue();
      expect(validarContrasena('abcdefghij')).toBeTrue();
      expect(validarContrasena('abcdefghijk')).toBeFalse();
    });
  });

  describe('números del admin', () => {
    it('stock: solo enteros no negativos', () => {
      expect(validarEnteroNoNegativo('0')).toBeTrue();
      expect(validarEnteroNoNegativo('5')).toBeTrue();
      expect(validarEnteroNoNegativo('-1')).toBeFalse();
      expect(validarEnteroNoNegativo('2.5')).toBeFalse();
      expect(validarEnteroNoNegativo('')).toBeFalse();
    });
    it('precio: acepta decimales y 0 (gratis), no negativos', () => {
      expect(validarPrecio('0')).toBeTrue();
      expect(validarPrecio('1999.99')).toBeTrue();
      expect(validarPrecio('-5')).toBeFalse();
      expect(validarPrecio('')).toBeFalse();
    });
  });

  describe('formatearPrecio', () => {
    it('muestra GRATIS cuando el precio es 0', () => {
      expect(formatearPrecio(0)).toBe('GRATIS');
    });
    it('antepone $ y separa miles', () => {
      expect(formatearPrecio(39990)).toContain('$');
      expect(formatearPrecio(39990)).toContain('39');
    });
  });
});
