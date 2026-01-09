import { appendArray, uniqueArray } from "../utils/array";
import { normalizeObject } from "../utils/object";
import {
	defaultBlockTags,
	defaultHighlightLanguages,
	defaultInlineTags,
	defaultKindSortOrder,
	defaultModifierTags,
	defaultRequiredToBeDocumented,
	defaultSort,
} from "./defaults";
import type { UserConfig } from "./model";

export const normalizeConfig = <C extends UserConfig>(config: C): C => {
	const _config = normalizeObject(config);
	if (_config.plugin) {
		_config.plugin = uniqueArray(_config.plugin);
	}
	if (_config.blockTags) {
		_config.blockTags = uniqueArray(
			appendArray(defaultBlockTags, _config.blockTags),
		);
	}
	if (_config.inlineTags) {
		_config.inlineTags = uniqueArray(
			appendArray(defaultInlineTags, _config.inlineTags),
		);
	}
	if (_config.modifierTags) {
		_config.modifierTags = uniqueArray(
			appendArray(defaultModifierTags, _config.modifierTags),
		);
	}
	if (_config.highlightLanguages) {
		_config.highlightLanguages = uniqueArray(
			appendArray(defaultHighlightLanguages, _config.highlightLanguages),
		);
	}
	if (_config.kindSortOrder) {
		_config.kindSortOrder = uniqueArray(
			appendArray(defaultKindSortOrder, _config.kindSortOrder),
		);
	}
	if (_config.sort) {
		_config.sort = uniqueArray(appendArray(defaultSort, _config.sort));
	}
	if (_config.requiredToBeDocumented) {
		_config.requiredToBeDocumented = uniqueArray(
			appendArray(
				defaultRequiredToBeDocumented,
				_config.requiredToBeDocumented,
			),
		);
	}

	if (_config.packageOptions) {
		if (_config.packageOptions.blockTags) {
			_config.packageOptions.blockTags = uniqueArray(
				appendArray(defaultBlockTags, _config.packageOptions.blockTags),
			);
		}
		if (_config.packageOptions.inlineTags) {
			_config.packageOptions.inlineTags = uniqueArray(
				appendArray(defaultInlineTags, _config.packageOptions.inlineTags),
			);
		}
		if (_config.packageOptions.modifierTags) {
			_config.packageOptions.modifierTags = uniqueArray(
				appendArray(defaultModifierTags, _config.packageOptions.modifierTags),
			);
		}
		if (_config.packageOptions.kindSortOrder) {
			_config.packageOptions.kindSortOrder = uniqueArray(
				appendArray(defaultKindSortOrder, _config.packageOptions.kindSortOrder),
			);
		}
		if (_config.packageOptions.sort) {
			_config.packageOptions.sort = uniqueArray(
				appendArray(defaultSort, _config.packageOptions.sort),
			);
		}
		if (_config.packageOptions.requiredToBeDocumented) {
			_config.packageOptions.requiredToBeDocumented = uniqueArray(
				appendArray(
					defaultRequiredToBeDocumented,
					_config.packageOptions.requiredToBeDocumented,
				),
			);
		}
	}

	return _config;
};
