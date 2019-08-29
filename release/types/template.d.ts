import * as Control from '@singleware/ui-control';
import { Properties } from './properties';
import { Element } from './element';
/**
 * Editable template class.
 */
export declare class Template<T extends Properties = Properties, V = any> extends Control.Component<T> {
    /**
     * Conclusion callback.
     */
    private conclusion?;
    /**
     * Editor instance.
     */
    private editor;
    /**
     * Viewer instance.
     */
    private viewer;
    /**
     * Determines whether the editable data was changed or not.
     */
    private changed;
    /**
     * Editable states.
     */
    private states;
    /**
     * Viewer slot.
     */
    private viewerSlot;
    /**
     * Edit button slot.
     */
    private editSlot;
    /**
     * Editor slot.
     */
    private editorSlot;
    /**
     * Conclude button slot.
     */
    private concludeSlot;
    /**
     * Cancel button slot.
     */
    private cancelSlot;
    /**
     * Editor wrapper element.
     */
    private editorWrapper;
    /**
     * Viewer wrapper element.
     */
    private viewerWrapper;
    /**
     * Editable styles.
     */
    private styles;
    /**
     * Editable skeleton.
     */
    private skeleton;
    /**
     * Editable shadow.
     */
    private shadow;
    /**
     * Updates the specified property state.
     * @param property Property name.
     * @param state Property state.
     */
    private updatePropertyState;
    /**
     * Sets the specified property into the current editor.
     * @param property Property name.
     * @param value Property value.
     */
    private setEditorProperty;
    /**
     * Gets the specified property from the current editor.
     * @param property Property name.
     * @returns Returns the property value or undefined when the property was not found.
     */
    private getEditorProperty;
    /**
     * Notify a render that corresponds to the specified rendering type.
     * @param type Render type.
     * @returns Returns the rendering result.
     */
    private notifyRender;
    /**
     * Renders the viewer.
     * @returns Returns the rendered viewer element.
     */
    private renderViewer;
    /**
     * Renders the editor.
     * @returns Returns the rendered editor element.
     */
    private renderEditor;
    /**
     * Start editing.
     */
    private startEditing;
    /**
     * Stop editing.
     */
    private stopEditing;
    /**
     * Render viewer handler.
     * @param event Event information.
     */
    private renderViewerHandler;
    /**
     * Render editor handler.
     * @param event Event information.
     */
    private renderEditorHandler;
    /**
     * Enable event handler.
     */
    private enableHandler;
    /**
     * Editor change handler.
     * @param event Event entity.
     */
    private changeHandler;
    /**
     * Start editing handler.
     */
    private editHandler;
    /**
     * Submit editing handler.
     * @param event Event entity.
     */
    private submitHandler;
    /**
     * Conclude editing handler.
     */
    private concludeHandler;
    /**
     * Cancel editing handler.
     */
    private cancelHandler;
    /**
     * Bind event handlers to update the custom element.
     */
    private bindHandlers;
    /**
     * Bind exposed properties to the custom element.
     */
    private bindProperties;
    /**
     * Initialize the first renderers.
     */
    private initialRender;
    /**
     * Default constructor.
     * @param properties Editable properties.
     * @param children Editable children.
     */
    constructor(properties?: T, children?: any[]);
    /**
     * Gets the editable data name.
     */
    /**
    * Sets the editable data name.
    */
    name: string;
    /**
     * Gets the editable value.
     */
    /**
    * Sets the editable value.
    */
    value: V;
    /**
     * Gets the default editable value.
     */
    readonly defaultValue: any;
    /**
     * Gets the required state.
     */
    /**
    * Sets the required state.
    */
    required: boolean;
    /**
     * Gets the read-only state.
     */
    /**
    * Sets the read-only state.
    */
    readOnly: boolean;
    /**
     * Gets the disabled state.
     */
    /**
    * Sets the disabled state.
    */
    disabled: boolean;
    /**
     * Editable element.
     */
    readonly element: Element;
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
