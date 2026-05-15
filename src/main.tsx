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

    if (!addon) return [];

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return [];

    const usedStyles: string[] = fieldParams.allowedStyles;

    /*
    Data passed on to Structured Text Field
    For more information, see:
    https://www.datocms.com/docs/plugin-sdk/structured-text-customizations#adding-custom-styles-to-nodes
    */
    const usedStyleNodes: StructuredTextCustomBlockStyle[] = usedStyles.flatMap(
      (id) => {
        const match = userParameters.customStyles.find((s) => s.slug === id);
        if (!match) return [];
        const { nodes, ...customStyle } = match;
        return nodes.map(({ value: node }) => ({
          id: customStyle.slug,
          node,
          label: customStyle.title,
          appliedStyle: getUserStyle(customStyle.css),
        }));
      },
    );

    return usedStyleNodes as StructuredTextCustomBlockStyle[];
  },

  customMarksForStructuredTextField(
    field: Field,
    ctx: CustomMarksForStructuredTextFieldCtx,
  ) {
    const userParameters = getUserParameters(ctx.plugin.attributes.parameters);

    const addon = field.attributes.appearance.addons.find(
      (a) => a.id === ctx.plugin.id && a.field_extension === FIELD_EXTENSION_ID,
    );

    if (!addon) return [];

    const fieldParams = getFieldParameters(addon.parameters);
    if (!fieldParams) return [];

    const usedMarks: StructuredTextCustomMark[] = fieldParams.allowedMarks.flatMap((id) => {
      const match = userParameters.customMarks.find((m) => m.slug === id);
      if (!match) return [];
      return {
        id: match.slug,
        label: match.title,
        icon: match.icon.value as Icon,
        keyboardShortcut: match.keyboardShortcut,
        appliedStyle: getUserStyle(match.css),
      };
    });
    return usedMarks;
  },
});
