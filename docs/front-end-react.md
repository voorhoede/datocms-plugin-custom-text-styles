# Front end: React

This example uses the [`<StructuredText />` component from `react-datocms`](https://github.com/datocms/react-datocms/blob/master/docs/structured-text.md). For the Astro version, see [front-end-astro.md](./front-end-astro.md).

The plugin stores a custom style as the `style` property of a `paragraph` or `heading` node, and a custom mark in the `marks` array of a `span` node. Both hold the **slug** from the plugin settings. The examples below turn those slugs into CSS classes.

## Custom styles

Add a node rule for paragraphs and headings and use `node.style` as the class name.

```tsx
// src/components/Content.tsx
import { StructuredText, renderNodeRule } from 'react-datocms';
import { isHeading, isParagraph } from 'datocms-structured-text-utils';

export function Content({ data }) {
  return (
    <StructuredText
      data={data}
      customNodeRules={[
        renderNodeRule(isParagraph, ({ node, children, key }) => (
          <p key={key} className={node.style}>
            {children}
          </p>
        )),
        renderNodeRule(isHeading, ({ node, children, key }) => {
          const Tag = `h${node.level}` as const;
          return (
            <Tag key={key} className={node.style}>
              {children}
            </Tag>
          );
        }),
      ]}
    />
  );
}
```

A paragraph with the style `centered` is now rendered as:

```html
<p class="centered">This text is centered</p>
```

Style it in your CSS:

```css
p.centered {
  text-align: center;
}
```

## Custom marks

Add a mark rule for each mark slug. The rule decides which HTML element the mark becomes.

```tsx
// src/components/Content.tsx
import { StructuredText, renderMarkRule } from 'react-datocms';

export function Content({ data }) {
  return (
    <StructuredText
      data={data}
      customMarkRules={[
        renderMarkRule('shout', ({ children, key }) => (
          <strong key={key} className="shout">
            {children}
          </strong>
        )),
      ]}
    />
  );
}
```

A span with the mark `shout` is now rendered as:

```html
<p>This is normal text with <strong class="shout">only this part</strong> shouting.</p>
```

Style it in your CSS:

```css
strong.shout {
  text-transform: uppercase;
}
```

Without a rule, React renders a custom mark as an element with the slug as its tag name, for example `<shout>`. So add a rule for every custom mark. `customNodeRules` and `customMarkRules` can be combined on the same `<StructuredText />`.
