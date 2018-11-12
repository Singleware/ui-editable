/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Editable states interface.
 */
export interface States {
  /**
   * Editable name.
   */
  name: string;
  /**
   * Editable value.
   */
  value: any;
  /**
   * Required state.
   */
  required: boolean;
  /**
   * Read-Only state.
   */
  readOnly: boolean;
  /**
   * Disabled state.
   */
  disabled: boolean;
}
