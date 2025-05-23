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
    render(<ConfigScreen ctx={ctx} />, ctx);
  },

  customBlockStylesForStructuredTextField(
    _field: Field,
    ctx: CustomBlockStylesForStructuredTextFieldCtx,
  ) {
    const userParameters = getUserParameters(ctx.plugin.attributes.parameters);

    return userParameters.customStyles.map((customStyle, index) => ({
      id: customStyle.styleTag,
      node: customStyle.node.value,
      label: customStyle.title,
      appliedStyle: getUserStyle(customStyle.css),
      cssClass: customStyle.styleTag,
    }));
  },
});
