import { connect, Field } from "datocms-plugin-sdk";
import ConfigScreen, { CustomStyle } from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import "./styles/index.css";

connect({
  renderConfigScreen(ctx) {
    render(<ConfigScreen ctx={ctx} />, ctx);
  },

  customBlockStylesForStructuredTextField(_field: Field, ctx: any) {
    const userSettings = ctx.plugin.attributes.parameters || {};
    console.log("user settings", ctx.plugin.attributes.parameters);

    const customstyles: CustomStyle[] = userSettings.customStyles || [];
	console.log("css", JSON.parse(customstyles[0]?.css));

    return customstyles.map((customStyle, index) => ({
      id: `custom-css-style-${index}`,
      node: customStyle.node.value,
      label: customStyle.title,
      appliedStyle: JSON.parse(customStyle.css),
    }));
  },
});
