/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Editable element interface.
 */
export interface Element extends HTMLDivElement {
  /**
   * Editable name.
   */
  name: string;
  /**
   * Editable value.
   */
  value: any;
  /**
   * Editable state.
   */
  checked: boolean;
  /**
   * Default editable value.
   */
  readonly defaultValue: any;
  /**
   * Required state.
   */
  required: boolean;
  /**
   * Read-only state.
   */
  readOnly: boolean;
  /**
   * Disabled state.
   */
  disabled: boolean;
  /**
   * Checks the validity.
   * @returns Returns true when the editable data is valid, false otherwise.
   */
  checkValidity(): boolean;
  /**
   * Reports the validity.
   * @returns Returns true when the editable data is valid, false otherwise.
   */
  reportValidity(): boolean;
  /**
   * Reset the editable data to its initial value and state.
   */
  reset(): void;
  /**
   * Start editing.
   */
  edit(): void;
  /**
   * Concludes the current editing.
   */
  conclude(): void;
  /**
   * Cancels the current editing.
   */
  cancel(): void;
  /**
   * Wait for edit to finish.
   * @returns Returns a promise to get true when the editing was finished or false when is canceled.
   */
  wait(): Promise<boolean>;
}
