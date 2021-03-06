/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import 'vs/css!./rulers';

import {ViewPart} from 'vs/editor/browser/view/viewPart';
import EditorBrowser = require('vs/editor/browser/editorBrowser');
import EditorCommon = require('vs/editor/common/editorCommon');
import {StyleMutator} from 'vs/base/browser/styleMutator';

export class Rulers extends ViewPart {

	public domNode: HTMLElement;
	private _layoutProvider:EditorBrowser.ILayoutProvider;
	private _rulers: number[];
	private _height: number;
	private _typicalHalfwidthCharacterWidth: number;

	constructor(context:EditorBrowser.IViewContext, layoutProvider:EditorBrowser.ILayoutProvider) {
		super(context);
		this._layoutProvider = layoutProvider;
		this.domNode = document.createElement('div');
		this.domNode.className = 'view-rulers';
		this._rulers = this._context.configuration.editor.rulers;
		this._height = this._context.configuration.editor.layoutInfo.contentHeight;
		this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.typicalHalfwidthCharacterWidth;
	}

	public dispose(): void {
		super.dispose();
	}

	// --- begin event handlers

	public onConfigurationChanged(e: EditorCommon.IConfigurationChangedEvent): boolean {
		if (e.rulers || e.layoutInfo || e.typicalHalfwidthCharacterWidth) {
			this._rulers = this._context.configuration.editor.rulers;
			this._height = this._context.configuration.editor.layoutInfo.contentHeight;
			this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.typicalHalfwidthCharacterWidth;
			return true;
		}
		return false;
	}

	// --- end event handlers

	_render(ctx: EditorBrowser.IRenderingContext): void {
		this._requestModificationFrame(() => {
			let existingRulersLength = this.domNode.children.length;
			let max = Math.max(existingRulersLength, this._rulers.length);

			for (let i = 0; i < max; i++) {

				if (i >= this._rulers.length) {
					this.domNode.removeChild(this.domNode.lastChild);
					continue;
				}

				let node: HTMLElement;
				if (i < existingRulersLength) {
					node = <HTMLElement>this.domNode.children[i];
				} else {
					node = document.createElement('div');
					node.className = 'view-ruler';
					this.domNode.appendChild(node);
				}

				StyleMutator.setHeight(node, Math.min(this._layoutProvider.getTotalHeight(), 1000000));
				StyleMutator.setLeft(node, this._rulers[i] * this._typicalHalfwidthCharacterWidth);
			}
		});
	}
}
