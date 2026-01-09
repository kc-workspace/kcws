import { OptionDefaults, type TagString } from "typedoc";
import type { ReflectionKinds, SortKinds } from "./model";

export const defaultBlockTags: ReadonlyArray<TagString> =
	OptionDefaults.blockTags;
export const defaultModifierTags: ReadonlyArray<TagString> =
	OptionDefaults.modifierTags;
export const defaultInlineTags: ReadonlyArray<TagString> =
	OptionDefaults.inlineTags;
export const defaultHighlightLanguages: ReadonlyArray<string> =
	OptionDefaults.highlightLanguages;

export const defaultSort: ReadonlyArray<SortKinds> = [
	"visibility",
	"static-first",
	"enum-value-ascending",
	"alphabetical-ignoring-documents",
] as const;

export const defaultKindSortOrder: ReadonlyArray<ReflectionKinds> = [
	"Document",
	"Reference",
	"Project",
	"Module",
	"Namespace",
	"Enum",
	"EnumMember",
	"Class",
	"Interface",
	"TypeAlias",
	"Constructor",
	"Property",
	"Variable",
	"Function",
	"Accessor",
	"Method",
	"Parameter",
	"TypeParameter",
	"TypeLiteral",
	"CallSignature",
	"ConstructorSignature",
	"IndexSignature",
	"GetSignature",
	"SetSignature",
] as const;

export const defaultRequiredToBeDocumented: ReadonlyArray<ReflectionKinds> = [
	"Namespace",
	"Enum",
	"EnumMember",
	"Function",
	"Class",
	"Method",
	"Reference",
] as const;
