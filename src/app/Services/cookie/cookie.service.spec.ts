import { TestBed } from '@angular/core/testing';

import { Cookie } from './cookie.service';

/**
 * Tests for Cookie Service
 */
describe('Cookie component', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
        {provide: Cookie, useClass: Cookie}
      ]
    })
  );

  it('cookie with name \'invalid_cookie\' should\'t exists', () => {
    expect(Cookie.getCookie('invalid_cookie')).toBeNull();
  });

  it('valid cookie should be set', () => {
    Cookie.setCookie('valid_cookie', 'test_value');
    expect(Cookie.getCookie('valid_cookie')).toContain('test_value');
  });

  it('cookie with name \'valid_cookie\' should be removed', () => {
    expect(Cookie.getCookie('valid_cookie')).toContain('test_value');
    Cookie.removeCookie('valid_cookie');
    expect(Cookie.getCookie('valid_cookie')).toBeNull();
  });
});
