# Front end: Astro

This example uses the [`<StructuredText />` component from `@datocms/astro`](https://github.com/datocms/astro-datocms/tree/main/src/StructuredText). For the React version, see [front-end-react.md](./front-end-react.md).

The plugin stores a custom style as the `style` property of a `paragraph` or `heading` node, and a custom mark in the `marks` array of a `span` node. Both hold the **slug** from the plugin settings. The examples below turn those slugs into CSS classes.

## Custom styles

Override the `paragraph` and `heading` nodes and use `node.style` as the class name.

```astro
---
// src/components/Paragraph.astro
import type { Paragraph } from 'datocms-structured-text-utils';

interface Props {
  node: Paragraph;
}

const { node } = Astro.props;
---

<p class={node.style}><slot /></p>
```

```astro
---
// src/components/Heading.astro
import type { Heading } from 'datocms-structured-text-utils';

interface Props {
  node: Heading;
}

const { node } = Astro.props;
const Element = `h${node.level}`;
---

<Element class={node.style}><slot /></Element>
```

Pass them to `<StructuredText />` as `nodeOverrides`:

```astro
---
// src/pages/example.astro
import { StructuredText } from '@datocms/astro';
import Paragraph from '../components/Paragraph.astro';
import Heading from '../components/Heading.astro';

const { data } = Astro.props;
---

<StructuredText
  data={data.content}
  nodeOverrides={{ paragraph: Paragraph, heading: Heading }}
/>
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

Create a component for each mark. The component decides which HTML element the mark becomes.

```astro
---
// src/components/marks/Shout.astro
---

<strong class="shout"><slot /></strong>
```

Pass it to `<StructuredText />` as `markOverrides`, keyed by the mark's slug:

```astro
---
// src/pages/example.astro
import { StructuredText } from '@datocms/astro';
import Shout from '../components/marks/Shout.astro';

const { data } = Astro.props;
---

<StructuredText data={data.content} markOverrides={{ shout: Shout }} />
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

Without an override, Astro renders a custom mark as an element with the slug as its tag name, for example `<shout>`. So add an override for every custom mark.
