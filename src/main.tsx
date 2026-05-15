import {
  connect,
  CustomBlockStylesForStructuredTextFieldCtx,
  CustomMarksForStructuredTextFieldCtx,
  Field,
  Icon,
  StructuredTextCustomBlockStyle,
  StructuredTextCustomMark,
} from "datocms-plugin-sdk";
import ConfigScreen from "./entrypoints/ConfigScreen";
import ManualFieldExtensionConfigScreen from "./entrypoints/ManualFieldExtensionConfigScreen";
import { render } from "./utils/render";
import { getUserParameters, getUserStyle } from "./utils/userSettings";
import { getFieldParameters } from "./utils/fieldParameters";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

import "./styles/index.css";

const FIELD_EXTENSION_ID = "per-field-filter";

const getMarkForStructuredTextField = (match: CustomMark): StructuredTextCustomMark => {
  return {
    id: match.slug,
    label: match.title,
    icon: match.icon.value as Icon,
    keyboardShortcut: match.keyboardShortcut,
    appliedStyle: getUserStyle(match.css),
  };
};

const getStyleForStructuredTextField = (match: CustomStyle): StructuredTextCustomBlockStyle[] => {
  return match.nodes.map((nodeItem) => ({
    id: match.slug,
    label: match.title,
    node: nodeItem.value ?? nodeItem,
    appliedStyle: getUserStyle(match.css),
  }));
};

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },

  manualFieldExtensions() {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: "Custom Text Styles",
        type: "addon",
        fieldTypes: ["structured_text"],
        configurable: true,
      },
    ];
  },

  renderManualFieldExtensionConfigScreen(_fieldExtensionId, ctx) {
    return render(<ManualFieldExtensionConfigScreen ctx={ctx} />);
  },

  customBlockStylesForStructuredTextField(
    field: Field,
    ctx: CustomBlockStylesForStructuredTextFieldCtx,
  ) {
    const userParameters = getUserParameters(ctx.plugin.attributes.parameters);

    const addon = field.attributes.appearance.addons.find(
      (a) => a.id === ctx.plugin.id && a.field_extension === FIELD_EXTENSION_ID,
    );

    // Graceful fallback: If no addon is configured, map and return all available custom styles
    if (!addon) {
      return userParameters.customStyles.flatMap(getStyleForStructuredTextField);
    }

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return [];

    return fieldParams.allowedStyles.flatMap((id) => {
      const match = userParameters.customStyles.find((s) => s.slug === id);
      if (!match) return [];

      return getStyleForStructuredTextField(match);
    });
  },

  customMarksForStructuredTextField(
    field: Field,
    ctx: CustomMarksForStructuredTextFieldCtx,
  ) {
    const userParameters = getUserParameters(ctx.plugin.attributes.parameters);

    const addon = field.attributes.appearance.addons.find(
      (a) => a.id === ctx.plugin.id && a.field_extension === FIELD_EXTENSION_ID,
    );

    if (!addon) {
      return userParameters.customMarks.map(getMarkForStructuredTextField);
    }

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return [];

    return fieldParams.allowedMarks.flatMap((id) => {
      const match = userParameters.customMarks.find((m) => m.slug === id);
      if (!match) return [];
      return getMarkForStructuredTextField(match);
    });
  },
});
