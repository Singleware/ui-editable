/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Editable properties interface.
 */
export interface Properties {
  /**
   * Editable classes.
   */
  class?: string;
  /**
   * Editable slot.
   */
  slot?: string;
  /**
   * Editable name.
   */
  name?: string;
  /**
   * Editable value.
   */
  value?: any;
  /**
   * Determines whether the editable is required or not.
   */
  required?: boolean;
  /**
   * Determines whether the editable is read-only or not.
   */
  readOnly?: boolean;
  /**
   * Determines whether the editable is disabled or not.
   */
  disabled?: boolean;
  /**
   * Editable children.
   */
  children?: {};
  /**
   * Render viewer event.
   */
  onRenderViewer?: (value: any) => HTMLElement;
  /**
   * Render editor event.
   */
  onRenderEditor?: (value: any) => HTMLElement;
}
