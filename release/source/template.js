"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
/**
 * Editable template class.
 */
let Template = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Editable properties.
     * @param children Editable children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Determines whether the editable data was changed or not.
         */
        this.changed = false;
        /**
         * Editable states.
         */
        this.states = {
            name: this.properties.name,
            value: this.properties.value,
            required: this.properties.required,
            readOnly: this.properties.readOnly,
            disabled: this.properties.disabled
        };
        /**
         * Viewer slot.
         */
        this.viewerSlot = DOM.create("slot", { name: "viewer" });
        /**
         * Edit button slot.
         */
        this.editSlot = DOM.create("slot", { name: "edit" });
        /**
         * Editor slot.
         */
        this.editorSlot = DOM.create("slot", { name: "editor" });
        /**
         * Conclude button slot.
         */
        this.concludeSlot = DOM.create("slot", { name: "conclude" });
        /**
         * Cancel button slot.
         */
        this.cancelSlot = DOM.create("slot", { name: "cancel" });
        /**
         * Editor wrapper element.
         */
        this.editorWrapper = (DOM.create("div", { class: "editor" },
            this.editorSlot,
            this.concludeSlot,
            this.cancelSlot));
        /**
         * Viewer wrapper element.
         */
        this.viewerWrapper = (DOM.create("div", { class: "viewer" },
            this.viewerSlot,
            this.editSlot));
        /**
         * Editable styles.
         */
        this.styles = (DOM.create("style", null, `:host > .viewer,
:host > .editor {
  display: flex;
  flex-direction: row;
  width: 100%;
}`));
        /**
         * Editable skeleton.
         */
        this.skeleton = (DOM.create("div", { slot: this.properties.slot, class: this.properties.class }, this.children));
        /**
         * Editable shadow.
         */
        this.shadow = DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles);
        this.bindHandlers();
        this.bindProperties();
        this.initialRender();
    }
    /**
     * Updates the specified property state.
     * @param property Property name.
     * @param state Property state.
     */
    updatePropertyState(property, state) {
        if (state) {
            this.skeleton.dataset[property] = 'on';
        }
        else {
            delete this.skeleton.dataset[property];
        }
    }
    /**
     * Sets the specified property into the current editor.
     * @param property Property name.
     * @param value Property value.
     */
    setEditorProperty(property, value) {
        if (property in this.editor) {
            this.editor[property] = value;
        }
    }
    /**
     * Gets the specified property from the current editor.
     * @param property Property name.
     * @returns Returns the property value or undefined when the property was not found.
     */
    getEditorProperty(property) {
        return property in this.editor ? this.editor[property] : void 0;
    }
    /**
     * Notify a render that corresponds to the specified rendering type.
     * @param type Render type.
     * @returns Returns the rendering result.
     */
    notifyRender(type) {
        const detail = { input: this.states.value, output: void 0 };
        const event = new CustomEvent(type, { bubbles: true, cancelable: true, detail: detail });
        if (!this.skeleton.dispatchEvent(event)) {
            detail.output = void 0;
        }
        return detail;
    }
    /**
     * Renders the viewer.
     * @returns Returns the rendered viewer element.
     */
    renderViewer() {
        const detail = this.notifyRender('renderviewer');
        if (!detail.output) {
            return DOM.create("div", { slot: "viewer" }, detail.input);
        }
        return detail.output;
    }
    /**
     * Renders the editor.
     * @returns Returns the rendered editor element.
     */
    renderEditor() {
        const detail = this.notifyRender('rendereditor');
        if (!detail.output) {
            return DOM.create("div", { slot: "editor" }, "Editor not provided");
        }
        return detail.output;
    }
    /**
     * Start editing.
     */
    startEditing() {
        this.changed = false;
        this.viewerWrapper.remove();
        this.updatePropertyState('editing', true);
        DOM.append(this.shadow, this.editorWrapper);
        const slot = Control.getChildByType(this.editorSlot, HTMLElement);
        if (slot) {
            DOM.append(DOM.clear(slot), this.editor);
            Control.setChildrenProperty(this.concludeSlot, 'disabled', this.disabled || !this.checkValidity());
            Control.setChildrenProperty(this.cancelSlot, 'disabled', this.disabled);
        }
        else {
            throw new Error(`Editor element not provided.`);
        }
    }
    /**
     * Stop editing.
     */
    stopEditing() {
        this.changed = false;
        this.editorWrapper.remove();
        this.updatePropertyState('editing', false);
        DOM.append(this.shadow, this.viewerWrapper);
        const slot = Control.getChildByType(this.viewerSlot, HTMLElement);
        if (slot) {
            DOM.append(DOM.clear(slot), this.viewer);
            Control.setChildrenProperty(this.editSlot, 'disabled', this.disabled);
        }
        else {
            throw new Error(`Viewer element not provided.`);
        }
    }
    /**
     * Render viewer handler.
     * @param event Event information.
     */
    renderViewerHandler(event) {
        if (this.properties.onRenderViewer) {
            event.detail.output = this.properties.onRenderViewer(event.detail.input);
        }
    }
    /**
     * Render editor handler.
     * @param event Event information.
     */
    renderEditorHandler(event) {
        if (this.properties.onRenderEditor) {
            event.detail.output = this.properties.onRenderEditor(event.detail.input);
        }
    }
    /**
     * Enable event handler.
     */
    enableHandler() {
        const disable = !this.checkValidity();
        if (!this.disabled) {
            Control.setChildrenProperty(this.concludeSlot, 'disabled', disable);
        }
    }
    /**
     * Editor change handler.
     * @param event Event information.
     */
    changeHandler(event) {
        event.stopPropagation();
        this.enableHandler();
        this.changed = true;
    }
    /**
     * Start editing handler.
     */
    editHandler() {
        if (!this.disabled) {
            this.edit();
        }
    }
    /**
     * Conclude editing handler.
     */
    concludeHandler() {
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
    cancelHandler() {
        if (!this.disabled) {
            this.cancel();
        }
    }
    /**
     * Bind event handlers to update the custom element.
     */
    bindHandlers() {
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
    bindProperties() {
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
    initialRender() {
        this.viewer = this.renderViewer();
        this.stopEditing();
    }
    /**
     * Gets the editable data name.
     */
    get name() {
        return this.states.name;
    }
    /**
     * Sets the editable data name.
     */
    set name(name) {
        this.setEditorProperty('name', (this.states.name = name));
    }
    /**
     * Gets the editable value.
     */
    get value() {
        return this.states.value;
    }
    /**
     * Sets the editable value.
     */
    set value(value) {
        this.states.value = value;
        if (this.editor) {
            this.setEditorProperty('value', value);
            this.enableHandler();
        }
        else {
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
    get defaultValue() {
        return this.properties.value;
    }
    /**
     * Gets the required state.
     */
    get required() {
        return this.states.required;
    }
    /**
     * Sets the required state.
     */
    set required(state) {
        this.setEditorProperty('required', (this.states.required = state));
        this.enableHandler();
    }
    /**
     * Gets the read-only state.
     */
    get readOnly() {
        return this.states.readOnly;
    }
    /**
     * Sets the read-only state.
     */
    set readOnly(state) {
        this.setEditorProperty('readOnly', (this.states.readOnly = state));
    }
    /**
     * Gets the disabled state.
     */
    get disabled() {
        return this.states.disabled;
    }
    /**
     * Sets the disabled state.
     */
    set disabled(state) {
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
    get element() {
        return this.skeleton;
    }
    /**
     * Checks the validity.
     * @returns Returns true when the editable data is valid, false otherwise.
     */
    checkValidity() {
        return 'checkValidity' in this.editor && this.editor.checkValidity();
    }
    /**
     * Reports the validity.
     * @returns Returns true when the editable data is valid, false otherwise.
     */
    reportValidity() {
        return 'reportValidity' in this.editor && this.editor.reportValidity();
    }
    /**
     * Reset the editable data to its initial value and state.
     */
    reset() {
        if ('reset' in this.editor) {
            this.editor.reset();
        }
        else {
            this.value = this.defaultValue;
        }
        this.enableHandler();
        this.changed = false;
    }
    /**
     * Start editing.
     */
    edit() {
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
    conclude() {
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
    cancel() {
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
    async wait() {
        return new Promise((resolve, reject) => {
            this.conclusion = resolve;
        });
    }
};
__decorate([
    Class.Private()
], Template.prototype, "conclusion", void 0);
__decorate([
    Class.Private()
], Template.prototype, "editor", void 0);
__decorate([
    Class.Private()
], Template.prototype, "viewer", void 0);
__decorate([
    Class.Private()
], Template.prototype, "changed", void 0);
__decorate([
    Class.Private()
], Template.prototype, "states", void 0);
__decorate([
    Class.Private()
], Template.prototype, "viewerSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "editSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "editorSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "concludeSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "cancelSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "editorWrapper", void 0);
__decorate([
    Class.Private()
], Template.prototype, "viewerWrapper", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "shadow", void 0);
__decorate([
    Class.Private()
], Template.prototype, "updatePropertyState", null);
__decorate([
    Class.Private()
], Template.prototype, "setEditorProperty", null);
__decorate([
    Class.Private()
], Template.prototype, "getEditorProperty", null);
__decorate([
    Class.Private()
], Template.prototype, "notifyRender", null);
__decorate([
    Class.Private()
], Template.prototype, "renderViewer", null);
__decorate([
    Class.Private()
], Template.prototype, "renderEditor", null);
__decorate([
    Class.Private()
], Template.prototype, "startEditing", null);
__decorate([
    Class.Private()
], Template.prototype, "stopEditing", null);
__decorate([
    Class.Private()
], Template.prototype, "renderViewerHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "renderEditorHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "enableHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "changeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "editHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "concludeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "cancelHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "bindHandlers", null);
__decorate([
    Class.Private()
], Template.prototype, "bindProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "initialRender", null);
__decorate([
    Class.Public()
], Template.prototype, "name", null);
__decorate([
    Class.Public()
], Template.prototype, "value", null);
__decorate([
    Class.Public()
], Template.prototype, "defaultValue", null);
__decorate([
    Class.Public()
], Template.prototype, "required", null);
__decorate([
    Class.Public()
], Template.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Template.prototype, "disabled", null);
__decorate([
    Class.Public()
], Template.prototype, "element", null);
__decorate([
    Class.Public()
], Template.prototype, "checkValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reportValidity", null);
__decorate([
    Class.Public()
], Template.prototype, "reset", null);
__decorate([
    Class.Public()
], Template.prototype, "edit", null);
__decorate([
    Class.Public()
], Template.prototype, "conclude", null);
__decorate([
    Class.Public()
], Template.prototype, "cancel", null);
__decorate([
    Class.Public()
], Template.prototype, "wait", null);
Template = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
