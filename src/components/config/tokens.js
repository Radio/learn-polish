'use strict';

/**
 * Recursively retrive value from given path.
 *
 * @param {String} path
 * @param {Object} document
 */
function retrieveRecursively (path, document) {
  if (document.hasOwnProperty(path)) {
    return document[path];
  }

  if (path.indexOf('.') < 0) {
    return null;
  }

  const [subDocumentPath, ...leftoverPathParts] = path.split('.');

  if (!document.hasOwnProperty(subDocumentPath)) {
    return null;
  }

  return retrieveRecursively(leftoverPathParts.join('.'), document[subDocumentPath]);
}

export default class Tokens {
  /**
   * @param {Object} configDocument
   */
  constructor (configDocument) {
    this.config = configDocument;
  }

  /**
   * Retrieve a config value by a given path.
   * Path may be nested with dots as separator.
   *
   * @param {String} path
   */
  get (path) {
    return retrieveRecursively(path, this.config);
  }
}
