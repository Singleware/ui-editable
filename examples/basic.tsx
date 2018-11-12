/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic editable element.
 */
import * as Editable from '../source';
import * as DOM from '@singleware/jsx';

/**
 * Render the view mode.
 * @param value Value.
 */
function onRenderViewer(value: any): HTMLElement {
  return <div>{value}</div> as HTMLElement;
}

/**
 * Render the editor mode.
 * @param value Value.
 */
function renderEditor(value: any): HTMLElement {
  return <input value={value} /> as HTMLElement;
}

const editable = (
  <Editable.Template onRenderViewer={onRenderViewer} onRenderEditor={renderEditor}>
    <div slot="viewer" />
    <div slot="editor" />
    <button slot="edit">Edit</button>
    <button slot="conclude">Save</button>
    <button slot="cancel">Cancel</button>
  </Editable.Template>
) as Editable.Element;

// Change disabled property of the element.
editable.disabled = true;

// Change read-only property of the element.
editable.readOnly = true;

// Change required property of the element.
editable.required = true;

// Change name property of the element.
editable.name = 'new-name';

// Change value property of the element.
editable.value = '1';
