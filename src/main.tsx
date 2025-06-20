import {
  connect,
  CustomBlockStylesForStructuredTextFieldCtx,
  Field,
} from "datocms-plugin-sdk";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import { getUserParameters, getUserStyle } from "./utils/userSettings";

import "./styles/index.css";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  customBlockStylesForStructuredTextField(
    _field: Field,
    ctx: CustomBlockStylesForStructuredTextFieldCtx
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
        }))
    );

    return customStyles;
  },
});
