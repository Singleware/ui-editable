/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';
import { States } from './states';
import { Render } from './render';

/**
 * Editable template class.
 */
@Class.Describe()
export class Template<T extends Properties = Properties, V = any> extends Control.Component<T> {
  /**
   * Conclusion callback.
   */
  @Class.Private()
  private conclusion?: Class.Callable;

  /**
   * Editor instance.
   */
  @Class.Private()
  private editor!: HTMLElement;

  /**
   * Viewer instance.
   */
  @Class.Private()
  private viewer!: HTMLElement;

  /**
   * Determines whether the editable data was changed or not.
   */
  @Class.Private()
  private changed = false;

  /**
   * Editable states.
   */
  @Class.Private()
  private states = {
    name: this.properties.name,
    value: this.properties.value,
    required: this.properties.required,
    readOnly: this.properties.readOnly,
    disabled: this.properties.disabled
  } as States;

  /**
   * Viewer slot.
   */
  @Class.Private()
  private viewerSlot = <slot name="viewer" /> as HTMLSlotElement;

  /**
   * Edit button slot.
   */
  @Class.Private()
  private editSlot = <slot name="edit" /> as HTMLSlotElement;

  /**
   * Editor slot.
   */
  @Class.Private()
  private editorSlot = <slot name="editor" /> as HTMLSlotElement;

  /**
   * Conclude button slot.
   */
  @Class.Private()
  private concludeSlot = <slot name="conclude" /> as HTMLSlotElement;

  /**
   * Cancel button slot.
   */
  @Class.Private()
  private cancelSlot = <slot name="cancel" /> as HTMLSlotElement;

  /**
   * Editor wrapper element.
   */
  @Class.Private()
  private editorWrapper = (
    <div class="editor">
      {this.editorSlot}
      {this.concludeSlot}
      {this.cancelSlot}
    </div>
  ) as HTMLLabelElement;

  /**
   * Viewer wrapper element.
   */
  @Class.Private()
  private viewerWrapper = (
    <div class="viewer">
      {this.viewerSlot}
      {this.editSlot}
    </div>
  ) as HTMLLabelElement;

  /**
   * Editable styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host > .viewer,
:host > .editor {
  display: flex;
  flex-direction: row;
  width: 100%;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Editable skeleton.
   */
  @Class.Private()
  private skeleton = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Editable shadow.
   */
  @Class.Private()
  private shadow = DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles);

  /**
   * Updates the specified property state.
   * @param property Property name.
   * @param state Property state.
   */
  @Class.Private()
  private updatePropertyState(property: string, state: boolean): void {
    if (state) {
      this.skeleton.dataset[property] = 'on';
    } else {
      delete this.skeleton.dataset[property];
    }
  }

  /**
   * Sets the specified property into the current editor.
   * @param property Property name.
   * @param value Property value.
   */
  @Class.Private()
  private setEditorProperty(property: string, value: any): void {
    if (property in this.editor) {
      (this.editor as any)[property] = value;
    }
  }

  /**
   * Gets the specified property from the current editor.
   * @param property Property name.
   * @returns Returns the property value or undefined when the property was not found.
   */
  @Class.Private()
  private getEditorProperty(property: string): any {
    return property in this.editor ? (this.editor as any)[property] : void 0;
  }

  /**
   * Notify a render that corresponds to the specified rendering type.
   * @param type Render type.
   * @returns Returns the rendering result.
   */
  @Class.Private()
  private notifyRender(type: string): Render {
    const detail = { input: this.states.value, output: void 0 } as Render;
    const event = new CustomEvent<Render>(type, { bubbles: true, cancelable: true, detail: detail });
    if (!this.skeleton.dispatchEvent(event)) {
      detail.output = void 0;
    }
    return detail;
  }

  /**
   * Renders the viewer.
   * @returns Returns the rendered viewer element.
   */
  @Class.Private()
  private renderViewer(): HTMLElement {
    const detail = this.notifyRender('renderviewer');
    if (!detail.output) {
      return <div slot="viewer">{detail.input}</div> as HTMLDivElement;
    }
    return detail.output;
  }

  /**
   * Renders the editor.
   * @returns Returns the rendered editor element.
   */
  @Class.Private()
  private renderEditor(): HTMLElement {
    const detail = this.notifyRender('rendereditor');
    if (!detail.output) {
      return <div slot="editor">Editor not provided</div> as HTMLDivElement;
    }
    return detail.output;
  }

  /**
   * Start editing.
   */
  @Class.Private()
  private startEditing(): void {
    this.changed = false;
    this.viewerWrapper.remove();
    this.updatePropertyState('editing', true);
    DOM.append(this.shadow, this.editorWrapper);
    const slot = Control.getChildByType(this.editorSlot, HTMLElement);
    if (slot) {
      DOM.append(DOM.clear(slot), this.editor);
      Control.setChildrenProperty(this.concludeSlot, 'disabled', this.disabled || !this.checkValidity());
      Control.setChildrenProperty(this.cancelSlot, 'disabled', this.disabled);
    } else {
      throw new Error(`Editor element not provided.`);
    }
  }

  /**
   * Stop editing.
   */
  @Class.Private()
  private stopEditing(): void {
    this.changed = false;
    this.editorWrapper.remove();
    this.updatePropertyState('editing', false);
    DOM.append(this.shadow, this.viewerWrapper);
    const slot = Control.getChildByType(this.viewerSlot, HTMLElement);
    if (slot) {
      DOM.append(DOM.clear(slot), this.viewer);
      Control.setChildrenProperty(this.editSlot, 'disabled', this.disabled);
    } else {
      throw new Error(`Viewer element not provided.`);
    }
  }

  /**
   * Render viewer handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderViewerHandler(event: CustomEvent<Render>): void {
    if (this.properties.onRenderViewer) {
      event.detail.output = this.properties.onRenderViewer(event.detail.input);
    }
  }

  /**
   * Render editor handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderEditorHandler(event: CustomEvent<Render>): void {
    if (this.properties.onRenderEditor) {
      event.detail.output = this.properties.onRenderEditor(event.detail.input);
    }
  }

  /**
   * Enable event handler.
   */
  @Class.Private()
  private enableHandler(): void {
    const disable = !this.checkValidity();
    if (!this.disabled) {
      Control.setChildrenProperty(this.concludeSlot, 'disabled', disable);
    }
  }

  /**
   * Editor change handler.
   * @param event Event information.
   */
  @Class.Private()
  private changeHandler(event: Event): void {
    event.stopPropagation();
    this.enableHandler();
    this.changed = true;
  }

  /**
   * Start editing handler.
   */
  @Class.Private()
  private editHandler(): void {
    if (!this.disabled) {
      this.edit();
    }
  }

  /**
   * Conclude editing handler.
   */
  @Class.Private()
  private concludeHandler(): void {
    if (!this.disabled && this.checkValidity()) {
      const changed = this.changed;
      this.conclude();
      if (changed) {
        this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
      }
    }
  }

  /**
   * Cancel editing handler.
   */
  @Class.Private()
  private cancelHandler(): void {
    if (!this.disabled) {
      this.cancel();
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    this.editSlot.addEventListener('click', this.editHandler.bind(this));
    this.concludeSlot.addEventListener('click', this.concludeHandler.bind(this));
    this.cancelSlot.addEventListener('click', this.cancelHandler.bind(this));
    this.editorSlot.addEventListener('change', this.changeHandler.bind(this), true);
    this.editorSlot.addEventListener('keyup', this.enableHandler.bind(this), true);
    this.skeleton.addEventListener('renderviewer', this.renderViewerHandler.bind(this));
    this.skeleton.addEventListener('rendereditor', this.renderEditorHandler.bind(this));
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    this.bindComponentProperties(this.skeleton, [
      'name',
      'value',
      'defaultValue',
      'required',
      'readOnly',
      'disabled',
      'checkValidity',
      'reportValidity',
      'reset',
      'edit',
      'conclude',
      'cancel',
      'wait'
    ]);
  }

  /**
   * Initialize the first renderers.
   */
  @Class.Private()
  private initialRender(): void {
    this.viewer = this.renderViewer();
    this.stopEditing();
  }

  /**
   * Default constructor.
   * @param properties Editable properties.
   * @param children Editable children.
   */
  constructor(properties?: T, children?: any[]) {
    super(properties, children);
    this.bindHandlers();
    this.bindProperties();
    this.initialRender();
  }

  /**
   * Gets the editable data name.
   */
  @Class.Public()
  public get name(): string {
    return this.states.name;
  }

  /**
   * Sets the editable data name.
   */
  public set name(name: string) {
    this.setEditorProperty('name', (this.states.name = name));
  }

  /**
   * Gets the editable value.
   */
  @Class.Public()
  public get value(): V {
    return this.states.value;
  }

  /**
   * Sets the editable value.
   */
  public set value(value: V) {
    this.states.value = value;
    if (this.editor) {
      this.setEditorProperty('value', value);
      this.enableHandler();
    } else {
      const slot = Control.getChildByType(this.viewerSlot, HTMLElement);
      if (slot) {
        this.viewer = this.renderViewer();
        DOM.append(DOM.clear(slot), this.viewer);
      }
    }
  }

  /**
   * Gets the default editable value.
   */
  @Class.Public()
  public get defaultValue(): any {
    return this.properties.value;
  }

  /**
   * Gets the required state.
   */
  @Class.Public()
  public get required(): boolean {
    return this.states.required;
  }

  /**
   * Sets the required state.
   */
  public set required(state: boolean) {
    this.setEditorProperty('required', (this.states.required = state));
    this.enableHandler();
  }

  /**
   * Gets the read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return this.states.readOnly;
  }

  /**
   * Sets the read-only state.
   */
  public set readOnly(state: boolean) {
    this.setEditorProperty('readOnly', (this.states.readOnly = state));
  }

  /**
   * Gets the disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return this.states.disabled;
  }

  /**
   * Sets the disabled state.
   */
  public set disabled(state: boolean) {
    this.states.disabled = state;
    this.setEditorProperty('disabled', state);
    Control.setChildrenProperty(this.editSlot, 'disabled', state);
    Control.setChildrenProperty(this.concludeSlot, 'disabled', state);
    Control.setChildrenProperty(this.cancelSlot, 'disabled', state);
    if (!state) {
      this.enableHandler();
    }
  }

  /**
   * Editable element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Checks the validity.
   * @returns Returns true when the editable data is valid, false otherwise.
   */
  @Class.Public()
  public checkValidity(): boolean {
    return 'checkValidity' in this.editor && (this.editor as any).checkValidity();
  }

  /**
   * Reports the validity.
   * @returns Returns true when the editable data is valid, false otherwise.
   */
  @Class.Public()
  public reportValidity(): boolean {
    return 'reportValidity' in this.editor && (this.editor as any).reportValidity();
  }

  /**
   * Reset the editable data to its initial value and state.
   */
  @Class.Public()
  public reset(): void {
    if ('reset' in this.editor) {
      (this.editor as any).reset();
    } else {
      this.value = this.defaultValue;
    }
    this.enableHandler();
    this.changed = false;
  }

  /**
   * Start editing.
   */
  @Class.Public()
  public edit(): void {
    if (!this.editor) {
      this.editor = this.renderEditor();
      this.setEditorProperty('name', this.name);
      this.setEditorProperty('required', this.required);
      this.setEditorProperty('readOnly', this.readOnly);
      this.setEditorProperty('disabled', this.disabled);
    }
    this.startEditing();
  }

  /**
   * Concludes the current editing.
   */
  @Class.Public()
  public conclude(): void {
    if (this.changed) {
      this.states.value = this.getEditorProperty('value');
      this.viewer = this.renderViewer();
    }
    this.stopEditing();
    if (this.conclusion) {
      this.conclusion(true);
    }
  }

  /**
   * Cancels the current editing.
   */
  @Class.Public()
  public cancel(): void {
    if (this.changed) {
      this.setEditorProperty('value', this.states.value);
    }
    this.stopEditing();
    if (this.conclusion) {
      this.conclusion(false);
    }
  }

  /**
   * Wait for edit to finish.
   * @returns Returns a promise to get true when the editing was finished or false when is canceled.
   */
  @Class.Public()
  public async wait(): Promise<boolean> {
    return new Promise((resolve: Class.Callable, reject: Class.Callable) => {
      this.conclusion = resolve;
    });
  }
}
