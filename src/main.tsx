import {
  connect,
  CustomBlockStylesForStructuredTextFieldCtx,
  CustomMarksForStructuredTextFieldCtx,
  Field,
  Icon,
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

    /*
     Data passed on to Structured Text Field
     For more information, see:
     https://www.datocms.com/docs/plugin-sdk/structured-text-customizations#adding-custom-styles-to-nodes
     */
    const customStyles = userParameters.customStyles.flatMap(
      ({ nodes, ...customStyle }) =>
        nodes.map(({ value: node }) => ({
          id: customStyle.slug,
          node,
          label: customStyle.title,
          appliedStyle: getUserStyle(customStyle.css),
        })),
    );

    const addon = field.attributes.appearance.addons.find(
      (a) => a.id === ctx.plugin.id && a.field_extension === FIELD_EXTENSION_ID,
    );

    if (!addon) return customStyles;

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return customStyles;

    return customStyles.filter((s) => fieldParams.allowedStyles.includes(s.id));
  },

  customMarksForStructuredTextField(
    field: Field,
    ctx: CustomMarksForStructuredTextFieldCtx,
  ) {
    const userParameters = getUserParameters(ctx.plugin.attributes.parameters);
    const customMarks = userParameters.customMarks.map(({ ...customMark }) => ({
      id: customMark.slug,
      label: customMark.title,
      icon: customMark.icon.value as Icon,
      keyboardShortcut: customMark.keyboardShortcut,
      appliedStyle: getUserStyle(customMark.css),
    }));

    const addon = field.attributes.appearance.addons.find(
      (a) => a.id === ctx.plugin.id && a.field_extension === FIELD_EXTENSION_ID,
    );

    if (!addon) return customMarks;

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return customMarks;

    return customMarks.filter((m) => fieldParams.allowedMarks.includes(m.id));
  },
});
