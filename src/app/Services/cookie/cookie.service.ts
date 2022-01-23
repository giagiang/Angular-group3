import { isNull } from 'lodash';
import { Injectable } from "@angular/core";

/**
 * Class Cookie implement basic functions for dealing with Cookies
 */
@Injectable()
export class Cookie {
  /**
   * Return a cookie by it's name
   *
   * @param {string} name
   *
   * @return {string}
   */
  public static getCookie(name: string): string {
    const regexp: RegExp = new RegExp('(?:^|; )' + name + '=([^;]*)');
    const result: RegExpExecArray = regexp.exec(document.cookie);

    let value: string = '';

    if (!isNull(result)) {
      value = decodeURIComponent(result[1].replace(/\+/g, ' '));
      try {
        value = JSON.parse(value);
      } catch (e) {
        /**
         * This suppresses exceptions from JSON.parse() function.
         * If value is not a valid json string we return it directly below.
         */
      }
    }

    return value;
  }

  /**
   * Save a value in a cookie
   *
   * @param {string} name
   * @param {any} value
   * @param {Date} expires?
   * @param {string} path?
   * @param {string} domain?
   */
  public static setCookie(name: string, value: any, expires?: Date, path?: string, domain?: string): void {
    let cookie: string = `${name}=${encodeURIComponent(JSON.stringify(value))};`;

    if (expires) {
      cookie += 'expires=' + expires.toUTCString() + ';';
    }

    if (path) {
      cookie += 'path=' + path + ';';
    }

    if (domain) {
      cookie += 'domain=' + domain + ';';
    }

    document.cookie = cookie;
  }

  /**
   * Delete a cookie by it's name
   *
   * @param {string} name
   * @param {string} path?
   * @param {string} domain?
   */
  public static removeCookie(name: string, path?: string, domain?: string): void {
    if (!this.getCookie(name)) {
      return;
    }

    const date: Date = new Date();

    date.setFullYear(date.getFullYear() - 1);
    this.setCookie(name, '', date, path, domain);
  }
}
