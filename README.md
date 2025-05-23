# DatoCMS plugin: Custom text Styles

This DatoCMS plugin makes it possible to add custom styles to the editor of Structured text fields by setting css properties. You can add as many styles as you'd like in the Plugin settings.
![preview of Custom Text Styles plugin](./docs/preview.png)

## Features

- Create / Alter / delete custom styles any time you need
- Add custom styles to editor of Structured Text Fields

## Configuration
### Plugin Settings
Add your own Custom Styles. You can set the following attributes:
- `Style Property`
This property is passed down to the final Structured Text value. 
<strong>Please Note: Upon changing this property, you will have to update all Structured Text Fields that use it as it functions as an id.</strong>

- `Title` 
This title will be shown in the DatoCMS text editor

- `Node`
For now, you can choose between <i>heading</i> and <i>paragraph</i>

- `CSS`
This is the CSS shown in the DatoCMS text editor
![Settings for Custom Text Styles plugin](./docs/custom-text-styles-settings.png)



### Front End Structured Text Implementation
Nodes inside Structured Text will be rendered with a `style` attribute corresponding with the `Style Property` set in the Plugin Settings.
(See more info from DatoCMS)[https://www.datocms.com/docs/plugin-sdk/structured-text-customizations#adding-custom-styles-to-nodes]

```JSON
{
    "type": "paragraph",
    "style": "stand-out",
    "children": [
      {
        "type": "span",
        "value": "This is a stand out"
      }
    ]
},
```
