import { describe, it, expect, vi, beforeEach } from '@asymmetric-effort/nogginlessdom';
import { warn, error, deprecate, resetWarnings } from '../../../src/shared/warnings';

describe('warnings', () => {
  beforeEach(() => {
    resetWarnings();
  });

  describe('warn', () => {
    it('logs a warning', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      warn('test warning');
      expect(spy).toHaveBeenCalledWith('[SpecifyJS] test warning');
      spy.mockRestore();
    });

    it('deduplicates identical warnings', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      warn('duplicate');
      warn('duplicate');
      warn('duplicate');
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('logs different warnings separately', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      warn('first');
      warn('second');
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });
  });

  describe('error', () => {
    it('logs an error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      error('test error');
      expect(spy).toHaveBeenCalledWith('[SpecifyJS] test error');
      spy.mockRestore();
    });

    it('does not deduplicate errors', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      error('same');
      error('same');
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });
  });

  describe('deprecate', () => {
    it('logs a deprecation warning with old, new, and version', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      deprecate('oldFunc', 'newFunc', '2.0.0');
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('DEPRECATED: "oldFunc" is deprecated'),
      );
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('v2.0.0'));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('"newFunc"'));
      spy.mockRestore();
    });

    it('is deduplicated like regular warnings', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      deprecate('oldApi', 'newApi', '3.0.0');
      deprecate('oldApi', 'newApi', '3.0.0');
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  describe('resetWarnings', () => {
    it('allows previously-warned messages to warn again', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      warn('reset-test');
      expect(spy).toHaveBeenCalledTimes(1);

      resetWarnings();
      warn('reset-test');
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });
  });
});
